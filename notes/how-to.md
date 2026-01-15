## A workflow that works (and scales)

### 1) Pick a post "shape" before you write anything

For each post, decide which of these you're doing:

* **Manifesto / principles** (e.g., "software that survives reality")
* **Case study** (a system you built, story + lessons)
* **Pattern guide** (a reusable technique + examples)
* **Project deep dive** (why it exists + design choices + how to use)

That one choice tells ChatGPT how to organize the post.

### 2) Do a 10-20 minute "brain dump" the way you described

For a manifesto-style post, don't write prose. Give it **bullets + examples**.

Use this exact template (copy/paste and fill):

**Title idea:**
**Audience:** (who is this for)
**What problem does this solve?** (1-3 bullets)

**My principles (bullets):**

* Principle 1: (one sentence)

  * Example from my work: (specific story)
  * Anti-pattern / mistake I've seen:
* Principle 2: …

**My defaults / "rules of thumb":**

* …

**Tradeoffs / where this breaks down:**

* …

**A short story that proves I've lived this:**

* (2-6 sentences, messy is fine)

**What I want the reader to do differently after reading:**

* …

Then tell ChatGPT: "turn this into a coherent post, keep my tone, do not add claims."

### 3) Have ChatGPT propose 2-3 outlines, then pick one

This prevents the model from guessing your intent. It also makes the post feel authored.

### 4) Draft → you add 2-3 "human edits" → final polish

Your edits are what kill the "AI feel." Add:

* one concrete anecdote the model couldn't invent
* one opinion stated in your words
* one constraint/detail (numbers, timeline, specific failure mode)

Then ask ChatGPT to do a final pass **without changing meaning**.

---

## How to avoid "AI writing" vibes

People detect AI writing when it's:

* overly smooth, generic, and symmetric
* full of "in today's world" / "it's important to"
* too many headings that say nothing
* no scars: no mistakes, no constraints, no specifics
* confident about things you didn't actually measure

### Practical rules that reliably fix this

1. **Anchor every section to something specific you did**

   * a decision you made
   * an incident you handled
   * a tradeoff you chose
   * a constraint you had (time, money, team size, legacy system)

2. **Use "because" and "so that"**

   * AI text often states conclusions without causal chains.
   * Humans explain "why" and "what it cost."

3. **Include one "I was wrong" moment per 2-3 posts**

   * "I used to think X. Then Y happened. Now I do Z."
   * That reads human immediately.

4. **Keep some asymmetry**

   * Not every section needs the same length.
   * Not every list needs 5 items.
   * Real writing has weight where you care most.

5. **Don't let the model write your "voice" from scratch**

   * Your idea-having a "how I sound" document-helps, but it's not sufficient by itself.
   * The real voice comes from *your raw material*: phrasing, opinions, examples, little turns of speech.

### Yes, a voice guide helps - but do it like this

Create a short "style contract" that you always prepend (you already have a version of this). Include:

* **Banned phrases**: ("in today's landscape", "delve", "robust", "leverage", "unlock", "seamless")
* **Sentence rules**: short sentences ok. occasional fragment ok.
* **Preference**: concrete nouns > abstract nouns; verbs > adjectives.
* **Evidence rule**: if I can't back it up, phrase as opinion or remove.

And a few "Samuel-isms" you actually use (2-5).

But again: **voice guide + your brain dump** is what produces human output.

---

## A good "biographer prompt" you can reuse

Paste this at the top of a chat when drafting:

**Prompt (reusable):**

You are my biographer and editor. I will give you raw bullet points and messy notes.
Your job is to produce a publishable blog post in my voice: direct, practical, no fluff.
Do not add facts I didn't provide. If something is missing, leave a bracketed placeholder like `[ADD EXAMPLE: …]`.
Prefer specifics, constraints, and tradeoffs. Avoid generic advice.
Output: (1) 3 title options, (2) outline, (3) full Markdown draft with frontmatter, (4) list of "facts to verify" and "assets needed".

Then paste your notes.

---

## How I'd do Post #2 ("Software that survives reality") specifically

### Your brain dump should include these buckets

* The 5-10 principles you actually follow
* A story where one principle saved you
* A story where ignoring one bit you
* Your "default architecture moves" (boundaries, idempotency, migrations, logging, etc.)
* What you refuse to do (big-bang rewrites, no observability, etc.)
* The "operational" part: support, incidents, on-call realities, maintenance

### What the final post should feel like

Not "here are best practices." More like:

* "Here's what I do by default, because I've seen what breaks."
* Opinionated, with receipts.
