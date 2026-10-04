import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import { runAxeInPage } from "../scripts/a11y-axe-runtime.mjs";
import { createRequire } from "node:module";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const schedulerUrl = "https://scheduler.classes.jacobdanderson.net/";
const axeSource = createRequire(import.meta.url).resolve("axe-core/axe.min.js");

test(
	"full-page booking handoff, Back navigation and accessible fallback",
	{ timeout: 120000 },
	async () => {
		let browser;
		let server;
		const previousDirectory = process.cwd();
		const startedAt = new Date().toISOString();
		const taskId =
			process.env.CLASSES_FAMILY_TASK_ID ?? "signup-browser-ci";
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: "signup-browser",
				pid: process.pid,
				startedAt,
				timeoutMs: 120000
			})
		);
		try {
			process.chdir(root);
			server = await createServer({
				root,
				server: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			await server.listen();
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				await puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(value => value && existsSync(value));
			assert.ok(
				executablePath,
				"Chrome is required for the booking browser test"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			const page = await browser.newPage();
			try {
				const schedulerRequests = [];
				let blockNavigation = false;
				await page.setRequestInterception(true);
				page.on("request", request => {
					const url = new URL(request.url());
					if (url.origin === new URL(schedulerUrl).origin) {
						schedulerRequests.push({
							url: request.url(),
							mainFrame: request.frame() === page.mainFrame(),
							navigation: request.isNavigationRequest()
						});
						if (blockNavigation) void request.abort("aborted");
						else
							void request.respond({
								status: 200,
								contentType: "text/html",
								body: '<!doctype html><html lang="en"><head><title>Scheduler fixture</title></head><body><h1>Scheduler fixture</h1></body></html>'
							});
					} else if (url.origin !== origin) {
						// Never contact production APIs, analytics or other external services.
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: "{}"
						});
					} else if (url.pathname.startsWith("/api/")) {
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: "{}"
						});
					} else void request.continue();
				});
				await page.goto(`${origin}/about`, {
					waitUntil: "networkidle0"
				});
				await page
					.goto(
						`${origin}/signup?redirect=https://example.invalid/&token=do-not-forward`,
						{ waitUntil: "domcontentloaded" }
					)
					.catch(error => {
						if (!error.message.includes("ERR_ABORTED")) throw error;
					});
				await page.waitForFunction(
					url => window.location.href === url,
					{},
					schedulerUrl
				);
				assert.equal(await page.$("iframe"), null);
				assert.deepEqual(
					schedulerRequests.filter(request => request.navigation),
					[{ url: schedulerUrl, mainFrame: true, navigation: true }]
				);
				// A BFCache restore need not emit the loading lifecycle events used by goBack.
				await page.evaluate(() => window.history.back());
				await page.waitForFunction(
					url => window.location.href === url,
					{},
					`${origin}/about`
				);
				assert.equal(
					page.url(),
					`${origin}/about`,
					"Back must not revisit the redirect page"
				);
				blockNavigation = true;
				for (const width of [390, 1280]) {
					await page.setViewport({ width, height: 900 });
					await page
						.goto(`${origin}/signup`, {
							waitUntil: "domcontentloaded"
						})
						.catch(error => {
							if (!error.message.includes("ERR_ABORTED"))
								throw error;
						});
					await page.waitForSelector(".signup-page a.site-button");
					await page.waitForFunction(() =>
						document
							.querySelector("#app")
							?.hasAttribute("data-v-app")
					);
					assert.equal(
						await page.$eval(
							".signup-page a.site-button",
							element => element.href
						),
						schedulerUrl
					);
					assert.equal(
						await page.$eval(
							".signup-page a.text-link",
							element => element.href
						),
						`${schedulerUrl}portal`
					);
					assert.equal(await page.$("iframe"), null);
					assert.equal(
						await page.evaluate(
							() =>
								document.documentElement.scrollWidth <=
								window.innerWidth
						),
						true
					);
					await page.addScriptTag({ path: axeSource });
					const result = await runAxeInPage(page);
					assert.deepEqual(
						result.violations,
						[],
						`Fallback accessibility at ${width}px`
					);
					if (process.env.BOOKING_SCREENSHOT_DIR) {
						const directory = join(
							previousDirectory,
							process.env.BOOKING_SCREENSHOT_DIR
						);
						await mkdir(directory, { recursive: true });
						await page.screenshot({
							path: join(
								directory,
								`signup-fallback-${width}.png`
							),
							fullPage: true
						});
					}
				}
			} finally {
				await page.close();
			}
		} finally {
			if (browser) await browser.close();
			if (server) await server.close();
			process.chdir(previousDirectory);
			console.log(
				JSON.stringify({
					event: "cleanup",
					taskId,
					pid: process.pid,
					startedAt,
					endedAt: new Date().toISOString()
				})
			);
		}
	}
);
