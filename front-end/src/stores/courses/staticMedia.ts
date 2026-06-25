export const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";

export const KNOWN_PENDING_STATIC_MEDIA_FILENAMES = [
	"am_12_file_io_with_dictionaries.mp4",
	"biomod1pro1im1.jpg",
	"biomod1pro1im2.jpg",
	"biomod2pro1im1.png",
	"c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png",
	"paa_kickoff_0.png",
	"paa_kickoff_1.png"
] as const;

const knownPendingStaticMedia = new Set<string>(
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES
);

export function staticMediaUrl(filename: string) {
	return `${STATIC_MEDIA_BASE}/${filename}`;
}

export function isKnownPendingStaticMedia(filename: string) {
	return knownPendingStaticMedia.has(filename);
}

export function pendingStaticMediaNotice(filename: string) {
	return `**Pending media:** The original static asset filename \`${filename}\` is reserved at ${staticMediaUrl(filename)} until that file is available on the class static host.`;
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
