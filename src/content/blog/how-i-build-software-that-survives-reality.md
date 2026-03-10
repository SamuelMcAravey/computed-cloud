---
title: "How I Build Software That Survives Reality"
description: "A practical manifesto on building software that stays operable, maintainable, and sane after it ships."
pubDate: 2026-01-14
tags: ["principles", "reliability", "operations", "integrations", "architecture"]
draft: false
---

# How I Build Software That Survives Reality

When I say *software that survives reality*, I mean software that holds up when the rubber meets the road.

A lot of developers hear that and translate it as: "Does it work in production?"

That's interesting. It needs to work. But I treat that as the minimum bar, not the goal.

Reality is the people who have to run the thing, maintain it, support it, debug it, and change it after you ship. It's the developers who come after you. It's the users (internal and external). It's the cost of operating it. It's the fact that your "simple" feature has to survive email deliverability, weird vendor workflows, schema changes you didn't authorize, and the reality that production never behaves exactly like your test environment.

Writing the code isn't the entire job.

---

## What "doesn't survive reality" looks like

The extreme version is software that requires constant tinkering to keep it alive. You're always "delving deep" into code to figure out where things are breaking. It's expensive, inefficient, and everyone dreads touching it.

Sometimes it's not even that the software is "bad." It's that when something goes wrong, you have no idea what went wrong. No observability. No useful logs. No ability to trace a workflow. So the response pattern becomes:

- find the user
- try to emulate their exact setup
- manually trace through code
- repeat... constantly

Not as an occasional incident. As the normal way of life.

And that's the key thing: the pain becomes routine.

---

## What "survives reality" looks like

Software that survives reality isn't bug-free. Bugs happen.

The difference is: when a bug happens, it's readily obvious where the problem occurred. It doesn't require pain and suffering. People don't come to work dreading maintenance. Other developers can change things without fear. Operations is straightforward.

Basically: it *feels* nice to use and nice to run.

---

## A quick model of what I'm optimizing for

Most engineering conversations over-index on the "write code" portion of the lifecycle. Reality is the loop:

