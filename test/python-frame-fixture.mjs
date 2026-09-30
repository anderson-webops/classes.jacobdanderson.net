import assert from "node:assert/strict";

export const publicRuntimeHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Cross-Origin-Resource-Policy": "cross-origin"
};

export async function pythonFrame(page) {
	const element = await page.waitForSelector(
		'iframe[title="Isolated Python output"]'
	);
	assert.equal(
		await element.evaluate(frame => frame.getAttribute("sandbox")),
		"allow-scripts"
	);
	const frame = await element.contentFrame();
	assert.ok(frame, "the isolated runtime document must exist");
	await frame.waitForSelector(".isolated-runtime");
	return frame;
}
