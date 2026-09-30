import { defineStore } from "pinia";

export const useAppStore = defineStore("isolated-runtime", {
	state: () => ({
		currentAdmin: null,
		currentUser: null,
		currentTutor: null,
		currentCourseLearner: null
	})
});