```mermaid
flowchart TD
  A[Understand the goal] --> B[Design a simple path]
  B --> C[Write the code]
  C --> D[Ship it]
  D --> E[Operate it]
  E --> F[Debug it]
  F --> G[Change it]
  G --> H[Hand it off]
  H --> E
````

If your system only works when the original authors are around and fully context-loaded, it's fragile. That fragility is what I mean by "doesn't survive reality."

---

## My default principles (the ones I apply before I touch a keyboard)

### 1) If you're going to build it, build it right (when you already know the right way)

This is not the same thing as pretending you have perfect requirements. Most of the time, you don't.

But there are *way more times* where people are just lazy. They take a shortcut **when they already know the right way**.

A simple example: hard-coding configuration into an application.

At first glance, it's "fine":

* set the value
* deploy
* it works

But now you've lost maintainability from the outside. If a URL changes because you need a different endpoint, you've created a situation where:

* a developer has to modify code
* run build/deploy
* risk shipping unrelated changes
* just to change a configuration value

That's insane if you knew better and chose not to do it.

Here's the principle: **make the right thing the easy thing for future-you and future-engineers**.

### 2) Jumping into the editor won't solve the problem

Even for a "small" project, I need an idea of what I'm building.

Requirements can be vague. That's normal. But you still need a mental model:

* what does the user want to accomplish?
* what are the workflows?
* what does "done" mean for them?
* what's the failure mode?

Understanding the purpose before you touch the keyboard is one of the most consistently high-leverage things you can do.

### 3) Pragmatism wins (but don't confuse pragmatism with laziness)

People use "keep it simple" or "don't repeat yourself" or a dozen other labels. For me it's just: pragmatism wins.

Pragmatism means accepting the state of the world and the fact that some things are outside your control.

Sometimes "do it right" and "be pragmatic" are in tension. That's real. You balance it:

* if the app is on fire, you fix what's broken *now*
* then you come back and fix it properly

The point is: **pragmatism doesn't mean "ship garbage."** It means you're honest about what matters right now and what can wait.

Also: pragmatism is how you avoid getting lost in the weeds. Bike shedding is real. People can argue endlessly about the color of the bike shed while the actual building is on fire.

Example: sending emails. There are multiple ways to do it. SMTP vs vendor API vs library. If email is not your core product, you pick the safest option that gets the job done, and you move on.

### 4) Play it safe. Don't chase the shiny new ball.

This is the one that gets me into arguments.

If you understand the full system-where it runs, how it fails, what it costs-you rarely need the complexity people assume is required.

Kubernetes is a good example. Kubernetes has real benefits. Do you need it?

Unlikely.

A single machine can do a lot. A handful of machines can do redundancy. A 32-core, 256GB RAM server can support a huge number of users. People often avoid simple deployments because they're afraid they "can't scale," but most systems never earn the right to that complexity.

Complexity has a real cost:

* in code
* in deployment
* in debugging
* in staffing
* in operations

The moment you start piling on microservices, multiple languages, and network boundaries as your primary isolation mechanism, you introduce costs that don't show up immediately. They show up later. And they stack up fast.

My bias is: **simpler systems are cheaper to build, cheaper to run, and easier to understand.**

---

## The painful part: discipline after the emergency ends

Two of the hardest things I've learned (and had to build discipline around) are:

1. being pragmatic when it isn't fun
2. not rushing when you *should* slow down and do it right

In an emergency, it's easy to focus. Fix the incident. Restore service. Get it stable.

The hard part is: when the emergency ends, the desire to go back and fix things properly disappears.

And when you have lots of time, the temptation flips: you start embellishing. You start adding more "because it might help someday." You start building a mountain of abstractions because it feels clever.

That's where I butt heads with people.

Abstractions are good right up until they're not. Complexity is only worth paying for when the benefit is real-maybe to users, maybe to resilience, maybe to observability-not because it's fashionable or "how everyone does it."

Everyone is not us.

---

## Anti-patterns I avoid (or try hard to)

### 1) Microservices for the sake of microservices

I've experimented with microservices. I can see benefits.

But unless you're at a scale where your organization actually splits along service boundaries (separate teams, separate ownership, separate release trains), microservices can be dangerous.

You become constrained by network speed. You're now doing:

* HTTP conversions
* routing
* service discovery
* retries and timeouts
* versioning API contracts
* distributed tracing (if you're lucky)

That's a lot of new failure modes just to get... what, exactly?

People talk about scaling one piece of the application independently. That's real. But microservices don't magically solve statelessness, performance, or operational discipline. More often than not, I've seen them make a system worse than a simpler architecture would have been.

### 2) Big bang rewrites

I hate rewriting software.

Big bang rewrites are dangerous because:

* behavior changes subtly
* customers notice the small details
* you never perfectly recreate all workflows
* and the best outcome is "it works exactly as well as before," which is nearly impossible

I also have a strong bias that production rollouts should be backwards compatible, especially with the database. Version 1 of the app should continue to work against version 2 of the database (at least for some window). That mindset pushes you toward incremental change instead of rewrites.

I'm not pretending rewrites are never justified. Sometimes technology is so old it's not maintainable. Sometimes the system is fundamentally flawed.

But "we want to rewrite it" is not a reason. It's a wish.

You need to know what you're trying to achieve and why that can't be achieved incrementally.

---

## Operational scars (this is the stuff that actually teaches you)

### A "small" production issue that wasn't small

We had a user who couldn't save product/invoice information. Looked isolated. One user. No big deal.

It wasn't.

As we dug in, it turned out to be an operational issue with underlying tech (Blazor in this case). Worse: it was silently corrupting data. This one user's corruption triggered an exception that surfaced to us. Other cases were quiet.

We missed it in testing. It went to production. It created silent damage.

That's reality: production doesn't just fail loudly. Sometimes it fails quietly and you don't know until it hurts.

### A system that worked fine... until integrations were added

ERP integrations taught me a lesson I have learned more than once:

**your test environment is a lie.**

One example: an ERP integration with Viewpoint Vista. We had a test instance for development and customer databases. One day, out of nowhere, we got a flood of exceptions from a customer's integration.

After digging: Trimble updated the customer's database schema... but not ours. No warning. No aligned upgrade. The schema changed under our feet and our strictness (which is usually a good thing) became a breaking point.

That's reality: you don't control the other side.

### A decision that paid off later: observability

At a previous payments platform, the early system was haphazard. If something went wrong, you were digging through Azure Table Storage just to find a record of an exception.

It took a long time to implement sane observability-Application Insights, and later things like Datadog-level visibility. It also took a long time to convince people it mattered.

Once it existed, it saved us repeatedly:

* we could see issues quickly
* we could alert earlier
* we could fix faster
* we could stop guessing

Observability feels "optional" right up until you have to operate the thing. Then it becomes the difference between a 15-minute fix and a two-day nightmare.

### A decision that still costs: coupling

In PayeWaive we have payment applications, and we sign electronic documents. Early on, we tightly coupled document signing and payment applications. It was pragmatic.

We're still paying for it.

We need to:

* sign documents unrelated to payment applications
* support payment applications unrelated to signing
* decouple workflows so they can evolve independently

Untangling tightly coupled systems later is harder than doing a bit more separation early. That's one of those "pragmatic" decisions that becomes expensive over time.

---

## When money moves, my alarm bells go off

There are plenty of places you can be a little flexible in software.

Money is not one of them.

When money moves, I want to prove-without a shadow of a doubt-that the code path is correct. I think through failure modes. I don't accept "probably fine."

What you can't have is a 500 error page in front of a customer during a money workflow. The customer needs to feel that the system is rock solid and their funds are doing exactly what they're supposed to do.

### Reconciliation changes the game too

Reconciliation isn't the same as "money movement," but it has its own reality:

* how do you know two systems are in sync?
* how do you know what's different?
* how do you sync without incinerating time and money?

You can build sync via brute-force workflows (like heavy ETL patterns), but that has real cost. If every customer sync triggers a big pipeline, you pay for it-forever.

Sometimes optimization is not premature. Sometimes optimization is survival.

### External vendors and users you don't control

In construction workflows, you're often in the middle of a relationship you didn't explicitly sign a contract with: your customer's subcontractors.

A payment application goes out. A subcontractor gets an email:

* maybe the email doesn't go through
* maybe it goes to spam
* maybe they're out of office
* maybe the link breaks
* maybe login friction kills completion
* maybe they fill it out and forget to click "send it back"
* maybe they type the wrong thing and get stuck

Reality is you need to design for users who didn't ask to learn your system.

The question becomes: how do you make it simple enough that they can help themselves, and you're not dragged into the middle of every interaction? What tooling can you give your customer to manage that vendor relationship without you becoming customer support for their entire supply chain?

---

## Integrations: the biggest mistakes I see

### The biggest integration mistake

Engineers tightly couple integrations to other parts of their system.

The second mistake is assuming documentation is accurate and the integration behaves predictably.

It never does.

Sandbox environments almost never reflect production. API surfaces differ. Performance differs. Behavior differs. Debugging differs.

So you go into production with your eyes open and you prepare for things to go wrong. That means:

* strong observability around integration paths
* explicit error handling
* recovery workflows
* and not pretending the other side is stable just because the docs say it is

---

## Modernization over time: "technical debt" is really obligation

I'm not denying technical debt exists. I just don't love the framing.

Debt implies:

* a known amount
* a known payoff
* a clear schedule

Software isn't like that.

I think of it more like owning a house.

Even if the house is paid off, you still have obligations:

* things break
* maintenance is constant
* upgrades cost money
* changes ripple into other areas

Nothing stays pristine forever.

That's why "build it right" matters-if you nail it together poorly, it will fall down faster.

And "be pragmatic" matters-because you can't do perfect work in a world with deadlines, incidents, and unknowns.

### Rewrites (again): I still hate them

The best outcome of a rewrite is "it works exactly the same." That's not a great outcome for a multi-year project.

If you're rewriting, you need a clear reason:

* maintainability is impossible otherwise
* the system is fundamentally flawed
* the risk of staying is higher than the risk of changing

Most rewrites I've seen are driven by something softer: taste, boredom, resume padding, or frustration.

### What I optimize for instead of "clean architecture"

Clean architecture is prescribed. People treat it like scripture.

It's better than nothing. But my default is: **simple and understandable**.

I want to be able to come back to code in a few weeks, forgetting its purpose, and still:

* understand what it's doing
* be confident it's correct

I don't want to trace ten layers of indirection to find the broken line.

Some layering is good. Some abstraction is good. Normalization and denormalization are tools.

But I don't worship a diagram. I worship clarity.

---

## Inheriting a legacy system: business first, code later

Step one: understand the purpose from a business perspective. I don't care about the code yet.

Then:

* interview the business folks: what is it supposed to do?
* interview the developers/maintainers: what are the moving pieces? the scary parts?
* align "what it does" with "why it exists"
* only then start diving into code and tooling

Once I understand purpose and behavior, I can ask:

* how do we know it's behaving properly in production?
* how do we verify it's meeting the business goal?
* what's missing?

From there you branch into the critical areas. You explore the most important systems first. You build a map before you start swinging an axe.

---

## People and handoffs are part of the system

People screw up. People fix things. People leave.

Software that survives reality assumes people are imperfect and turnover is inevitable.

I dislike:

* esoteric exception messages
* cryptic names
* implicit knowledge required to decipher problems
* shortened names that only make sense if you were in the room when it was written

If the original authors leave and the system has no documentation, no work items, no diagrams, and everything is encoded as tribal knowledge... good luck.

### What I do to make systems survivable for the next engineer

* document workflows and key decisions
* avoid cryptic error codes that are hard to search
* use meaningful names
* keep error handling explicit
* keep processes documented and centralized

The business is not the developer. Developers come and go. The business continues.

---

## The takeaway

If a senior engineer only remembers three things from this post:

1. **Don't do things just because that's what other people do.**
   Always consider your situation: business goals, team size, capability, constraints. "Everyone does it" is not a reason.

2. **Hold off on the temptation to jump in front of the keyboard.**
   The real work starts with understanding what you're building and why. Plan first. Then code.

3. **Reality includes people, operations, and handoffs-not just production.**
   If your system only works when the original author is around, it doesn't survive reality.

And if you're building your first serious system: don't aim for clever. Aim for clear. Aim for operable. Aim for a system someone else can maintain without dreading it.

One last thing I wish someone had told me earlier: management is not optional. Even if you think you're "just a developer," you can't escape the need to understand customers, internal users, day-two operations, and the broader system. Once you understand all of that, you can finally feel confident about what you're building.
