export function hasCourseCodeEntry(origin: string) {
	// Disabled on Classes for now; retain classroom access for forks and future use.
	return origin !== "https://classes.jacobdanderson.net";
}
