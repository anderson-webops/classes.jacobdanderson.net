import type { Request, RequestHandler } from "express";
import type { CustomSession } from "../types/session/CustomSession.js";
import { env } from "node:process";
import bodyParser from "body-parser";
import { ipKeyGenerator } from "express-rate-limit";
import { authenticatedSessionIsCurrent } from "../utils/accountSessions.js";

/**
 * A project may contain 12,000,000 UTF-16 code units. JSON can expand one
 * code unit to a six-byte escape, so the parser needs slightly more than
 * 72 MB for the largest valid payload plus file names and metadata.
 */
export const DEFAULT_CODE_IDE_PROJECT_JSON_BODY_LIMIT = "80mb";
export const HEAVY_CODE_IDE_PROJECT_PAYLOAD_THRESHOLD_BYTES = 4 * 1024 * 1024;
export const MAX_CONCURRENT_HEAVY_CODE_IDE_PROJECT_PAYLOADS = 1;
export const MAX_CONCURRENT_HEAVY_CODE_IDE_PROJECT_PAYLOADS_PER_IDENTITY = 1;
export const MAX_CONCURRENT_NORMAL_CODE_IDE_PROJECT_PAYLOADS = 8;
export const MAX_CONCURRENT_NORMAL_CODE_IDE_PROJECT_PAYLOADS_PER_IDENTITY = 2;

interface ProjectPayloadConcurrencyOptions {
	globalLimit?: number;
	heavyThresholdBytes?: number;
	normalGlobalLimit?: number;
	normalPerIdentityLimit?: number;
	perIdentityLimit?: number;
}

export type CodeIdeProjectMutationAuthScope
	= "account" | "managed" | "read-only";

interface ProjectPayloadReservation {
	claim: () => boolean;
	takeOwnership: () => (() => void) | null;
}

const projectPayloadReservations = new WeakMap<
	Request,
	ProjectPayloadReservation
>();

function projectPayloadTransportClosed(
	req: Request,
	res: Parameters<RequestHandler>[1]
): boolean {
	return (
		req.aborted
		|| req.destroyed
		|| res.destroyed
		|| res.writableEnded
	);
}

/** Classify the parsed regex mount, never the attacker-controlled raw target. */
export function codeIdeProjectMutationAuthScope(
	req: Request
): CodeIdeProjectMutationAuthScope {
	if (req.baseUrl.toLowerCase() === "/users/loggedin/python-projects") {
		return "account";
	}
	if (/^\/users\/[^/]+\/python-projects$/i.test(req.baseUrl)) {
		return "managed";
	}
	return "read-only";
}

export function isHeavyCodeIdeProjectPayload(
	req: Request,
	thresholdBytes = HEAVY_CODE_IDE_PROJECT_PAYLOAD_THRESHOLD_BYTES
): boolean {
	const transferEncoding = req.get("transfer-encoding");
	if (transferEncoding) return true;

	const contentEncoding = req.get("content-encoding")?.trim().toLowerCase();
	if (contentEncoding && contentEncoding !== "identity") return true;

	const rawContentLength = req.get("content-length")?.trim();
	if (!rawContentLength || !/^\d+$/.test(rawContentLength)) return true;

	const contentLength = Number(rawContentLength);
	return (
		!Number.isSafeInteger(contentLength)
		|| contentLength > thresholdBytes
	);
}

/**
 * Production authenticates project mutations before admission. Prefer that
 * verified current-role identity; signed-session and normalized network keys
 * remain defensive fallbacks for reusable middleware and isolated fixtures.
 */
export function codeIdeProjectPayloadIdentity(req: Request): string {
	const currentRoleAndID = [
		["admin", req.currentAdmin?._id?.toString()],
		["tutor", req.currentTutor?._id?.toString()],
		["user", req.currentUser?._id?.toString()],
		[
			"course-code-learner",
			req.currentCourseCodeLearner?._id?.toString()
		]
	].find(
		(entry): entry is [string, string] =>
			typeof entry[1] === "string" && entry[1].length > 0
	);
	if (currentRoleAndID) return `${currentRoleAndID[0]}:${currentRoleAndID[1]}`;

	const session = req.session as CustomSession | undefined;
	if (!session || !authenticatedSessionIsCurrent(session)) {
		return `network:${ipKeyGenerator(
			req.ip || req.socket.remoteAddress || "unknown"
		)}`;
	}
	const roleAndID = [
		["admin", session?.adminID],
		["tutor", session?.tutorID],
		["user", session?.userID],
		["course-code-learner", session?.courseCodeLearnerID]
	].find(
		(entry): entry is [string, string] =>
			typeof entry[1] === "string" && entry[1].length > 0
	);

	if (roleAndID) return `${roleAndID[0]}:${roleAndID[1]}`;
	return `network:${ipKeyGenerator(
		req.ip || req.socket.remoteAddress || "unknown"
	)}`;
}

export function createCodeIdeProjectJsonParser(
	limit =
		env.CODE_IDE_PROJECT_BODY_LIMIT
		|| env.PYTHON_IDE_PROJECT_BODY_LIMIT
		|| DEFAULT_CODE_IDE_PROJECT_JSON_BODY_LIMIT
): RequestHandler {
	// Browser project writes are uncompressed. Refusing compression prevents a
	// small request from inflating into a much larger parser allocation.
	return bodyParser.json({ inflate: false, limit });
}

/**
 * Claim a successfully parsed, preauthorized mutation immediately before
 * route dispatch. The transport fallback stays armed so unmatched routes and
 * disconnects before terminal ownership cannot leak the slot.
 */
