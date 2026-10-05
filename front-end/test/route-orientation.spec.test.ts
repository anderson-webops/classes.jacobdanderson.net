import type { RouteLocationNormalized } from "vue-router";
import { describe, expect, it } from "vitest";
import { routeScrollBehavior } from "@/modules/routeOrientation";
const location = (path: string, hash = "") =>
	({ path, hash }) as RouteLocationNormalized;
describe("route orientation", () => {
	it("resets new pages but preserves workspace query changes and browser back", () => {
		expect(
			routeScrollBehavior(location("/pathways"), location("/about"), null)
		).toEqual({ top: 0, left: 0, behavior: "instant" });
		expect(
			routeScrollBehavior(location("/ide"), location("/ide"), null)
		).toBe(false);
		expect(
			routeScrollBehavior(
				location("/courses", "#course:module"),
				location("/courses"),
				null
			)
		).toBe(false);
		const saved = { top: 880, left: 0 };
		expect(
			routeScrollBehavior(
				location("/about"),
				location("/pathways"),
				saved
			)
		).toEqual({ ...saved, behavior: "instant" });
	});
	it("honors section anchors", () => {
		expect(
			routeScrollBehavior(
				location("/courses", "#classroom-access"),
				location("/profile"),
				null
			)
		).toEqual({ el: "#classroom-access", top: 16, behavior: "instant" });
		expect(
			routeScrollBehavior(
				location("/about", "#pathways"),
				location("/"),
				null
			)
		).toEqual({ el: "#pathways", top: 16, behavior: "instant" });
	});
});
