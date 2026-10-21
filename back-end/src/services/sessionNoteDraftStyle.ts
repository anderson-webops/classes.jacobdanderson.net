import { Buffer } from "node:buffer";
import { open } from "node:fs/promises";
import { z } from "zod";

export const SESSION_NOTE_DRAFT_STYLE = [
	"Write an editable session-note email body in Jacob's natural teaching voice: clear, friendly, specific and encouraging without exaggeration.",
	"Analyze the actual transcript, not a Zoom AI summary. Describe learning and demonstrated results rather than a chronological transcript recap.",
	"Distinguish discussing, introducing, attempting, completing and independently demonstrating a skill. Preserve qualifications such as worked in our tests instead of claiming mastery.",
	"Use these Markdown sections only when supported: **Homework Check**: for actual prior homework reviewed; **In Class**: for the main work, concepts, difficulties and results; **Homework**: for explicitly assigned work.",
	"Keep the colon outside each bold label. Bold project names immediately before the word project, for example **Tic Tac Toe** project.",
	"Homework accuracy takes priority over completeness: distinguish explicit assignments from brainstorming, optional challenges and unfinished classwork. Unfinished work alone is not homework. Saying no homework was assigned also requires explicit evidence.",
	"Omit unsupported or irrelevant sections. Do not put transcript does not document statements or missing-evidence commentary into the email; use the separate instructor-only review warnings.",
	"Use natural we for shared work and the approved audience preference for you versus the student's name. Do not force every sentence into one grammatical perspective.",
	"Preserve useful technical explanations, terminology, code identifiers and project names without listing every troubleshooting step. Make assignments concrete without inventing solutions, hints or resources. Keep optional work explicitly optional.",
	"When relevant, add a concise **Follow-up**: section for resources promised, questions to investigate and outstanding instructor obligations. Do not assume these are still outstanding if they could have been completed outside the transcript.",
	"Prefer coherent paragraphs and use bullets only for genuinely distinct tasks. Praise should identify something concrete. About 100 to 200 words is a tendency, not a quota; do not pad or omit important supported detail to hit it.",
	"The markdown field contains only the email body, without headers, an invented greeting or signature, an enclosing code block, or claims it was saved or sent. Do not use em dashes."
].join("\n");

export const approvedNotePreferences = z.object({
	approved: z.literal(true),
	audience: z.enum(["student", "family"]),
	format: z.enum(["session", "overall_update"]).default("session"),
	homeworkCheck: z.enum(["when_reviewed", "omit"]).default("when_reviewed"),
	examples: z.array(z.string().trim().min(1).max(2500)).min(2).max(3).optional()
}).strict();

const referenceFile = z.object({
	schemaVersion: z.literal(1),
	students: z.record(z.string().regex(/^[a-f\d]{24}$/), approvedNotePreferences)
		.refine(students => Object.keys(students).length <= 200)
}).strict();

export async function readApprovedNotePreferences(path: string, studentId: string) {
	if (!path) return undefined;
	const handle = await open(path, "r");
	try {
		const maxBytes = 64_000;
		const buffer = Buffer.alloc(maxBytes + 1);
		let size = 0;
		while (size < buffer.length) {
			const { bytesRead } = await handle.read(buffer, size, buffer.length - size, size);
			if (!bytesRead) break;
			size += bytesRead;
		}
		if (size > maxBytes) throw new Error("Invalid note references");
		const parsed = referenceFile.parse(JSON.parse(buffer.subarray(0, size).toString("utf8")));
		return parsed.students[studentId.toLowerCase()];
	}
	finally { await handle.close(); }
}

export function sessionNoteStudentFormat(preferences?: z.infer<typeof approvedNotePreferences>) {
	return [
		preferences?.audience === "student"
			? "Address this student primarily in second person (you/your), with natural we for shared work."
			: "Write primarily in third person for the student and family, with natural we for shared work.",
		preferences?.homeworkCheck === "omit" ? "For this student, omit Homework Check entirely." : "Include Homework Check only when prior homework was actually reviewed.",
		preferences?.format === "overall_update"
			? "Use **Overall Update**: and group related concepts by topic. This request covers only this student's selected session. Do not claim a cumulative multi-session update, combine students, erase earlier information or reset a reporting period. Earlier updates are unavailable here."
			: "Use the supported session sections; omit unsupported sections."
	].join("\n");
}
