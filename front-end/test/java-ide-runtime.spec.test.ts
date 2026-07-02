import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	javaStarterCode,
	karelStarterCode,
	karelStarterWorld
} from "../src/modules/pythonIde";
import { runJavaIdeProject } from "../src/modules/javaIdeRuntime";

function sourceFile(path: string) {
	return readFileSync(resolve(__dirname, path), "utf8");
}

describe("java IDE runtime", () => {
	it("previews Java console print output", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: javaStarterCode.replace(
						'System.out.println("Hello, Java!");',
						'System.out.print("Hello, ");\n        System.out.println("Java " + (2 + 3));'
					)
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["Hello, Java 5"]);
	});

	it("explains the beginner Java preview scope when no main body runs", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: "public class Main {\n}\n"
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([
			"The browser Java runner previews beginner console Java from main: System.out output, variables, Scanner input, decisions, loops, helper methods, arrays, and ArrayLists."
		]);
		expect(result.stdout).toEqual([]);
	});

	it("previews beginner Java formatted console output", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        String name = "Ada";
        int score = 7;
        double ratio = 2.0 / 3.0;
        System.out.printf("%s scored %03d%n", name, score);
        System.out.format("ratio=%.2f done=%b", ratio, true);
        System.out.println();
        System.out.println(String.format("[%6s] %.1f%%", name, ratio * 100));
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"Ada scored 007",
			"ratio=0.67 done=true",
			"[   Ada] 66.7%"
		]);
	});

	it("ignores Java console prints inside comments", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        // System.out.println("hidden line");
        /*
           System.out.println("hidden block");
        */
        System.out.println("https://classes.example/java");
        System.out.println("literal /* not a comment */ text");
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"https://classes.example/java",
			"literal /* not a comment */ text"
		]);
	});

	it("previews simple Scanner input and beginner variables", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Name: ");
        String name = input.nextLine();
        System.out.print("Age: ");
        int age = input.nextInt();
        System.out.println("Hi " + name + ", next year you will be " + (age + 1));
    }
}`
				}
			],
			inputText: "Jacob\n14",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"Name: Age: Hi Jacob, next year you will be 15"
		]);
	});

	it("reports invalid Scanner numeric input without server execution", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int age = input.nextInt();
        System.out.println("Age: " + age);
    }
}`
				}
			],
			inputText: "not-a-number",
			mode: "java"
		});

		expect(result.stderr).toEqual([
			'Scanner could not read int from "not-a-number".'
		]);
		expect(result.stdout).toEqual(["Age: 0"]);
	});

	it("previews Scanner token reads and nextLine newline behavior", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String name = input.next();
        int age = input.nextInt();
        String leftover = input.nextLine();
        String city = input.nextLine();
        double temp = input.nextDouble();
        boolean ready = input.nextBoolean();
        System.out.println(name + "|" + age + "|" + leftover + "|" + city + "|" + temp + "|" + ready);
    }
}`
				}
			],
			inputText: "Ada 36\nSeattle WA\n98.6 true",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["Ada|36||Seattle WA|98.6|true"]);
	});

	it("previews Scanner hasNext validation without consuming tokens", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String skipped = "";
        while (!input.hasNextInt() && input.hasNext()) {
            skipped = input.next();
        }
        int value = input.nextInt();
        System.out.println(skipped + ":" + value + ":" + input.hasNextLine());
    }
}`
				}
			],
			inputText: "oops 5\nnext line",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["oops:5:true"]);
	});

	it("previews Java console if/else decisions from stored input", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String color = input.nextLine();
        int age = input.nextInt();
        boolean hasTicket = input.nextBoolean();

        if (color.equalsIgnoreCase("blue") && age >= 13 && hasTicket) {
            System.out.println("Enter the blue room");
        } else if (age < 13) {
            System.out.println("Come back later");
        } else {
            System.out.println("Try another line");
        }
    }
}`
				}
			],
			inputText: "Blue\n14\ntrue",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["Enter the blue room"]);
	});

	it("previews bounded Java console for and while loops", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        int total = 0;
        for (int i = 1; i <= 3; i++) {
            total += i;
            System.out.print(i);
        }
        System.out.println(" total=" + total);

        int count = 0;
        while (count < 2) {
            System.out.print(" w" + count);
            count++;
        }
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["123 total=6", " w0 w1"]);
	});

	it("previews beginner string, cast, and Math expressions", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        String word = "Python";
        String padded = "  grid  ";
        System.out.println(word.length());
        System.out.println(word.charAt(2));
        System.out.println(word.substring(1, 4));
        System.out.println(word.equals("Python"));
        System.out.println(word.equalsIgnoreCase("PYTHON"));
        System.out.println(word.toLowerCase());
        System.out.println(word.toUpperCase());
        System.out.println(padded.trim());
        System.out.println(word.indexOf("th"));
        System.out.println(word.indexOf("x"));
        System.out.println(word.compareTo("Java"));
        System.out.println(word.compareTo("Python"));
        System.out.println(word.toUpperCase().indexOf("TH"));
        System.out.println(word.compareTo("Java") > 0);
        System.out.println((int) 3.9);
        System.out.println(Math.max(4, 7));
        System.out.println(Math.round(Math.PI * 100));
        System.out.println((int) Math.E);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"6",
			"t",
			"yth",
			"true",
			"true",
			"python",
			"PYTHON",
			"grid",
			"2",
			"-1",
			"6",
			"0",
			"2",
			"true",
			"3",
			"7",
			"314",
			"2"
		]);
	});

	it("previews beginner Java static methods with parameters and returns", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        System.out.println("sum=" + sum(2, 3));
        System.out.println("max=" + max(9, 4));
        System.out.println("even=" + isEven(sum(1, 5)));
        System.out.println("next=" + (sum(2, 3) + 1));
        say("done");
    }

    public static int sum(int a, int b) {
        return a + b;
    }

    public static int max(int a, int b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    public static boolean isEven(int value) {
        return value % 2 == 0;
    }

    public static void say(String text) {
        System.out.println(text);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"sum=5",
			"max=9",
			"even=true",
			"next=6",
			"done"
		]);
	});

	it("previews recursive Java return methods with a browser call-depth cap", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        System.out.println("factorial=" + factorial(5));
        System.out.println("capped=" + neverDone(0));
    }

    public static int factorial(int value) {
        if (value <= 1) {
            return 1;
        }
        return value * factorial(value - 1);
    }

    public static int neverDone(int value) {
        return neverDone(value + 1);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toContain(
			"Stopped Java preview after 40 nested method calls."
		);
		expect(result.stdout).toEqual(["factorial=120", "capped=null"]);
	});

	it("previews beginner Java arrays with indexing, length, and loops", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = {2, 4, 6};
        scores[1] = scores[0] + 5;

        int total = 0;
        for (int i = 0; i < scores.length; i++) {
            total += scores[i];
        }

        String[] names = new String[2];
        names[0] = "Ada";
        names[1] = "Grace";

        System.out.println(Arrays.toString(scores));
        System.out.println("total=" + total);
        System.out.println(names[1]);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["[2, 7, 6]", "total=15", "Grace"]);
	});

	it("previews beginner Java two-dimensional arrays with row and column indexing", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[][] grid = {{1, 2, 3}, {4, 5, 6}};
        grid[1][2] = grid[0][1] + 7;

        int total = 0;
        for (int row = 0; row < grid.length; row++) {
            for (int col = 0; col < grid[row].length; col++) {
                total += grid[row][col];
            }
        }

        int[][] blank = new int[2][2];
        blank[0][1] = total;

        System.out.println(grid.length);
        System.out.println(grid[0].length);
        System.out.println(total);
        System.out.println(Arrays.deepToString(grid));
        System.out.println(Arrays.deepToString(blank));
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"2",
			"3",
			"24",
			"[[1, 2, 3], [4, 5, 9]]",
			"[[0, 24], [0, 0]]"
		]);
	});

	it("previews beginner Java ArrayLists with add, get, set, remove, contains, clear, and size", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Ada");
        names.add("Grace");
        names.add(1, "Katherine");
        names.set(1, "Linus");
        names.remove("Grace");
        boolean hadAda = names.contains("Ada");
        boolean hadGrace = names.contains("Grace");

        ArrayList<Integer> points = new ArrayList<Integer>();
        points.add(3);
        points.add(4);

        System.out.println(names.size());
        System.out.println(names.get(1));
        System.out.println(points.get(0) + points.get(1));
        System.out.println(hadAda + ":" + hadGrace);
        names.clear();
        System.out.println(names.isEmpty());
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["2", "Linus", "7", "true:false", "true"]);
	});

	it("previews beginner Java enhanced for loops over arrays and ArrayLists", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        int[] scores = {2, 4, 6};
        int total = 0;
        for (int score : scores) {
            total += score;
        }

        ArrayList<String> names = new ArrayList<>();
        names.add("Ada");
        names.add("Grace");

        String initials = "";
        for (String name : names) {
            initials += name.charAt(0);
        }

        System.out.println(total);
        System.out.println(initials);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["12", "AG"]);
	});

	it("runs the beginner Karel command subset into a visual world state", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{ name: "Algo.java", content: karelStarterCode },
				{ name: "world.txt", content: karelStarterWorld }
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.rows).toBe(10);
		expect(result.karelWorld?.cols).toBe(10);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 4,
			direction: "West",
			name: "sam",
			street: 6
		});
		expect(result.karelWorld?.beepers).toContainEqual({
			avenue: 9,
			count: 1,
			street: 6
		});
		expect(result.stdout.at(-1)).toContain("(avenue: 4)");
	});

	it("reports Karel boundary collisions without moving through them", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: karelStarterCode.replace(
						"sam.move();\n        sam.move();\n        sam.move();",
						Array.from({ length: 10 }, () => "sam.move();").join(
							"\n        "
						)
					)
				},
				{ name: "world.txt", content: karelStarterWorld }
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual(["sam.move() hit the edge of the world."]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 1,
			street: 6
		});
	});

	it("runs Karel helper methods and simple loops from main only", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(6, 7, Directions.East, 0);
        turnRight(sam);
        moveTwice(sam);
        for (int i = 0; i < 2; i++) {
            sam.turnLeft();
        }
    }

    static void turnRight(UrRobot robot) {
        robot.turnLeft();
        robot.turnLeft();
        robot.turnLeft();
    }

    static void moveTwice(UrRobot robot) {
        robot.move();
        robot.move();
    }

    static void hidden(UrRobot robot) {
        robot.move();
    }

    static {
        World.setVisible(true);
    }
}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 7,
			direction: "North",
			street: 4
		});
		expect(result.stdout).toHaveLength(8);
	});

	it("caps long Karel preview loops in the browser runner", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(6, 7, East, 0);
        for (int i = 0; i < 600; i++) {
            sam.turnLeft();
        }
    }
}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([
			"Stopped Karel preview after 500 commands."
		]);
		expect(result.stdout).toHaveLength(501);
		expect(result.karelWorld?.robot?.direction).toBe("East");
	});

	it("runs CodeHS-style Karel commands from run methods", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        putBall();
        move();
        turnRight();
    }

    private void turnRight() {
        turnLeft();
        turnLeft();
        turnLeft();
    }

    private void hidden() {
        move();
    }
}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			direction: "South",
			name: "karel",
			street: 1
		});
		expect(result.karelWorld?.beepers).toContainEqual({
			avenue: 1,
			count: 1,
			street: 1
		});
		expect(result.stdout).toHaveLength(6);
	});

	it("runs CodeHS-style Karel if/else and while conditions", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        if (ballsPresent()) {
            takeBall();
        } else {
            move();
        }

        while (frontIsClear()) {
            move();
        }

        if (frontIsBlocked()) {
            turnLeft();
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=3
cols=4`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 4,
			direction: "North",
			name: "karel",
			street: 1
		});
		expect(result.karelWorld?.beepers).toEqual([]);
		expect(result.stdout).toHaveLength(5);
	});

	it("evaluates Karel ball and facing conditions against preview state", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        if (ballsPresent()) {
            takeBall();
        }
        if (noBallsPresent()) {
            putBall();
        }
        if (facingEast()) {
            turnLeft();
        }
        if (!notFacingNorth()) {
            move();
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=3
cols=4
beeper 1 1 1`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 1,
			direction: "North",
			street: 2
		});
		expect(result.karelWorld?.beepers).toContainEqual({
			avenue: 1,
			count: 1,
			street: 1
		});
		expect(result.stdout).toHaveLength(5);
	});

	it("evaluates compound Karel Java conditions in preview control flow", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        if (frontIsClear() && ballsPresent()) {
            takeBall();
            move();
        }

        if (frontIsBlocked() || noBallsPresent()) {
            turnLeft();
        }

        while (frontIsClear() && noBallsPresent()) {
            move();
        }

        if (!(ballsPresent() || facingWest()) && facingNorth()) {
            putBall();
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=2
cols=3
beeper 1 1 1`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			direction: "North",
			name: "karel",
			street: 2
		});
		expect(result.karelWorld?.beepers).toEqual([
			{ avenue: 2, count: 1, street: 2 }
		]);
	});

	it("loads Java and Karel execution through the client IDE workspace", () => {
		const routeSource = sourceFile("../src/pages/python-ide.vue");
		const workspaceSource = sourceFile(
			"../src/components/PythonIdeWorkspace.vue"
		);

		expect(routeSource).toContain(
			'() => import("@/components/PythonIdeWorkspace.vue")'
		);
		expect(workspaceSource).toContain(
			'import { runJavaIdeProject } from "@/modules/javaIdeRuntime";'
		);
		expect(workspaceSource).toContain(
			"const result = runJavaIdeProject({"
		);
		expect(workspaceSource).toContain("inputText: inputText.value");
		expect(workspaceSource).toContain("mode: project.mode");
		expect(workspaceSource).not.toContain("javac");
		expect(workspaceSource).not.toContain("child_process");
	});

	it("keeps the Java/Karel runner isolated from backend and worker execution", () => {
		const runtimeSource = sourceFile("../src/modules/javaIdeRuntime.ts");

		expect(runtimeSource).not.toMatch(/\bfetch\s*\(/);
		expect(runtimeSource).not.toMatch(/\bnew\s+Worker\b|\bWorker\s*\(/);
		expect(runtimeSource).not.toContain("child_process");
		expect(runtimeSource).not.toMatch(/\bspawn\s*\(|\bexec\s*\(|\bfork\s*\(/);
		expect(runtimeSource).not.toMatch(/\bjavac\b|\bdocker\b/i);
	});
});
