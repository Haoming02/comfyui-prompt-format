import { app } from "../../scripts/app.js";

export function process_prompts() {
	const fields = document.querySelectorAll("textarea.comfy-multiline-input");

	for (const field of fields)
		LeFormatter.formatPipeline(
			field,
			app.extensionManager.setting.get("PromptFormat.RemoveDuplicates"),
			app.extensionManager.setting.get("PromptFormat.RemoveUnderscore"),
			app.extensionManager.setting.get("PromptFormat.AppendComma"),
		);
}

function updateInput(target) {
	let e = new Event("input", { bubbles: true });
	Object.defineProperty(e, "target", { value: target });
	target.dispatchEvent(e);
}

class LeFormatter {
	/**
	 * @param {HTMLTextAreaElement} textArea
	 * @param {boolean} dedupe
	 * @param {boolean} rmUnderscore
	 * @param {boolean} appendComma
	 */
	static formatPipeline(textArea, dedupe, rmUnderscore, appendComma) {
		const lines = textArea.value.split("\n");

		for (let i = 0; i < lines.length; i++) lines[i] = this.formatString(lines[i], dedupe, rmUnderscore);

		if (!appendComma) textArea.value = lines.join("\n");
		else {
			const val = lines.join(",\n");
			textArea.value = val
				.replace(/\n,\n/g, "\n\n")
				.replace(/\>,\n/g, ">\n")
				.replace(/\s*,\s*$/g, "")
				.replace(/\.,(\s)/g, ".$1");
		}

		updateInput(textArea);
	}

	/** @param {string} input @returns {string} */
	static #toExpression(input) {
		return input
			.replace(/(?:,|\n|^)\s*> <\s*(?:,|\n|$)/g, ", $SHY$,")
			.replace(/(?:,|\n|^)\s*:3\s*(?:,|\n|$)/g, ", $CAT$,");
	}

	/** @param {string} input @returns {string} */
	static #fromExpression(input) {
		return input.replace("$SHY$", "> <").replace("$CAT$", ":3");
	}

	/** @param {string} input @param {boolean} dedupe @param {boolean} rmUnderscore @returns {string} */
	static formatString(input, dedupe, rmUnderscore) {
		// Remove Whitespaces
		input = input.replace(/[^\S\n]/g, " ");

		// Remove Underscore
		input = rmUnderscore ? this.#rmUnderscore(input) : input;

		// Special Tags
		input = this.#toExpression(input);

		// Fix Bracket & Space
		input = input.replace(/\s+(\)|\]|\>|\})/g, "$1").replace(/(\(|\[|\<|\{)\s+/g, "$1");

		// Fix Commas inside Brackets
		input = input.replace(/,+(\)|\]|\>|\})/g, "$1,").replace(/(\(|\[|\<|\{),+/g, ",$1");

		// Remove Space around Syntax
		input = input.replace(/\s*\|\s*/g, "|").replace(/\s*\:\s*/g, ":");

		// Sentence -> Tags
		let tags = input.split(",").map((word) => word.trim());

		// Remove Duplicate
		tags = dedupe ? this.#dedupe(tags) : tags;

		// Remove extra Spaces
		input = tags.join(", ").replace(/\s+/g, " ");

		// Remove Empty Brackets
		while (/\(\s*\)|\[\s*\]/.test(input)) input = input.replace(/\(\s*\)|\[\s*\]/g, "");

		// Space after Comma in Escaped Brackets (for franchise)
		input = input.replace(/\\\(([^\\\)]+?):([^\\\)]+?)\\\)/g, "\\($1: $2\\)");

		// Prune empty Chunks
		input = input
			.split(",")
			.map((word) => word.trim())
			.filter((word) => word)
			.join(", ");

		// LoRA Block Weights
		input = input.replace(/<.+?>/g, (match) => {
			return match.replace(/\,\s+/g, ",");
		});

		// Remove empty before Colon
		input = input.replace(/,\s*:(\d)/g, ":$1");

		input = this.#fromExpression(input);

		return input;
	}

	/** @param {string[]} input @returns {string[]} */
	static #dedupe(input) {
		const KEYWORD = /^(AND|BREAK)$/;
		const uniqueSet = new Set();
		const results = [];

		for (const tag of input) {
			const cleanedTag = tag
				.replace(/\[|\]|\(|\)/g, "")
				.replace(/\s+/g, " ")
				.trim();

			if (KEYWORD.test(cleanedTag)) {
				results.push(tag);
				continue;
			}

			if (!isNaN(cleanedTag)) {
				results.push(tag);
				continue;
			}

			if (!uniqueSet.has(cleanedTag)) {
				uniqueSet.add(cleanedTag);
				results.push(tag);
				continue;
			}

			results.push(tag.replace(cleanedTag, ""));
		}

		return results;
	}

	/** @param {string} input @returns {string} */
	static #rmUnderscore(input) {
		if (!input.trim()) return "";
		return input.replaceAll("_", " ");
	}
}
