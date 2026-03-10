# Notes Idea Bank

Working backlog of note ideas pulled from:

- `facts_bank.yml`
- `src/content/notes/`
- published blog posts and outlines
- resume material in `C:\temp\resume\career\resumes`

Legend:

- `*` = likely strong enough to expand into a full blog post later
- unstarred = probably a better fit for a short public note
- items in the final section are more inferred than explicitly documented, so validate them before publishing

## Existing themes worth splitting into smaller notes

- `*` Recovery paths are product features, not cleanup work.
- The phrase "we did not deploy anything" is often the first useful clue in an incident.
- Forwarded tickets are identity bugs.
- A support note is not a backlog item.
- One person doing manual math every day is a production risk.
- Floor software should look like floor work, not office work.
- Strict on writes, tolerant on reads.
- Sandboxes are useful, not authoritative.
- The system that wins at 5am is the one people can understand half awake.
- After an incident, fix one defensive thing, not ten.
- Simpler systems are easier to staff.
- Big-bang rewrites are usually wishful thinking with a calendar.

## PayeWaive: architecture, integrations, and reliability

- `*` What 99.99% uptime changed about how you design boring systems.
- `*` Why modular multi-tenant architecture sped up client work.
- `*` The shape of an ERP integration roadmap when every customer needs a slightly different thing.
- Choosing the few tables and columns that can actually page you.
- What "mission-critical payment and compliance workflow" means in daily engineering decisions.
- How to think about geo-redundancy when money moves.
- When an external system turns your deploy discipline into someone else's outage.
- Why client processing time is often a workflow problem before it is a performance problem.
- The difference between "integrated" and "operable."
- What you log when you need to prove what happened later.
- When a strict Entity Framework mapping is useful and when it is a trap.
- `*` The contract surface of Viewpoint Vista and Spectrum integrations.
- How tenant overrides become their own small programming language if you let them.
- The point where "custom requirement" means the architecture needs to change.
- What a multi-year technology roadmap looked like in practice instead of on slides.

## PayeWaive: delivery, AI, support, and ops

- `*` What "AI-powered SDLC" actually meant day to day.
- Where AI helped planning, implementation, refactoring, and test writing.
- Where AI was useful in incidents and where it stayed read-only.
- The difference between grounded AI and clean-looking guesses.
- Why Freshdesk is for customer context and GitHub is for engineering work.
- The kinds of tickets that are safe to triage with AI first.
- How internal notes reduce support thrash.
- What changed when you gave the assistant repo context.
- Why human review is cheaper than confident-wrong support.
- `*` Rebuilding Azure Data Factory sync logic into code in days instead of months.
- What moved faster once ERP sync stopped living in orchestration glue.
- How you choose guardrails for AI when money or ERP actions are nearby.
- Using Sentry plus code context as an incident copilot without pretending it knows.
- `*` OCR, outbox patterns, retries, and LLM validation when accuracy matters more than speed.
- What offline dataset evaluation taught you about AI claims.
- Why rate limits are part of the design, not an operational detail.

## Nvoicepay and payments platform work

- `*` What modernizing a 50+ person engineering org actually required.
- `*` Git adoption as a cultural change, not a tooling change.
- `*` Why CI/CD reduced rollback pain more than it reduced build time.
- What release discipline looked like before and after modernization.
- The early Kubernetes rollout: what was worth it and what was not.
- Service Fabric lessons that still hold even if the tech changes.
- What international payments changed about error handling and contracts.
- `*` Payment rails are different products wearing the same "payments" label.
- Checks vs ACH vs wires vs virtual cards vs RTP vs FedNow as engineering constraints.
- What a platform processing billions forces you to care about.
- Why QA, DevOps, and Product handoffs matter more in payment systems.
- The kind of legacy refactor that actually improves stability.
- High-availability work that users never notice, which is the point.
- How to design a hotfix path for systems that cannot sit broken.
- When organization scale finally justifies more platform complexity.

