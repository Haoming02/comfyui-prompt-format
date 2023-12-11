# ComfyUI Prompt Format
This is an Extension for [ComfyUI](https://github.com/comfyanonymous/ComfyUI), which helps formatting texts.

## Features
- [x] Remove duplicated **spaces** and **commas**
- [x] Fix misplaced **brackets** and **commas**
- [x] **(Optional)** Remove identical tags found in the prompts
  - **Note:** Only works for tag-based prompt, not sentence-based prompt 
    - **eg.** `1girl, solo, smile, 1girl` will become `1girl, solo, smile`
    - **eg.** `a girl smiling, a girl standing` will not be changed
- [x] Respect line breaks
  - Duplicates removal only checks within the same line

## How to Use
- Clone this repo into the `~/ComfyUI/custom_nodes` folder
- This will add a button, **Format**, to the menu. Simply click it to format the texts~

## Configs
By default, this only processes the built-in `CLIPTextEncode` node. You can also add custom nodes yourself by adding entries to the `configs.js` script.
*(Open a `.json` workflow file to see the exact field names)*

The entries are in the format of `"NodeType": ["property", dedupe?, [keep_keywords]]`
- **NodeType:** The name of the node *(**eg.** `"CLIPTextEncode"`)*
- **property:** The property to search for strings *(Probably will always be `"widgets_values"`)*
- **dedupe?:** Should remove duplicates or not *(`true` / `false`)*
- **[keep_keywords]:** An array of special keywords to ignore when removing duplicates. 
If you have custom prompt nodes that use certain keywords, add them to the list to not get deleted. 
*(**eg.** For `Automatic1111`, it would be `["BREAK", "AND"]` as those are built-in keywords)*
