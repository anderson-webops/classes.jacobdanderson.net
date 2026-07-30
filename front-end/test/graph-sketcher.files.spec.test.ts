import { zipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { createSampleGraphDocument } from "@/modules/graphSketcher";
import {
	graphDocumentToCsv,
	graphDocumentToSvg,
	importDelimitedGraphData,
	importLegacyGraphSketcherDocument
} from "@/modules/graphSketcherFiles";

const legacyDocument = `<?xml version="1.0" encoding="UTF-8"?>
<document xmlns="http://www.omnigroup.com/namespace/OmniGraphSketcher/v1">
	<graph>
		<canvas w="800" h="500">
			<whitespace left="70" top="40" right="30" bottom="60"/>
		</canvas>
		<axis dimension="x" min="-2" max="8">
			<grid visible="true"/>
			<ticks spacing="2"/>
		</axis>
		<axis dimension="y" min="0" max="20">
			<grid visible="true"/>
		</axis>
		<label id="series-label" owner="line-1">
			<text><p><lit>Imported data</lit></p></text>
		</label>
		<label id="free-label" x="1" y="3">
			<text><p><lit>Default style</lit></p></text>
		</label>
		<vertex id="v1" x="0" y="2" shape="circle" width="7">
			<color r="0.1" g="0.2" b="0.9"/>
		</vertex>
		<vertex id="v2" x="4" y="10" shape="circle" width="7">
			<color r="0.1" g="0.2" b="0.9"/>
		</vertex>
		<line id="line-1" method="curved" dash="dashes">
			<vertices ids="v1 v2"/>
		</line>
	</graph>
</document>`;

function legacyGraphWith(children: string) {
	return `<document xmlns="http://www.omnigroup.com/namespace/OmniGraphSketcher/v1"><graph>${children}</graph></document>`;
}

describe("Graph Sketcher file compatibility", () => {
	it("imports wide and long CSV or spreadsheet data", () => {
		const wide = importDelimitedGraphData(
			"x,Measured,Reference\n0,82,80\n2,66,65\n4,not-a-number,52"
		);
		expect(wide.series.map(series => series.name)).toEqual([
			"Measured",
			"Reference"
		]);
		expect(wide.series[0].points).toEqual([
			{ x: 0, y: 82 },
			{ x: 2, y: 66 }
		]);
		expect(wide.issues).toHaveLength(1);

		const long = importDelimitedGraphData(
			"series\tx\ty\ty_error\tlabel\nTrial A\t0\t3\t0.2\tstart\nTrial A\t1\t5\t0.3\tend\nTrial B\t0\t4\t\t"
		);
		expect(long.series).toHaveLength(2);
		expect(long.series[0].points[0]).toEqual({
			x: 0,
			y: 3,
			yError: 0.2,
			label: "start"
		});
	});

	it("exports portable data and escaped standalone SVG", () => {
		const document = createSampleGraphDocument();
		document.title = `Cooling <script>alert("no")</script>`;
		document.series[0].points[0].label = "quoted, value";

		const csv = graphDocumentToCsv(document);
		const svg = graphDocumentToSvg(document);

		expect(csv).toContain('"quoted, value"');
		expect(svg).toContain("<svg");
		expect(svg).toContain("Cooling &lt;script&gt;");
		expect(svg).not.toContain("<script>");
		expect(svg).toContain(">Measured</text>");
	});

	it("imports original plain and ZIP-wrapped .ograph documents", () => {
		const plain = importLegacyGraphSketcherDocument(
			legacyDocument,
			"Original Graph"
		);
		expect(plain.document.title).toBe("Original Graph");
		expect(plain.document.canvas).toMatchObject({
			width: 800,
			height: 500,
			paddingLeft: 70
		});
		expect(plain.document.xAxis.tickSpacing).toBe(2);
		expect(plain.document.xAxis.logarithmBase).toBe(10);
		expect(plain.document.series[0]).toMatchObject({
			name: "Imported data",
			color: "#1a33e6",
			lineMode: "smooth",
			lineStyle: "dashed",
			strokeWidth: 2
		});
		expect(plain.document.series[0].points).toEqual([
			{ x: 0, y: 2 },
			{ x: 4, y: 10 }
		]);
		expect(plain.document.annotations[0]).toMatchObject({
			text: "Default style",
			fontSize: 14
		});

		const archive = zipSync({
			"Project/contents.xml": new TextEncoder().encode(legacyDocument)
		});
		const zipped = importLegacyGraphSketcherDocument(
			archive,
			"Archived Graph"
		);
		expect(zipped.document.title).toBe("Archived Graph");
		expect(zipped.document.series[0].points).toHaveLength(2);
	});

	it("rejects legacy XML declarations that can expand external content", () => {
		const internalEntity = `<!DOCTYPE document [<!ENTITY classroom "expanded">]>${legacyGraphWith(
			"<label><text><p><lit>&classroom;</lit></p></text></label>"
		)}`;
		const externalEntity = `<!DOCTYPE document [<!ENTITY classroom SYSTEM "https://example.test/student">]>${legacyGraphWith(
			"<label><text><p><lit>&classroom;</lit></p></text></label>"
		)}`;

		expect(() => importLegacyGraphSketcherDocument(internalEntity)).toThrow(
			/DOCTYPE or ENTITY/i
		);
		expect(() => importLegacyGraphSketcherDocument(externalEntity)).toThrow(
			/DOCTYPE or ENTITY/i
		);
	});

	it("rejects foreign HTML or SVG elements in legacy XML", () => {
		const foreignSvg = legacyGraphWith(
			'<svg xmlns="http://www.w3.org/2000/svg"><script>alert("no")</script></svg>'
		);
		const foreignHtml = legacyGraphWith(
			'<label><text><p><div xmlns="http://www.w3.org/1999/xhtml">Unsafe</div></p></text></label>'
		);

		expect(() => importLegacyGraphSketcherDocument(foreignSvg)).toThrow(
			/outside the original GraphSketcher namespace/i
		);
		expect(() => importLegacyGraphSketcherDocument(foreignHtml)).toThrow(
			/outside the original GraphSketcher namespace/i
		);
	});

	it("copies legacy label markup as inert text and escapes SVG output", () => {
		const result = importLegacyGraphSketcherDocument(
			legacyGraphWith(
				'<label id="note" x="1" y="2"><text><p><lit>&lt;img src=x onerror=alert(1)&gt;</lit></p></text></label>'
			)
		);
		const svg = graphDocumentToSvg(result.document);

		expect(result.document.annotations[0]?.text).toBe(
			"<img src=x onerror=alert(1)>"
		);
		expect(svg).toContain("&lt;img src=x onerror=alert(1)&gt;");
		expect(svg).not.toContain("<img");
	});

	it("rejects malformed or unrelated legacy documents", () => {
		expect(() => importLegacyGraphSketcherDocument("<not-xml")).toThrow(
			/malformed/i
		);
		expect(() =>
			importLegacyGraphSketcherDocument(
				'<document xmlns="https://example.test"><graph/></document>'
			)
		).toThrow(/not an original/i);
	});
});
