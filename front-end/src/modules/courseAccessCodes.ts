import { api } from "@/api";

export interface CourseAccessCodeSummary {
	_id: string;
	codeHint: string;
	courseID: string;
	label: string;
	createdByRole: "admin" | "tutor";
	createdByName: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CourseCodeLearner {
	_id: string;
	username: string;
	courseID: string;
	courseAccess: string[];
	courseStatus: Record<string, "current">;
	role: "course-code";
	codeLabel?: string;
	createdAt: string;
	lastSeenAt: string;
}

export async function fetchCourseAccessCodes() {
	const { data } = await api.get<{ codes: CourseAccessCodeSummary[] }>(
		"/course-access/codes"
	);
	return data.codes;
}

export async function createCourseAccessCode(payload: {
	courseID: string;
	label?: string;
}) {
	const { data } = await api.post<{
		accessCode: CourseAccessCodeSummary;
		code: string;
	}>("/course-access/codes", payload);
	return data;
}

export async function updateCourseAccessCode(
	codeID: string,
	payload: { active?: boolean; label?: string }
) {
	const { data } = await api.patch<{
		accessCode: CourseAccessCodeSummary;
	}>(`/course-access/codes/${encodeURIComponent(codeID)}`, payload);
	return data.accessCode;
}