## Pearl Bakery: technical and workflow notes

- `*` The bakery taught me more about workflow software than many SaaS apps did.
- `*` Designing software for people who are already moving and cannot stop to think.
- Station-specific views vs generic ERP screens.
- Why loss factors and buffers are part of the domain, not edge cases.
- Shared base mixes as a dependency graph problem.
- Overproduction vs underproduction: which one actually hurts more.
- What batch sizing mistakes look like when the cost is food waste.
- Orders as system-of-record vs the floor as work-in-progress.
- The last manual step to kill is often invoicing.
- Why QuickBooks integration mattered less for elegance and more for retyping elimination.
- iPads on tables: what worked and what that says about UI design.
- `*` If non-technical staff cannot enter the order cleanly, the plan is already broken.
- Temperature checks and verification steps as software design inputs.
- When paper was still the right answer and when it stopped being.
- Why boring ASP.NET Core Razor Pages were the right tool there.
- Static IPs, allow lists, and simple hosting for internal ops software.
- What changed once the plan and execution lived in the same system.
- How to watch a floor use software and know what to change next.

## Pearl Bakery: non-technical founder and operations notes

- `*` What it feels like when the business depends on you doing the daily math.
- Nights when a driver called out: the operational cost of founder bottlenecks.
- What running delivery routes teaches you about system design.
- Hiring, training, and shift coverage in a 20+ person bakery.
- What good SOPs looked like when the day started before sunrise.
- Quality checks that mattered because a customer had more than a dozen stores.
- Ingredient sourcing as a systems problem.
- Pricing when ingredient costs, waste, and labor all move at once.
- Equipment upkeep as reliability engineering with flour on it.
- What health and quality systems taught you about repeatability.
- The difference between wholesale discipline and small retail chaos.
- `*` Full P&L ownership changed how I think about technical tradeoffs.
- Why founder work makes you less romantic about internal tools.
- How you decide whether to build software or change the process.
- What acquisition handoff taught you about documentation that someone else can actually use.
- Training incoming owners without creating hidden traps.
- What "successful acquisition" looks like from the operator side, not the announcement side.
- How to keep a team calm when the day starts behind schedule.
- What the bakery taught you about waste, buffers, and real-world feedback loops.
- The non-technical parts of the bakery that still felt like systems work.

## Leadership, management, and org design notes

- `*` Metrics-driven culture without metrics theater.
- What you looked for when hiring people into high-consequence systems.
- How you mentored engineers in the US and Brazil without turning async into drift.
- Clear ownership boundaries: the smallest change that reduces chaos.
- When to push for "do it right" and when to take the safe temporary fix.
- What founder partnership looked like when product, business, and technology were entangled.
- GTM partnerships with Trimble and Corpay as engineering work, not just sales work.
- How to sequence roadmap work when everything looks urgent.
- Why live-site responsibility changes who you trust on a team.
- How to build accountability without blame.
- What delivery predictability actually depends on.
- When a manager should still stay hands-on.
- Leading through senior engineers and managers vs owning every hard problem yourself.
- `*` Modernizing habits is harder than modernizing tools.
- How to explain technical constraints to executives without hiding the cost.
- What "partnering with founders" is on a Tuesday, not in a job description.
- Rules of thumb for cross-functional work with QA, DevOps, and Product.
- Why support pain is product feedback, not just noise.
- How to keep engineering work out of the ticketing system without losing context.
- What mentoring changed about your own taste in architecture.

## Career arc, education, research, and background

