import type { RequestHandler } from "express";
import helmet from "helmet";

export function createApiSecurityHeaders(): RequestHandler {
	return helmet({
		contentSecurityPolicy: {
			directives: {
				baseUri: ["'none'"],
				defaultSrc: ["'none'"],
				formAction: ["'none'"],
				frameAncestors: ["'none'"]
			},
			useDefaults: false
		}
	});
}

export function createCrossOriginAssetHeaders(): RequestHandler {
	return helmet.crossOriginResourcePolicy({ policy: "cross-origin" });
}
