import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { inventoryCases } from "./fixtures/cpp-inventory-packs.mjs";

function body(source, name) {
	const match = new RegExp(`\\b${name}\\([^;]*?\\)\\s*(?:const\\s*)?\\{`).exec(source);
	assert.ok(match, name);
	const start = match.index + match[0].length;
	let depth = 1;
	let end = start;
	for (; depth && end < source.length; end++) {
		if (source[end] === "{") depth++;
		if (source[end] === "}") depth--;
	}
	assert.equal(depth, 0);
	return { start, end: end - 1, text: source.slice(start, end - 1) };
}

export function completeInventoryFile(folder, source, referenceFiles) {
	if (!folder.endsWith("/starter")) return source;
	assert.equal((source.match(/\/\/ TODO:/g) ?? []).length, 4);
	assert.ok(referenceFiles?.["main.cpp"]);
	for (const [learner, reference] of [["selectCategory", "select_category"], ["projectNames", "project_names"], ["joinSuppliers", "join_suppliers"], ["renameCategory", "rename_category"]]) {
		const target = body(source, learner);
		const completed = body(referenceFiles["main.cpp"], reference).text.replaceAll("supplier_by_id", "supplierById");
		source = source.slice(0, target.start) + completed + source.slice(target.end);
	}
	return source;
}

async function build(directory, file, binary, sanitized, runNative) {
	const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", ...(sanitized ? ["-g", "-O0", "-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
	const result = await runNative("clang++", [...flags, file, "-o", binary], directory);
	assert.equal(result.code, 0, result.stderr);
	assert.equal(result.stderr, "");
}

export async function verifyInventoryDefaultExport(directory, runNative) {
	try {
		await build(directory, "main.cpp", "inventory-native", false, runNative);
		assert.deepEqual(await runNative(join(directory, "inventory-native"), [], directory), { code: 0, stdout: "Categories: electronics tools\nTool names:\n", stderr: "" });
	}
	finally {
		await rm(join(directory, "inventory-native"), { force: true });
	}
}

// Plain-row model: linear duplicate/supplier tests, independent of C++ indexes.
function expectedCase(test, number) {
	const rows = test.rows.map(row => [...row]);
	const selected = rows.filter(row => row[2] === test.category).map(row => [...row]);
	const show = (label, items) => `${label}:${items.map(row => ` ${row.join(":")};`).join("")}\n`;
	const categories = () => `Categories:${[...new Set(rows.map(row => row[2]))].sort().map(value => ` ${value}`).join("")}\n`;
	let text = `Case ${number}\nAdds:${rows.map(() => " true").join("")}\n`;
	if (test.duplicate) text += `Duplicate: ${!rows.some(row => row[0] === test.duplicate[0])}\n`;
	text += categories() + show("Selected", selected);
	text += `Names:${selected.map(row => row[1]).sort().map(name => ` ${name}`).join("")}\n`;
	text += `Joined:${rows.flatMap((row) => {
		const supplier = test.suppliers.find(entry => entry[0] === row[0]);
		return supplier ? [` ${row[0]} | ${row[1]} | ${row[3]} | ${supplier[1]};`] : [];
	}).join("")}\n`;
	const present = rows.some(row => row[2] === test.from);
	for (const row of rows) {
		if (row[2] === test.from) row[2] = test.to;
	}
	text += `Rename: ${present}\n${categories()}${show("Old view", selected)}`;
	text += show("Fresh source", rows.filter(row => row[2] === test.from));
	text += show("Fresh destination", rows.filter(row => row[2] === test.to));
	if (selected.length) selected[0][1] = "copy-only";
	text += show("Edited copy", selected) + show("Unchanged rows", rows.filter(row => row[2] === test.to));
	return text;
}

