import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

export function scratchCourseAccount(path, role) {
	if (!role) return {};
	const user = { _id: "scratch-course-fixture", name: "Course fixture", email: "course@example.invalid", age: 14, state: "GA", courseAccess: ["scratch-level-1"], courseProgress: [] };
	if (path === "/api/accounts/me") return role === "instructor" ? { tutorID: "scratch-tutor-fixture" } : { userID: user._id };
	if (path === "/api/users/loggedin" && role === "learner") return { currentUser: user };
	if (path === "/api/tutors/loggedin" && role === "instructor") return { currentTutor: { _id: "scratch-tutor-fixture", name: "Course fixture", email: "course@example.invalid", age: 30, state: "GA", usersOfTutorLength: 1, coursePermissions: ["scratch-level-1"] } };
	if (path === "/api/users/oftutor/scratch-tutor-fixture") return [user];
	return {};
}

async function readLesson(page, title, required) {
	await page.waitForFunction(title => [...document.querySelectorAll(".lesson-item")].some(item => item.querySelector("h5")?.textContent.includes(title)), {}, title);
	await page.$$eval(".lesson-item", (items, title) => items.find(item => item.querySelector("h5")?.textContent.includes(title)).scrollIntoView(), title);
	await page.waitForFunction(({ title, required }) => [...document.querySelectorAll(".lesson-item")].find(item => item.querySelector("h5")?.textContent.includes(title))?.querySelector(".item-content-markdown")?.textContent.includes(required), {}, { title, required });
	return page.$$eval(".lesson-item", (items, title) => items.find(item => item.querySelector("h5")?.textContent.includes(title)).textContent.replace(/\s+/g, " "), title);
}

export async function checkScratchConditionalCourse(page, origin, setRole) {
	for (const role of ["learner", "instructor"]) {
		setRole(role);
		for (const width of [390, 1280]) {
			await page.setViewport({ width, height: 900 });
			await page.goto(`${origin}/courses#scratch-level-1-gs5-basic-conditionals`, { waitUntil: "networkidle2" });
			await page.waitForSelector(".lesson-view-toggle button");
			await page.click(".lesson-view-toggle button:nth-child(3)");
			const colors = await readLesson(page, "Dino's Colors: Sampling and Boundary Decisions", "swap roles");
			assert.match(colors, /eyedropper/);
			assert.match(colors, /last matching check wins/);
			assert.match(colors, /grey, blue, yellow, red/);
			const sounds = await readLesson(page, "Noisy Reactions: Conditions and Sound Order", "message broadcasting module");
			assert.match(sounds, /different Thunder Storm recordings/);
			assert.match(sounds, /wait until not touching Ball\?/);
			assert.match(sounds, /go to Cloud/);
			await page.click(".lesson-view-toggle button:nth-child(2)");
			const timing = await readLesson(page, "Concurrent Lightning Strike Challenge", "completion gate for returning");
			assert.match(timing, /both motion and sound finish/);
			assert.match(timing, /two separate loops/);
			assert.equal(await page.$$eval(".lesson-item", items => items.find(item => item.querySelector("h5")?.textContent.includes("Concurrent Lightning Strike Challenge"))?.querySelectorAll("pre").length), 2, "Both block stacks render with their nesting");
			assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
			if (process.env.SCRATCH_SCREENSHOT_DIR) {
				await mkdir(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
				await page.screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, `scratch-conditionals-${role}-${width}.png`), fullPage: true });
			}
			await page.click(".lesson-view-toggle button:nth-child(1)");
			for (const id of [291223299, 291542721])
				await page.waitForSelector(`a[href='https://scratch.mit.edu/projects/${id}/']`);
			const references = await page.$$eval("a", links => links.map(link => link.href).filter(href => /scratch\.mit\.edu\/projects\/(?:291220849|291530292)\//.test(href)));
			assert.equal(references.length, role === "instructor" ? 2 : 0);
			console.log(`Scratch conditional guidance, optional timing and source roles verified: ${role} at ${width}px`);
		}
	}
}
