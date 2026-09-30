import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
let directory: string;
let bundle: string;
beforeAll(() => {
	directory = mkdtempSync(join(tmpdir(), "classes-java-limits-"));
	bundle = join(directory, "runtime.cjs");
	const root = resolve(__dirname, "..");
	const result = spawnSync(process.execPath, ["-e", `require(process.argv[1]).buildSync(JSON.parse(process.argv[2]))`, require.resolve("esbuild"), JSON.stringify({
		entryPoints: [resolve(root, "src/modules/javaIdeRuntime.ts")], bundle: true, platform: "node", format: "cjs", outfile: bundle, alias: { "@": resolve(root, "src") }, logLevel: "silent"
	})], { timeout: 15000, encoding: "utf8", maxBuffer: 64000 });
	expect(result.status, result.stderr).toBe(0);
});
afterAll(() => { if (directory) rmSync(directory, { recursive: true, force: true }); });

function runProject(project: { activeFileName: string; mode: "java" | "karel"; files: { name: string; content: string }[] }) {
	const result = spawnSync(process.execPath, ["--max-old-space-size=96", "-e", `const {runJavaIdeProject}=require(process.argv[1]);const fs=require("node:fs");process.stdout.write(JSON.stringify(runJavaIdeProject(JSON.parse(fs.readFileSync(0,"utf8")))));`, bundle], { input: JSON.stringify(project), timeout: 2000, maxBuffer: 1000000, encoding: "utf8" });
	expect(result.error?.message, result.stderr).toBeUndefined();
	expect(result.status, result.stderr).toBe(0);
	return JSON.parse(result.stdout) as { stderr: string[]; stdout: string[] };
}

function run(body: string, mode: "java" | "karel" = "java", prefix = "") {
	return runProject({ activeFileName: "Main.java", mode, files: [{ name: "Main.java", content: `public class Main {\n${prefix}\npublic static void main(String[] args) { ${body} } }` }] });
}

describe("Java/Karel bounded production interpreter", () => {
	it("selects the driver without backtracking through unterminated helper comments", () => {
		const result = runProject({ activeFileName: "Helper.java", mode: "java", files: [{ name: "Helper.java", content: "/*".repeat(50000) }, { name: "Main.java", content: "class Main { public static void main(String[] args) { System.out.println(42); } }" }] });
		expect(result.stdout).toEqual(["42"]);
		expect(result.stderr).toEqual([]);
	});
	it.each(["java", "karel"] as const)("stops command-free nested loops across the whole %s run", mode => {
		const result = run("for(int a=0;a<500;a++){for(int b=0;b<500;b++){for(int c=0;c<500;c++){;}}} System.out.println(999);", mode);
		expect(result.stderr.join(" ")).toContain("total execution limit");
		expect(result.stdout).not.toContain("999");
	});
	it.each([
		"int[] a = new int[1000000000];",
		"int[][] a = new int[9999][9999];",
		"int[] a = {1}; int[] b = Arrays.copyOf(a, 1000000000);",
		"int[] a = {1}; a[1000000000] = 2;",
		"ArrayList<String> a = new ArrayList<>(); a.add(\"x\"); a.set(1000000000, \"y\");",
		"System.out.printf(\"%999999999s\", \"x\");",
		"System.out.printf(\"%.999999999f\", 1);",
		"String a = \"x\"; for(int n=0;n<500;n++){ a += a; }",
		"ArrayList<Object> a = new ArrayList<>(); a.add(a); System.out.println(a);"
	])("rejects materialization before resource exhaustion: %s", body => {
		const result = run(body);
		expect(result.stderr.join(" ")).toMatch(/limit|size|index|cyclic/);
	});
	it.each(["java", "karel"] as const)("guards eagerly seeded constants in %s", mode => {
		expect(run("", mode, "static final int HUGE = new int[1000000000];").stderr.join(" ")).toContain("collection size");
	});
	it.each(["%", "%-", "%000", "%+ ", "%.2", "%123"])("terminates incomplete format token %s", format => {
		expect(run(`System.out.printf(${JSON.stringify(format)}, 1);`).stdout).toEqual([format]);
	});
	it("preserves ordinary nested loops, array copy, sorting and formatting", () => {
		const result = run('int sum=0; for(int a=0;a<10;a++){for(int b=0;b<10;b++){sum++;}} int[] values={3,1,2}; int[] copy=Arrays.copyOf(values,5); Arrays.sort(copy); System.out.println(sum); System.out.println(Arrays.toString(copy)); System.out.printf("%04d %.2f", 7, 1.25);');
		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["100", "[0, 0, 1, 2, 3]", "0007 1.25"]);
	});
});
