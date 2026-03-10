# Outline: Codex-Assisted Support Ticket Triage (Freshdesk) With Human Approval

## Title options
- Using Codex to Triage Support Tickets Without Trusting It
- Support Automation Without Auto-Replies: A Codex Workflow
- Human-in-the-Loop Support With Codex (and the Forwarded Ticket Scar)
- Forwarded Tickets Are Identity Bugs: A Support Workflow Fix
- A Practical AI Support Assistant: Summaries, Draft Replies, and Guardrails

## Recommended title + why
Using Codex to Triage Support Tickets Without Trusting It

Reason: It states the constraint and the posture. It signals guardrails first, not hype.

## Tags (draft suggestions)
["operations", "support", "workflows", "reliability", "ai"]

## TL;DR (must be first in the post)
- Decision: use Codex as a human-in-the-loop support assistant that summarizes, investigates (read-only), and drafts replies.
- Constraint: a wrong reply is worse than a slow reply, so humans must approve the exact text before sending.
- Scar: forwarded tickets broke the requester identity assumption, so we added an explicit identity check and To/CC handling.
- Outcome: lower cognitive load and faster first pass when a ticket arrives.

## On this page
- Context
- The workflow
- The forwarded ticket scar
- Guardrails
- Internal notes and handoff
- Tradeoffs and next improvement
- Checklist

## Context
- Support work is high-context, and raw tickets include emotion, forwarding artifacts, and missing details.
- Goal: reduce cognitive load while keeping risk bounded.
- Non-goal: fully automated replies.

## Decision
- Manual invocation: a human runs Codex when a ticket arrives.
- Codex can read the ticket and draft a response, but it must always show the exact outbound text for review.
- Optional step: Codex does read-only codebase investigation using clues from the ticket (error message, page name, etc.).
- Repo grounding: Codex has a repo map file (llms.txt) plus read-only access to the codebase.

## The workflow (runbook-style)
1. New ticket notification arrives.
2. Ask Codex to fetch and summarize the latest ticket via the Freshdesk API.
3. Codex produces a facts-only summary plus recommended next action.
4. If it smells like our bug: ask Codex to investigate the codebase read-only by searching for error strings and likely modules.
5. Ask Codex to draft a public reply for human review.
6. Review and edit the draft (tone, correctness, guardrails).
7. Send the reply:
   - To: real requester
   - CC: forwarder (when it was forwarded)
8. Add an internal note (nearly every ticket) capturing what happened and what we did.
9. If engineering work is needed: create a GitHub Issue (Freshdesk is not the engineering backlog).
10. Close the ticket when no action remains (either you completed work, or the customer did).

## Summary output contract (what the summary must include)
- Facts-only issue summary (1 to 3 sentences)
- Identity check: requester vs forwarder (flag forwarded suspicion)
- Who is impacted
- What we need from the customer (if anything)
- Likely root cause (with confidence level)
- Recommended response (short bullets)
- Engineering follow-up needed (yes/no) and next action
- Risk/urgency (low/medium/high)

## The scar: forwarded tickets broke identity
- What happened: forwarded tickets made the requester the forwarder, not the person with the issue.
- Detection heuristic:
  - requester email is on our domain, and
  - the body looks like a forwarded thread (little original content, mostly another email)
- Fix today: reply with the real requester in To and the forwarder in CC.
- Rule of thumb: treat requester identity as untrusted until you verify it.

## Guardrails (what the assistant must not do)
- No money: no refunds, billing decisions, credits, or financial commitments.
- No timelines: no deadlines or ETAs unless a human explicitly approves them.
- No blame: do not blame the user or shame them for confusion.
- No risky instructions: avoid asking customers to perform risky production actions, especially anything touching an ERP, unless truly necessary and carefully reviewed.
- No secrets: do not ask for passwords, API keys, or private credentials in email.
- Always show outbound text: the assistant must present the exact public reply for human approval before sending.

## Internal note template (include this snippet in the post)
- Summary:
- Suspected root cause (if any):
- What we did / what the customer needs to do:
- Follow-ups (including whether an engineering issue should be created):

## Engineering handoff (what happens after triage)
- Engineering work is tracked in GitHub Issues.
- Freshdesk internal notes capture context, but the engineering backlog is separate.
- Links are not always added immediately because issue creation follows a process.

## Tradeoffs and next improvement
- Tradeoff: human review adds time, but caps risk and prevents confident-wrong replies.
- Tradeoff: read-only code investigation can narrow the search, but it is not proof.
- Next improvement: update the Freshdesk requester field via API when forwarding is detected so identity is correct in the system of record (not just in To/CC).

## Diagram (flowchart)
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

## Checklist (end-of-post)
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
