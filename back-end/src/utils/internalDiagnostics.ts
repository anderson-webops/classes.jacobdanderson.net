import type { Request } from "express";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

function equalSecrets(provided: string, expected: string) {
	const providedBuffer = Buffer.from(provided);
	const expectedBuffer = Buffer.from(expected);
	return providedBuffer.length === expectedBuffer.length
		&& timingSafeEqual(providedBuffer, expectedBuffer);
}

export function internalDiagnosticsAuthorized(
	req: Request,
	{
		diagnosticsKey,
		isProduction
	}: {
		diagnosticsKey?: string;
		isProduction: boolean;
	}
) {
	if (!isProduction) return true;
	const providedKey = req.get("x-internal-diagnostics-key");
	return !!diagnosticsKey
		&& !!providedKey
		&& equalSecrets(providedKey, diagnosticsKey);
}
