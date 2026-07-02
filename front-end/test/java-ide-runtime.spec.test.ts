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
        UrRobot sam = new UrRobot(6, 7, East, 0);
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
