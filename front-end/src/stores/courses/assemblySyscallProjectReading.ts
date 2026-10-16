import openatReading from "../../assets/course-guides/assembly-syscall-openat.md?raw";
import writeReading from "../../assets/course-guides/assembly-syscall-write.md?raw";

export const assemblySyscallWriteReading = [
	"## Required runtime investigation",
	"",
	"After tracing the C function ABI, follow the second boundary into Linux. Complete this write lab and the file-creation lab in this unit; the separate parser project covers argc/argv, argument grammar and numeric range. Each program has its own learner/reference attempt. The runtime library prepares argc and argv before C main runs; main is not the raw ELF process-entry interface. Check argc before indexing argv and use the parser's bounded conversion contract.",
	"",
	"The required route connects register predictions with actual kernel results. Save the untouched result, complete only the named assembly task, run the unchanged contracts, then record normal, error, partial-progress and cleanup observations in trace.md. A passing program and an explained trace are separate completion evidence. The Write Boundary Worksheet reopens this same saved attempt.",
	"",
	writeReading.trim()
].join("\n");

export const assemblySyscallOpenatReading = [
	"## Required file-creation investigation",
	"",
	"Follow the write lab with an operation whose fourth argument changes register between the C and Linux interfaces. This lab is required for the unit's bad-path, permission and raw-error outcomes. Complete its own starter before comparing the separate reference. Keep its saved attempt separate from the write and parser projects.",
	"",
	openatReading.trim()
].join("\n");

export const assemblySyscallWriteTraceReading = [
	"## Write Boundary Worksheet",
	"",
	"Continue the same saved write attempt from Core Project: Linux Syscalls and Partial Writes. This is the explanatory part of that project. Keep the completed routine, driver, contracts and observations together; opening the separate reference does not replace the learner attempt.",
	"",
	"In trace.md, make a prediction before each observation. For the default payload, record RDI as the owned write descriptor, RSI as the source address, RDX as the requested byte count and RAX as syscall number 1 before the boundary. Record the returned RAX value, actual bytes read from the other pipe end, and the independently captured errno sentinel. Instruction and buffer addresses vary between runs; keep the current addresses beside their meanings.",
	"",
	"For descriptor -1, compare the negative raw EBADF value with libc's -1 and positive errno. strace formats the failed operation as -1 EBADF even when the assembly return is a negative kernel code. Its display does not prove that the assembly function wrote errno. Use the driver's immediate captures to explain that distinction.",
	"",
	"For the nonblocking pipe, record its measured capacity C, request 2C bytes, and label the first positive short result. Explain why a full-pipe EAGAIN transfers no bytes, why the source pointer advances by the actual return, and how draining then comparing both byte segments establishes the completed 2C transfer. Retain descriptor closure and ordinary exit evidence.",
	"",
	"Repeat with --changed and both compiler/build profiles described in README.md. Show one rejected wrong-call or preserved-register experiment from an owned copy, restore the correct routine, and connect the failed assertion to its boundary obligation. Passing the contracts alone does not fill in this worksheet. The separate file-creation project follows RCX into R10 and checks file modes and path errors; the parser worksheet remains about argument processing.",
	"",
	"The build instructions and complete source guide remain in this attempt's README.md. Use the course action to reopen it and export the saved code and trace together."
].join("\n");
