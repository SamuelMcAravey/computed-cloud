# Editorial Roadmap (Computed Cloud Blog)

North star:
- Practical notes on systems that survive reality: integrations, reliability, and the boring work that keeps money-moving workflows stable.
- CTO-level decisions with receipts: constraints, tradeoffs, scars, and what changed operationally.

Defaults locked for this roadmap:
- Career focus: CTO / Head of Engineering
- Personal dial: low (personal stories only when they support an engineering point)
- Canonical per-post specs live in: `notes/blog-backlog.yml`

Related docs:
- How to draft: `notes/how-to.md`
- Avoid AI writing tells: `notes/ai-writing-tells.md`
- Posts live in: `src/content/blog/`

---

## Pillars (Rotate These)

1) Reliability and ops for B2B workflows
- incidents, support, guardrails, failure modes, reducing cognitive load

2) Integrations as a product
- ERP and payments integrations, schema drift, idempotency, contracts, and observability

3) Engineering leadership that is not fluff
- modernization without rewrites, metrics that matter, delivery systems, hiring and scaling

---

## Content mix rules (Guidance)

- 60-70% technical (pattern guides, how-to, project deep dives)
- 20-30% leadership/strategy (only if grounded in concrete incidents and decisions)
- 0-10% personal (engineering-adjacent only)

---

## Current state (Published)

Published posts (see `src/content/blog/`):
- `src/content/blog/start-here.md`: site context and what this blog is about.
- `src/content/blog/how-i-build-software-that-survives-reality.md`: operating principles.
- `src/content/blog/when-the-sandbox-lies.md`: integration reality and failure modes.
- `src/content/blog/codex-assisted-support-ticket-triage-freshdesk.md`: human-in-the-loop support workflow with guardrails.
- `src/content/blog/pearl-bakery-custom-erp-for-production.md`: case study: bakery ERP from orders to invoices.

---

## Roadmap horizons

### Now (Next 3)

These are the next three drafts we should produce because they are high-signal, repeatable, and align with the blog pillars.

#### configuration-as-a-first-class-system
- Shape: pattern-guide
- Working title: Configuration as a First-Class System
- Goal/point: Make config boring and safe. Treat config changes as high-risk operational changes, not "just settings".
- Target reader: senior engineers and founders
- Core constraint: config changes happen under pressure; deploys are a risky way to change a value.
- Decision/assertion: typed parsing + validation + clear environment boundaries beats ad-hoc string config.
- What must be in the post:
  - examples: feature flags, endpoint URLs, timeouts, tenant overrides
  - "secrets are not config" boundary callout (link to the future secrets post)
  - a checklist for introducing a new config value safely
- Scar to include: [ADD: config change caused incident -> what changed -> rule of thumb]
- Artifacts:
  - a checklist
  - a small example schema/validation snippet (language-agnostic or .NET)
- What to avoid:
  - no invented metrics
  - no proprietary customer/internal system names
- Inputs needed from Samuel:
  - [ADD: one real config failure story]
  - [ADD: what improved after the fix, even if qualitative]

#### schema-drift-erp-integrations
- Shape: how-to
- Working title: Schema Drift in ERP Integrations: Detect It Before It Pages You
- Goal/point: Turn schema drift from a surprise outage into a monitored, intentional failure mode.
- Target reader: engineers integrating with ERPs or external databases
- Core constraint: the sandbox is not a contract; production can change without your deploy.
- Decision/assertion: tolerant reads, strict writes, and drift detection on the few tables that matter.
- What must be in the post:
  - concrete drift signals to log (table, column, type, length)
  - pragmatic monitoring that fits small teams
  - how to choose failure modes (block writes, degrade reads, alert-only)
- Scar to include: Production changed schema; sandbox did not; strict mapping threw; hotfix; new rule: detect drift and choose failure modes.
- Artifacts:
  - drift detection checklist
  - mermaid flow for "detect -> decide -> respond"
- What to avoid:
  - do not over-rotate into "build a platform"
- Inputs needed from Samuel:
  - [ADD: what you changed after the incident]

#### idempotency-in-payments-workflows
- Shape: case-study
- Working title: Idempotency in Payments Workflows (When Money Moves Twice)
- Goal/point: Idempotency is not a retry button. It is a workflow design problem, plus reconciliation and evidence.
- Target reader: engineers building workflows with external systems
- Core constraint: retries are unavoidable; external providers can deliver duplicates or partial results.
- Decision/assertion: model explicit states; enforce idempotency at the boundary with durable keys.
- What must be in the post:
  - a state model (mermaid) with retry and reconciliation states
  - what you log to prove what happened (minimal audit trail)
  - recovery path that is human-safe (part of the product)
