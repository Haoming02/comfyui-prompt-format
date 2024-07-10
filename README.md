# ComfyUI Prompt Format
This is an Extension for [ComfyUI](https://github.com/comfyanonymous/ComfyUI), which helps formatting texts.

## Features
This adds a button to the menu, **Format**, which when clicked will:

- [x] Remove extra **space**s and **comma**s
- [x] Fix misplaced **bracket**s and **comma**s
- [x] **(Optional)** Remove duplicated tags found in the prompts
    - **Note:** Only works for tag-based prompt, not sentence-based prompt
        - **eg.** `1girl, solo, smile, 1girl` will become `1girl, solo, smile`
        - **eg.** `a girl walking, a girl wearing dress` will not be changed
- [x] Respect line breaks
    - Duplicates removal only checks within the same line

## Configs
By default, this only processes the built-in `CLIPTextEncode` node. You can add other custom nodes by adding an entry, **promptFormat.settings**, to the `~ComfyUI\user\default\comfy.settings.json` file.

> Open a workflow `.json` to see the name for the nodes

The entries are in the format of `"NodeType": ["property", dedupe?, [keep_keywords]]`
- **NodeType:** The name of the node *(**eg.** `"CLIPTextEncode"`)*
- **property:** The property to search for strings *(Probably will always be `"widgets_values"`)*
- **dedupe?:** Should remove duplicates or not *(`true` / `false`)*
- **[keep_keywords]:** An array of special keywords to ignore when removing duplicates. If you have custom prompt nodes that use certain keywords, add them to the list to not get deleted.
    - *(**eg.** For `Automatic1111`, it would be `["BREAK", "AND"]` as those are built-in keywords)*

```json
{
    "promptFormat.settings": {
        "CLIPTextEncode": [
            "widgets_values",
            true,
            [
                "BREAK"
            ]
        ]
    }
}
```
