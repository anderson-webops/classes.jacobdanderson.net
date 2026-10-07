import type { User } from "@/stores/app";
import { api } from "@/api";

export async function fetchManagedLearners(
	scope: { role: "admin" } | { role: "tutor"; tutorId: string },
	signal?: AbortSignal
): Promise<User[]> {
	const path =
		scope.role === "admin"
			? "/users/all"
			: `/users/oftutor/${scope.tutorId}`;
	const learners = new Map<string, User>();
	const limit = 250;
	for (let offset = 0; offset <= 10_000; offset += limit) {
		const { data } = await api.get<User[]>(path, {
			params: { limit, offset },
			signal
		});
		if (!Array.isArray(data))
			throw new Error("Invalid student list response");
		for (const learner of data) learners.set(learner._id, learner);
		if (data.length < limit) return [...learners.values()];
	}
	throw new Error("Student list exceeds the supported limit");
}
