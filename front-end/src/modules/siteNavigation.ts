export const classMeetingUrl = "https://us06web.zoom.us/j/2543520025";
export const siteLabels = {
	courses: "Courses",
	ide: "IDE",
	graphing: "Graphing",
	booking: "Book a Class",
	join: "Join class",
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
