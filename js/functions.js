import { formatSettings } from "./configs.js";

function constructRE(keywords) {
	return new RegExp('^(' + keywords.join('|') + ')$');
}

// "NodeType": ["property", dedupe?, [keep_keywords]]
export function Process(graph) {
	graph["nodes"].forEach((node) => {
		const type = String(node["type"]);
		if (type in formatSettings) {

			const property = formatSettings[type][0];
			const dedupe = formatSettings[type][1];
			const keywords = formatSettings[type][2];

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
	if (dedupe) {
		const temp = input.split(',');

		const cleanArray = [];
		const finalArray = [];

		const keep = constructRE(keywords);

		temp.forEach((tag) => {
			const cleanedTag = tag.replace(/\[|\]|\(|\)|\s+/g, '').trim();

			if (keep.test(cleanedTag)) {
				finalArray.push(cleanedTag);
				return;
			}

			if (!cleanArray.includes(cleanedTag)) {
				cleanArray.push(cleanedTag);
				finalArray.push(tag);
				return;
			}

			// Keep the brackets to fix later
			finalArray.push(tag.replace(cleanedTag, ''));
		});

		input = finalArray.join(', ');
	}

	// Fix Bracket & Comma
	input = input.replace(/,\s*\)/g, '),').replace(/,\s*\]/g, '],').replace(/\(\s*,/g, ',(').replace(/\[\s*,/g, ',[');

	// Remove Commas
	let tags = input.split(',').map(word => word.trim()).filter(word => word.length > 0);

	// Remove Stray Brackets
	const patterns = [/^\(+$/, /^\)+$/, /^\[+$/, /^\]+$/];
	tags = tags.filter(word => !patterns[0].test(word)).filter(word => !patterns[1].test(word)).filter(word => !patterns[2].test(word)).filter(word => !patterns[3].test(word));

	// Remove Spaces
	input = tags.join(', ').replace(/\s+/g, ' ');

	// Fix Bracket & Space
	input = input.replace(/\s+\)/g, ')').replace(/\s+\]/g, ']').replace(/\(\s+/g, '(').replace(/\[\s+/g, '[');

	// Fix Empty Bracket
	while (input.match(/\(\s*\)|\[\s*\]/g))
		input = input.replace(/\(\s*\)|\[\s*\]/g, '');

	return input.split(',').map(word => word.trim()).filter(word => word.length > 0).join(', ');
}
