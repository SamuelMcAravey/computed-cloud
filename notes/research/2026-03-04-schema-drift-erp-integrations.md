# Research Dossier: Schema Drift in ERP Integrations

Post id: `schema-drift-erp-integrations`
Shape: how-to
Working thesis: If you do database-level integrations with systems you do not control, schema drift is not a surprise, it is a failure mode. The practical move is to monitor the few columns that can break you, then choose a controlled response (block writes, degrade reads, or alert-only) instead of learning about drift from a support ticket.

This dossier supports a blog draft. It is not a design spec.

## Primary references (starting set)

SQL Server metadata and drift detection building blocks:

1. INFORMATION_SCHEMA.COLUMNS (SQL Server)
   - https://learn.microsoft.com/en-us/sql/relational-databases/system-information-schema-views/columns-transact-sql?view=sql-server-ver17
2. sys.columns (SQL Server)
   - https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-columns-transact-sql?view=sql-server-ver17
3. sys.types (SQL Server)
   - https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-types-transact-sql?view=sql-server-ver17
4. Metadata Visibility Configuration (permissions and false negatives)
   - https://learn.microsoft.com/en-us/sql/relational-databases/security/metadata-visibility-configuration?view=sql-server-ver17
5. DDL triggers (capturing CREATE/ALTER/DROP)
   - https://learn.microsoft.com/en-us/sql/relational-databases/triggers/ddl-triggers?view=sql-server-ver17
6. EVENTDATA() (DDL trigger payload)
   - https://learn.microsoft.com/en-us/sql/t-sql/functions/eventdata-transact-sql?view=sql-server-ver17
7. sys.sql_expression_dependencies (impact analysis for dependent objects)
   - https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-sql-expression-dependencies-transact-sql?view=sql-server-ver17
8. TRY_CONVERT (tolerant parsing)
   - https://learn.microsoft.com/en-us/sql/t-sql/functions/try-convert-transact-sql?view=sql-server-ver17
9. CREATE VIEW (compatibility shims)
   - https://learn.microsoft.com/en-us/sql/t-sql/statements/create-view-transact-sql?view=sql-server-ver17
10. CHECK constraints (strict writes at the boundary)
   - https://learn.microsoft.com/en-us/sql/relational-databases/tables/create-check-constraints?view=sql-server-ver17
11. Primary and foreign key constraints (integrity guardrails)
   - https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints?view=sql-server-ver17

Integration evolution idea:

12. Martin Fowler - Tolerant Reader
   - https://martinfowler.com/bliki/TolerantReader.html

## Claims we plan to make (map to refs)

1. You can detect drift by snapshotting schema metadata and diffing it on a schedule, scoped to "tables/columns that matter." (R1, R2, R3)
2. If your monitoring principal cannot see metadata, your drift check can lie (false negatives), so permissions are part of reliability. (R4)
3. DDL triggers can capture drift near real-time, but they are often not available in vendor-managed ERPs. (R5, R6)
4. Tolerant reads + strict writes is a reasonable default, but you still need to pick explicit failure modes for critical fields. (R8, R10, R11, R12)
5. Views can act as a compatibility shim when you control the database surface and want to stabilize what the app reads. (R9)

## Glossary (keep wording consistent)

- Schema drift: the production schema changes without your deploy (add/drop columns, type/length changes, nullability changes, renamed objects).
- Critical schema surface: a small allowlist of columns where drift can cause downtime, corruption, or billing/compliance errors.
- Tolerant reads: the read path degrades safely if data is unexpected (missing columns, new columns, larger strings, new enum values).
- Strict writes: the write path fails fast when the contract is violated (length, nullability, FK integrity).
- Failure mode choice: what you do when drift is detected (alert-only, block writes, read-only mode, full stop).

## Practical drift detection approaches

### 1) Snapshot and diff (small team default)

Core idea:
- Create a canonical "schema snapshot" representation (one row per column).
- Persist the snapshot (your own DB, a file in blob storage, or a table in a control database).
- Recompute on a schedule and diff.
- Alert only on changes to your critical schema surface.

Metadata sources:
- Start with `INFORMATION_SCHEMA.COLUMNS` (portable and simple), then use `sys.columns` + `sys.types` for authoritative SQL Server-specific fields (max length, precision/scale, identity/computed flags). (R1, R2, R3)

Watch for false negatives:
- Ensure the monitoring identity can see the metadata for the schemas/tables you care about. (R4)

### 2) Event-driven capture (DDL triggers)

Core idea:
- Add DDL triggers to log `CREATE_TABLE`, `ALTER_TABLE`, `DROP_TABLE`, etc.
- Use `EVENTDATA()` to capture what changed and by whom. (R5, R6)

Real-world limitation:
- Many ERP DBs do not allow you to add triggers, or you should not (support contracts, upgrades).

### 3) Dependency impact checks

If you control stored procedures, views, or computed objects, dependencies help prioritize testing:
- `sys.sql_expression_dependencies` can show object-level dependencies to identify likely blast radius. (R7)

### 4) Tolerant reads, strict writes (behavioral mitigation)

Drift detection tells you what changed.
You still need to pick what happens next.

Read-side tactics:
- use explicit column lists in queries
- use `TRY_CONVERT` / `TRY_CAST` for ingestion parsing where a hard failure is worse than losing one optional field (R8)

Write-side tactics:
- enforce schema constraints and validation at your boundary so writes fail fast (R10, R11)

Evolution mindset:
- Tolerant reader is a useful framing, especially for integrations. (R12)

## Suggested diagrams

1. Detect -> classify -> decide -> respond flowchart.
2. Drift monitor architecture (scheduled job + snapshot store + alert channel).

## Questions only Samuel can answer (to avoid guessing)

1. What did you change after the incident (monitoring, runbook, mapping strategy, guardrails)?
2. What is the minimum drift you want to detect (length only, type/nullability, add/drop, all of the above)?
3. What is the acceptable failure mode when drift is detected (block writes, allow reads, read-only mode, alert-only)?
4. Where should the drift check run in your stack (app startup, scheduled job, CI, separate tool)?

