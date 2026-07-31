import type { Request } from "express";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

export const MIN_INTERNAL_DIAGNOSTICS_KEY_BYTES = 32;

export function readInternalDiagnosticsKey(
	value: string | undefined
): string | undefined {
	if (value === undefined || value === "") return undefined;
	if (!value.trim()) {
		throw new TypeError(
			"INTERNAL_DIAGNOSTICS_KEY cannot contain only whitespace"
		);
	}
	if (Buffer.byteLength(value, "utf8") < MIN_INTERNAL_DIAGNOSTICS_KEY_BYTES) {
		throw new TypeError(
			`INTERNAL_DIAGNOSTICS_KEY must be at least ${MIN_INTERNAL_DIAGNOSTICS_KEY_BYTES} UTF-8 bytes when configured`
		);
	}
	return value;
}

function equalSecrets(provided: string, expected: string) {
	const providedBuffer = Buffer.from(provided);
	const expectedBuffer = Buffer.from(expected);
	return providedBuffer.length === expectedBuffer.length
		&& timingSafeEqual(providedBuffer, expectedBuffer);
}

export function internalDiagnosticsAuthorized(
	req: Request,
	{
		diagnosticsKey
	}: {
		diagnosticsKey?: string;
	}
) {
	const providedKey = req.get("x-internal-diagnostics-key");
	return !!diagnosticsKey
		&& !!providedKey
		&& equalSecrets(providedKey, diagnosticsKey);
}
