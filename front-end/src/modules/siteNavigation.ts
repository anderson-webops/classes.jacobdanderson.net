export const classMeetingUrl = "https://us06web.zoom.us/j/2543520025";
export const siteLabels = {
	courses: "Courses",
	ide: "IDE",
	graphing: "Graphing",
	booking: "Schedule Class",
	join: "Join on Zoom",
	account: "Account"
} as const;
export const workspacePaths = [
	"/ide",
	"/graph-sketcher",
	"/courses",
	"/teaching",
	"/admin",
	"/profile"
];
export function isWorkspacePath(path: string) {
	return workspacePaths.some(
		base => path === base || path.startsWith(`${base}/`)
	);
}
