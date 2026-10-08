import { onBeforeUnmount, onMounted, ref } from "vue";
import { api } from "@/api";

interface DraftSettings {
	siteAvailable: boolean;
	allowed: boolean;
	ready: boolean;
	tutorsEnabled: boolean;
}

export function useSessionNoteDraftSettings() {
	const settings = ref<DraftSettings | null>(null);
	const loading = ref(false);
	const loadError = ref("");
	let disposed = false;
	let canonicalSiteConfirmed = false;

	async function loadSettings() {
		if (loading.value || disposed) return;
		loading.value = true;
		loadError.value = "";
		try {
			const { data } = await api.get<DraftSettings>(
				"/session-notes/drafting/settings"
			);
			if (disposed) return;
			if (
				!data ||
				["siteAvailable", "allowed", "ready", "tutorsEnabled"].some(
					key => typeof data[key as keyof DraftSettings] !== "boolean"
				)
			) {
				throw new TypeError("Invalid drafting settings response");
			}
			canonicalSiteConfirmed = data.siteAvailable;
			settings.value = data;
		} catch {
			if (disposed) return;
			settings.value = null;
			if (
				canonicalSiteConfirmed ||
				globalThis.location?.origin ===
					"https://classes.jacobdanderson.net"
			) {
				loadError.value =
					"AI drafting settings could not be loaded. Your notes are unchanged.";
			}
		} finally {
			if (!disposed) loading.value = false;
		}
	}

	onMounted(loadSettings);
	onBeforeUnmount(() => {
		disposed = true;
	});
	return { settings, loading, loadError, loadSettings };
}
