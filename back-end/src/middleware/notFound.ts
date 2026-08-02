import type { RequestHandler } from "express";

/** Keep unknown API responses small, non-cacheable, and machine-readable. */
export const apiNotFound: RequestHandler = (_req, res) => {
	res
		.status(404)
		.set("Cache-Control", "no-store")
		.json({ message: "Not found" });
};
