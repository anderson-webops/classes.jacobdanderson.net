import type { ICourseAccessCode } from "../types/entities/ICourseAccessCode.js";
import { createHash, randomBytes } from "node:crypto";
import { Types } from "mongoose";
import { Admin } from "../models/schemas/Admin.js";
import { CourseAccessCode } from "../models/schemas/CourseAccessCode.js";
import { Tutor } from "../models/schemas/Tutor.js";

const COURSE_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const COURSE_CODE_LENGTH = 12;
const COURSE_CODE_RE = /^[2-9A-HJ-NP-Z]{12}$/;
const COURSE_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const USERNAME_RE = /^[A-Z0-9][\w .-]{1,39}$/i;
const USERNAME_WHITESPACE_RE = /\s+/g;

export function createCourseAccessCodeValue() {
	const bytes = randomBytes(COURSE_CODE_LENGTH);
	const characters = Array.from(
		bytes,
		byte => COURSE_CODE_ALPHABET[byte % COURSE_CODE_ALPHABET.length]
	);
	const compact = characters.join("");
	return compact.match(/.{1,4}/g)?.join("-") ?? compact;
}

export function normalizeCourseAccessCode(value: unknown) {
	if (typeof value !== "string") return null;
	const compact = value.toUpperCase().replaceAll(/[\s-]/g, "");
	return COURSE_CODE_RE.test(compact) ? compact : null;
}

export function hashCourseAccessCode(compactCode: string) {
	return createHash("sha256").update(compactCode).digest("hex");
}

export function courseAccessCodeHint(compactCode: string) {
	return compactCode.slice(-4);
}

export function normalizeCourseID(value: unknown) {
	if (typeof value !== "string") return null;
	const courseID = value.trim().toLowerCase();
	return courseID.length <= 120 && COURSE_ID_RE.test(courseID)
		? courseID
		: null;
}

export function normalizeCourseCodeUsername(value: unknown) {
	if (typeof value !== "string") return null;
	const username = value.normalize("NFKC").replace(USERNAME_WHITESPACE_RE, " ").trim();
	if (!USERNAME_RE.test(username)) return null;
	return {
		username,
		usernameKey: username.toLowerCase()
	};
}

export async function courseAccessCodeCreatorIsAuthorized(
	code: Pick<ICourseAccessCode, "createdBy" | "createdByRole" | "courseID">
) {
	if (code.createdByRole === "admin") {
		return !!(await Admin.exists({ _id: code.createdBy }));
	}

	return !!(await Tutor.exists({
		_id: code.createdBy,
		coursePermissions: code.courseID
	}));
}

export async function findUsableCourseAccessCodeByHash(codeHash: string) {
	const code = await CourseAccessCode.findOne({
		active: true,
		codeHash
	}).select("+codeHash");
	if (!code || !(await courseAccessCodeCreatorIsAuthorized(code))) return null;
	return code;
}

export async function findUsableCourseAccessCodeByID(value: unknown) {
	if (typeof value !== "string" || !Types.ObjectId.isValid(value)) return null;
	const code = await CourseAccessCode.findOne({
		_id: new Types.ObjectId(value),
		active: true
	});
	if (!code || !(await courseAccessCodeCreatorIsAuthorized(code))) return null;
	return code;
}
