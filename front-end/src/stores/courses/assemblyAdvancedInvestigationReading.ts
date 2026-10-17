import branchReading from "../../assets/course-guides/assembly-followup-branch-counts.md?raw";
import conditionalReading from "../../assets/course-guides/assembly-followup-conditional.md?raw";
import repeatReading from "../../assets/course-guides/assembly-followup-repeat-scaling.md?raw";
import returnReading from "../../assets/course-guides/assembly-followup-returns.md?raw";
import { assemblyDebugProjectReading } from "./assemblyDebugProjectReading";
import { assemblyPerformanceProjectReading } from "./assemblyPerformanceProjectReading";

export const assemblyConditionalBreakpointReading = `${conditionalReading.trim()}\n\n## Baseline contract and setup\n${
	assemblyDebugProjectReading
}`;
export const assemblyCallerReturnReading = `${returnReading.trim()}\n\n## Baseline contract and setup\n${
	assemblyDebugProjectReading
}`;
export const assemblyBranchCountReading = `${branchReading.trim()}\n\n## Baseline contract and setup\n${
	assemblyPerformanceProjectReading
}`;
export const assemblyRepeatScalingReading = `${repeatReading.trim()}\n\n## Baseline contract and setup\n${
	assemblyPerformanceProjectReading
}`;
