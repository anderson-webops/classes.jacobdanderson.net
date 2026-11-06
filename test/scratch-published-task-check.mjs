import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const groups = [
	{
		module: "scratch-level-1-gs9-variables",
		tab: 2,
		projects: [
			{
				id: "327635693",
				reference: "327634746",
				required: [
					"Zebra Steps",
					"set it to 0",
					"next costume",
					"by 1"
				],
				excluded: []
			},
			{
				id: "327610777",
				reference: "327610727",
				required: [
					"random x",
					"pick random",
					"decreasing y",
					"Puffs Eaten",
					"Chomp",
					"add a timed round"
				],
				optional: ["add a timed round"],
				excluded: ["3. Add a timer"]
			},
			{
				id: "327607937",
				reference: "327607840",
				required: [
					"donut $2",
					"pizza $4",
					"taco $3",
					"apple $1",
					"done",
					"unchanged",
					"money remains"
				],
				excluded: ["sandwich", "salad"]
			}
		]
	},
	{
		module: "scratch-level-1-gs7-user-input",
		tab: 1,
		projects: [
			{
				id: "297744913",
				reference: "297735619",
				required: [
					"hat is clicked",
					"between 1 and 5",
					"Magic Spell",
					"twice",
					"each number"
				],
				excluded: ["Love, Money, or Friendship"]
			},
			{
				id: "295334181",
				reference: "294561252",
				required: [
					"1 and 100",
					"51",
					"Too low!",
					"Too high!",
					"unchanged"
				],
				optional: ["randomly chosen target", "count guesses"],
				excluded: ["between 1 and 20"]
			}
		]
	},
	{
		module: "scratch-level-1-gs7-user-input",
		tab: 2,
		projects: [
			{
				id: "328309551",
				reference: "328310531",
				required: [
					"backdrops named",
					"dinosaur",
					"jellyfish",
					"giraffe",
					"two seconds"
				],
				excluded: ["build a shop", "plant a tree", "items collected"]
			},
			{
				id: "328310783",
				reference: "328308418",
				required: [
					"Spot",
					"Dot",
					"(0, 0)",
					"Earth",
					"Saturn",
					"Star",
					"pick random",
					"Hi Dot!"
				],
				excluded: ["Captain", "Mars", "Jupiter", "discoveries"]
			}
		]
	}
];

export async function checkScratchPublishedTasks(
	page,
	{ origin, files, setRole }
) {
	const output =
		process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR ||
		path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const record = {
		complete: false,
		sourceCommit: process.env.GITHUB_SHA,
		views: []
	};
	const retain = () =>
		writeFile(
			path.join(output, "published-tasks.json"),
			`${JSON.stringify(record, null, 2)}\n`
		);
	for (const role of ["learner", "instructor"]) {
		setRole(role);
		for (const width of [390, 1280]) {
			await page.setViewport({ width, height: 900 });
			for (const group of groups) {
				await page.goto("about:blank");
				await page.goto(`${origin}/courses#${group.module}`, {
					waitUntil: "networkidle2"
				});
				await page.waitForSelector(".lesson-view-toggle button");
				await page
					.locator(
						`.lesson-view-toggle button:nth-child(${group.tab})`
					)
					.click();
				for (const project of group.projects) {
					const selector = `a.is-ide-starter[href*="originalProject=${project.id}"]`;
					await page.waitForSelector(selector);
					await page.$eval(selector, link =>
						link.closest(".lesson-item").scrollIntoView({
							behavior: "instant",
							block: "center"
						})
					);
					await page.waitForFunction(
						(selector, required) => {
							const text = document
								.querySelector(selector)
								?.closest(".lesson-item")
								?.textContent.replace(/\s+/g, " ");
							return (
								text &&
								required.every(value => text.includes(value))
							);
						},
						{},
						selector,
						project.required
					);
					const actual = await page.$eval(selector, link => {
						const item = link.closest(".lesson-item");
						return {
							title: item.querySelector("h5").textContent,
							text: item.textContent.replace(/\s+/g, " "),
							links: [
								...item.querySelectorAll("a.is-ide-starter")
							].map(a => ({
								id: new URL(a.href).searchParams.get(
									"originalProject"
								),
								role: new URL(a.href).searchParams.get("role"),
								course: new URL(a.href).searchParams.get(
									"course"
								)
							})),
							playableReference: !!item.querySelector(
								".is-playable-solution"
							),
							optionalSections: [
								...item.querySelectorAll(
									".assignment-aside.is-optional"
								)
							].map(section => ({
								label: section
									.querySelector("h6")
									.textContent.trim(),
								text: section.textContent.replace(/\s+/g, " ")
							})),
							contained:
								item.scrollWidth <= item.clientWidth + 1 &&
								document.documentElement.scrollWidth <=
									innerWidth + 1
						};
					});
					for (const text of project.optional || [])
						assert.ok(
							actual.optionalSections.some(
								section =>
									section.label.startsWith("Optional") &&
									section.text.includes(text)
							),
							`${project.id}: optional section ${text}`
						);
					for (const text of project.required)
						assert.ok(
							actual.text.includes(text),
							`${project.id}: ${text}`
						);
					for (const text of project.excluded)
						assert.ok(
							!actual.text.includes(text),
							`${project.id}: obsolete ${text}`
						);
					assert.ok(
						actual.contained,
						`${role}/${width}/${project.id}: task overflow`
					);
					assert.ok(actual.playableReference);
					assert.ok(
						actual.links.some(
							link =>
								link.id === project.id &&
								link.role === "project" &&
								link.course === "scratch-level-1"
						)
					);
					if (role === "instructor")
						assert.ok(
							actual.links.some(
								link =>
									link.id === project.reference &&
									link.role === "reference" &&
									link.course === "scratch-level-1"
							)
						);
					await page.screenshot({
						path: path.join(
							output,
							`published-task-${project.id}-${role}-${width}.png`
						)
					});
					record.views.push({
						role,
						width,
						module: group.module,
						project: project.id,
						...actual
					});
					await retain();
				}
			}
		}
	}
	assert.equal(record.views.length, 28);
	record.complete = true;
	await retain();
}
