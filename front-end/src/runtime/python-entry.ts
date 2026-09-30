import { createPinia } from "pinia";
import { createApp, h, nextTick } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import CodeIdeWorkspace from "../components/CodeIdeWorkspace.vue";
import { sandboxPointerRelease, sandboxRun } from "../modules/pythonSandbox";

const { channel, parentOrigin } = document.body.dataset;
if (
	window.parent === window ||
	window.origin !== "null" ||
	!channel ||
	!parentOrigin
) {
	throw new Error("An opaque Python frame is required.");
}
const host = window.parent;
const destinationOrigin = parentOrigin;
function send(message: Record<string, unknown>) {
	return host.postMessage({ ...message, channel }, destinationOrigin);
}
let component: InstanceType<typeof CodeIdeWorkspace> | null = null;
let used = false;
const app = createApp({
	render: () =>
		h(CodeIdeWorkspace, {
			runtimeOnly: true,
			ref: instance => {
				component = instance as InstanceType<typeof CodeIdeWorkspace>;
			},
			onRuntimeMessage: send
		})
});
app.use(createPinia());
app.use(
	createRouter({
		history: createMemoryHistory(),
		routes: [{ path: "/", component: { render: () => null } }]
	})
);
app.mount("#python-runtime-root");
window.addEventListener("message", async event => {
	if (event.source !== host || event.origin !== parentOrigin) return;
	const message = event.data;
	if (!message || message.channel !== channel) return;
	const release = used ? sandboxPointerRelease(message, channel) : null;
	if (release) {
		component?.releaseIsolatedPointer(
			release.button,
			release.clientX,
			release.clientY
		);
		return;
	}
	if (used || message.type !== "run") return;
	const run = sandboxRun(message.run);
	if (!run) return;
	used = true;
	await nextTick();
	try {
		await component?.runIsolated(run);
	} catch {
		send({
			type: "error",
			message: "The isolated runtime could not run this project."
		});
	}
});
send({ type: "ready" });
