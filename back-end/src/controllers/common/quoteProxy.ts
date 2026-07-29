import { Router } from "express";

const WHITESPACE_RE = /\s+/g;
const QUOTE_REQUEST_TIMEOUT_MS = 5_000;

export const quoteProxy = Router().get("/", async (_req, res) => {
	try {
		const r = await fetch("https://favqs.com/api/qotd", {
			headers: { accept: "application/json" },
			signal: AbortSignal.timeout(QUOTE_REQUEST_TIMEOUT_MS)
		});
		if (!r.ok) {
			return res.status(r.status).json({ error: await r.text() });
		}

		// FavQs shape: { qotd_date, quote: { id, body, author, tags, … } }
		const { quote } = await r.json();

		/* Normalize so your Vue code can stay the same (expects an ARRAY) */
		res.json([
			{
				_id: String(quote.id),
				content: quote.body,
				author: quote.author,
				tags: quote.tags || [],
				authorSlug: quote.author.replace(WHITESPACE_RE, "-").toLowerCase(),
				length: quote.body.length,
				dateAdded: new Date().toISOString(),
				dateModified: new Date().toISOString()
			}
		]);
	}
	catch (err) {
		console.error("favqs proxy failed:", err);
		if (err instanceof Error && err.name === "TimeoutError") {
			return res.status(504).json({ error: "Quotes service timed out" });
		}
		res.status(502).json({ error: "Unable to reach quotes service" });
	}
});
