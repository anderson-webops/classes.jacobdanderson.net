import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
	exactSecurityHeaders,
	serializeContentSecurityPolicy
} from "../scripts/production-security-headers.mjs";

const root = fileURLToPath(new URL("../front-end/dist/", import.meta.url));
const types = {
	".html": "text/html",
	".js": "application/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".svg": "image/svg+xml",
	".wasm": "application/wasm",
	".zip": "application/zip",
	".woff2": "font/woff2",
	".wav": "audio/wav",
	".ogg": "audio/ogg",
	".mp3": "audio/mpeg"
};
const server = createServer((request, response) => {
	const pathname = new URL(request.url, "http://127.0.0.1").pathname;
	for (const [name, value] of Object.entries(exactSecurityHeaders))
		response.setHeader(name, value);
	response.setHeader("Cache-Control", "no-store");
	response.setHeader(
		"Content-Security-Policy",
		serializeContentSecurityPolicy(
			/^\/(?:ide|python-ide)(?:\/|$)/.test(pathname)
				? "code-ide"
				: "standard"
		)
	);
	if (pathname.startsWith("/api/")) {
		response.setHeader("Content-Type", "application/json");
		response.end("{}");
		return;
	}
	if (/^\/(?:python-runtime|(?:ide|python-ide)\/assets)\//.test(pathname)) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
	}
	let file = path.resolve(root, `.${decodeURIComponent(pathname)}`);
	if (!file.startsWith(root) || !existsSync(file)) {
		response.writeHead(404).end("Not found");
		return;
	}
	if (statSync(file).isDirectory()) file = path.join(file, "index.html");
	if (!existsSync(file)) {
		response.writeHead(404).end("Not found");
		return;
	}
	response.setHeader(
		"Content-Type",
		types[path.extname(file)] ?? "application/octet-stream"
	);
	createReadStream(file).pipe(response);
});
server.listen(3344, "127.0.0.1", () =>
	console.log(
		"Synthetic built-artifact acceptance: http://127.0.0.1:3344/ide/"
	)
);
for (const signal of ["SIGINT", "SIGTERM"])
	process.on(signal, () => server.close(() => process.exit(0)));
