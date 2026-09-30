import type { JavaIdeRunOptions } from "@/modules/javaIdeRuntime";
import { runJavaIdeProject } from "@/modules/javaIdeRuntime";

globalThis.onmessage = (event: MessageEvent<JavaIdeRunOptions>) => {
	globalThis.postMessage(runJavaIdeProject(event.data));
};
