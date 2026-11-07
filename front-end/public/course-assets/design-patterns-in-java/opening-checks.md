# Patterns opening: case inputs and worked answers

## Smells inputs

Case A: simpleMinutes(2) multiplies by 60; there is one caller and one fixed conversion.
Case B: compare grossCents(5) with inconsistentInvoiceCents(5). The declared order rule uses 300 cents each at quantity five.
Case C: factoryMinutes(2) calls a factory, which creates a FixedMinutes object through MinutesPolicy; there is no other required conversion.

Predict each result, classify each design, and propose the smallest useful change.

## Smells answers

A returns 120. One named method is reasonable simplicity for its stated context. B returns 1500 from the declared rule and 1750 from the duplicated invoice rule. That divergence is a behavior defect; share the correct calculation and retain a five-unit regression test. C also returns 120 but introduces three additional types for one fixed operation. With no variation requirement, the types add navigation and indirection without a demonstrated benefit.

A repeated if can be a local stable decision. The evidence needed for Strategy is a real family of interchangeable behaviors whose callers benefit from a stable common contract; duplicated business rules may instead need one shared method.

## Reflection inputs

Context A: one caller, fixed hours * 60 conversion.
Context B: quote and invoice clients; regular/member pricing; pickup/courier shipping. Overnight is the next confirmed option for both membership states. Shipping and pricing may change independently.
Write requirement, invariant, pressure, choice, alternative, cost, and test for each context.

## Reflection answers

A: preserve integer hours-to-minutes conversion; no current variation pressure exists. Retain the plain simpleMinutes method rather than add a factory. Its cost is that a genuinely new conversion would require revisiting the choice. Test 2 -> 120 and 0 -> 0.

B: preserve both clients' totalCents contract and all pickup/courier results. Independent policy variation and the confirmed overnight option support composing Checkout from pricing and shipping policies. A plain conditional function remains a reasonable alternative for a small fixed calculator. Composition costs extra types and object wiring. Test member/courier at six units -> 2240 and member/overnight -> 3300 through both clients. Neither an inheritance ban nor a class-count claim alone establishes the decision.

## Baseline inputs

Use the comparison reference and its documented Java 21 commands.
Record regular pickup, regular courier, member pickup, member courier for 6 units and for 0 units.
Predict regular pickup at 4, 5, 9, and 10 units.
Trace the six-unit member/courier case through both clients.

## Baseline answers

At six units the four outputs are 1800, 2420, 1620, 2240. At zero every total is 0. Regular pickup totals for 4, 5, 9, 10 are 1400, 1500, 2700, 2500.

For member courier: gross = 6 * 300 = 1800; member subtotal = 1800 - 180 = 1620; courier = 500 + 20 * 6 = 620; Checkout returns 2240. displayQuote returns Quote: 2240; invoiceTotal returns 2240.

The baseline harness prints Base design contracts: 20052 passed. It compares the plain, inherited and composed baseline implementations, both clients, bounds and null choices. Characterization records current behavior. Agreement among copies is weaker than agreement with a stated independent contract, so the oracle uses the written requirements. A design explanation remains a separate deliverable.

## Change inputs

Add overnight shipping: empty fee 0; otherwise 1500 + 30 * units cents. Both membership states are supported. Preserve pickup/courier behavior and displayQuote/invoiceTotal signatures.
List the edits for the plain conditional function, the four inherited combined classes, and the composed design.
Predict regular and member overnight totals for 6 units.

## Change answers

The six-unit fee is 1680; regular total = 1800 + 1680 = 3480; member total = 1620 + 1680 = 3300.

The plain function needs an overnight branch and its shipping choice; in the supplied executable that branch is already complete. The particular combined inheritance design needs RegularOvernight and MemberOvernight plus callers choosing them. The composed design supplies OvernightShipping through the existing ShippingPolicy interface, using the existing Checkout and both clients unchanged.

A plain function is a defensible small-program choice. Independent changes shared by two clients can justify the composed choice. Preserve the baseline tests, add empty and invalid overnight cases, and explicitly record the cost of extra policy types.

## Pricing inputs

Whole-order unit rates: quantities 0..4 -> 3.50; 5..9 -> 3.00; 10..1,000,000 -> 2.50.
Predict 0, 4, 5, 6, 9, 10, 11, and 1,000,000 units.
Specify the result for -1, 1,000,001, Integer.MIN_VALUE, and Integer.MAX_VALUE.
Compile all four Java files; Main calls priceFor(6).

## Pricing answers

