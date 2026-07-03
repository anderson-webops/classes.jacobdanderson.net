import { describe, expect, it } from "vitest";
import {
	containsCurrentIdeBundleMarkers,
	containsJavaModeCopy,
	pageAssetUrls
} from "../../scripts/production-ide-smoke.mjs";

describe("production Code IDE smoke helpers", () => {
	it("extracts same-origin JavaScript assets from the IDE page HTML", () => {
		const baseUrl = new URL("https://classes.jacobdanderson.net/ide");
		const html = [
			'<link rel="stylesheet" href="/assets/app.css">',
			'<script type="module" src="/assets/CodeIdeWorkspace-a1b2.js"></script>',
			'<script src="https://classes.jacobdanderson.net/assets/app-c3d4.js"></script>',
			'<script src="https://cdn.example.test/external.js"></script>'
		].join("");

		expect(pageAssetUrls(html, baseUrl)).toEqual([
			"https://classes.jacobdanderson.net/assets/CodeIdeWorkspace-a1b2.js",
			"https://classes.jacobdanderson.net/assets/app-c3d4.js"
		]);
	});

	it("requires current Code IDE bundle markers, not generic Java course copy", () => {
		const genericJavaCourseAsset =
			"Java Level 1 mentions Karel Java and a BlueJ Java Project.";
		const currentIdeBundle = [
			"Code, run, and draw in Python or Java",
			"preview Java console programs or Karel robot",
			"Karel world ready",
			"BlueJ Java Project",
			"Download for BlueJ"
		].join("\n");

		expect(containsJavaModeCopy(genericJavaCourseAsset)).toBe(true);
		expect(containsCurrentIdeBundleMarkers(genericJavaCourseAsset)).toBe(
			false
		);
		expect(containsCurrentIdeBundleMarkers(currentIdeBundle)).toBe(true);
	});
});
