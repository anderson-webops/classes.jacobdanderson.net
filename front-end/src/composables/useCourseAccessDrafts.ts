import type { Ref } from "vue";
import type { CourseStatusMap } from "@/modules/courseAccess";
import type { User } from "@/stores/app";
import { ref, watch } from "vue";
import { cleanCourseStatusMap } from "@/modules/courseAccess";

export function useCourseAccessDrafts(learners: Ref<User[]>) {
	const selections = ref<Record<string, string[]>>({});
	const statuses = ref<Record<string, CourseStatusMap>>({});
	function reset(userId: string) {
		const learner = learners.value.find(user => user._id === userId);
		if (!learner) return;
		selections.value[userId] = [...(learner.courseAccess ?? [])];
		statuses.value[userId] = cleanCourseStatusMap(
			selections.value[userId],
			learner.courseStatus
		);
	}
	watch(
		learners,
		value => {
			selections.value = {};
			statuses.value = {};
			for (const learner of value) reset(learner._id);
		},
		{ immediate: true }
	);
	function toggle(userId: string, courseId: string, checked: boolean) {
		if (!learners.value.some(user => user._id === userId)) return;
		const next = new Set(selections.value[userId] ?? []);
		if (checked) next.add(courseId);
		else next.delete(courseId);
		selections.value[userId] = [...next];
		statuses.value[userId] = cleanCourseStatusMap(
			[...next],
			statuses.value[userId]
		);
	}
	function setStatus(userId: string, courseId: string, status: string) {
		if (!selections.value[userId]?.includes(courseId)) return;
		statuses.value[userId] = cleanCourseStatusMap(
			selections.value[userId],
			{
				...statuses.value[userId],
				[courseId]: status
			}
		);
	}
	return { selections, statuses, reset, toggle, setStatus };
}
