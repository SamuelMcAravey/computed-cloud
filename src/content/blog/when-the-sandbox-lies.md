---
title: "When the Sandbox Lies: Surviving ERP Schema Drift"
description: "An ERP production schema change (without a sandbox update) broke our Entity Framework mapping."
pubDate: 2026-01-15
tags: ["integrations", "erp", "entity-framework", "reliability", "architecture"]
---

## TL;DR

- We integrated against an ERP database and used strict Entity Framework mappings (including column sizes) to avoid bad writes and silent truncation.
- The constraint: we don't control the ERP schema, and the "sandbox" is not a contract.
- Production changed a column length without the sandbox being updated, and our mapping started throwing exceptions even though we hadn't deployed anything.
- The immediate fix was a hot patch: update the mapped length for one `nvarchar` column and redeploy.
- Rule of thumb: **be tolerant on reads, strict on writes - and assume external schemas drift.**

---

## Context: why we were strict

We used Entity Framework for database access, and we were intentional about keeping the model aligned with the database.

That meant not only matching types, but also matching sizing (for example, the length of an `nvarchar` column). The goal was simple: catch truncation and "doesn't fit" problems early instead of letting them turn into bad data later.

This integration was built against an ERP-provided sandbox environment.

---

## What broke: failures with no deploy

One day we started getting exceptions in our logging system that looked like a mapping problem.

That part mattered: **we hadn't deployed a new version of our software.** So the failure felt random.

It wasn't random. Production disagreed with our assumptions.

> **Failure mode (the scar):**  
> The ERP production database schema drifted from the sandbox, and our strict mapping treated that drift as a hard failure. We couldn't even read from the affected table.  
>  
> **Change we made:** update the mapped column size and redeploy as a hotfix.  
>  
> **New rule of thumb:** if it's not your system, treat it like an API you don't control - versioned or not.

---

## Root cause: production schema changed; sandbox didn't

The ERP provider made a schema change in production without updating the sandbox first.

The change looked innocuous on their side: they updated the size of a column (an `nvarchar` length change). Because our model was strict about sizing, the mismatch tripped our mapping and started throwing exceptions when we touched that table.

We were supposed to be notified of changes. We were supposed to see them in the sandbox first. That didn't happen.

And it still became our outage.

---

## The fix: a small hot patch

The solution was straightforward:

- update the configured size for the affected column in our data access layer (Entity Framework mapping)
- rebuild
- redeploy

It was a hotfix. It stopped the production issue.

We did **not** attempt a broad redesign in the moment. Changing one column's mapping doesn't solve the underlying fragility when *all* columns are treated this way.

So we made the minimal change that restored service and moved on.

`nvarchar(15)` -> `nvarchar(30)`

---

## The lesson: strictness is good, but place it carefully

At first this looked like "their fault." And it was. They changed production without keeping the sandbox in sync.

But the part that hurt was ours: we chose a strictness level that could turn a harmless drift into a full stop.

I still like strict typing and sizing when it prevents silent data corruption. That's a real failure mode.

The adjustment is where that strictness lives:

- Strictness that prevents bad writes is usually worth it.
- Strictness that prevents reads is a bigger deal, because it can turn a recoverable mismatch into downtime.

This is not about being adversarial with vendors. It's about being honest about control boundaries.

If you didn't write it and you don't control it, it can change.

---

## Tradeoffs: ways to make this less fragile

We didn't implement all of these (yet), but this incident narrowed the design space.

> **Tradeoff:** you can't get perfect safety *and* perfect compatibility when the other system changes without warning. You pick the failure mode you can live with.

Some options:

1) **Detect schema drift explicitly**
   - Periodically check key tables/columns for drift across customer environments.
   - Raise a *warning* (or a pager) before the drift turns into a runtime failure.
   - Tradeoff: extra operational work and edge cases (permissions, latency, tenant variance).

2) **Allow reads, block writes when mismatch is detected**
   - If a mismatch is discovered, degrade to read-only behavior for the affected surface area.
   - Tradeoff: you avoid full outages, but you still have partial functionality loss.

3) **Relax mapping constraints for "non-critical" fields**
   - For example, tolerate larger column sizes in the database while still validating outbound writes.
   - Tradeoff: you reduce hard failures, but you may lose early detection in some cases.

4) **Treat the sandbox as helpful, not authoritative**
   - Keep using it, but assume it can be stale.
   - Tradeoff: you'll invest more in monitoring and defensive behavior.

If this kind of drift becomes frequent, I'd bias toward drift detection plus "reads survive, writes get guarded."

---

## Checklist: ERP/database integrations that survive reality

- [ ] Assume the sandbox can drift from production.
- [ ] Decide which failures should block writes vs block reads.
- [ ] Log schema mismatch signals with enough detail to debug quickly.
- [ ] Keep a small "known contracts" list (the few tables/columns that really matter).
- [ ] Have a fast path for hotfixes (build + deploy) when the external system changes.
- [ ] After the incident, add one defensive improvement (not ten). Repeat over time.

---

If you only remember one thing: **external systems change. Your job is to choose the failure mode.**
