# Research Dossier: Configuration as a First-Class System

Post id: `configuration-as-a-first-class-system`
Shape: pattern-guide
Working thesis: Treat configuration as data with a schema: typed binding, explicit validation, and hard environment boundaries. Optimize for high-pressure changes and safe rollouts.

This dossier is meant to support a blog post draft. It is not a design spec.

## Primary references (starting set)

1. The Twelve-Factor App - Config
   - https://12factor.net/config
2. Kubernetes - ConfigMaps
   - https://kubernetes.io/docs/concepts/configuration/configmap/
3. Kubernetes tutorial - Updating Configuration via a ConfigMap
   - https://kubernetes.io/docs/tutorials/configuration/updating-configuration-via-a-configmap/
4. Kubernetes - Secrets good practices
   - https://kubernetes.io/docs/concepts/security/secrets-good-practices/
5. Kubernetes - Encrypting Secret Data at Rest
   - https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
6. Kubernetes - Liveness, readiness, and startup probes
   - https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/
7. Kubernetes - Configure access to multiple clusters
   - https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
8. Kubernetes - Admission controllers (admission-time policy enforcement model)
   - https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
9. .NET - Configuration in .NET (providers and precedence)
   - https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration
10. .NET - Configuration providers
   - https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers
11. .NET - Options pattern (typed options, validation, ValidateOnStart)
   - https://learn.microsoft.com/en-us/dotnet/core/extensions/options
12. .NET - Options validation source generator
   - https://learn.microsoft.com/en-us/dotnet/core/extensions/options-validation-generator
13. Microsoft Learn - Store app secrets safely during development
   - https://learn.microsoft.com/en-us/dotnet/architecture/microservices/secure-net-microservices-web-applications/developer-app-secrets-storage
14. 1Password CLI - Load secrets into environment variables (`op run`)
   - https://developer.1password.com/docs/cli/secrets-environment-variables/
15. 1Password - Kubernetes Secrets Injector
   - https://developer.1password.com/docs/k8s/injector/
16. JSON Schema 2020-12 validation vocabulary
   - https://json-schema.org/draft/2020-12/json-schema-validation.html
17. RFC 3986 - URI: Generic Syntax
   - https://www.rfc-editor.org/rfc/rfc3986
18. YAML 1.2.2 spec (typed parsing pitfalls context)
   - https://spec.yaml.io/232/spec/1.2.2/
19. OpenFeature specification (feature flags as a system)
   - https://github.com/open-feature/spec

## Claims we plan to make (map to refs)

1. Configuration should be treated as a contract: schema, validation, precedence, ownership. (R1, R9, R11)
2. Config changes happen under pressure and often ship faster than code, so they deserve guardrails. (experience + R1)
3. In Kubernetes, ConfigMaps are for non-confidential values and Secrets are for confidential values; ConfigMaps do not provide secrecy. (R2, R4)
4. Updating ConfigMaps has runtime semantics that can surprise you (restart vs eventual update), so be explicit about how your app consumes config. (R2, R3)
5. Startup validation plus readiness gating prevents serving traffic with known-bad config. (R6, R11)
6. Endpoint URLs are safety-critical because they select the environment boundary; validate and enforce allowlists instead of trusting naming conventions. (R17 + experience)
7. Options validation in .NET provides a clean example of typed config + fail-fast validation. (R11, R12)
8. Feature flags are "config", but they behave like a control plane. Treat them like a system with lifecycle rules. (R19)

## Glossary (keep wording consistent)

- Configuration (config): values that vary by deploy/environment (endpoints, timeouts, feature flags, tenant overrides). (R1)
- Secret: confidential value requiring restricted access and handling (tokens, passwords, keys). (R4, R13)
- Sensitive non-secret: value that is not confidential but can still create an incident (endpoints, allowlists, timeouts).
- Environment boundary: a rule that prevents cross-environment coupling (prod cannot call sandbox; staging cannot write prod).
- Schema: machine-checkable shape and constraints of config (types, required fields, ranges).
- Validation: checks that values meet constraints (type, range, allowed hosts, allowed schemes).
- Fail fast: refuse to start (or refuse readiness) if config is invalid. (R6, R11)
- Precedence: rules for resolving duplicates across config sources (env vars override appsettings, etc.). (R9)
- Drift: real-world config diverges from intended config over time (manual edits, partial rollouts, stale mounts).

## Failure modes and gotchas (including the scar)

1. Prod pointed at a sandbox endpoint.
   - Root causes: copy/paste under pressure, unclear naming, precedence masking, shared bundles.
   - Guardrails: explicit env identity, allowlist endpoint hosts by env, startup validation + readiness gating, optional admission-time policy. (R6, R8, R11, R17)
2. Stringly typed config.
   - Timeouts and sizes as free-form strings, YAML implicit typing, no bounds. (R18)
3. Silent overrides.
   - Provider order decides which value wins; this can hide mistakes until runtime. (R9, R10)
4. "Config updates did not take effect."
   - ConfigMap env vars require restart; mounted files update eventually; subPath mounts have caveats. (R2, R3)
5. Secrets exposure via convenient channels.
   - Env vars are visible in many places; Kubernetes Secrets need RBAC and optional encryption at rest. (R4, R5, R13)
6. Schema validation overreach.
   - JSON Schema `format` does not prove reachability. (R16)

## Competing viewpoints and tradeoffs

1. "Secrets are config" (12-factor) vs "secrets are not config" (operational boundary).
   - Boundary is useful because access control, audit, and rotation are different concerns. (R1, R4, R13)
2. Environment variables vs config files vs API-driven config.
   - Different tradeoffs for diffability, rollout semantics, and failure modes. (R1, R2, R3, R9)
3. Strict fail-fast vs permissive defaults.
   - Fail-fast catches bad config early, but can increase startup failures during partial rollouts. (R6, R11)
4. Admission policy vs app-level validation.
   - Admission prevents bad manifests; app validation catches cross-field and runtime constraints. (R8, R11)

## Suggested diagrams

1. Environment boundary diagram:
   - prod, staging, sandbox boxes; arrows showing allowed outbound calls; show "prod -> sandbox" blocked.
2. Startup validation timeline:
   - bind -> validate -> fail or become Ready; note readiness probe gating. (R6, R11)
3. Config supply chain:
   - 1Password -> CI/CD -> k8s Secret/ConfigMap -> pod -> app binding -> validation -> readiness.

## Questions only Samuel can answer (to avoid guessing)

1. Incident details: how did you detect prod was calling sandbox, and what was the impact (sanitized)?
2. What was the exact change after: host allowlist, scheme restriction, env identity, boundary marker, CI checks, something else?
3. Environment model: what environments exist and what does "sandbox" mean in your world (vendor sandbox, internal sandbox, both)?
4. Config precedence in practice: which source wins today (1Password vs k8s vs appsettings vs CI env vars)?
5. Which config distribution path is real in deployments: 1Password CLI at deploy, an operator/injector, or manual sync?

