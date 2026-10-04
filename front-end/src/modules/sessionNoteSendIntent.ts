interface Intent {
	signature: string;
	key: string;
	noteId: string;
}
const STORAGE_KEY = "classes.session-note-send-intents.v2";
async function digest(signature: string) {
	const bytes = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(signature)
	);
	return [...new Uint8Array(bytes)]
		.map(value => value.toString(16).padStart(2, "0"))
		.join("");
}
async function locked<T>(action: () => Promise<T>) {
	if (!navigator.locks) {
		throw new Error(
			"This browser cannot safely coordinate note sending across tabs. Use a browser with Web Locks support."
		);
	}
	return navigator.locks.request(
		"classes-session-note-intent",
		{ mode: "exclusive" },
		action
	);
}
function ledger(storage: Storage, name: string) {
	const raw = storage.getItem(name);
	const entries = raw ? JSON.parse(raw) : {};
	if (!entries || Array.isArray(entries) || typeof entries !== "object")
		throw new Error("Send tracking storage requires review");
	return entries;
}
function requireSpace(entries: object) {
	if (Object.keys(entries).length >= 200) {
		throw new Error(
			"Send tracking history is full. Review existing operations before creating more."
		);
	}
}
// Digest and identifiers only; cross-tab locking covers draft creation and the storage commit.
export async function retainNoteSendIntent(
	signature: string,
	saveDraft: () => Promise<string>,
	storage: Storage = localStorage
): Promise<Intent> {
	const hash = await digest(signature);
	return locked(async () => {
		const entries = ledger(storage, STORAGE_KEY);
		const prior = entries[hash];
		if (prior) {
			if (
				!/^[a-f0-9]{24}$/.test(prior.noteId) ||
				!/^[\w-]{16,128}$/.test(prior.key)
			) {
				throw new Error("Send tracking storage requires review");
			}
			return { ...prior, signature };
		}
		requireSpace(entries);
		const noteId = await saveDraft();
		if (!/^[a-f0-9]{24}$/.test(noteId))
			throw new Error("Invalid saved note reference");
		const key = crypto.randomUUID();
		entries[hash] = { noteId, key };
		storage.setItem(STORAGE_KEY, JSON.stringify(entries));
		return { signature, key, noteId };
	});
}
export async function retainEvidenceActionKey(
	signature: string,
	storage: Storage = localStorage
): Promise<string> {
	const hash = await digest(signature);
	return locked(async () => {
		const name = `${STORAGE_KEY}.actions`;
		const entries = ledger(storage, name);
		if (entries[hash]) {
			if (!/^[\w-]{16,128}$/.test(entries[hash]))
				throw new Error("Send tracking storage requires review");
			return entries[hash];
		}
		requireSpace(entries);
		const key = crypto.randomUUID();
		entries[hash] = key;
		storage.setItem(name, JSON.stringify(entries));
		return key;
	});
}
