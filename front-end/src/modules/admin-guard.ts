// src/modules/admin-guard.ts
import type { UserModule } from "@/types";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

export const install: UserModule = ({ router }) => {
        // Guards should only run in the browser. During SSG/SSR the
        // navigation guard would run without access to the cookie-backed
        // session, so bail out when rendering on the server.
        if (import.meta.env.SSR) return;

	router.beforeEach(async (to) => {
		if (!to.meta.requiresAdmin) return;

		const app = useAppStore();

		// If we don’t already know, ask the server (cookie-session backed)
		if (!app.currentAdmin) {
			try {
				// You already have this endpoint and cookie-session configured
				const { data } = await api.get("/admins/loggedin", {
					withCredentials: true
				});
				if (data.currentAdmin) app.setCurrentAdmin(data.currentAdmin);
			} catch {
				// ignore; not logged in as admin
			}
		}

		// Still not an admin? block & bounce
		if (!app.currentAdmin) {
			// optional: pop your login modal
			app.setLoginBlock?.(true);
			// redirect home (preserve intended path)
			return { path: "/", query: { redirect: to.fullPath } };
		}
	});
};
