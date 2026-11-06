import { parseGitHubResource } from "@/modules/codePreview";

export const physicsLevel2SourceRevision =
	"c4d972f91edb71e7fb9259fcd5df6213d6429401";

export type PhysicsLevel2CodePack = "orbit-model" | "numerical-model";
export type PhysicsLevel2CodeRole = "starter" | "reference";

const sourcePath = "front-end/public/course-assets/physics/code-packs";

export function physicsLevel2SourceUrl(
	pack: PhysicsLevel2CodePack,
	role: PhysicsLevel2CodeRole
) {
	return `https://github.com/anderson-webops/classes.jacobdanderson.net/tree/${physicsLevel2SourceRevision}/${sourcePath}/${pack}/${role}`;
}

export function physicsLevel2CourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "anderson-webops" ||
		resource.repo.toLowerCase() !== "classes.jacobdanderson.net" ||
		resource.ref !== physicsLevel2SourceRevision ||
		resource.mode !== "tree"
	) {
		return null;
	}
	for (const pack of ["orbit-model", "numerical-model"] as const) {
		for (const role of ["starter", "reference"] as const) {
			if (resource.path === `${sourcePath}/${pack}/${role}`)
				return { ...resource, pack, role };
		}
	}
	return null;
}
