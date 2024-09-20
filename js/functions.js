import { app } from "../../scripts/app.js";

const DEFAULT = {
	"CLIPTextEncode": ["widgets_values", true, ["BREAK"]],
}

app.ui.settings.addSetting({
	id: "promptFormat.settings",
	name: "Prompt Format Settings",
	defaultValue: DEFAULT,
	type: "hidden",
});

// "NodeType": ["property", dedupe?, [keep_keywords]]
export function Process(graph) {
	const formatSettings = app.ui.settings.getSettingValue("promptFormat.settings", DEFAULT);

	graph["nodes"].forEach((node) => {
		const type = String(node["type"]);

		if (type in formatSettings) {
			const [property, dedupe, keywords] = formatSettings[type];

			if (!node.hasOwnProperty(property)) {
				alert(`Node of type "${type}" does not have property "${property}"`);
				return;
			}

			if (typeof node[property] === "string") {
				const lines = node[property].split('\n');

				for (let i = 0; i < lines.length; i++)
					lines[i] = formatString(lines[i], dedupe, keywords);

				node[property] = lines.join('\n');
			}
			else {
				for (let e = 0; e < node[property].length; e++) {
					const lines = node[property][e].split('\n');

					for (let i = 0; i < lines.length; i++)
						lines[i] = formatString(lines[i], dedupe, keywords);

					node[property][e] = lines.join('\n');
				}
			}
		}
	});

	return graph;
}

function formatString(input, dedupe, keywords) {

	// Remove Duplicate
	if (dedupe)
		input = _dedupe(input, _constructRE(keywords));

	// Fix Bracket & Comma
	input = input
		.replace(/,+\s*\)/g, '),')
		.replace(/,+\s*\]/g, '],')
		.replace(/\(\s*,+/g, ',(')
		.replace(/\[\s*,+/g, ',[');

	// Remove Commas
	let tags = input.split(',').map(word => word.trim()).filter(word => word.length > 0);

	// Remove Stray Brackets
	const patterns = /^\(+$|^\)+$|^\[+$|^\]+$/;
	tags = tags.filter(word => !patterns.test(word));

	// Remove extra Spaces
	input = tags.join(', ').replace(/\s{2,}/g, ' ');

	// Fix Bracket & Space
	input = input
		.replace(/\s\)/g, ')')
		.replace(/\s\]/g, ']')
		.replace(/\(\s/g, '(')
		.replace(/\[\s/g, '[');

	// Fix Empty Bracket
	while (input.match(/\(\s*\)|\[\s*\]/g))
		input = input.replace(/\(\s*\)|\[\s*\]/g, '');

	return input.split(',').map(word => word.trim()).filter(word => word).join(', ');
}

function _constructRE(keywords) {
	return new RegExp('^(' + keywords.join('|') + ')$');
}

function _dedupe(input, keywords) {
	const chunks = input.split(',');

	const uniqueSet = new Set();
	const resultArray = [];

	chunks.forEach((tag) => {
		const cleanedTag = tag.replace(/\[|\]|\(|\)/g, '').replace(/\s+/g, ' ').trim();

		if (keywords.test(cleanedTag)) {
			resultArray.push(tag);
			return;
		}

		if (!uniqueSet.has(cleanedTag)) {
			uniqueSet.add(cleanedTag);
			resultArray.push(tag);
			return;
		}

		resultArray.push(tag.replace(cleanedTag, ''));
	});

	return resultArray.join(', ');
}
