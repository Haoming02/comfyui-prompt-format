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

## Configs
T.B.A