- The jump from junior consultant to CTO: what actually changed at each stage.
- What early Azure work taught you before cloud patterns had settled.
- Lessons from building software for Microsoft, Nike, and Intel as a junior engineer.
- What EasyPower taught you about domain software for experts in the field.
- Graphical tools and field survey apps: UX lessons from technical users.
- Why a short stop can still teach you a lot about product shape.
- `*` Undergraduate reactive programming research and why you still think about it.
- Automatic parallelization: what sounded exciting in research and what survives contact with real systems.
- Presenting a research paper and winning first place: what that taught about explaining hard ideas.
- The Microsoft Channel 9 interview story and what it says about earlier interests.
- How Reactive Extensions and `IObservable` changed how you think about workflows.
- Why reactive ideas still matter even when the stack is different.
- BYU-Idaho and Portland Community College: the parts of school that actually carried into work.
- Why you are doing PMP now, and what you expect it to sharpen.
- Why you enrolled in Harvard CORe after already leading engineering.
- The career case for staying hands-on even as titles get bigger.
- Why "management-first with IC depth" fits how you actually work.
- What changed when you started thinking in systems instead of projects.

## Infrastructure, tooling, and operational taste

- `*` A single big machine can take you farther than people admit.
- When Kubernetes is worth the cost and when it is not.
- Proxmox, Hyper-V, Veeam, and bare metal hosting: why on-prem still teaches useful instincts.
- LXC and lightweight virtualization as a sanity check against cloud sprawl.
- VLANs and network segmentation for people who think app code is the whole system.
- Why static IPs and allow lists are still a valid tool sometimes.
- Wireshark, `iperf3`, `curl`, `OpenSSL`, `traceroute`, and `netsh` as a troubleshooting stack.
- The parts of networking every application engineer should know.
- PowerShell vs Bash: which problems each one solves well.
- Why backups only matter if restore actually works.
- Secrets boundaries vs config boundaries in day-to-day ops.
- Service accounts, operators, and the boring mechanics of config delivery.
- What a home-lab or on-prem mindset gives you that managed cloud can hide.
- The cost model of simplicity: fewer moving parts, fewer mystery failures.

## Lightly personal or more inferred ideas - validate before publishing

- Why having three kids changes what "sustainable pace" means.
- What parenting taught you about clear instructions, repetition, and handoffs.
- How family life changed your tolerance for operational heroics.
- Why calm systems matter more when your life outside work is full.
- The overlap between teaching kids and onboarding engineers.
- Early mornings, interrupted attention, and why you value boring defaults.
- What entrepreneurship plus family pressure taught you about false urgency.
- How you think about ambition after running both software teams and a bakery.
- The kinds of work you want more of now, and the kinds you are less interested in.
- What living in Billings while leading distributed teams changed about how you hire and communicate.
- The practical side of moving between Portland-area work, Montana, remote teams, and physical businesses.
- Why you keep the personal dial low in public writing, and when it is worth turning it up a little.

## Meta notes about writing and taste

- Why you write about scars instead of polished architecture diagrams.
- The difference between advice you can reuse and content that expires in a week.
- Why "software that survives reality" became your framing.
- What kinds of readers you actually want to attract.
- Why you prefer short rules of thumb over giant abstract frameworks.
- How the blog should balance CTO notes, systems notes, and founder notes.
- When a topic wants to be a 200-word note instead of a 2,000-word post.
- The kinds of stories you still have not written because they need sanitizing first.
- Why you distrust beginner-friendly abstractions in high-consequence systems.
- The note format itself: what makes a good public note vs a private scratchpad.

## Easy first passes

If you want a quick baseline for the notes section, I would start by turning these into short notes first:

- `*` Recovery paths are product features, not cleanup work.
- `*` What 99.99% uptime changed about how you design boring systems.
- `*` Rebuilding Azure Data Factory sync logic into code in days instead of months.
- `*` Payment rails are different products wearing the same "payments" label.
- `*` Designing software for people who are already moving and cannot stop to think.
- `*` What it feels like when the business depends on you doing the daily math.
- `*` Metrics-driven culture without metrics theater.
- `*` Undergraduate reactive programming research and why you still think about it.
- `*` A single big machine can take you farther than people admit.
