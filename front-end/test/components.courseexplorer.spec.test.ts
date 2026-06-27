import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { api } from "@/api";
import { resetCourseAssetPreviewCache } from "@/modules/courseAssetPreview";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import {
	pendingStaticMediaNotice,
	staticMediaUrl
} from "@/stores/courses/staticMedia";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn(),
		put: vi.fn()
	}
}));

function installLocalStorageStub() {
	const values = new Map<string, string>();

	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			clear: () => values.clear(),
			getItem: (key: string) => values.get(key) ?? null,
			removeItem: (key: string) => values.delete(key),
			setItem: (key: string, value: string) => {
				values.set(key, value);
			}
		}
	});
}

describe("CourseExplorer.vue", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		resetCourseAssetPreviewCache();
		vi.useRealTimers();
		installLocalStorageStub();
		window.localStorage.clear();
		window.history.replaceState({}, "", "/courses");
	});

	afterEach(() => {
		vi.useRealTimers();
		window.localStorage.clear();
		window.history.replaceState({}, "", "/courses");
		vi.unstubAllGlobals();
	});

	it("renders course stats for an assigned learner without throwing", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const course = await coursesStore.loadCourseById(assignedCourse.id);
		const firstModule = course?.modules[0];
		const firstItem = firstModule?.curriculum[0];

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress:
				firstModule && firstItem
					? [
							{
								courseId: assignedCourse.id,
								completedModuleIds: [firstModule.id],
								completedItemIds: [firstItem.id]
							}
						]
					: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Current course");
		});
		expect(wrapper.text()).toContain(assignedCourse.name);
		expect(wrapper.text()).toContain("Core lessons");
		expect(wrapper.text()).toContain("Projects");
		expect(wrapper.text()).toContain("Done");
		expect(wrapper.text()).toContain("Complete");
	});

	it("links Python-family courses to the integrated Python IDE", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const pythonCourse = coursesStore.courses.find(
			course => course.id === "python-level-1"
		);

		if (!pythonCourse) throw new Error("Expected Python Level 1 course.");

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: pythonCourse.id,
			name: pythonCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use Turtle to draw with coordinates.",
							id: "python-turtle-lesson",
							title: "Turtle Coordinates"
						}
					],
					id: "python-module-1",
					supplementalProjects: [],
					title: "Python Turtle"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [pythonCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Open Turtle IDE");
		});

		const link = wrapper
			.findAll("a")
			.find(candidate => candidate.text() === "Open Turtle IDE");
		expect(link?.exists()).toBe(true);
		const href = link?.attributes("href") ?? "";
		const query = new URLSearchParams(href.split("?")[1] ?? "");
		expect(href.startsWith("/python-ide?")).toBe(true);
		expect(query.get("course")).toBe("python-level-1");
		expect(query.get("mode")).toBe("turtle");
	});

	it("links GitHub starter resources to course-tied IDE projects", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const pythonCourse = coursesStore.courses.find(
			course => course.id === "python-level-1"
		);

		if (!pythonCourse) throw new Error("Expected Python Level 1 course.");

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: pythonCourse.id,
			name: pythonCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use the starter project.",
							id: "turtle-coordinates",
							projectLink:
								"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Coordinates/starter",
							title: "Turtle Coordinates"
						}
					],
					id: "python-module-1",
					supplementalProjects: [],
					title: "Python Turtle"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [pythonCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Start in IDE");
		});

		const link = wrapper
			.findAll("a")
			.find(candidate => candidate.text().includes("Start in IDE"));
		expect(link?.exists()).toBe(true);
		const href = link?.attributes("href") ?? "";
		const query = new URLSearchParams(href.split("?")[1] ?? "");
		expect(href.startsWith("/python-ide?")).toBe(true);
		expect(query.get("course")).toBe("python-level-1");
		expect(query.get("mode")).toBe("turtle");
		expect(query.get("projectKey")).toBe(
			"python-level-1:turtle-coordinates:starter"
		);
		expect(query.get("starterUrl")).toBe(
			"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Coordinates/starter"
		);
		expect(query.get("starterTitle")).toBe("Turtle Coordinates");
		expect(query.get("starterLabel")).toBe("Starter project");
	});

	it("marks PyGame course-level IDE links as course starters", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const pygamesCourse = coursesStore.courses.find(
			course => course.id === "pygames"
		);

		if (!pygamesCourse) throw new Error("Expected PyGames course.");

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: pygamesCourse.id,
			name: pygamesCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Create a PyGame Zero window.",
							id: "pgzero-window",
							title: "Window setup"
						}
					],
					id: "pygames-module-1",
					supplementalProjects: [],
					title: "PyGame Zero"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [pygamesCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Open PyGame Zero IDE");
		});

		const link = wrapper
			.findAll("a")
			.find(candidate => candidate.text() === "Open PyGame Zero IDE");
		expect(link?.exists()).toBe(true);
		const href = link?.attributes("href") ?? "";
		const query = new URLSearchParams(href.split("?")[1] ?? "");
		expect(query.get("course")).toBe("pygames");
		expect(query.get("mode")).toBe("pgzero");
		expect(query.get("starter")).toBe("course");
		expect(query.get("projectKey")).toBe("pygames:course");
		expect(query.get("starterTitle")).toBe("PyGames Starter");
		expect(query.get("starterLabel")).toBe("Course starter");
	});

	it("counts reference appendices separately from core course work", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Core lesson content.",
							id: "lesson-1",
							title: "Core Lesson"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Core Module"
				},
				{
					curriculum: [
						{
							content: "Reference material.",
							id: "appendix-item",
							title: "Reference Item"
						}
					],
					id: "appendix-1",
					kind: "appendix",
					supplementalProjects: [],
					title: "Reference Appendix"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Reference Appendix");
		});

		expect(wrapper.find(".course-stats").text()).toContain("Modules1");
		expect(wrapper.find(".course-stats").text()).toContain("Appendices1");
		expect(wrapper.find(".course-stats").text()).toContain("Core lessons1");
		expect(wrapper.find(".course-stats").text()).toContain("Projects0");
		expect(wrapper.text()).toContain("Choose a section");
		expect(wrapper.text()).toContain("References");
		expect(
			wrapper
				.find('[aria-label="Show appendix 1: Reference Appendix"]')
				.exists()
		).toBe(true);
	});

	it("matches saved progress against stable ID aliases", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValueOnce({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					aliases: ["legacy-module-id"],
					curriculum: [
						{
							aliases: ["legacy-item-id"],
							content: "Read the starter and explain the result.",
							id: "stable-item-id",
							title: "Stable Lesson"
						}
					],
					id: "stable-module-id",
					supplementalProjects: [],
					title: "Stable Module"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [
				{
					courseId: assignedCourse.id,
					completedModuleIds: ["legacy-module-id"],
					completedItemIds: ["legacy-item-id"]
				}
			],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Stable Module");
		});
		expect(wrapper.text()).toContain("Done");
		expect(wrapper.text()).toContain("Complete");
	});

	it("groups learner course dropdown options by current, past, and available status", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const currentCourse = coursesStore.courses.find(
			course => course.id === "python-level-1"
		);
		const pastCourse = coursesStore.courses.find(
			course => course.id === "python-level-2"
		);
		const availableCourse = coursesStore.courses.find(
			course => course.id === "python-level-3"
		);

		if (!currentCourse || !pastCourse || !availableCourse) {
			throw new Error("Expected Python course fixtures.");
		}

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [currentCourse.id, pastCourse.id, availableCourse.id],
			courseStatus: {
				[pastCourse.id]: "past",
				[currentCourse.id]: "current",
				[availableCourse.id]: "available"
			},
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain(currentCourse.name);
		});

		const groups = wrapper.findAll("optgroup");
		expect(groups.map(group => group.attributes("label"))).toEqual([
			"Current courses",
			"Past courses",
			"Other available courses"
		]);
		expect(
			wrapper.findAll("#course-select option").map(option => option.text())
		).toEqual([
			currentCourse.name,
			pastCourse.name,
			availableCourse.name
		]);
		expect(
			wrapper.find<HTMLSelectElement>("#course-select").element.value
		).toBe(currentCourse.id);
		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Current course");
		});
	});

	it("lets staff mark selected learner progress with debounced autosave", async () => {
		vi.useFakeTimers();
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const course = await coursesStore.loadCourseById(assignedCourse.id);
		const firstModule = course?.modules[0];

		if (!firstModule) throw new Error("Expected test course module.");

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [assignedCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-1",
					name: "Learner",
					email: "learner@example.com",
					age: 12,
					state: "GA",
					courseAccess: [assignedCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});
		(api.put as any).mockResolvedValueOnce({ data: {} });

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});

		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Learner · 1 course");
			expect(wrapper.text()).toContain(assignedCourse.name);
		});
		expect(wrapper.text()).not.toContain("learner@example.com");

		await wrapper.find(".progress-toggle.is-module input").setValue(true);
		expect(api.put).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(701);
		await flushPromises();

		expect(api.put).toHaveBeenCalledWith(
			"/users/learner-1/course-progress",
			{
				courseId: assignedCourse.id,
				completedModuleIds: [firstModule.id],
				completedItemIds: []
			}
		);
		expect(wrapper.text()).toContain("Saved");
	});

	it("restores staff learner, course, and module context on deep-link refresh", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const fallbackCourse = coursesStore.courses[0];
		const chemistryCourse = coursesStore.courses.find(
			course => course.id === "intro-to-chemistry"
		);

		if (!chemistryCourse)
			throw new Error("Expected Intro to Chemistry course.");

		const chemistryModuleId = "chm1-chemistry-basics";
		const chemistryItemId =
			"intro-to-chemistry-chm1-chemistry-basics-curriculum-mini-lab-diy-lava-lamp-and-density";
		const hashAnchor = `${chemistryModuleId}-${chemistryItemId}`;

		window.localStorage.setItem(
			"classes:course-explorer:selected-learner",
			"learner-chemistry"
		);
		window.localStorage.setItem(
			"classes:course-explorer:selected-course",
			chemistryCourse.id
		);
		window.localStorage.setItem(
			`classes:course-explorer:active-module:${chemistryCourse.id}`,
			chemistryModuleId
		);
		window.history.replaceState({}, "", `/courses#${hashAnchor}`);

		vi.spyOn(coursesStore, "loadCourseById").mockImplementation(
			async courseId => {
				if (courseId === chemistryCourse.id) {
					return {
						id: chemistryCourse.id,
						name: chemistryCourse.name,
						modules: [
							{
								curriculum: [
									{
										content:
											"Density predicts which liquid sits on top.",
										id: chemistryItemId,
										title: "Mini Lab: DIY Lava Lamp and Density"
									}
								],
								id: chemistryModuleId,
								supplementalProjects: [],
								title: "CHM1 Chemistry Basics"
							}
						]
					};
				}

				return {
					id: fallbackCourse.id,
					name: fallbackCourse.name,
					modules: [
						{
							curriculum: [
								{
									content: "Fallback content.",
									id: "fallback-item",
									title: "Fallback Lesson"
								}
							],
							id: "fallback-module",
							supplementalProjects: [],
							title: "Fallback Module"
						}
					]
				};
			}
		);

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 2,
			coursePermissions: [fallbackCourse.id, chemistryCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-fallback",
					name: "Fallback Learner",
					email: "fallback@example.com",
					age: 12,
					state: "GA",
					courseAccess: [fallbackCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				},
				{
					_id: "learner-chemistry",
					name: "Chemistry Learner",
					email: "chemistry@example.com",
					age: 13,
					state: "GA",
					courseAccess: [chemistryCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(
				wrapper.find<HTMLSelectElement>("#learner-select").element.value
			).toBe("learner-chemistry");
			expect(
				wrapper.find<HTMLSelectElement>("#course-select").element.value
			).toBe(chemistryCourse.id);
			expect(wrapper.text()).toContain(
				"Mini Lab: DIY Lava Lamp and Density"
			);
		});

		expect(wrapper.text()).toContain(
			"Showing module 1: CHM1 Chemistry Basics."
		);
		expect(coursesStore.loadCourseById).toHaveBeenCalledWith(
			chemistryCourse.id
		);
	});

	it("uses a course hash to choose the matching learner when no stored learner exists", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const fallbackCourse = coursesStore.courses[0];
		const chemistryCourse = coursesStore.courses.find(
			course => course.id === "intro-to-chemistry"
		);

		if (!chemistryCourse)
			throw new Error("Expected Intro to Chemistry course.");

		window.history.replaceState(
			{},
			"",
			"/courses#intro-to-chemistry-chm1-chemistry-basics"
		);

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: chemistryCourse.id,
			name: chemistryCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Chemistry basics content.",
							id: "chemistry-item",
							title: "Chemistry Basics Lesson"
						}
					],
					id: "chm1-chemistry-basics",
					supplementalProjects: [],
					title: "CHM1 Chemistry Basics"
				}
			]
		});

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 2,
			coursePermissions: [fallbackCourse.id, chemistryCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-fallback",
					name: "Fallback Learner",
					email: "fallback@example.com",
					age: 12,
					state: "GA",
					courseAccess: [fallbackCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				},
				{
					_id: "learner-chemistry",
					name: "Chemistry Learner",
					email: "chemistry@example.com",
					age: 13,
					state: "GA",
					courseAccess: [chemistryCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(
				wrapper.find<HTMLSelectElement>("#learner-select").element.value
			).toBe("learner-chemistry");
			expect(
				wrapper.find<HTMLSelectElement>("#course-select").element.value
			).toBe(chemistryCourse.id);
			expect(wrapper.text()).toContain("Chemistry Basics Lesson");
		});
	});

	it("renders starter code previews but hides solution previews for learners", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Build from the starter.",
							id: "starter-item",
							projectLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
							solutionLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution",
							title: "Starter Project"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Preview starter code");
		});

		expect(wrapper.text()).not.toContain("Preview solution code");
		expect(wrapper.text()).not.toContain("Solution repo");
	});

	it("renders non-file media resources as links instead of broken images", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const phetLink =
			"https://phet.colorado.edu/en/simulations/filter?subjects=middle-school";
		const youtubeLink = "https://youtu.be/qCuFjXGSVB4";
		const javalabLink = "https://javalab.org/en/dissolution_process_en/";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use a simulation resource.",
							id: "science-resource",
							mediaLink: phetLink,
							title: "Simulation Resource"
						},
						{
							content: "Review a safe demo video.",
							id: "video-resource",
							mediaLink: youtubeLink,
							title: "Video Resource"
						},
						{
							content: "Use an interactive chemistry simulation.",
							id: "interactive-resource",
							mediaLink: javalabLink,
							title: "Interactive Resource"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Simulation collection");
			expect(wrapper.text()).toContain("Demo video");
			expect(wrapper.text()).toContain("Interactive simulation");
		});

		for (const resourceLink of [phetLink, youtubeLink, javalabLink]) {
			const link = wrapper.find(`a[href="${resourceLink}"]`);
			expect(link.exists()).toBe(true);
			expect(wrapper.find(`img[src="${resourceLink}"]`).exists()).toBe(
				false
			);
		}
	});

	it("shows a pending placeholder when hosted static media is unavailable", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const missingStaticVideo =
			"https://static.classes.jacobdanderson.net/original-demo-video.mp4";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Review the project demo.",
							id: "static-demo",
							mediaLink: missingStaticVideo,
							title: "Static Demo"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		const video = wrapper.find("video.item-media-video");
		expect(video.exists()).toBe(true);

		await video.trigger("error");
		await nextTick();

		expect(wrapper.find("video.item-media-video").exists()).toBe(false);
		expect(wrapper.text()).toContain("Static asset pending");
		expect(wrapper.text()).toContain("original-demo-video.mp4");
		expect(wrapper.text()).toContain("When the file becomes available");
		expect(wrapper.text()).toContain(missingStaticVideo);
		expect(wrapper.find(`a[href="${missingStaticVideo}"]`).exists()).toBe(
			true
		);
	});

	it("reserves known pending static media without first rendering a broken embed", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const pendingStaticImage = staticMediaUrl("biomod1pro1im1.jpg");

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content:
								"Review the reserved body systems source image.",
							id: "known-pending-static-demo",
							mediaLink: pendingStaticImage,
							title: "Known Pending Static Demo"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		expect(wrapper.find("img.item-media-image").exists()).toBe(false);
		expect(wrapper.find("video.item-media-video").exists()).toBe(false);
		expect(wrapper.text()).toContain("Static asset pending");
		expect(wrapper.text()).toContain("biomod1pro1im1.jpg");
		expect(wrapper.text()).toContain("When the file becomes available");
		expect(wrapper.text()).toContain(pendingStaticImage);
		expect(wrapper.find(`a[href="${pendingStaticImage}"]`).exists()).toBe(
			true
		);
	});

	it("reserves source-noted pending static media before manifest updates", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const futureStaticImage = staticMediaUrl(
			"future-original-demo-image.png"
		);

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: [
								"Review the reserved demo image when it becomes available.",
								pendingStaticMediaNotice(
									"future-original-demo-image.png"
								)
							].join("\n\n"),
							id: "source-noted-pending-static-demo",
							mediaLink: futureStaticImage,
							title: "Source-Noted Pending Static Demo"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		expect(wrapper.find("img.item-media-image").exists()).toBe(false);
		expect(wrapper.find("video.item-media-video").exists()).toBe(false);
		expect(wrapper.text()).toContain("Static asset pending");
		expect(wrapper.text()).toContain("future-original-demo-image.png");
		expect(wrapper.text()).toContain(futureStaticImage);
		expect(wrapper.find(`a[href="${futureStaticImage}"]`).exists()).toBe(
			true
		);
	});

	it("surfaces Pre-Calculus A reserved source media through reference search", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const pendingSourceImage = staticMediaUrl("pcta12_pset2_40.png");

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: ["pre-calculus-a"],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Pre-Calculus and Trigonometry A");
		});

		await wrapper.get("#course-search").setValue("pcta12_pset2_40.png");
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Pending Static Assets");
		});
		expect(wrapper.text()).toContain("References");
		expect(wrapper.text()).toContain("Pre-Calculus A Static Placeholders");
		expect(wrapper.text()).toContain("pcta12_pset2_40.png");
		expect(wrapper.text()).toContain("Pending media");
		expect(wrapper.text()).toContain(pendingSourceImage);
		expect(wrapper.find(`a[href="${pendingSourceImage}"]`).exists()).toBe(
			true
		);
	});

	it("surfaces Pre-Calculus B reserved source media through reference search", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const pendingSourceImage = staticMediaUrl("pctb3_pset4_20.png");

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: ["pre-calculus-b"],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Pre-Calculus and Trigonometry B");
		});

		await wrapper.get("#course-search").setValue("pctb3_pset4_20.png");
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Pending Static Assets");
		});
		expect(wrapper.text()).toContain("References");
		expect(wrapper.text()).toContain("Pre-Calculus B Static Placeholders");
		expect(wrapper.text()).toContain("pctb3_pset4_20.png");
		expect(wrapper.text()).toContain("Pending media");
		expect(wrapper.text()).toContain(pendingSourceImage);
		expect(wrapper.find(`a[href="${pendingSourceImage}"]`).exists()).toBe(
			true
		);
	});

	it("points supplemental pending media to the future class static URL", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const pendingStaticVideo =
			"https://static.classes.jacobdanderson.net/supplemental-demo.mp4";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [],
					id: "module-1",
					supplementalProjects: [
						{
							content: "Review the supplemental project demo.",
							id: "supplemental-static-demo",
							mediaLink: pendingStaticVideo,
							title: "Supplemental Static Demo"
						}
					],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		const video = wrapper.find("video.item-media-video");
		expect(video.exists()).toBe(true);

		await video.trigger("error");
		await nextTick();

		expect(wrapper.find("video.item-media-video").exists()).toBe(false);
		expect(wrapper.text()).toContain("Static asset pending");
		expect(wrapper.text()).toContain("supplemental-demo.mp4");
		expect(wrapper.text()).toContain("class static host");
		expect(wrapper.text()).toContain("When the file becomes available");
		expect(wrapper.text()).toContain(pendingStaticVideo);
		expect(wrapper.find(`a[href="${pendingStaticVideo}"]`).exists()).toBe(
			true
		);
	});

	it("labels science reference links by purpose instead of calling every link a dataset", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const acsLink =
			"https://www.acs.org/education/whatischemistry/periodictable.html";
		const localMaterialLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data";
		const namingCardsLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#nomenclature-practice-cards";
		const modelCardsLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#model-comparison-cards";
		const sourceMapLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#project-reference-index";
		const answerKeyLink =
			"/course-assets/chemistry/chemistry-rubrics-answer-key.md#heating-curve-key";
		const phetLink =
			"https://phet.colorado.edu/en/simulations/build-an-atom";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use chemistry references.",
							datasetLink: acsLink,
							id: "chemistry-resource",
							mediaLink: phetLink,
							title: "Chemistry Resource"
						},
						{
							content: "Use local chemistry materials.",
							datasetLink: localMaterialLink,
							id: "local-chemistry-material",
							solutionLink: answerKeyLink,
							title: "Local Chemistry Material"
						},
						{
							content: "Name chemistry formulas.",
							datasetLink: namingCardsLink,
							id: "naming-cards",
							title: "Naming Cards"
						},
						{
							content: "Compare model strengths and limits.",
							datasetLink: modelCardsLink,
							id: "model-cards",
							title: "Model Cards"
						},
						{
							content: "Use the project reference map.",
							id: "source-map",
							projectLink: sourceMapLink,
							title: "Source Map"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("ACS periodic table");
			expect(wrapper.text()).toContain("Heating curve data");
			expect(wrapper.text()).toContain("Naming cards");
			expect(wrapper.text()).toContain("Model cards");
			expect(wrapper.text()).toContain("Project reference map");
			expect(wrapper.text()).toContain("PhET simulation");
			expect(wrapper.text()).toContain("Course asset");
		});

		for (const localAssetLink of [
			localMaterialLink,
			namingCardsLink,
			modelCardsLink,
			sourceMapLink
		]) {
			const rawAssetLink = wrapper.find(
				`a.resource-link[href="${localAssetLink}"]`
			);
			expect(rawAssetLink.exists()).toBe(false);
		}
		expect(wrapper.html()).toContain(
			"/course-resource?asset=%2Fcourse-assets%2Fchemistry%2Fchemistry-materials-pack.md%23heating-curve-data"
		);

		expect(wrapper.text()).not.toContain("Rubric / answer key");
		expect(wrapper.text()).not.toContain("Project link");
		expect(wrapper.text()).not.toContain("Dataset");
	});

	it("labels local non-chemistry course assets by purpose instead of as datasets", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Use the course pacing guide.",
							datasetLink:
								"/course-assets/apcs/apcs-pacing-tracks.md",
							id: "apcs-track-guide",
							title: "Track Guide"
						},
						{
							content: "Use a local support handout.",
							datasetLink:
								"/course-assets/examples/support-handout.md",
							id: "local-support-handout",
							title: "Support Handout"
						},
						{
							content: "Use the Turtle scoring guide.",
							datasetLink:
								"/course-assets/python/turtle-project-reference.md#score-turtle-pattern",
							id: "turtle-score-guide",
							title: "Turtle Score Guide"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Track guide");
			expect(wrapper.text()).toContain("Score turtle guide");
			expect(wrapper.text()).toContain("Course asset");
		});

		expect(wrapper.text()).toContain("View Track guide");
		expect(wrapper.text()).toContain("View Score turtle guide");
		expect(wrapper.text()).toContain("View Course asset");
		expect(wrapper.text()).not.toContain("Dataset");
		expect(
			wrapper.find('a.resource-link.is-asset[href*="apcs-pacing-tracks"]')
				.exists()
		).toBe(true);
		expect(wrapper.find("a.resource-link.is-dataset").exists()).toBe(
			false
		);
	});

	it("renders local course asset fragments inside the course viewer", async () => {
		const fetcher = vi.fn(async () => ({
			ok: true,
			text: async () =>
				[
					"# Intro to Chemistry Remote Materials Pack",
					"",
					"## Measurement Tables and Unit Conversions",
					"",
					"Measurement text that should not appear in the section preview.",
					"",
					"## Heating Curve Data",
					"",
					"Flat regions can still involve energy transfer.",
					"",
					"| Sample | Temperature behavior | Evidence note |",
					"| --- | --- | --- |",
					"| Ice-water mixture | Stays near 0 C while melting | Energy changes phase before temperature rises |",
					"",
					"## Capstone Evidence Seeds",
					"",
					"Capstone text that should not appear."
				].join("\n")
		})) as any;
		vi.stubGlobal("fetch", fetcher);

		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const materialLink =
			"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content: "Compare local chemistry data.",
							datasetLink: materialLink,
							id: "chemistry-material",
							solutionLink:
								"/course-assets/chemistry/chemistry-rubrics-answer-key.md#heating-curve-key",
							title: "Chemistry Material"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("View Heating curve data");
		});

		expect(wrapper.text()).not.toContain("Rubric / answer key");
		expect(
			wrapper.html().indexOf("Compare local chemistry data.")
		).toBeLessThan(wrapper.html().indexOf("View Heating curve data"));

		await wrapper.find(".course-asset-preview-toggle").trigger("click");
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Course resource section");
			expect(wrapper.text()).toContain("Heating Curve Data");
			expect(wrapper.text()).toContain(
				"Flat regions can still involve energy transfer."
			);
			expect(wrapper.find(".course-asset-preview-scrollbox").exists()).toBe(
				true
			);
			expect(wrapper.find(".markdown-table-scroll").exists()).toBe(true);
		});

		const fullResourceLink = wrapper.find(
			".course-asset-preview-open-link"
		);
		expect(fullResourceLink.attributes("href")).toContain(
			"/course-resource?asset=%2Fcourse-assets%2Fchemistry%2Fchemistry-materials-pack.md%23heating-curve-data"
		);
		expect(fullResourceLink.attributes("href")).not.toBe(materialLink);

		expect(fetcher).toHaveBeenCalledWith(
			"/course-assets/chemistry/chemistry-materials-pack.md"
		);
		expect(wrapper.text()).not.toContain(
			"Measurement text that should not appear"
		);
		expect(wrapper.text()).not.toContain(
			"Capstone text that should not appear"
		);
	});

	it("renders solution code preview controls for staff course context", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content:
								"Compare the solution after attempting the starter.",
							id: "starter-item",
							projectLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
							solutionLink:
								"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution",
							title: "Starter Project"
						},
						{
							content:
								"Compare local chemistry data against the rubric.",
							datasetLink:
								"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data",
							id: "chemistry-material",
							solutionLink:
								"/course-assets/chemistry/chemistry-rubrics-answer-key.md#heating-curve-key",
							title: "Chemistry Material"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [assignedCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-1",
					name: "Learner",
					email: "learner@example.com",
					age: 12,
					state: "GA",
					courseAccess: [assignedCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Preview code");
		});

		expect(wrapper.text()).toContain("Solution repo");
		expect(wrapper.text()).toContain("Heating curve data");
		expect(wrapper.text()).toContain("Rubric / answer key");
		expect(wrapper.text()).toContain("Course asset");
		expect(wrapper.html()).toContain(
			"chemistry-rubrics-answer-key.md%23heating-curve-key&amp;label=Rubric+%2F+answer+key"
		);
		expect(wrapper.html()).not.toContain(
			"chemistry-rubrics-answer-key.md%23heating-curve-key&amp;label=Course+asset"
		);
	});

	it("does not show a staff solution button for equivalent project and solution URLs", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content:
								"Use the shared graphics source as a reference build.",
							id: "shared-graphics-source",
							projectLink:
								"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow/",
							solutionLink:
								"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow",
							title: "Shared Graphics Source"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [assignedCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-1",
					name: "Learner",
					email: "learner@example.com",
					age: 12,
					state: "GA",
					courseAccess: [assignedCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Project repo");
		});

		expect(wrapper.text()).not.toContain("Solution repo");
		expect(wrapper.findAll(".resource-link.is-project")).toHaveLength(1);
		expect(wrapper.findAll(".resource-link.is-solution")).toHaveLength(0);
	});

	it("keeps repository-root resources from posing as starter or solution links", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse =
			coursesStore.courses.find(course => course.id === "pygames") ??
			coursesStore.courses[0];
		const rootUrl =
			"https://github.com/instruction-material/PyGames/tree/main";
		const usacoRootUrl =
			"https://github.com/instruction-material/USACO-Bronze/tree/main";
		const starterUrl =
			"https://github.com/instruction-material/PyGames/tree/main/PG-01-pyg0-setup-editors-and-asset-workflow-supplemental-2/starter";
		const solutionUrl =
			"https://github.com/instruction-material/PyGames/tree/main/PG-01-pyg0-setup-editors-and-asset-workflow-supplemental-2/solution";

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValue({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					curriculum: [
						{
							content:
								"This item has only the broad repository root and should not show a resource action.",
							id: "broad-pygame-root",
							projectLink: rootUrl,
							solutionLink: rootUrl,
							title: "Broad PyGame Root"
						},
						{
							content:
								"This reference archive intentionally points to the full repo.",
							id: "pygame-reference-archive",
							projectLink: rootUrl,
							title: "Reference Archive: PyGame Workspace"
						},
						{
							content:
								"Browse the full Bronze repo bank when the curated course spine is not enough practice.",
							id: "usaco-problem-bank",
							projectLink: usacoRootUrl,
							title: "Problem Bank: Full Bronze Repo"
						},
						{
							content:
								"This item points to a concrete starter and solution folder.",
							id: "specific-pygame-folder",
							projectLink: starterUrl,
							solutionLink: solutionUrl,
							title: "Specific PyGame Starter"
						}
					],
					id: "module-1",
					supplementalProjects: [],
					title: "Module 1"
				}
			]
		});

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [assignedCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-1",
					name: "Learner",
					email: "learner@example.com",
					age: 12,
					state: "GA",
					courseAccess: [assignedCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Broad PyGame Root");
			expect(wrapper.text()).toContain(
				"Reference Archive: PyGame Workspace"
			);
			expect(wrapper.text()).toContain("Problem Bank: Full Bronze Repo");
			expect(wrapper.text()).toContain("Specific PyGame Starter");
		});

		expect(
			wrapper.find(`a.resource-link.is-project[href="${rootUrl}"]`).exists()
		).toBe(false);
		expect(
			wrapper.find(`a.resource-link.is-solution[href="${rootUrl}"]`).exists()
		).toBe(false);
		expect(
			wrapper.find(`a.resource-link.is-reference[href="${rootUrl}"]`).exists()
		).toBe(true);
		expect(
			wrapper
				.find(`a.resource-link.is-reference[href="${usacoRootUrl}"]`)
				.exists()
		).toBe(true);
		expect(
			wrapper
				.find(`a.resource-link.is-reference[href="${rootUrl}"]`)
				.text()
		).toContain(
			"Source archive"
		);
		expect(
			wrapper
				.find(`a.resource-link.is-reference[href="${usacoRootUrl}"]`)
				.text()
		).toContain("Problem bank");
		expect(
			wrapper.find(`a.resource-link.is-project[href="${starterUrl}"]`).exists()
		).toBe(true);
		expect(
			wrapper
				.find(`a.resource-link.is-solution[href="${solutionUrl}"]`)
				.exists()
		).toBe(true);
		expect(wrapper.findAll(".resource-link.is-project")).toHaveLength(1);
		expect(wrapper.findAll(".resource-link.is-solution")).toHaveLength(1);
		expect(wrapper.findAll(".resource-link.is-reference")).toHaveLength(2);
	});
});
