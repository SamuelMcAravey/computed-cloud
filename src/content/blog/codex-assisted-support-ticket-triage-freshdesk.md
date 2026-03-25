---
title: "Using Codex to Triage Support Tickets Without Trusting It"
description: "A human-in-the-loop workflow: facts-only summaries, read-only investigation, and draft replies with guardrails."
pubDate: 2026-02-27
tags: ["operations", "support", "workflows", "reliability", "ai"]
draft: false
---

## TL;DR

- I use Codex to do the first pass on support tickets: summarize facts, propose next actions, and draft a reply.
- The constraint is simple: a wrong reply is worse than a slow reply, so nothing is sent without human review.
- Forwarded tickets broke my "requester identity" assumption, so identity checks and To/CC handling are part of the workflow now.
- This reduces cognitive load when a ticket arrives, without pretending the model is a source of truth.

## On this page

- [Context](#context)
- [Decision](#decision)
- [Workflow](#workflow)
- [The Scar: Forwarded Tickets](#the-scar-forwarded-tickets)
- [Guardrails](#guardrails)
- [Internal Notes And Handoff](#internal-notes-and-handoff)
- [Tradeoffs](#tradeoffs)
- [Next Improvement](#next-improvement)
- [Diagram](#diagram)
- [Checklist](#checklist)

## Context

Support tickets are high-context, but most of that context is not useful.

The raw thread often has emotion, forwarding artifacts, and missing details. That is normal. The problem is that it forces me to do work in the worst order: read the whole thing, reconstruct the facts, and only then decide what the next action is. When a ticket comes in during a busy day, that is a good way to make a mistake.

I also do not want an automated bot responding on my behalf. Support is easy to make worse, and a confident-wrong reply can cost more than taking an extra ten minutes to understand the issue.

So I optimize for a workflow that is fast, consistent, and boring: extract the facts, pick the next action, and draft a reply I can review.

## Decision

When a ticket arrives in Freshdesk, I run Codex manually as a first pass.

The shape is simple. Codex fetches the ticket via the API, summarizes the facts, proposes next actions, and drafts a response. If it smells like our bug, it can do read-only investigation in the codebase by searching for error strings and pointing at likely modules.

The constraint is non-negotiable: it cannot send anything without showing me the exact outbound message first. I approve what goes out, or it does not go out.

To keep it grounded, I give it a short repo map file (`llms.txt`) plus read-only access to the codebase on the same machine.

## Workflow

The workflow is intentionally repetitive. Repetition is the point.

1. A new ticket arrives (Freshdesk).
2. I ask Codex to fetch and summarize the latest ticket (facts only).
3. Codex proposes next actions: reply, ask a question, or hand off to engineering.
4. If it smells like our bug, I ask Codex to investigate the codebase read-only:
   - search for error strings or keywords from the ticket
   - point to likely modules and candidate causes
5. I ask Codex to draft a public reply.
6. Codex prints the exact message it wants to send.
7. I review and edit (tone, correctness, guardrails).
8. Codex updates the ticket:
   - public reply (email)
   - internal note (almost every ticket gets one)
9. If engineering work is needed, we create a GitHub Issue (Freshdesk is not the engineering backlog).
10. We close the ticket when no action remains (either we finished our work, or the customer finished theirs).

The value is not "AI wrote my email". The value is that I start from a clean summary and a draft that I can accept, edit, or reject.

## The scar: forwarded tickets

Forwarded tickets taught me that requester identity is part of the system.

The failure mode was basic:

- A ticket gets forwarded.
- The ticket requester is the forwarder, not the person with the issue.
- If you reply naively, you reply to the forwarder and the thread becomes a mess.

Now I treat requester identity as untrusted until I verify it.

My forwarding heuristic is simple:

- the requester email is on our domain, and
- the body looks like a forwarded thread (little original content, mostly another email)

When a ticket is forwarded, my reply handling is:

- To: the real requester
- CC: the forwarder

If I cannot confidently identify the real requester, I investigate identity as part of the review step.

> **Rule of thumb:** forwarded tickets are identity bugs. Verify who should receive the reply before you send it.

## Guardrails

Human review is the main gate, but I still keep an explicit "do not do this" list. It prevents the assistant from drifting into the exact behaviors I do not want.

- No money: no refunds, billing decisions, credits, or financial commitments.
- No timelines: no deadlines or ETAs unless a human explicitly approves them.
- No blame: do not blame the user or shame them for confusion.
- No risky instructions: avoid telling customers to perform risky production actions, especially anything touching an ERP, unless truly necessary and carefully reviewed.
- No secrets: do not ask for passwords, API keys, or private credentials in email.
- Always show outbound text: the assistant must present the exact public reply for human approval before sending.

This is not paranoia. It is an attempt to choose a failure mode I can live with.

## Internal notes and handoff

Almost every ticket gets an internal note. That note is not a backlog. It is a breadcrumb trail for future-me.

I keep it short:

```text
- Summary:
- Suspected root cause (if any):
- What we did / what the customer needs to do:
- Follow-ups (including whether an engineering issue should be created):
```

Engineering work is tracked in GitHub Issues. Freshdesk is for customer communication and context, not sprint planning.

We do not always add a hard link in the Freshdesk note immediately, because issue creation follows a separate process.

## Tradeoffs

This workflow has real costs.

- Human review adds time, but it caps risk and prevents confident-wrong replies.
- Read-only code investigation can narrow the search, but it is not proof. It can still be wrong.
- Internal notes improve continuity, but they can turn into busywork if the template grows.

Both are valid. I prefer this shape because the real constraint is not "can we answer". The constraint is "can we avoid making things worse".

## Next improvement

Today, I fix forwarding mostly at reply time (To/CC).

The next improvement is to update the Freshdesk requester field via API when forwarding is detected, so identity is correct in the system of record, not only in the outgoing email.

## Diagram

```mermaid
flowchart TD
  A[Ticket arrives] --> B[Fetch ticket via API]
  B --> C[Facts-only summary + next action]
  C --> D{Needs code investigation?}
  D -- No --> E[Draft public reply]
  D -- Yes --> F[Read-only code search]
  F --> E[Draft public reply]
  E --> G[Human review and edits]
  G --> H[Send reply (To real requester, CC forwarder if forwarded)]
  H --> I[Add internal note]
  I --> J{Engineering work needed?}
  J -- No --> K{No action remains?}
  J -- Yes --> L[Create GitHub Issue]
  L --> K{No action remains?}
  K -- Yes --> M[Close ticket]
  K -- No --> N[Wait for customer / next step]
```

## Checklist

- [ ] Summarize facts first. Do not respond from the raw thread.
- [ ] Verify identity: requester vs forwarder.
- [ ] If forwarded: To real requester, CC forwarder.
- [ ] Decide: customer action vs engineering action vs no action.
- [ ] If likely a bug: do read-only code search using error strings.
- [ ] Draft the reply, then review it as if it will be forwarded to your CEO.
- [ ] Do not promise money or timelines.
- [ ] Do not ask for secrets.
- [ ] Avoid risky touch production steps, especially ERP actions.
- [ ] Add an internal note capturing what happened and next steps.
- [ ] Create a GitHub Issue when engineering work is required.
- [ ] Close only when no action remains.
