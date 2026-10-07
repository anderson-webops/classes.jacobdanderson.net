<script setup lang="ts">
import type { CourseStatusMap } from "@/modules/courseAccess";
import type { CourseSummary } from "@/stores/courses/types";
import { computed } from "vue";
import { groupCoursesByLearnerStatus } from "@/modules/courseAccess";

const props = defineProps<{
	courses: CourseSummary[];
	selected: string[];
	statuses: CourseStatusMap;
	studentName: string;
	studentId: string;
	editable?: boolean;
	allowed?: Set<string>;
}>();
const emit = defineEmits<{
	toggle: [courseId: string, checked: boolean];
	status: [courseId: string, value: string];
}>();
const groups = computed(() =>
	groupCoursesByLearnerStatus(
		props.courses,
		{
			courseAccess: props.selected,
			courseStatus: props.statuses
		},
		{ includeOther: props.editable }
	)
);
</script>

<template>
	<div class="learner-course-access">
		<p v-if="!groups.length">No courses assigned.</p>
		<section v-for="group in groups" :key="group.key">
			<h3>{{ group.label }}</h3>
			<ul>
				<li v-for="course in group.courses" :key="course.id">
					<template v-if="editable">
						<label>
							<input
								type="checkbox"
								:checked="selected.includes(course.id)"
								:disabled="allowed && !allowed.has(course.id)"
								@change="
									emit(
										'toggle',
										course.id,
										($event.target as HTMLInputElement)
											.checked
									)
								"
							/>
							<span>{{ course.name }}</span>
						</label>
						<select
							v-if="selected.includes(course.id)"
							:value="statuses[course.id] ?? 'current'"
							:disabled="allowed && !allowed.has(course.id)"
							:aria-label="`Set ${course.name} status for ${studentName}`"
							@change="
								emit(
									'status',
									course.id,
									($event.target as HTMLSelectElement).value
								)
							"
						>
							<option value="current">Current</option>
							<option value="past">Past</option>
							<option value="available">Available</option>
						</select>
					</template>
					<RouterLink
						v-else
						:to="{
							path: '/courses',
							query: { learner: studentId },
							hash: `#${course.id}`
						}"
						>{{ course.name }}</RouterLink
					>
				</li>
			</ul>
		</section>
	</div>
</template>

<style scoped>
.learner-course-access {
	display: grid;
	gap: 1rem;
	min-width: 0;
}
.learner-course-access section {
	margin: 0;
}
.learner-course-access h3 {
	font-size: 1rem;
	font-weight: 600;
	margin: 0 0 0.5rem;
	color: var(--color-ink-soft);
}
.learner-course-access ul {
	list-style: none;
	display: grid;
	gap: 0.25rem;
	padding: 0;
	margin: 0;
}
.learner-course-access li {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem 1rem;
	padding: 0.45rem 0;
	border-bottom: 1px solid var(--color-border);
}
.learner-course-access label {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	margin: 0;
	flex: 1 1 18rem;
	min-width: 0;
	font-weight: 400;
}
.learner-course-access input {
	flex: 0 0 auto;
	accent-color: var(--color-accent);
}
.learner-course-access a,
.learner-course-access span {
	overflow-wrap: anywhere;
}
.learner-course-access select {
	width: auto;
	max-width: 100%;
	padding: 0.35rem 0.6rem;
}
</style>
