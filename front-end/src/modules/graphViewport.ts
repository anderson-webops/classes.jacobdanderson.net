import type { GraphDocument } from "./graphSketcher";

/** Reflow only the interactive view. Downloads and persisted geometry stay unchanged. */
export function graphForViewport(
	document: GraphDocument,
	width: number
): GraphDocument {
	if (!Number.isFinite(width) || width <= 0 || width > 600) return document;
	const canvas = {
		...document.canvas,
		width: Math.max(320, Math.min(document.canvas.width, width)),
		height: Math.max(440, Math.min(document.canvas.height, 560))
	};
	const xScale = canvas.width / document.canvas.width;
	const yScale = canvas.height / document.canvas.height;
	return {
		...document,
		canvas,
		annotations: document.annotations.map(annotation =>
			annotation.coordinateSpace === "canvas"
				? {
						...annotation,
						x: annotation.x * xScale,
						y: annotation.y * yScale,
						x2:
							annotation.x2 === undefined
								? undefined
								: annotation.x2 * xScale,
						y2:
							annotation.y2 === undefined
								? undefined
								: annotation.y2 * yScale
					}
				: annotation
		)
	};
}