function probe(source, reference) {
	assert.equal((source.match(/int main\(\) \{/g) ?? []).length, 1);
	source = source.replace("int main() {", "int originalDemonstration() {");
	const end = source.lastIndexOf("}");
	source = `${source.slice(0, end)}    return 0;\n${source.slice(end)}`;
	const name = key => reference ? ({ selectCategory: "select_category", projectNames: "project_names", joinSuppliers: "join_suppliers", renameCategory: "rename_category", printCategories: "print_categories" })[key] : key;
	const cpp = value => JSON.stringify(value);
	const rows = values => `{${values.map(row => `{${row.map(cpp).join(",")}}`).join(",")}}`;
	const sequence = [...inventoryCases, inventoryCases[0]];
	let code = "\nvoid showRows(const char* label, const std::vector<Item>& rows) {\n    std::cout << label << ':';\n    for (const auto& row : rows) std::cout << ' ' << row.id << ':' << row.name << ':' << row.category << ':' << row.quantity << ';';\n    std::cout << '\\n';\n}\nint main() {\n    std::cout << std::boolalpha;\n";
	for (const [index, test] of sequence.entries()) {
		code += `    {\n        InventoryIndex inventory;\n        std::cout << "Case ${index}\\nAdds:";\n        for (const auto& row : std::vector<Item>${rows(test.rows)}) std::cout << ' ' << inventory.add(row);\n        std::cout << '\\n';\n`;
		if (test.duplicate) code += `        std::cout << "Duplicate: " << inventory.add(Item${rows([test.duplicate]).slice(1, -1)}) << '\\n';\n`;
		code += `        inventory.${name("printCategories")}();\n        auto selected = inventory.${name("selectCategory")}(${cpp(test.category)});\n        showRows("Selected", selected);\n        std::cout << "Names:";\n        for (const auto& value : inventory.${name("projectNames")}(selected)) std::cout << ' ' << value;\n        std::cout << "\\nJoined:";\n        for (const auto& value : inventory.${name("joinSuppliers")}(std::map<int,std::string>${rows(test.suppliers)})) std::cout << ' ' << value << ';';\n        std::cout << "\\nRename: " << inventory.${name("renameCategory")}(${cpp(test.from)}, ${cpp(test.to)}) << '\\n';\n        inventory.${name("printCategories")}();\n        showRows("Old view", selected);\n        showRows("Fresh source", inventory.${name("selectCategory")}(${cpp(test.from)}));\n        showRows("Fresh destination", inventory.${name("selectCategory")}(${cpp(test.to)}));\n        if (!selected.empty()) selected.front().name = "copy-only";\n        showRows("Edited copy", selected);\n        showRows("Unchanged rows", inventory.${name("selectCategory")}(${cpp(test.to)}));\n    }\n`;
	}
	return { code: `${source + code}}\n`, expected: sequence.map(expectedCase).join("") };
}

export async function verifyInventoryExport(directory, folder, runNative) {
	const source = await readFile(join(directory, "main.cpp"), "utf8");
	const reference = folder.endsWith("/solution");
	const { code, expected } = probe(source, reference);
	try {
		await writeFile(join(directory, "inventory-probe.cpp"), code);
		for (const sanitized of [false, true]) {
			await build(directory, "main.cpp", "inventory-native", sanitized, runNative);
			const result = await runNative(join(directory, "inventory-native"), [], directory);
			assert.equal(result.code, 0, result.stderr);
			assert.equal(result.stderr, "");
			assert.match(result.stdout, /Tool names: debug cable hex driver\n/);
			const joined = result.stdout.split("\n").filter(line => /^\d+ \| /.test(line));
			assert.deepEqual(joined.map(line => Number(line.split(" | ")[0])), reference ? [101, 102, 103, 104] : [101, 102, 103]);
			if (reference) assert.match(result.stdout, /Duplicate accepted\? no\n[\s\S]*Categories: lab tools\n/);
			await build(directory, "inventory-probe.cpp", "inventory-native", sanitized, runNative);
			assert.deepEqual(await runNative(join(directory, "inventory-native"), [], directory), { code: 0, stdout: expected, stderr: "" });
		}
	}
	finally {
		await rm(join(directory, "inventory-native"), { force: true });
		await rm(join(directory, "inventory-probe.cpp"), { force: true });
	}
}