- Scar to include: [ADD: duplicate attempt/duplicate submission -> fix -> rule of thumb]
- Artifacts:
  - mermaid state diagram
  - logging checklist
- What to avoid:
  - no compliance claims unless cited to a primary source
- Inputs needed from Samuel:
  - [ADD: operational change after adopting this]
  - [ADD: one incident story that is safe to tell]

### Next (Next 6-9)

These are high-signal, CTO-aligned posts that extend the pillars.

#### secrets-and-credential-boundaries
- Shape: pattern-guide
- Goal/point: Define the boundary between config and secrets, and make rotation and least privilege real.
- Must include: where secrets live, rotation playbook, "who can access what", local dev story.
- Inputs needed from Samuel: [ADD: one scar involving a credential boundary mistake]

#### background-jobs-retries-and-poison-messages
- Shape: pattern-guide
- Goal/point: Background jobs are where reliability goes to die unless retries and poison handling are designed.
- Must include: retry strategy, backoff, dead-letter/poison handling, observability signals.
- Inputs needed from Samuel: [ADD: one production scar]

#### logging-traces-and-correlation-ids-you-actually-use
- Shape: pattern-guide
- Goal/point: Logs are only useful if they answer specific questions fast, under stress.
- Must include: correlation ID propagation, what you log, what you never log, how it changes support and incident work.
- Inputs needed from Samuel: [ADD: your minimal "prove what happened" fields]

#### feature-flags-with-kill-switches
- Shape: pattern-guide
- Goal/point: Flags are operational tools. Without lifecycle rules they become debt.
- Must include: kill switches, auditability, lifecycle, "flags are debt" tradeoff.
- Inputs needed from Samuel: [ADD: one failure mode from flags]

#### forward-only-database-migrations-in-multi-tenant-systems
- Shape: how-to
- Goal/point: Migrations should be forward-only and survivable during rollout across tenants and environments.
- Must include: compatibility strategy, rollout checklist, verification queries.
- Inputs needed from Samuel: [ADD: one scar]

#### modernizing-delivery-without-a-rewrite
- Shape: case-study
- Goal/point: Modernization that actually worked: Git + CI/CD + release discipline, without a rewrite.
- Must include: what changed in practice, how adoption worked, what got better (qualitative is OK if honest).
- Inputs needed from Samuel: [ADD: one incident that made the change unavoidable]

#### ai-assisted-engineering-workflows-with-guardrails
- Shape: case-study
- Goal/point: Use AI for speed and cognitive load reduction without outsourcing truth or responsibility.
- Must include: where it works, where it fails, hard guardrails, example workflow.
- Inputs needed from Samuel: [ADD: which parts are safe to describe publicly]

#### rebuilding-erp-sync-from-data-factory-into-code
- Shape: case-study
- Goal/point: When "integration glue" becomes product logic, it belongs in code with tests and observability.
- Must include: why it moved, what changed operationally, test approach, deployment approach.
- Inputs needed from Samuel: [ADD: what moved fastest and why]

#### ocr-compliance-workflows-outbox-and-llm-validation
- Shape: case-study
- Goal/point: Accuracy-first workflows: outbox, retries, rate limits, and validation layers.
- Must include: outbox model, retries, evaluation approach (FATURA mention if safe), failure modes.
- Inputs needed from Samuel: [ADD: what accuracy or error modes you cared about most]

### Later (Title bank)

These are "good someday" items. Add details when they move into Now/Next.

- Multi-tenant context: patterns, caching, request lifecycle
- Eventing patterns: in-process vs queue, contracts, versioning
- Retry policies that will not DDoS your own dependencies
- Incident response notes for small teams
- How to model statuses without creating a 200-state enum

---

## Brief template (Copy/Paste)

Use this when adding or updating a post in the roadmap:

- ID:
- Shape:
- Working title:
- Goal/point:
- Target reader:
- Core constraint:
- Decision/assertion:
- What must be in the post:
- Scar to include:
- Artifacts:
- What to avoid:
- Inputs needed from Samuel:

---

## Iteration log

- 2026-03-04: Reformatted `notes/plan.md` into an editorial roadmap with "Now/Next/Later" horizons. Canonical per-post specs remain in `notes/blog-backlog.yml`.

