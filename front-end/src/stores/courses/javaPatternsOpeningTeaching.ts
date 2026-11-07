import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaPatternsModuleID,
	javaPatternsURL
} from "@/modules/javaPatternsResources";

function resources(section: string) {
	const asset = "/course-assets/design-patterns-in-java/opening-checks.md#";
	return `\n\n[Case inputs](${courseAssetViewerUrl(
		`${asset + section}-inputs`
	)}) · [Project self-check](${courseAssetViewerUrl(
		`${asset + section}-answers`
	)})`;
}
function assignment(
	item: RawCourseModuleItem,
	section: string
): RawCourseModuleItem {
	return {
		...item,
		content: item.content + resources(section),
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true
	};
}
export function completeJavaPatternsOpening(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPJ1 What Patterns Are and What They Are Not")
		return module;
	return {
		...module,
		id: javaPatternsModuleID,
		estimatedTime: "4 sessions · 60–90 minutes each",
		curriculum: [
			{
				id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-what-patterns-are-and-what-they-are-not-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-core-concepts"
				],
				title: "What Patterns Are and What They Are Not Core Concepts",
				content: `**Course flow:** Establish a working Java baseline, classify a concrete design problem, compare three implementations, and complete the bulk-pricing project. Predict each result before opening its worked answer. The optional tasks test a decision, transfer it to a new requirement, or implement one additional shipping policy.

### Patterns, contracts, and costs

A design pattern describes a recurring arrangement of responsibilities for a recurring problem. An API specifies callable operations and their contract; a library supplies executable code; a template supplies starting text. A pattern still needs an implementation fitted to its inputs, clients, and constraints. An anti-pattern is a recurring approach with harmful consequences in its context. Overengineering adds flexibility whose costs exceed the requirements it currently serves.

A code smell is a reason to investigate, rather than proof that a named pattern is needed. Refactoring.Guru groups smells into five families:

- **Bloaters:** code becomes difficult to inspect, such as one method calculating totals, formatting invoices, and sending messages.
- **Object-orientation abusers:** types fit their responsibilities poorly, such as a subtype that rejects operations its parent promises.
- **Change preventers:** one requirement forces scattered edits, such as changing a fee in several clients.
- **Dispensables:** unnecessary code obscures behavior, such as unused factories for one fixed operation.
- **Couplers:** classes depend on excessive detail about other classes, such as a quote screen navigating another object's internal fields to calculate its price.

A long method may need extraction; repeated business rules may need one shared function. A switch over three stable options can be clear. Interchangeable policy objects become useful when several real behaviors vary independently and clients should use one stable contract. These choices have different costs in navigation, indirection, testing, and future changes. [Smell categories](https://refactoring.guru/refactoring/smells) and [Strategy structure](https://refactoring.guru/design-patterns/strategy) provide further reference.

### The complete example's contract

The example is a small order calculator. Quantities are integers from 0 through 1,000,000. Every unit in an order receives the same rate: 350 cents for quantities below 5, 300 cents for 5 through 9, and 250 cents for 10 or more. The nine-unit subtotal is 2700; the ten-unit subtotal is 2500. This deliberately uses whole-order discounts.

Members receive a reduction of one tenth of the subtotal, calculated as gross minus gross / 10 with integer division. All gross totals in this exercise divide exactly by ten. Pickup costs zero. Courier costs 500 + 20 * units cents. Overnight costs 1500 + 30 * units cents. Every shipping option costs zero for an empty order. Invalid quantities throw IllegalArgumentException; null shipping choices or policy objects throw NullPointerException. These bounds keep every total within int.

For six units, the regular subtotal is 1800, the member subtotal is 1620, and courier adds 620. The four baseline totals are 1800, 2420, 1620, and 2240 for regular pickup, regular courier, member pickup, and member courier. Overnight adds 1680, producing 3480 or 3300.

### Three designs under the same requirement

The plain function selects membership and shipping with conditionals. It is a reasonable design for a small fixed calculator. The inheritance version has four combined classes for two membership states and two shipping choices. With a third shipping choice it would need two additional combined classes. This count follows from this particular subclass design; inheritance can be appropriate where the subtype relationship itself is stable.

The composed Checkout receives a PricingPolicy and a ShippingPolicy. Its total is the selected subtotal plus the selected fee. Its two clients, displayQuote and invoiceTotal, use that same checkout object. A third shipping choice adds one ShippingPolicy implementation; Checkout and both client methods stay compatible. Composition introduces interfaces and extra objects, so the decision depends on actual variation and shared clients.

In new Checkout(new MemberPricing(), new CourierShipping()), six units reach MemberPricing.subtotalCents, which returns 1620; CourierShipping.feeCents returns 620; Checkout returns 2240. Passing this checkout to displayQuote yields Quote: 2240, and invoiceTotal returns 2240. A different policy is supplied when constructing a different checkout.

The worked-code reference contains the complete runnable example below, its contract harness, and README. The plain and inherited designs are retained for comparison.

\`\`\`java
import java.util.Objects;

public class Main {
    public enum Shipping { PICKUP, COURIER, OVERNIGHT }

    private static void validUnits(int units) {
        if (units < 0 || units > 1_000_000) {
            throw new IllegalArgumentException("units must be 0..1000000");
        }
    }
    public static int grossCents(int units) {
        validUnits(units);
        return units * (units >= 10 ? 250 : units >= 5 ? 300 : 350);
    }
    private static int memberCents(int gross) { return gross - gross / 10; }
    private static int courierFee(int units) { return units == 0 ? 0 : 500 + 20 * units; }
    public static int plainTotalCents(int units, boolean member, Shipping shipping) {
        int gross = grossCents(units);
        Objects.requireNonNull(shipping, "shipping");
        int fee = switch (shipping) {
            case PICKUP -> 0;
            case COURIER -> courierFee(units);
            case OVERNIGHT -> units == 0 ? 0 : 1500 + 30 * units;
        };
        return (member ? memberCents(gross) : gross) + fee;
    }

    public abstract static class LegacyOrder {
        protected final int units;
        protected LegacyOrder(int units) { validUnits(units); this.units = units; }
        public abstract int totalCents();
    }
    public static final class RegularPickup extends LegacyOrder {
        public RegularPickup(int units) { super(units); }
        public int totalCents() { return grossCents(units); }
    }
    public static final class RegularCourier extends LegacyOrder {
        public RegularCourier(int units) { super(units); }
        public int totalCents() { return grossCents(units) + courierFee(units); }
    }
    public static final class MemberPickup extends LegacyOrder {
        public MemberPickup(int units) { super(units); }
        public int totalCents() { return memberCents(grossCents(units)); }
    }
    public static final class MemberCourier extends LegacyOrder {
        public MemberCourier(int units) { super(units); }
        public int totalCents() { return memberCents(grossCents(units)) + courierFee(units); }
    }

    public interface PricingPolicy { int subtotalCents(int units); }
    public interface ShippingPolicy { int feeCents(int units); }
    public static final class RegularPricing implements PricingPolicy {
        public int subtotalCents(int units) { return grossCents(units); }
    }
    public static final class MemberPricing implements PricingPolicy {
        public int subtotalCents(int units) { return memberCents(grossCents(units)); }
    }
    public static final class PickupShipping implements ShippingPolicy {
        public int feeCents(int units) { validUnits(units); return 0; }
    }
    public static final class CourierShipping implements ShippingPolicy {
        public int feeCents(int units) { validUnits(units); return courierFee(units); }
    }
    public static final class OvernightShipping implements ShippingPolicy {
        public int feeCents(int units) {
            validUnits(units);
            return units == 0 ? 0 : 1500 + 30 * units;
        }
    }
    public static final class Checkout {
        private final PricingPolicy pricing;
        private final ShippingPolicy shipping;
        public Checkout(PricingPolicy pricing, ShippingPolicy shipping) {
            this.pricing = Objects.requireNonNull(pricing, "pricing");
            this.shipping = Objects.requireNonNull(shipping, "shipping");
        }
        public int totalCents(int units) {
            validUnits(units);
            return pricing.subtotalCents(units) + shipping.feeCents(units);
        }
    }
    public static String displayQuote(Checkout checkout, int units) {
        return "Quote: " + checkout.totalCents(units);
    }
    public static int invoiceTotal(Checkout checkout, int units) {
        return checkout.totalCents(units);
    }
    public static int simpleMinutes(int hours) {
        return Math.multiplyExact(hours, 60);
    }
    public interface MinutesPolicy { int convert(int hours); }
    public static final class FixedMinutes implements MinutesPolicy {
        public int convert(int hours) { return simpleMinutes(hours); }
    }
    public static final class MinutesFactory {
        public MinutesPolicy create() { return new FixedMinutes(); }
    }
    public static int factoryMinutes(int hours) {
        return new MinutesFactory().create().convert(hours);
    }
    public static int inconsistentInvoiceCents(int units) {
        validUnits(units);
        return units * 350;
    }

    public static void main(String[] args) {
        System.out.println(new Checkout(new RegularPricing(), new PickupShipping()).totalCents(6));
        System.out.println(new Checkout(new RegularPricing(), new CourierShipping()).totalCents(6));
        System.out.println(new Checkout(new MemberPricing(), new PickupShipping()).totalCents(6));
        System.out.println(new Checkout(new MemberPricing(), new CourierShipping()).totalCents(6));
    }
}
\`\`\`

### Multi-file and native workflow

Use Java 21. The worked comparison has Main.java, ContractTests.java, and README.md. Confirm its reference import into the site IDE; it is saved separately from learner work. Run displays native build instructions for this example. Save and download its ZIP, extract it, and run these commands from the directory containing the files:

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests base
java ContractTests
java Main
\`\`\`

The baseline harness reports 20052 passed, the full reference reports 28070 passed, and Main prints the four baseline totals in the order shown above. These programs read no standard input and create no answer file; change the calls in Main.java to investigate another case. Compile different projects in separate directories because each defines Main. The core pricing project has two additional Java files and its own compile command.

The optional overnight starter already passes the baseline. Its full harness reaches a named unfinished method until the overnight fee is implemented. A successful harness checks the stated behavior; the design explanation must also identify a real change pressure, a preserved contract, an alternative, and a cost. [Java compiler reference](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html)
`,
				contentKind: "reading",
				preserveInstructions: true,
				learningPath: "core",
				ideImport: true,
				solutionLink: javaPatternsURL("comparison", "solution")
			},
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-design-exercise-smell-or-reasonable-simplicity",
					title: "Design Exercise: Smell or Reasonable Simplicity?",
					learningPath: "core",
					content: `Use the complete comparison reference's three small classification examples. Case A is simpleMinutes(hours), used by one caller with the fixed rule hours * 60. Case B is inconsistentInvoiceCents(units), which always multiplies by 350 even though grossCents applies whole-order tiers. Case C is factoryMinutes(hours), which reaches the same fixed conversion through MinutesFactory, MinutesPolicy, and FixedMinutes with no second policy requirement.

Predict simpleMinutes(2), factoryMinutes(2), grossCents(5), and inconsistentInvoiceCents(5). For each case, identify the relevant requirement, classify the design, and propose the smallest useful change. Explain why two repeated conditionals alone cannot establish a need for Strategy. **Completion evidence:** Preserve a short classification table before consulting the worked answer.`,
					ideImport: true,
					solutionLink: javaPatternsURL("comparison", "solution")
				},
				"smells"
			),
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-reflection-question-when-does-a-pattern-actually-help",
					title: "Reflection Question: When Does a Pattern Actually Help?",
					learningPath: "core",
					content: `Compare two supplied contexts. Context A has one caller converting hours to minutes; its rule is fixed and no other conversion is requested. Context B has quote and invoice clients, regular/member pricing, and pickup/courier shipping; the next confirmed change is overnight shipping for both membership states.

**Completion evidence:** Write one decision record per context: current requirement, behavior that must stay invariant, actual change pressure, chosen design, rejected alternative, cost, and a test. Use the six-unit totals to make the second decision concrete. A reasoned choice of a plain function is valid; a pattern name by itself does not justify additional types.`,
					ideImport: true,
					solutionLink: javaPatternsURL("comparison", "solution")
				},
				"reflection"
			),
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-java-pattern-course-contract-and-characterization-baseline",
					title: "Java Pattern Course Contract and Characterization Baseline",
					learningPath: "core",
					content: `Open the complete comparison reference and compile Main.java with ContractTests.java using Java 21. Run java ContractTests base and java Main before making a change. Save this passing baseline before editing. Record the four six-unit totals and the zero-unit totals, then predict regular pickup at quantities 4, 5, 9, and 10.

Trace one six-unit member/courier quote through the pricing policy, shipping policy, Checkout, displayQuote, and invoiceTotal. Identify which outputs characterize the current behavior and which might reflect a mistake in an undocumented system. Here the stated contract independently specifies the expected results, including the deliberate whole-order boundary drop. **Completion evidence:** Keep the observations and predictions before consulting the worked self-check.`,
					ideImport: true,
					solutionLink: javaPatternsURL("comparison", "solution")
				},
				"baseline"
			),
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-one-change-scenario-before-one-abstraction",
					title: "One Change Scenario Before One Abstraction",
					learningPath: "core",
					content: `The confirmed change is overnight shipping for all regular/member customers. Its fee is zero for an empty order and 1500 + 30 * units cents otherwise. Keep the existing pickup/courier totals and the two client method signatures.

**Completion evidence:** Before editing, list the change points in plainTotalCents, the four-class combined inheritance design, and the composed Checkout design. Predict six-unit regular/member overnight totals. Choose an approach for a small fixed calculator and another for an application whose quote and invoice clients share independently changing policies. Explain the extra types or conditionals each choice introduces. The optional extension implements the composed choice.`,
					ideImport: true,
					solutionLink: javaPatternsURL("comparison", "solution")
				},
				"change"
			),
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-core-project-what-patterns-are-and-what-they-are-not",
					aliases: [
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-core-project",
						"dpj1-what-patterns-are-and-what-they-are-not-core-project",
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-curriculum-dpj1-what-patterns-are-and-what-they-are-not-core-project"
					],
					title: "Core Project: What Patterns Are and What They Are Not",
					learningPath: "core",
					content: `Implement BulkPricingStrategy.priceFor(int units), preserving PricingStrategy and the supplied Main caller. Accept quantities 0..1,000,000 inclusive. Select one whole-order unit price: 3.50 below 5 units, 3.00 from 5 through 9, 2.50 from 10 onward. Return zero for zero units; throw IllegalArgumentException for other integers. Keep the public double return type; these half-unit rates are exactly representable.

The confirmed starter imports Main.java, PricingStrategy.java, BulkPricingStrategy.java, ContractTests.java, and README.md. Only the strategy's method body is unfinished. Save the learner attempt separately from the reference. Download and extract the ZIP, then run:

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java PricingStrategy.java BulkPricingStrategy.java ContractTests.java
java ContractTests
java Main
\`\`\`

The untouched starter compiles and throws its named UnsupportedOperationException. Implement the method, predict quantities 0, 4, 5, 6, 9, 10, 11, and the upper bound, then run the harness. A correct implementation reports Pricing contracts: 10014 passed; Main prints 18.0. Explain the deliberate total decrease at ten units and why a negative quantity must be rejected before computing a price. Finally state why this exercise retains an interface and when one plain method would be sufficient. **Completion evidence:** Preserve the attempt, case table, and decision before opening the reference.`,
					ideImport: true,
					projectLink: javaPatternsURL("pricing", "starter"),
					solutionLink: javaPatternsURL("pricing", "solution")
				},
				"pricing"
			)
		],
		supplementalProjects: [
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-understanding-check-what-patterns-are-and-what-they-are-not",
					aliases: [
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-dpj1-what-patterns-are-and-what-they-are-not-diagnostic-checkpoint",
						"diagnostic-checkpoint-what-patterns-are-and-what-they-are-not",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-diagnostic-checkpoint-what-patterns-are-and-what-they-are-not",
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-understanding-check"
					],
					title: "Understanding Check: What Patterns Are and What They Are Not",
					learningPath: "choice",
					content: `Complete a decision worksheet using the supplied cases: a fixed hour-to-minute conversion in one caller; a five-unit invoice that returns 1750 when the declared bulk contract requires 1500; and regular/member orders with independently selected pickup/courier/overnight shipping.

Define pattern, API, and template in terms of what each supplies. **Completion evidence:** For each case, name one requirement, one observation, the smallest useful repair or design, and a test. Explain which evidence would justify two policy interfaces and which would favor a shared function. A complete answer includes a cost, not only a pattern label.`
				},
				"understanding"
			),
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-what-patterns-are-and-what-they-are-not-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-transfer-practice",
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-transfer-practice-what-patterns-are-and-what-they-are-not"
					],
					title: "What Patterns Are and What They Are Not Transfer Practice",
					learningPath: "choice",
					content: `This is a design-and-calculation worksheet. Add a zone value, local or remote, to the supplied order contract. For nonempty courier and overnight orders, remote zone adds 1200 cents once per order; local adds zero. Pickup ignores zone. Empty orders remain zero. Existing membership and whole-order pricing remain unchanged.

Calculate six-unit regular/courier/remote, member/overnight/remote, regular/pickup/remote, and empty member/courier/remote totals. Specify where the zone value and shared surcharge calculation belong for a small program, then explain what further variation would justify a policy abstraction. Sketch a changed call and its expected result. **Completion evidence:** The task requires a table and design record; the existing comparison executable has no zone parameter.`
				},
				"transfer"
			),
			assignment(
				{
					id: "design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-what-patterns-are-and-what-they-are-not-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-extension-practice",
						"design-patterns-in-java-dpj1-what-patterns-are-and-what-they-are-not-supplemental-extension-practice-what-patterns-are-and-what-they-are-not"
					],
					title: "What Patterns Are and What They Are Not Extension Practice",
					learningPath: "challenge",
					content: `Open the comparison extension starter. Keep its existing baseline and implement only OvernightShipping.feeCents: validate units 0..1,000,000; return zero for zero; otherwise return 1500 + 30 * units cents. Checkout, displayQuote, invoiceTotal, pricing policies, and pickup/courier behavior retain their contract.

Run java ContractTests base before editing; it reports 20052 passed. After the change, compile Main.java and ContractTests.java with Java 21, then run both baseline and full harnesses. The full reference reports Complete design contracts: 28070 passed. Main still prints the four baseline totals. Predict six-unit overnight results for both membership states, zero units, and the largest accepted quantity; reject -1 and 1,000,001. Explain how one new shipping policy serves both clients and both pricing policies. **Completion evidence:** Save the attempt and change-impact explanation before consulting the reference.`,
					ideImport: true,
					projectLink: javaPatternsURL("comparison", "starter"),
					solutionLink: javaPatternsURL("comparison", "solution")
				},
				"extension"
			)
		]
	};
}
