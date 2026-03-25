---
title: "How I watch for schema drift in ERP integrations"
description: "A small-team approach to catching database schema drift before it pages you."
pubDate: 2026-03-04
tags: ["integrations", "erp", "reliability", "how-to", "sql-server"]
draft: true
---

## TL;DR

- The constraint: when you integrate with a database you do not control, the schema can change without your deploy.
- The scar: we had an ERP production schema change that did not show up in sandbox first. Our strict mapping started throwing even though we had not shipped code.
- The pattern: monitor drift on the 5 to 20 columns that can break you, and treat drift as an operational event with a playbook.
- The decision you have to make: when drift is detected, do you block writes, allow reads, or do alert-only.
- Rule of thumb: you do not need a "schema platform." You need one scoped check and one controlled failure mode.

## On this page

- [Context](#context)
- [Pick the contract surface](#pick-the-contract-surface)
- [Watch for drift](#watch-for-drift)
- [Pick a failure mode](#pick-a-failure-mode)
- [What to log](#what-to-log)
- [Tradeoffs](#tradeoffs)
- [Checklist](#checklist)
- [References](#references)

## Context

If you integrate with an ERP through its database, your API is the schema.

That can be fast. It can also break in a way that feels unfair the first time: production changes and you break without shipping anything.

I wrote about one incident like this in [When the Sandbox Lies](/blog/when-the-sandbox-lies/). The point of this post is not the story. The point is the playbook: how to detect drift early enough to choose a controlled response.

## Pick the contract surface

Schema drift is a big category. Trying to "monitor the whole database" is how you end up building a platform you did not want.

Start with an allowlist of what can actually hurt you. A good first pass is:

- the tables you write to
- the tables you read during a money-moving workflow
- the 5 to 20 columns where a type, length, or nullability change could break mapping or corrupt data

For each contract column, define what you care about. In practice that is usually:

- type (including precision and scale where it matters)
- max length (common in vendor schemas)
- nullability
- existence (add/drop)

If you only do one thing, cover the write paths first. Reads can limp along. Bad writes are harder to unwind.

## Watch for drift

The simplest drift detector is a scheduled job that snapshots schema metadata, diffs it against the previous snapshot, and alerts when a contract column changes.

This can be a script. It can be a small job in your app. It can run daily. The point is to find out from the check, not from a runtime exception.

### Two layers of metadata

If you are on SQL Server, you have two common sources of truth:

- `INFORMATION_SCHEMA.COLUMNS` is easy to query and portable. It is a good first pass. [1]
- `sys.columns` joined to `sys.types` is the SQL Server-native metadata surface and exposes details you may care about (length and other column attributes). [2] [3]

In practice, a pragmatic pattern is:

1. Query `INFORMATION_SCHEMA.COLUMNS` for a quick snapshot.
2. Use `sys.columns` + `sys.types` for the attributes you actually enforce in code.

### Example: a canonical snapshot query (SQL Server)

This is intentionally plain. It is "one row per column."

```sql
SELECT
  s.name  AS schema_name,
  t.name  AS table_name,
  c.name  AS column_name,
  ty.name AS type_name,
  c.max_length,
  c.precision,
  c.scale,
  c.is_nullable
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.columns c ON c.object_id = t.object_id
JOIN sys.types ty ON ty.user_type_id = c.user_type_id;
```

Store the output, or a hash of it, somewhere you control, and diff it on a schedule.

### A real gotcha: metadata visibility and permissions

If your drift check runs under a low-privilege identity, it might not see all objects and columns. That can lead to false negatives.

Treat metadata visibility as part of the monitoring contract. If the job cannot see a contract table, that is an alert. SQL Server documents metadata visibility behavior explicitly. [4]

### Optional: dependency impact checks (when you control database objects)

If you have views or stored procedures on your side of the integration, schema changes can break them too.

SQL Server exposes dependency metadata via `sys.sql_expression_dependencies`. It can help you prioritize what to test first when drift is detected. [7]

### Optional: near real-time detection with DDL triggers

SQL Server can capture DDL events via DDL triggers and `EVENTDATA()`. [5] [6]

In vendor-managed ERP databases, you usually cannot do this, or you should not. I mention it here because it is a real tool when you control the DB surface.

## Pick a failure mode

Detection is half the work. The other half is deciding what you do when drift is detected.

There is no one correct answer. You pick a failure mode you can live with.

### Option 1: alert-only (default for low-risk reads)

Use this when:

- the column is not safety-critical
- a mismatch is annoying, but it will not corrupt data or break compliance

What you do:

- open an internal work item
- plan a patch
- keep serving traffic

### Option 2: block writes, allow reads (default for many ERPs)

Use this when:

- you can tolerate stale data on reads for a short period
- you cannot tolerate writing the wrong thing

What you do:

- keep read paths online
- block the workflow steps that write
- surface a clear error to operators (and ideally customers) that the system is in a controlled degraded state

This is the tolerant-reader idea in practice: accept what you can, reject what you must. [9]

If you want the read side to degrade instead of throwing, SQL Server has `TRY_CONVERT`, which returns `NULL` on conversion failure instead of raising an error. That is useful in ingestion paths for non-critical fields. [8]

### Option 3: read-only mode for the integration surface

Use this when:

- drift affects many columns and you do not trust your reads
- you need time to understand the blast radius

This is often less painful than a partial runtime failure spread across code paths.

### Option 4: full stop (fail closed)

Use this when:

- drift could cause incorrect billing, money movement, or compliance impact
- you do not have a safe degraded mode

This is the most expensive option in uptime. It can still be the right one.

## What to log

Drift alerts only help if they tell you what changed, where, and what it affects.

At minimum, log and alert with:

- environment (prod vs non-prod)
- integration identity (which ERP instance, tenant, or customer bucket)
- schema_name, table_name, column_name
- expected: type, length, nullability
- actual: type, length, nullability
- detected_at timestamp

If you keep a "contract surface" allowlist, include which contract entry fired. That lets you group alerts and route them to the right owner.

## Tradeoffs

- Drift detection is not free. It is more moving parts, more identities, and another thing to page on.
- If you scope it well, it is not a platform. It is one job and one diff.
- Alert-only feels fine until the wrong drift hits a write path.
- Blocking writes protects data, but if it fires too often it becomes its own tax.

I would start small: one detector, one failure mode, then adjust after the next incident instead of guessing upfront.

## Checklist

- [ ] Write down your contract surface (5 to 20 columns).
- [ ] Decide the failure mode per contract group (alert-only, block writes, read-only, full stop).
- [ ] Implement a scheduled snapshot + diff using `INFORMATION_SCHEMA.COLUMNS` and/or `sys.columns` + `sys.types`. [1] [2] [3]
- [ ] Treat missing metadata visibility as an alert (permissions are part of reliability). [4]
- [ ] Log drift with expected vs actual, plus environment and tenant identifiers.
- [ ] After the next incident, add one defensive improvement. Do not build a platform out of fear.

## References

1. https://learn.microsoft.com/en-us/sql/relational-databases/system-information-schema-views/columns-transact-sql?view=sql-server-ver17
2. https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-columns-transact-sql?view=sql-server-ver17
3. https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-types-transact-sql?view=sql-server-ver17
4. https://learn.microsoft.com/en-us/sql/relational-databases/security/metadata-visibility-configuration?view=sql-server-ver17
5. https://learn.microsoft.com/en-us/sql/relational-databases/triggers/ddl-triggers?view=sql-server-ver17
6. https://learn.microsoft.com/en-us/sql/t-sql/functions/eventdata-transact-sql?view=sql-server-ver17
7. https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-sql-expression-dependencies-transact-sql?view=sql-server-ver17
8. https://learn.microsoft.com/en-us/sql/t-sql/functions/try-convert-transact-sql?view=sql-server-ver17
9. https://martinfowler.com/bliki/TolerantReader.html

## Assets needed

- None.

## Open questions / assumptions

- What did you change after the incident (monitoring, runbook, mapping strategy, guardrails)?
- Where should the drift check run in your stack (scheduled job, app startup, CI)?
- How do you want to alert (email, Slack, pager), and what is the threshold (any change vs only contract surface changes)?

## Fact check list

- Confirm the SQL Server attributes you care about beyond type/length/nullability (identity/computed flags, collation).
- Confirm you can query `sys.*` views with your ERP DB permissions, or whether you need to fall back to `INFORMATION_SCHEMA` only.
