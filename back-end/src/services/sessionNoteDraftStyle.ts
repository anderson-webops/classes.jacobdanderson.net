export const SESSION_NOTE_DRAFT_STYLE = [
	"Analyze the actual transcript, not a Zoom AI summary. Identify accomplishments, concepts taught, difficulties, homework and unfinished work.",
	"Distinguish completed work from attempted, introduced or unfinished work. Preserve important technical terminology and programming concepts.",
	"Use reasonable explanation of concepts without becoming a minute-by-minute account. Keep related ideas together in coherent paragraphs.",
	"Use positive, professional, encouraging language without exaggeration. Frame difficulties constructively and accurately.",
	"Normally write in third person for the student and parents, with these Markdown section labels exactly: **Homework Check**:, **In Class**:, **Homework**:.",
	"Keep the colon outside each bold label. Bold project names immediately before the word project, for example **Tic Tac Toe** project.",
	"Homework must be clear, actionable and supported by the transcript. Distinguish optional suggestions from assigned work. If no assignment is documented, say so rather than inventing one.",
	"If a homework check is not documented, say that the transcript does not document one, rather than guessing completion.",
	"When relevant, add a concise **Follow-up**: section for resources promised, questions to investigate and outstanding instructor obligations. Do not assume these are still outstanding if they could have been completed outside the transcript.",
	"Keep related sentences in the same bullet when bullets are useful. Otherwise prefer concise, coherent paragraphs.",
	"Return raw Markdown for direct insertion in the editor, without an enclosing code block. Do not use em dashes."
].join("\n");

export function sessionNoteStudentFormat(studentName: string) {
	const firstName = studentName.trim().split(/\s+/)[0]?.toLowerCase();
	if (firstName === "devin" || firstName === "jinen") {
		return "For this student, omit Homework Check entirely. Address the student directly in second person. Retain **In Class**: and **Homework**: with the colon outside the bold label.";
	}
	if (firstName === "jayden" || firstName === "abby") {
		return "For this student, use **Overall Update**: instead of a dated, individual-class summary. Group related concepts by topic in coherent paragraphs. Include homework or follow-up only when supported. This request contains only this student's selected transcript, not a complete reporting period or the other student's transcript. Do not claim a cumulative multi-session update, combine students, erase earlier information or reset a reporting period. Earlier updates are unavailable here.";
	}
	return "Use the standard third-person Homework Check, In Class and Homework format.";
}
