# Avoid AI Writing Tells (For This Blog)

This is a practical checklist based on the Wikipedia field guide "Signs of AI writing".

The goal is not to "beat detection". The goal is to avoid the common failure mode where draft prose becomes generic, inflated, and template-like.

Treat these as "smell tests", not a scoring system. Fixing surface phrasing does not fix underlying issues like missing facts, hand-wavy claims, or invented details.

## The One Big Pattern

LLM output tends to regress toward the statistically common version of an idea.

In practice that means it often:
- gets smoother and more confident
- gets less specific
- sounds more important than it is

If you read a paragraph and think "this could be about anything", it is a problem even if it is grammatically perfect.

## Red Flags (The Ones That Matter For Our Blog)

### Inflated significance (puffery)

These are lines that claim importance without adding facts.

Examples of smells:
- "pivotal", "enduring legacy", "represents a shift", "reflects broader trends"
- "serves as", "stands as", "underscores", "a testament to"

Rewrite rule:
- delete it unless you can replace it with a concrete constraint, failure mode, or decision you actually made

### Promotional tone

Blog posts can be opinionated, but they should not read like marketing copy.

Smells:
- "renowned", "groundbreaking", "breathtaking", "in the heart of", "commitment to"

Rewrite rule:
- replace adjectives with nouns and verbs
- say what it did, what it cost, and what broke

### Weasel wording (vague authorities)

Smells:
- "experts argue", "industry reports", "observers have cited", "researchers say"

Rewrite rule:
- name the actual source, or remove the attribution
- if it is your own view, own it with "I think" and explain why

### Template filler sections

Smells:
- generic "challenges and future outlook" sections
- generic wrap-ups that restate what we already said

Rewrite rule:
- end with a specific rule of thumb, a next step, or a concrete tradeoff you would pick differently

### "AI vocabulary" clusters (watch list)

These words are not banned. They are a watch list because they tend to appear together in LLM output.

If you see a cluster, slow down and check if the paragraph is carrying real information.

Examples:
- "delve"
- "underscore" (verb)
- "tapestry"
- "pivotal"
- "showcase" (verb)
- "meticulous"
- "intricate"
- "vibrant"

Rewrite rule:
- prefer plain language and plain verbs
- do not swap in fancy synonyms for variety

### Inflated verb choices ("copula avoidance")

Smells:
- replacing "is/are/has" with "serves as", "stands as", "offers", "boasts"

Rewrite rule:
- use the simple verb unless the fancy verb adds meaning

### Fake ranges ("from X to Y" with no scale)

Smell:
- "from microservices to machine learning" style ranges that do not form a coherent scale

Rewrite rule:
- list the things, or explain the actual dimension you mean

### Assistant-chat phrasing accidentally included

Smells:
- "Of course!", "Certainly!", "I hope this helps", "Would you like..."

Rewrite rule:
- delete it. It is not part of an article.

### "Knowledge cutoff" disclaimers and source speculation

Smells:
- "as of my last update", "not widely documented", "limited in available sources"

Rewrite rule:
- in our blog, this is usually a sign we are about to speculate
- either find the missing fact, or remove the claim

### Placeholder text and tool artifacts

Smells:
- `[ADD: ...]`, `TBD`, `INSERT_...`, `PASTE_...`, `2026-XX-XX`
- citation/tool junk like `turn0search0`, `oaicite`, `oai_citation`, `utm_source=chatgpt.com`

Rewrite rule:
- placeholders belong in drafts only
- tool artifacts should never survive into a committed post

## Rewrite Playbook (When Something Feels "AI")

1. Replace abstract nouns with concrete nouns.
- bad: "operational excellence"
- good: "the ticket queue", "the 2am page", "the retry storm"

2. Turn "importance" into "constraint".
- bad: "this was pivotal"
- good: "we had 90 minutes before trucks left, so we needed a plan that never required recalculating by hand"

3. Add one "scar" if the section is too smooth.
- failure mode -> change made -> rule of thumb

4. Prefer "because" and "so that".
- causal chains read human and force specificity

5. Use consistent naming.
- do not rotate synonyms for the same thing

## How We Enforce This In The Repo

Manual:
- you still read it and decide if it sounds like you

Automated (warning-only):
- run `pwsh scripts/check-ai-tells.ps1` to flag common tells in `src/content/blog`
- treat matches as a review prompt, not an automatic delete list

## Publish Checklist (Non-Negotiable)

- `pwsh scripts/check-ascii.ps1`
- `pwsh scripts/check-ai-tells.ps1`
- `npm run build`

