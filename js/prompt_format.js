import { app } from "../../scripts/app.js";
import { process_prompts } from "./functions.js";

function legacy() {
	const menu = document.querySelector(".comfy-menu");

	const formatButton = document.createElement("button");
	formatButton.textContent = "Format";
	formatButton.addEventListener("click", () => {
		process_prompts();
	});

	const refreshButton = document.getElementById("comfy-refresh-button");
	menu.insertBefore(formatButton, refreshButton);
	document.addEventListener("keydown", (e) => {
		if (e.altKey && e.shiftKey && e.code === "KeyF")
			formatButton.click();
	});
}

async function frontend() {
	const btn = new (await import("../../scripts/ui/components/button.js")).ComfyButton({
		icon: "format-clear",
		action: () => {
			process_prompts();
		},
		tooltip: "Prompt Format",
		content: "Format",
		classList: "comfyui-button comfyui-menu-mobile-collapse",
	}).element;

	app.menu.actionsGroup.element.after(btn);
}

app.registerExtension({
	name: "Comfy.PromptFormat",
	async setup() {
		try {
			await frontend();
		} catch {
			// No Frontend
		}

		legacy();
	},
	settings: [
		{
			id: "PromptFormat.RemoveDuplicates",
			name: "Remove Duplicates",
			type: "boolean",
			defaultValue: false,
		},
		{
			id: "PromptFormat.RemoveUnderscore",
			name: "Remove Underscores",
			type: "boolean",
			defaultValue: false,
		},
		{
			id: "PromptFormat.AppendComma",
			name: "Append Comma on Newline",
			type: "boolean",
			defaultValue: false,
		},
	],
});
