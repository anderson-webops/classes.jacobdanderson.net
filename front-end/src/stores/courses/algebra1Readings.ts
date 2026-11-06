import type { RawCourse, RawCourseModuleItem } from "./types";

export const algebra1AReadingMethods = [
	{
		target: "Balancing Equations",
		method: "An equation asserts that two expressions have the same value. Adding or subtracting the same quantity on both sides preserves its solutions. Multiplying or dividing both sides by a known nonzero number is reversible. Distribute multiplication across a sum before combining terms; combine only like terms. Squaring both sides preserves a true equality but can introduce extra solutions when solving, so check candidates in the original equation.",
		worked: "For 3x+4=19, subtract 4 from both sides to obtain 3x=15, then divide both sides by 3 to obtain x=5. Substitution gives 3(5)+4=19. In contrast, squaring x=-2 gives x^2=4, whose extra candidate x=2 fails the original equation."
	},
	{
		target: "Guessing and Checking",
		method: "A candidate solves an equation only if substitution makes the two original sides equal. Evaluate each side separately, retaining parentheses around a negative candidate. Testing several values can find a solution, but does not prove that every solution has been found; use the equation's structure to establish the full set. A length or count may impose an additional nonnegative or whole-number restriction.",
		worked: "For 4x^2=100, trying x=5 gives 4(25)=100, and x=-5 also gives 4(25)=100. Dividing by 4 gives x^2=25, so these are the two real solutions. If x is a wall length in feet, the contextual answer is 5 feet because a length cannot be negative."
	},
	{
		target: "Addition and Subtraction",
		method: "Simplify numerical terms, then undo addition with subtraction or subtraction with addition on both sides. A variable preceded by a minus sign has coefficient -1. Keep that sign when isolating it, and verify the final value in the original equation. Translating a word problem also requires naming the unknown and its unit.",
		worked: "For 30-x=-5, subtract 30 from both sides: -x=-35. Multiply both sides by -1 to obtain x=35. The original left side is 30-35=-5. For 13+y=10, subtracting 13 gives y=-3, which checks because 13+(-3)=10."
	},
	{
		target: "Multiplication and Division",
		method: "First combine like terms. Undo multiplication by a nonzero coefficient by dividing both sides by that coefficient. Undo division by a known nonzero number by multiplying both sides by it. For a fractional coefficient, multiply both sides by its reciprocal. Division by zero is undefined; the zero-coefficient cases 0x=0 and 0x=5 have all real solutions and no solution, respectively.",
		worked: "For z/6+z/3=21, use denominator 6: z/6+2z/6=3z/6=z/2. Multiply both sides by 2 to get z=42. Checking gives 42/6+42/3=7+14=21. For 11c=16.5, division by 11 gives c=1.5 dollars per chore when c is the pay rate."
	},
	{
		target: "Exponents and Roots",
		method: "The principal square root is nonnegative. Solving x^2=a over the reals gives x=plus or minus sqrt(a) when a>0, x=0 when a=0, and no real solution when a<0. Odd powers have one real inverse root, including for negative inputs. For sqrt(x)=b, both x>=0 and b>=0 are required before squaring. Check every candidate after raising an equation to an even power.",
		worked: "For z^2=63, sqrt(63)=sqrt(9×7)=3sqrt(7), so z=3sqrt(7) or z=-3sqrt(7); squaring either gives 63. For sqrt(b)=9, squaring gives b=81 and the principal root checks. The equation sqrt(b)=-9 has no real solution, even though squaring alone would also produce 81."
	},
	{
		target: "Two-Step and Multi-Step Equations",
		method: "Distribute parentheses and combine like terms on each side. Add or subtract the same variable expression on both sides to collect variable terms, then isolate the variable using reversible operations. A false constant statement means no solution; a true constant statement after the variable cancels means every permitted input is a solution. If an even power is involved, retain both possible roots and check their original domain.",
		worked: "For 7(x-8)=3(x-4), distribute to get 7x-56=3x-12. Subtract 3x and add 56: 4x=44, so x=11. Both original sides are 21. Also 2(x+1)=2x+3 reduces to 2=3 and has no solution, while 2(x+1)=2x+2 reduces to 2=2 and holds for every real x."
	},
	{
		target: "Problems with Multiple Variables",
		method: "Isolating one variable expresses how it depends on the others; it need not determine a single number. Use the same balancing operations as with one unknown, and retain any restriction from division by an expression. One linear equation in two variables generally describes a line of ordered pairs. Check a proposed pair by substituting both coordinates.",
		worked: "For 8x+4y-13=7, add 13 to obtain 8x+4y=20, subtract 8x, then divide by 4: y=5-2x. Choosing x=1 gives y=3, and 8(1)+4(3)-13=7. Choosing x=0 gives y=5, a different solution of the same equation."
	},
	{
		target: "Solving Inequalities",
		method: "Addition and subtraction preserve inequality direction. Multiplying or dividing by a positive number preserves it; a negative number reverses it. A strict sign excludes its boundary, while <= or >= includes it. Check an interior point and the boundary. For x^2>a with a>0, values on both sides of the interval between -sqrt(a) and sqrt(a) satisfy the inequality.",
		worked: "For -5y+7>=2, subtract 7: -5y>=-5. Dividing by -5 reverses the sign, giving y<=1. At y=0 the original statement is 7>=2; y=1 gives equality, while y=2 fails. Separately, x^2>144 gives x<-12 or x>12, excluding both endpoints."
	},
	{
		target: "Slope Basics",
		method: "For points (x1,y1) and (x2,y2) with x2!=x1, slope m=(y2-y1)/(x2-x1). Subtract coordinates in the same order in numerator and denominator. The units are y-units per x-unit. Positive and negative slopes describe rise and fall as x increases; a horizontal line has slope 0 and a vertical line has undefined slope. Equal slopes identify parallel distinct nonvertical lines; equal slope and intercept identify the same line.",
		worked: "For (-8,6) and (-4,-6), m=(-6-6)/(-4-(-8))=-12/4=-3. Reversing both orders gives 12/(-4)=-3 again. Points (2,1) and (2,7) give denominator 0, so their line is vertical and this quotient does not define a slope."
	},
	{
		target: "Reading and Writing y = mx + b",
		method: "For a nonvertical line y=mx+b, m is the change in y per unit increase in x and b is the value at x=0. Given m and a point (x1,y1), solve b=y1-mx1. Plot (0,b), then use the slope to locate another point and draw the line. A contextual model also needs a domain; an extrapolated intercept need not be a physically observed starting value.",
		worked: "A line of slope 5 through (1,8) has b=8-5(1)=3, so y=5x+3. It gives points (0,3) and (1,8). The pea-growth model y=3(x-2)=3x-6 applies for x>=2 weeks after planting; its negative extension before week 2 is not a model of plant height."
	},
	{
		target: "Writing Lines from a Point and a Slope",
		method: "A nonvertical line through (x1,y1) with finite slope m satisfies y-y1=m(x-x1). The coordinate differences must retain their signs, including when the given coordinate is negative. Distribute and isolate y for slope-intercept form, or collect x and y on one side for standard form Ax+By=C. A vertical line is written x=x1 instead of using a finite slope.",
		worked: "Slope 3 through (6,8) gives y-8=3(x-6). Distribute: y-8=3x-18. Add 8: y=3x-10, or 3x-y=10. Substituting (6,8) into the standard form gives 18-8=10. For a point (-2,4), the same setup would use x-(-2)=x+2."
	},
	{
		target: "Graphing Linear Inequalities",
		method: "Replace the inequality sign with equality to graph its boundary. Use a dashed line for < or > and a solid line for <= or >=. Test any point off the boundary in the original inequality and shade the side containing that point if it satisfies the inequality; otherwise shade the opposite side. Vertical boundaries x=a are handled in the same way, with shading left or right.",
		worked: "For y>2x+5, draw the dashed line through (0,5) and (1,7). The test point (0,0) gives 0>5, which is false, so shade the side above the line. The boundary point (0,5) is excluded, while (0,6) is included. For x<=3, draw a solid vertical line and shade left."
	},
	{
		target: "Concept and Special Cases",
		method: "A solution of a system must satisfy every original equation at once. Graph each line using two points, locate any intersection and substitute its coordinates into both equations. Distinct parallel lines have no intersection. Two equations for the same line have infinitely many common points. A graph gives an estimate when the intersection is not on a readable grid point; substitution can check its exact coordinates.",
		worked: "For y=3x+2, plot (0,2) and (1,5). For y=-x+6, plot (0,6) and (1,5). The shared point is (1,5): 5=3(1)+2 and 5=-1+6. Lines y=2x+1 and y=2x-3 have equal slopes but different intercepts, so they cannot share a point."
	},
	{
		target: "Systems of Inequalities by Graphing",
		method: "Graph each inequality's boundary and determine its satisfying half-plane. The solution set is the overlap of all those half-planes, with each boundary included or excluded according to its own sign. Add contextual restrictions such as nonnegative counts. Testing a point requires checking every inequality; satisfying just one is insufficient.",
		worked: "For y>2x and y<-x+3, draw both boundaries dashed. The point (0,1) passes both tests because 1>0 and 1<3, so it belongs to the overlap. The point (1,2) fails the strict first inequality. The boundary lines meet at (1,2), but that intersection is excluded and there is no overlap for x>=1."
	},
	{
		target: "Substitution Method",
		method: "Isolate one variable in one equation, replace that variable in the other equation with the entire equal expression, and solve. Substitute back to recover the second coordinate. Parentheses preserve operations on a substituted sum. Check the ordered pair in both original equations; a contradiction after substitution means no solution, while an identity may show that both equations describe the same line.",
		worked: "For 6x+2y=28 and y=4x, substitute 4x for y: 6x+2(4x)=28. Thus 14x=28, x=2 and y=8. The checks are 6(2)+2(8)=28 and 8=4(2), so (2,8) satisfies the whole system."
	},
	{
		target: "Elimination Method",
		method: "Write corresponding variable terms in matching columns. Multiply entire equations by suitable nonzero numbers so one variable's coefficients become opposites, then add the equations. Each multiplication applies to the constant as well as every variable term. Recover the other coordinate by substitution and check both originals. If both variables cancel, read the remaining true or false statement to distinguish coincident from parallel lines.",
		worked: "For 4x+3y=8 and 5x-4y=10, multiply the first equation by 4 and the second by 3. This gives 16x+12y=32 and 15x-12y=30. Adding gives 31x=62, so x=2. Then 8+3y=8 gives y=0; the second original equation checks as 5(2)-4(0)=10."
	}
] as const;

