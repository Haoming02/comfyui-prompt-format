# ComfyUI Prompt Format
This is an Extension for [ComfyUI](https://github.com/comfyanonymous/ComfyUI), which helps formatting texts.

## Features
This adds a button, **Format**, to the menu which when clicked will:

- [x] Remove extra **spaces** and **commas**
- [x] Fix misplaced **brackets** and **commas**
- [x] Enable `Remove Duplicates` to remove identical tags found in the prompts
  - **Note:** Only works for tag-based prompt, not sentence-based prompt
    - **e.g.** `1girl, solo, smile, 1girl` will become `1girl, solo, smile`
    - **e.g.** `a girl smiling, a girl standing` will not be changed
- [x] Enable `Remove Underscores` to replace `_` with `space`
- [x] Respect line breaks
  - `Remove Duplicates` only checks within the same line
- [x] Append a comma every line break
- [x] Pressing `Alt` + `Shift` + `F` can also manually trigger formatting
