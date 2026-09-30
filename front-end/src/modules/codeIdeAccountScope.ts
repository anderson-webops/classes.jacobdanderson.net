export interface CodeIdeAccountScope {
	readonly ownerKey: string | null;
	readonly signal: AbortSignal;
}

export function codeIdeAccountRequest(
	scope?: CodeIdeAccountScope,
	signal?: AbortSignal
) {
	if (!scope) return signal ? { signal } : {};
	scope.signal.throwIfAborted();
	if (!scope.ownerKey) throw new Error("Sign in to sync this workspace.");
	return {
		headers: { "X-Code-IDE-Owner": scope.ownerKey },
		signal: signal ? AbortSignal.any([scope.signal, signal]) : scope.signal
	};
}
