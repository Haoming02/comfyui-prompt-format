import { app } from "../../scripts/app.js";
import { Process } from "./functions.js";

app.registerExtension({
	name: "Comfy.PromptFormat",
	async setup() {
		const menu = document.querySelector(".comfy-menu");

		const formatButton = document.createElement("button");
		formatButton.textContent = "Format";
		formatButton.addEventListener("click", () => {
			app.loadGraphData(Process(app.graph.serialize()));
		});

		const refreshButton = document.getElementById("comfy-refresh-button");
		menu.insertBefore(formatButton, refreshButton);
	}
});
