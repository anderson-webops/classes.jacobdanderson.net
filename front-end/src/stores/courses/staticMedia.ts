export const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";

export const KNOWN_PENDING_STATIC_MEDIA_FILENAMES = [
	"am_12_file_io_with_dictionaries.mp4",
	"biomod1pro1im1.jpg",
	"biomod1pro1im2.jpg",
	"biomod2pro1im1.png",
	"c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png",
	"paa_kickoff_0.png",
	"paa_kickoff_1.png",
	"pab5_0.png",
	"pab14_0.png",
	"pab22_0.png"
] as const;

const knownPendingStaticMedia = new Set<string>(
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES
);

export function staticMediaUrl(filename: string) {
	return `${STATIC_MEDIA_BASE}/${filename}`;
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

export function isKnownPendingStaticMedia(filename: string) {
	return knownPendingStaticMedia.has(filename);
}

export function isKnownPendingStaticMediaUrl(url: string) {
	return (
		isStaticMediaUrl(url) &&
		isKnownPendingStaticMedia(staticMediaFilename(url))
	);
}

export function pendingStaticMediaNotice(filename: string) {
	return `**Pending media:** The original static asset \`${filename}\` is not currently available. Space is reserved for it at ${staticMediaUrl(filename)} so the asset can be added later without changing this course link.`;
}

export function withPendingStaticMediaNotice(
	content: string,
	filename: string
) {
	if (!isKnownPendingStaticMedia(filename)) {
		return content;
	}

	if (content.includes(filename)) {
		return content;
	}

	return `${content}\n\n${pendingStaticMediaNotice(filename)}`;
}
