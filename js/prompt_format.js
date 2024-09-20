import { app } from "../../scripts/app.js";
import { Process } from "./functions.js";

function legacy() {
	const menu = document.querySelector(".comfy-menu");

	const formatButton = document.createElement("button");
	formatButton.textContent = "Format";
	formatButton.addEventListener("click", () => app.loadGraphData(Process(app.graph.serialize())));

	const refreshButton = document.getElementById("comfy-refresh-button");
	menu.insertBefore(formatButton, refreshButton);
}

async function frontend() {
	const btn = new (await import("../../scripts/ui/components/button.js")).ComfyButton({
		icon: "format-clear",
		action: () => {
			app.loadGraphData(Process(app.graph.serialize()));
		},
		tooltip: "Prompt Format",
		content: "Format",
		classList: "comfyui-button comfyui-menu-mobile-collapse"
	}).element;

	app.menu?.actionsGroup.element.after(btn);
}

app.registerExtension({
	name: "Comfy.PromptFormat",
	async setup() {

		try {
			await frontend();
		} catch {
			// No Frontend?
		}

		legacy();

	}
});
