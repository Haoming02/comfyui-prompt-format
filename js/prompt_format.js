import { app } from "../../scripts/app.js";
import { Process, DEFAULT } from "./functions.js";

app.ui.settings.addSetting({
	id: "promptFormat.settings",
	name: "Prompt Format Settings",
	defaultValue: DEFAULT,
	type: "hidden",
});

app.registerExtension({
	name: "Comfy.PromptFormat",
	async setup() {
		const menu = document.querySelector(".comfy-menu");

		const formatButton = document.createElement("button");
		formatButton.textContent = "Format";
		formatButton.addEventListener("click", () => app.loadGraphData(Process(app.graph.serialize())));

		const refreshButton = document.getElementById("comfy-refresh-button");
		menu.insertBefore(formatButton, refreshButton);
	}
});
