# Outline: From Orders To Invoices - The Small ERP I Built For Pearl Bakery

## Title options
- From Orders To Invoices: The Small ERP I Built For Pearl Bakery
- When Excel Becomes The Bottleneck: Building A Production Planning System
- A Custom ERP For A Real Production Floor (Pearl Bakery Case Study)
- Building A Production Planner That People Actually Use
- The Bakery Taught Me What ERP Software Forgets

## Recommended title + why
From Orders To Invoices: The Small ERP I Built For Pearl Bakery

Reason: it signals end-to-end scope and stays concrete.

## Tags (draft suggestions)
["case-study", "systems", "operations", "manufacturing", "architecture"]

## TL;DR
- Decision: I built a small custom ERP/MRP system for Pearl Bakery instead of forcing our workflow into a legacy ERP or a growing Excel mess.
- Constraint: daily planning and paper checklists were turning into a single-person bottleneck as we scaled.
- Outcome: orders flowed into a production plan, that plan drove station work on iPads, and the results rolled into packing slips and invoicing.
- Scar: if the business depends on one person doing manual math every day, you do not have a planning process, you have a risk.

## On this page
- Context
- Decision
- Implementation (end-to-end pipeline)
- What worked / What didnt
- Tradeoffs
- How to use (portable lessons)
- Wrap-up
- Checklist

## Context
- We did not want an ancient ERP that fought the workflow.
- The real forcing function was time: planning by Excel + paper was a daily tax and a single point of failure.
- Growth turned "I can do this by hand" into "this will not survive".

## Decision
- Map the real workflow first: inputs, stations, checkpoints, outputs.
- Build a small ERP tailored to the process:
  - customers, products, orders
  - recipes -> scalable formulas (including loss and buffer)
  - production planning engine
  - station execution UI for iPads
  - packing slips
  - accounting system integration for invoicing

## Implementation
- Data model (high level):
  - customer, order, product, recipe, batch/mix, station task, packing slip, invoice line item
- Planning engine:
  - aggregate daily demand
  - apply buffer + loss factors
  - handle shared bases cascading into consolidated mixes
  - compute raw ingredient quantities
- Station execution:
  - iPad at each station
  - station-specific quantities
  - checkpoints (ingredient verification, temps)
  - confirmations and splits into tubs/batches
- Fulfillment:
  - packing slips by customer
  - allocation summaries
  - surplus/waste tracking
- Finance:
  - weekly invoicing support
  - sync to accounting system

## Scar
- Before: Excel sheets, manual calculations, printing.
- Failure mode: planning and paperwork became a bottleneck and an error surface as volume grew.
- Change: automate the plan, then put it on the tables (stations) so the plan is executable, not just a spreadsheet.
- Rule of thumb: automate the first thing that is both repetitive and business-critical.

## What worked / What didnt
- Worked:
  - end-to-end traceability (order -> plan -> station -> pack -> invoice)
  - station UI was not "ERP screens", it was "do the work screens"
  - buffers/loss factors made plans resilient
- Didnt:
  - first versions likely missed edge cases (ADD: which ones)
  - training and adoption still matters (software does not remove leadership)

## Tradeoffs
- You own maintenance forever.
- You can overfit to the current workflow.
- Key-person risk if only one builder understands it.
- But: the cost can still be lower than forcing ops to bend around bad software.

## How to use (portable lessons)
- Start with the workflow map, not the database schema.
- Make the plan executable: put it at the stations.
- Design for losses, errors, and buffers.
- Separate "system of record" from "work in progress" views.
- Build the artifact people need at 5am (not the one you want to demo).

## Diagram
- Flowchart: Orders -> Plan -> Stations -> Packing -> Invoicing (with buffer/loss loop).

## Checklist
- [ ] Map the workflow and stations
- [ ] Identify the daily bottleneck
- [ ] Model demand -> plan -> execution -> fulfillment
- [ ] Add buffer and loss factors early
- [ ] Put the UI where the work happens
- [ ] Create packing and invoicing outputs
- [ ] Add one operational feedback loop per month
