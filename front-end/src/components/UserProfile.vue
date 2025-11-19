<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import ProfileFields from "@/components/ProfileFields.vue";
import SecuritySettings from "@/components/SecuritySettings.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { currentUser } = storeToRefs(app);
const deleteMe = useDeleteAccount("user");
const { editing, toggle, save } = useEditable("user");
const cardActive = ref(false);

const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "age", label: "Age" },
	{ key: "state", label: "State" }
];

const assignedTutorNames = computed(() => {
	const user = currentUser.value;
	if (!user?.tutors?.length) return [] as string[];
	return user.tutors
		.map(t =>
			typeof t === "string"
				? (app.tutors.find(entry => entry._id === t)?.name ?? null)
				: t.name
		)
		.filter((name): name is string => !!name);
});

function activateCard() {
	cardActive.value = true;
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<div
			v-if="currentUser"
			class="tutorList mt-2 clickable-card"
			@click="activateCard"
		>
			<br />
			<ul>
				<li><h4>User</h4></li>

				<ProfileFields
					:editing="editing"
					:entity="currentUser"
					:fields="fields"
				/>
			</ul>
			<p class="assigned-tutors">
				<strong
					>Assigned tutor{{
						assignedTutorNames.length === 1 ? "" : "s"
					}}:</strong
				>
				{{
					assignedTutorNames.length
						? assignedTutorNames.join(", ")
						: "No tutor assigned yet"
				}}
			</p>
			<br />

			<div v-if="cardActive" class="card-actions">
				<button
					class="btn-danger btn"
					type="button"
					@click.stop="deleteMe(currentUser!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					type="button"
					@click.stop="editing ? save(currentUser) : toggle()"
				>
					{{ editing ? "Save" : "Edit" }}
				</button>
			</div>

			<SecuritySettings
				v-if="cardActive"
				:email="currentUser.email"
				:entity-id="currentUser._id"
				role="user"
			/>
		</div>
	</section>
</template>

<style scoped>
ul {
	list-style-type: none;
	display: flex;
	flex-direction: column;
}

ul p {
	display: inline;
}

div.tutorList,
li {
	align-self: center;
}

.hidden {
	display: none;
}

div.tutorList {
	outline: black solid 1px;
	padding-bottom: 1%;
	width: 35%;
	margin: auto;
}

@media (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.error {
	color: red;
	margin-top: 10px;
}

.clickable-card {
	cursor: pointer;
}

.card-actions {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
	flex-wrap: wrap;
}

.assigned-tutors {
	margin: 0 auto;
	width: 90%;
	text-align: left;
}
</style>
