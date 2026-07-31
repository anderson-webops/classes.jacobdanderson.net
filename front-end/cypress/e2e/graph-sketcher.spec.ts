import { zipSync } from "fflate";

const legacyGraph = `<?xml version="1.0" encoding="UTF-8"?>
<document xmlns="http://www.omnigroup.com/namespace/OmniGraphSketcher/v1">
	<graph>
		<vertex id="v1" x="1" y="2" />
	</graph>
</document>`;

context("Graph Sketcher browser workspace", () => {
	it("imports a legacy archive through the bounded worker", () => {
		const archive = zipSync({
			"Project/contents.xml": new TextEncoder().encode(legacyGraph)
		});

		cy.visit("/graph-sketcher");
		cy.get("input[aria-label='Open or import a graph project']")
			.should("be.enabled")
			.selectFile(
				{
					contents: Cypress.Buffer.from(archive),
					fileName: "legacy.ograph",
					mimeType: "application/zip"
				},
				{ force: true }
			);

		cy.contains(
			"Imported legacy.ograph without modifying the original file."
		).should("be.visible");
		cy.get("#canvas-title").should("contain.text", "legacy");
	});
});