| Units   | Returned price |
| ------- | -------------- |
| 0       | 0.0            |
| 4       | 14.0           |
| 5       | 15.0           |
| 6       | 18.0           |
| 9       | 27.0           |
| 10      | 25.0           |
| 11      | 27.5           |
| 1000000 | 2500000.0      |

All four invalid integers throw IllegalArgumentException. Reject them before applying the formula. Select the rate once from the whole quantity, then multiply; marginal-tier accumulation would implement a different contract.

Main prints 18.0. The independent harness reports Pricing contracts: 10014 passed, including explicit boundaries, quantities 0..10000, the upper bound and invalid integers. PricingStrategy is preserved as the supplied public interface. With one fixed rule and one caller a plain method could be simpler; interchangeable real pricing policies would provide a reason to retain or extend the abstraction. Preserve the learner's implementation and reasoning independently from the reference.

## Understanding inputs

1. Define pattern, API, and template by what each supplies.
2. Classify fixed hour conversion, a divergent five-unit invoice, and independently chosen pricing/shipping used by two clients.
3. For each, give a requirement, observation, smallest useful action, test, and cost.
4. Does every duplicated conditional need Strategy? Explain using a concrete case.

## Understanding answers

A pattern supplies a reusable responsibility arrangement for a recurring design problem. An API supplies the operations and contract callers use. A template supplies starting text; its presence does not establish a good design.

Fixed conversion: one requirement, same 2 -> 120 result, keep a method and test 0 and 2; future variation may require another decision. Divergent invoice: declared five-unit total 1500 versus returned 1750, repair the rule and share one calculation; retain a boundary test. Independent shipping/pricing: two clients and real policy combinations support a composed Checkout; compare member/overnight at six units -> 3300 through both clients. Extra types and wiring are costs.

A duplicated conditional may need a shared function, or may describe separate stable contexts. Strategy is justified by interchangeable behavior and useful caller independence, rather than the number of if statements alone.

## Transfer inputs

Keep the same order rules and add local/remote zone data. On a nonempty courier or overnight order, remote adds 1200 cents once. Local adds zero. Pickup ignores zone. An empty order remains zero.
Calculate 6-unit regular/courier/remote; 6-unit member/overnight/remote; 6-unit regular/pickup/remote; empty member/courier/remote.
Give a small-program design and a changed call sketch. This is a worksheet; the comparison pack does not implement zones.

## Transfer answers

| Case                         | Total cents |
| ---------------------------- | ----------- |
| 6, regular, courier, remote  | 3620        |
| 6, member, overnight, remote | 4500        |
| 6, regular, pickup, remote   | 1800        |
| 0, member, courier, remote   | 0           |

The first two add 1200 to 2420 and 3300. Pickup and empty orders skip the surcharge.

One valid sketch extends the plain function's inputs with a Zone enum and adds a shared remoteSurcharge(units, shipping, zone) helper. A hypothetical call plainTotalCents(6, false, COURIER, REMOTE) returns 3620. The helper returns 1200 only when units > 0, zone is remote, and shipping is not pickup. This sketch is a proposed API, not an existing executable method.

Zone is data and one common surcharge can be a function. Distinct changing zone algorithms or clients needing interchangeable zone behavior could justify a policy later. Test all four table rows and unchanged local totals before making that choice.

## Extension inputs

Run the comparison starter baseline before editing. Implement OvernightShipping.feeCents only, preserving Checkout and both clients.
Predict 6 regular/overnight, 6 member/overnight, both empty orders, and regular/member overnight at 1,000,000 units.
Reject quantities -1 and 1,000,001. Run baseline, full harness, and Main.

## Extension answers

| Case                      | Total cents |
| ------------------------- | ----------- |
| 6 regular overnight       | 3480        |
| 6 member overnight        | 3300        |
| 0 regular overnight       | 0           |
| 0 member overnight        | 0           |
| 1000000 regular overnight | 280001500   |
| 1000000 member overnight  | 255001500   |

At the upper bound the regular subtotal is 250000000, member subtotal 225000000, and overnight fee 30001500. Invalid quantities throw IllegalArgumentException.

The method validates units, then returns units == 0 ? 0 : 1500 + 30 * units. Baseline reports 20052 passed before and after; the completed full harness reports 28070 passed. Main retains 1800, 2420, 1620, 2240 on separate lines. One ShippingPolicy implementation works with both pricing implementations and both clients. The preserved plain function demonstrates the same overnight rule, while the subclass comparison would require two combined variants. A passing harness supports behavior; the written change-impact explanation supports the design choice.
