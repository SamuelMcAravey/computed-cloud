---
title: "Config is a dependency"
description: "How I keep config sane across environments, with fail-fast validation and explicit boundaries."
pubDate: 2026-03-04
tags: ["configuration", "reliability", "operations", "architecture", "dotnet"]
draft: false
---

## TL;DR

- Treat configuration like a system: define a schema, pick a distribution path, validate it, and make precedence explicit.
- The constraint: config is scattered (Kubernetes operator, ConfigMaps/Secrets, `appsettings.json`), and people copy values under pressure.
- The failure mode: production pointed at a sandbox endpoint because the values looked plausible and nothing blocked startup.
- The change: fail-fast config validation at startup plus explicit environment boundaries (including outbound endpoint allowlists).
- Rule of thumb: if a value selects an environment (URLs, account IDs, tenant IDs), add a technical guardrail. Do not rely on naming conventions.

## On this page

- [Context](#context)
- [What I do](#what-i-do)
- [Production hit sandbox](#production-hit-sandbox)
- [Implementation (With Small .NET Examples)](#implementation-with-small-net-examples)
- [Tradeoffs](#tradeoffs)
- [Checklist: Adding a New Config Value Safely](#checklist-adding-a-new-config-value-safely)
- [What I keep in mind](#what-i-keep-in-mind)

## Context

Most teams do not have one config file. They have a pile of config surfaces.

In my world, that usually means:

- secrets and non-secrets coming in through a Kubernetes operator
- some non-secret values in Kubernetes ConfigMaps
- `appsettings.json` defaults so local dev is not awful

That setup is fine. The problem is what comes after.

Values get copied between environments under pressure. Endpoints look almost the same. A new key ships without validation. A config change can alter behavior without touching code, so it is easy to miss in review.

If you treat config like loose strings, it will act like loose strings.

If you treat config as a real dependency, you can make it boring.

## What I do

Configuration is a dependency. Dependencies need contracts.

I use three ideas:

1. Typed schema

If a value has a shape (URL, enum, duration), enforce the shape. If it is required, make it required in code, not in a README.

2. Fail-fast validation

Validate at startup, before the app takes traffic. Broken config should be a deploy failure, not a runtime mystery.

3. Explicit environment boundaries

Make the boundary part of the contract. By default, production should not be able to talk to sandbox.

### Secrets are not config

In practice, secrets and non-secrets often ride the same delivery pipes. That does not make them the same thing.

Secrets have different access control, different audit requirements, and different handling rules. A secret leak is a different class of problem than a bad timeout.

This post is about configuration guardrails. It is not a guide to secrets management. The key point is simple: do not treat "it is in the same tool" as "it has the same risk".

## When production hit sandbox

We had an outbound integration where the base URL was configuration. Both environments existed:

- sandbox endpoint for dev and testing
- production endpoint for real traffic

At some point, production was pointed at the sandbox endpoint.

Nothing crashed. The URL was valid. The service started normally. We got successful HTTP responses. They were the wrong responses.

That is the most dangerous kind of misconfig. It works.

> **Failure mode:** production sent real traffic to a sandbox endpoint because configuration was treated as data, not as a constrained contract.
>
> **Change we made:** fail fast at startup when config and environment disagree, and enforce outbound endpoint allowlists so prod cannot talk to sandbox.
>
> **New rule of thumb:** if a value selects an environment (URLs, account IDs, tenant IDs), guard it with code.

The first signal was a support ticket, plus logs and traces.

That is the bad version. A customer found it first.

I want the logs and traces to catch this before a ticket does.

## Implementation (With Small .NET Examples)

These examples use .NET Options because the mechanics are clean:

- bind config to a typed object
- validate it
- fail startup if it is wrong

Keep the contract. Swap out the wiring.

### Define a typed options object

```csharp
using System.ComponentModel.DataAnnotations;

public sealed class ExternalApiOptions
{
    public const string SectionName = "ExternalApi";

    [Required]
    [Url]
    public string BaseUrl { get; init; } = "";

    // An explicit boundary marker. This is boring on purpose.
    // The goal is to prevent "prod config injected into non-prod" (and vice versa).
    [Required]
    [RegularExpression("Development|Staging|Production")]
    public string Boundary { get; init; } = "";
}
```

### Bind and validate at startup

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOptions<ExternalApiOptions>()
    .Bind(builder.Configuration.GetSection(ExternalApiOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

var app = builder.Build();
app.MapGet("/", () => "ok");
app.Run();
```

This buys you a basic safety net: missing required values block startup.

### Make config and runtime environment agree

The idea is not tied to a specific env var name. The idea is that your runtime environment and your config boundary must match.

```csharp
using Microsoft.Extensions.Options;

var app = builder.Build();

var options = app.Services.GetRequiredService<IOptions<ExternalApiOptions>>().Value;
var env = app.Environment;

var expectedBoundary = env.IsProduction() ? "Production"
    : env.IsStaging() ? "Staging"
    : "Development";

if (!string.Equals(options.Boundary, expectedBoundary, StringComparison.Ordinal))
{
    throw new InvalidOperationException(
        $"Configuration boundary mismatch. Expected '{expectedBoundary}', got '{options.Boundary}'.");
}
```

### Block known-bad endpoint wiring

Boundary markers are good, but endpoints still need guardrails. The most direct guardrail is an allowlist of allowed hosts per environment.

This is the class of check that would have blocked "prod -> sandbox" at startup.

```csharp
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

public sealed class ExternalApiOptionsValidator(IHostEnvironment env)
    : IValidateOptions<ExternalApiOptions>
{
    public ValidateOptionsResult Validate(string? name, ExternalApiOptions options)
    {
        if (!Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out var uri))
        {
            return ValidateOptionsResult.Fail("ExternalApi:BaseUrl must be an absolute URI.");
        }

        var allowedHosts = env.IsProduction()
            ? new[] { "api.vendor.example" }
            : new[] { "sandbox.vendor.example", "localhost" };

        if (!allowedHosts.Contains(uri.Host, StringComparer.OrdinalIgnoreCase))
        {
            return ValidateOptionsResult.Fail(
                $"ExternalApi:BaseUrl host '{uri.Host}' is not allowed in '{env.EnvironmentName}'.");
        }

        if (env.IsProduction() && !string.Equals(uri.Scheme, "https", StringComparison.OrdinalIgnoreCase))
        {
            return ValidateOptionsResult.Fail("ExternalApi:BaseUrl must use https in Production.");
        }

        return ValidateOptionsResult.Success;
    }
}
```

Wire it up:

```csharp
builder.Services.AddSingleton<IValidateOptions<ExternalApiOptions>, ExternalApiOptionsValidator>();
```

Now the service refuses to start if production is configured to talk to the sandbox host.

### Be explicit about config distribution

Teams get opinionated here. That is fine. What matters is being explicit.

In practice, I see four buckets:

- a secrets store for secrets (often via an operator/injector in Kubernetes)
- Kubernetes config for environment-specific non-secrets
- `appsettings.json` for local defaults and ergonomics
- code defaults only when they are truly safe

For distribution, what has been real for us is:

- a Kubernetes operator (today), or
- before Kubernetes, the service using a service account and fetching what it needs directly

Two rules:

1. Non-secret does not mean non-sensitive. An endpoint can still be a boundary selector.
2. "One place" is not the goal. Coherent contracts and validation are the goal.

## Tradeoffs

This is a bias. It costs something.

- Fail-fast validation creates a new failure mode: the service will not start if your config distribution path is broken.
- Allowlists need maintenance. When vendors add new hosts, someone has to update the contract on purpose.
- If you over-validate, you can block legitimate changes until code ships.
- You need good error messages. A generic "options validation failed" line is not enough at 2am.

Usually you do not fix this with a broad refactor. You patch the config, then come back and tighten the guardrails.

- stop the bleeding by updating the config
- then dig in and remediate (validation, boundaries, better defaults, better visibility)

I still prefer strictness when the failure mode is cross-environment traffic. That mistake is expensive and hard to reason about after the fact.

## Checklist: Adding a New Config Value Safely

- Define the intent in one sentence. What decision does this value control?
- Decide if it is a secret, a sensitive non-secret, or a safe non-secret.
- Pick the distribution path (Kubernetes operator, Kubernetes config, `appsettings.json`) and document why.
- Give it a typed schema (URL, enum, duration). Avoid "string that happens to be a URL".
- Validate at startup for:
  - missing required values
  - malformed values (bad URL, negative timeout)
  - boundary violations (prod calling sandbox, prod config in non-prod)
- Add a safe default only when it is truly safe. Otherwise require it explicitly.
- Make precedence explicit. Write down what wins when two sources define the same key.
- Add a small test for the validation rules, especially allowlists.
- Do not log secrets. If you log config, log hosts and identifiers, not tokens.
- Have a rollback plan for when validation blocks startup.

## What I keep in mind

Configuration changes behavior without touching code. That is why it needs the same care as code.

If you only remember one thing: treat environment-selecting values (URLs, tenant IDs, account IDs) as safety-critical. Put guardrails in code, and fail early when the boundary is wrong.
