export class NoteArchiveError extends Error {
	constructor(readonly outcome: "not_appended" | "unconfirmed") {
		super(
			outcome === "not_appended"
				? "archive_nonacceptance"
				: "archive_outcome_ambiguous"
		);
	}
}

export async function confirmedArchiveAppend(actions: {
	connect: () => Promise<unknown>;
	append: () => Promise<unknown>;
	logout: () => Promise<unknown>;
}) {
	let appendStarted = false;
	try {
		await actions.connect();
		appendStarted = true;
		const result = await actions.append();
		if (result === false) throw new NoteArchiveError("not_appended");
		if (!result || typeof result !== "object" || Array.isArray(result)
			|| typeof (result as { path?: unknown }).path !== "string"
			|| !(result as { path: string }).path.length) {
			throw new NoteArchiveError("unconfirmed");
		}
	}
	catch (error) {
		if (error instanceof NoteArchiveError) throw error;
		const status = (error as { responseStatus?: unknown } | null)
			?.responseStatus;
		// Only a pre-APPEND failure or a tagged negative response proves no append.
		throw new NoteArchiveError(
			!appendStarted || status === "NO" || status === "BAD"
				? "not_appended"
				: "unconfirmed"
		);
	}
	finally {
		try {
			await actions.logout();
		}
		catch {}
	}
}
