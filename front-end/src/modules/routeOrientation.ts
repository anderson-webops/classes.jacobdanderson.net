import type { RouterScrollBehavior } from "vue-router";

export const routeScrollBehavior: RouterScrollBehavior = (to, from, saved) => {
	if (saved) return { ...saved, behavior: "instant" };
	// Course hashes encode course/module state and are handled by CourseExplorer.
	if (to.hash && (to.path !== "/courses" || to.hash === "#classroom-access"))
		return { el: to.hash, top: 16, behavior: "instant" };
	if (to.path === from.path) return false;
	return { top: 0, left: 0, behavior: "instant" };
};