const groups = [
	{
		modulePrefix: "AA2 ",
		title: "Solving Single-Step Linear Equations Core Concepts",
		id: "algebra-1a-aa2-solving-single-step-linear-equations-curriculum-solving-single-step-linear-equations-core-concepts"
	},
	{
		modulePrefix: "AA4 ",
		title: "Solving Multi-Step Linear Equations Core Concepts",
		id: "algebra-1a-aa4-solving-multi-step-linear-equations-curriculum-solving-multi-step-linear-equations-core-concepts"
	}
] as const;

export function applyAuthoredAlgebraMethods(
	course: RawCourse,
	methods: readonly { target: string; method: string; worked: string }[]
) {
	for (const entry of methods) {
		const item = course.modules
			.flatMap(module => module.curriculum)
			.find(item => item.title === entry.target);
		if (!item)
			throw new Error(`Missing ${course.name} reading ${entry.target}`);
		item.content = `**Method**\n\n${entry.method}\n\n**Worked example**\n\n${entry.worked}\n\n${item.content}`;
		item.contentKind = "reading";
		item.preserveInstructions = true;
	}
}

export function applyAlgebra1AReadings(course: RawCourse) {
	applyAuthoredAlgebraMethods(course, algebra1AReadingMethods);
	for (const group of groups) {
		const module = course.modules.find(module =>
			module.title.startsWith(group.modulePrefix)
		);
		if (!module) throw new Error(`Missing Algebra 1A group ${group.title}`);
		const items = module.curriculum;
		const reading: RawCourseModuleItem = {
			id: group.id,
			title: group.title,
			aliases: [
				"Core Concepts",
				...items.flatMap(item => [
					...(item.id ? [item.id] : []),
					...(item.aliases ?? [])
				])
			],
			content: items
				.map(item => `### ${item.title}\n\n${item.content}`)
				.join("\n\n"),
			contentKind: "reading",
			preserveInstructions: true,
			learningPath: "core"
		};
		module.curriculum = [reading];
	}
	for (const module of course.modules) {
		if (module.title.startsWith("AA17 ")) {
			for (const item of module.curriculum) {
				item.contentKind = "assignment";
				item.preserveInstructions = true;
			}
		}
		if (
			module.title.startsWith("AA3 ") ||
			module.title.startsWith("AA11 ")
		) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			])
				item.preserveInstructions = true;
		}
	}
}
