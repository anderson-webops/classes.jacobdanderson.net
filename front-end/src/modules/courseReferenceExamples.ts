import recordSource from "@/assets/course-references/Main.java?raw";
import eventSource from "@/assets/course-references/pgzero-events.py?raw";
import melodySource from "@/assets/course-references/pysynth-melody.py?raw";
import layoutSource from "@/assets/course-references/tile_layout.py?raw";

export const courseReferenceExamples = {
	"event-reference": [
		{ name: "main.py", content: eventSource },
		{ name: "tile_layout.py", content: layoutSource },
		{
			name: "README.md",
			content:
				"# Pygame Zero event reference\n\nRun main.py in PyGame mode. Enter starts; left-click scores; R resets. No image or sound assets are needed. The separate tile_layout.py helper demonstrates finite, nonoverlapping placement and is not called by the event demo. Read the course's Events and Safe Placement Reference for the trace and transfer checks.\n"
		}
	],
	"melody-reference": [
		{ name: "main.py", content: melodySource },
		{
			name: "README.md",
			content:
				"# Browser PySynth reference\n\nRun main.py in Python mode. Download course_melody.wav from the generated audio result. At 120 bpm with pause=0 this sequence lasts two seconds, including the rest and final c5. The browser supplies pysynth; native packages can have a different API.\n"
		}
	],
	"record-reference": [
		{ name: "Main.java", content: recordSource },
		{
			name: "README.md",
			content:
				"# Native Java record reference\n\nThe site IDE imports and saves this example for export. Its Java preview does not provide a full JDK or record compilation. Export the ZIP, extract it and use a native JDK 17 or newer in this folder:\n\n```sh\njavac Main.java\njava Main\n```\n\nExpected output:\n\n```text\nOak: 8\nPine: 5\nCopied tags: [ready]\nShared tags: [ready, changed]\nNegative score rejected\n```\n\nRecords are optional Java enrichment, separate from required AP CSA class-design practice.\n"
		}
	]
};