export const claimCodeIdeProjectPayloadReservation: RequestHandler
	= (req, _res, next) => {
		const reservation = projectPayloadReservations.get(req);
		if (!reservation || reservation.claim()) next();
	};

/**
 * Await the terminal project mutation while it owns the admitted payload slot.
 * The terminal path takes exclusive ownership and removes the fallback before
 * persistence. A request released during parsing/auth cannot mutate later.
 */
export function withCodeIdeProjectPayloadReservation(
	handler: RequestHandler
): RequestHandler {
	return async (req, res, next) => {
		const reservation = projectPayloadReservations.get(req);
		if (!reservation) {
			await handler(req, res, next);
			return;
		}

		const release = reservation.takeOwnership();
		if (!release) return;

		try {
			await handler(req, res, next);
		}
		finally {
			release();
		}
	};
}

/**
 * Admit one heavy body process-wide. Normal autosaves retain a wider tier,
 * while each signed identity remains bounded. Slots stay held through the
 * response because the parsed body remains reachable during validation/write.
 */
export function createCodeIdeProjectPayloadConcurrencyGuard(
	options: ProjectPayloadConcurrencyOptions = {}
): RequestHandler {
	const globalLimit
		= options.globalLimit ?? MAX_CONCURRENT_HEAVY_CODE_IDE_PROJECT_PAYLOADS;
	const heavyThresholdBytes
		= options.heavyThresholdBytes
			?? HEAVY_CODE_IDE_PROJECT_PAYLOAD_THRESHOLD_BYTES;
	const normalGlobalLimit
		= options.normalGlobalLimit
			?? MAX_CONCURRENT_NORMAL_CODE_IDE_PROJECT_PAYLOADS;
	const normalPerIdentityLimit
		= options.normalPerIdentityLimit
			?? MAX_CONCURRENT_NORMAL_CODE_IDE_PROJECT_PAYLOADS_PER_IDENTITY;
	const perIdentityLimit
		= options.perIdentityLimit
			?? MAX_CONCURRENT_HEAVY_CODE_IDE_PROJECT_PAYLOADS_PER_IDENTITY;
	const activeByIdentity = new Map<
		string,
		{ heavy: number; normal: number }
	>();
	let activeHeavyTotal = 0;
	let activeNormalTotal = 0;

	return (req, res, next) => {
		if (projectPayloadTransportClosed(req, res)) return;
		const isHeavy = isHeavyCodeIdeProjectPayload(
			req,
			heavyThresholdBytes
		);
		const identity = codeIdeProjectPayloadIdentity(req);
		const activeForIdentity
			= activeByIdentity.get(identity) ?? { heavy: 0, normal: 0 };
		const rejected = isHeavy
			? activeHeavyTotal >= globalLimit
			|| activeForIdentity.heavy + activeForIdentity.normal
			>= perIdentityLimit
			: activeNormalTotal >= normalGlobalLimit
				|| activeForIdentity.heavy > 0
				|| activeForIdentity.normal >= normalPerIdentityLimit;
		if (rejected) {
			res.setHeader("Retry-After", "1");
			res.status(429).json({
				message: isHeavy
					? "Another large project save is already in progress. Try again shortly."
					: "Too many project saves are already in progress. Try again shortly."
			});
			return;
		}

		if (isHeavy) {
			activeHeavyTotal += 1;
			activeForIdentity.heavy += 1;
		}
		else {
			activeNormalTotal += 1;
			activeForIdentity.normal += 1;
		}
		activeByIdentity.set(identity, activeForIdentity);

		let slotReleased = false;
		const releaseSlot = () => {
			if (slotReleased) return;
			slotReleased = true;
			const current = activeByIdentity.get(identity);
			if (isHeavy) {
				activeHeavyTotal -= 1;
				if (current) current.heavy -= 1;
			}
			else {
				activeNormalTotal -= 1;
				if (current) current.normal -= 1;
			}
			if (!current || current.heavy + current.normal <= 0) {
				activeByIdentity.delete(identity);
			}
			else {
				activeByIdentity.set(identity, current);
			}
		};

		let reservationState: "available" | "claimed" | "owned" | "released"
			= "available";
		const removeFallbackListeners = () => {
			req.removeListener("aborted", releaseBeforeOwnership);
			res.removeListener("close", releaseBeforeOwnership);
			res.removeListener("finish", releaseBeforeOwnership);
		};
		function releaseBeforeOwnership() {
			if (
				reservationState !== "available"
				&& reservationState !== "claimed"
			) {
				return;
			}
			reservationState = "released";
			removeFallbackListeners();
			releaseSlot();
		}
		const reservation: ProjectPayloadReservation = {
			claim: () => {
				if (projectPayloadTransportClosed(req, res)) {
					releaseBeforeOwnership();
					return false;
				}
				if (reservationState !== "available") return false;
				reservationState = "claimed";
				return true;
			},
			takeOwnership: () => {
				if (projectPayloadTransportClosed(req, res)) {
					releaseBeforeOwnership();
					return null;
				}
				if (reservationState !== "claimed") return null;
				reservationState = "owned";
				removeFallbackListeners();
				return () => {
					if (reservationState !== "owned") return;
					reservationState = "released";
					projectPayloadReservations.delete(req);
					releaseSlot();
				};
			}
		};
		projectPayloadReservations.set(req, reservation);
		req.once("aborted", releaseBeforeOwnership);
		res.once("close", releaseBeforeOwnership);
		res.once("finish", releaseBeforeOwnership);
		try {
			next();
		}
		catch (error) {
			releaseBeforeOwnership();
			throw error;
		}
	};
}
