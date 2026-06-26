export const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";
export const LEGACY_STATIC_MEDIA_BASE = "https://static.junilearning.com";
const STATIC_MEDIA_URL_PATTERN =
	/https:\/\/(?:static\.classes\.jacobdanderson\.net|static\.junilearning\.com)\/[^\s<>"')\]]+/g;
export const PENDING_STATIC_MEDIA_NOTICE_PATTERN =
	/\b(?:pending media|reserved|placeholder|not currently available|class static host)\b/i;

export const KNOWN_PENDING_STATIC_MEDIA_FILENAMES = [
	"am_12_file_io_with_dictionaries.mp4",
	"biomod1pro1im1.jpg",
	"biomod1pro1im2.jpg",
	"biomod2pro1im1.png",
	"c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png",
	"ent3_project2_0.png",
	"ent3_project2_1.png",
	"ent5_project1_0.png",
	"jor2_disact_plotempty.png",
	"leb16_concept1_0.png",
	"mfb10_concept1_0.png",
	"module_project_1_0.png",
	"pf5_concept1_1.png",
	"pf5_concept1_2.png",
	"pf5_concept1_3.png",
	"pf5_concept1_4.png",
	"pf5_concept1_5.png",
	"pf5_concept1_6.png",
	"paa_kickoff_0.png",
	"paa_kickoff_1.png",
	"pab5_0.png",
	"pab14_0.png",
	"pab22_0.png",
	"ted_ed_release.pdf",
	"UB1.png",
	"UB2.png",
	"UB3.png",
	"UB4.png",
	"UB5.png",
	"UB6.png",
	"missionTitle2.png",
	"nextStepTitle.png",
	"wyb1_proj1_plotempty.png"
] as const;

const knownPendingStaticMedia = new Set<string>(
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES
);

export function staticMediaUrl(filename: string) {
	return `${STATIC_MEDIA_BASE}/${filename}`;
}

function trimStaticMediaUrl(url: string) {
	const trimmed = url.replace(/[.,;:!?]+$/g, "");
	return {
		trailing: url.slice(trimmed.length),
		url: trimmed
	};
}

export function staticMediaFilename(url: string) {
	try {
		const pathname = new URL(url).pathname;
		return decodeURIComponent(
			pathname.split("/").filter(Boolean).pop() || pathname || url
		);
	} catch {
		return url;
	}
}

export function isStaticMediaUrl(url: string) {
	try {
		return new URL(url).origin === STATIC_MEDIA_BASE;
	} catch {
		return false;
	}
}

export function isLegacyStaticMediaUrl(url: string) {
	try {
		return new URL(url).origin === LEGACY_STATIC_MEDIA_BASE;
	} catch {
		return false;
	}
}

export function canonicalStaticMediaUrl(url: string) {
	if (isStaticMediaUrl(url)) return url;
	if (isLegacyStaticMediaUrl(url))
		return staticMediaUrl(staticMediaFilename(url));
	return null;
}

export function isKnownPendingStaticMedia(filename: string) {
	return knownPendingStaticMedia.has(filename);
}

export function isKnownPendingStaticMediaUrl(url: string) {
	return (
		!!canonicalStaticMediaUrl(url) &&
		isKnownPendingStaticMedia(staticMediaFilename(url))
	);
}

export function staticMediaUrlsFromText(text: string) {
	return [...text.matchAll(STATIC_MEDIA_URL_PATTERN)]
		.map(match => trimStaticMediaUrl(match[0]).url)
		.map(canonicalStaticMediaUrl)
		.filter((url): url is string => Boolean(url));
}

export function normalizeStaticMediaUrlsInText(text: string) {
	return text.replace(STATIC_MEDIA_URL_PATTERN, rawUrl => {
		const { trailing, url } = trimStaticMediaUrl(rawUrl);
		return `${canonicalStaticMediaUrl(url) ?? url}${trailing}`;
	});
}

export function pendingStaticMediaNotice(filename: string) {
	return `**Pending media:** The original static asset \`${filename}\` is not currently available. Space is reserved for it at ${staticMediaUrl(filename)} so the asset can be added later without changing this course link.`;
}

export function hasPendingStaticMediaNotice(content: string, filename: string) {
	return (
		content.includes(filename) &&
		content.includes(staticMediaUrl(filename)) &&
		PENDING_STATIC_MEDIA_NOTICE_PATTERN.test(content)
	);
}

export function withPendingStaticMediaNotice(
	content: string,
	filename: string
) {
	if (!isKnownPendingStaticMedia(filename)) {
		return content;
	}

	if (hasPendingStaticMediaNotice(content, filename)) {
		return content;
	}

	return `${content}\n\n${pendingStaticMediaNotice(filename)}`;
}
