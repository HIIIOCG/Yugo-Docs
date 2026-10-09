# Handbook assets

## Available in this first edition

| Asset | Source | Use |
| --- | --- | --- |
| `assets/images/hiiio-logo.svg` | Supplied `git images/logo.svg` | hiiio maker section; original vector shapes with outside whitespace removed, white in dark mode and black in light mode |
| `assets/images/doc-character.webp` | Supplied `doc_pages.png`, optimized | Introduction character, 872 × 960, 128,280 bytes |
| `assets/images/doc-character-small.webp` | Same supplied PNG, optimized | Smaller responsive cover image, 436 × 480, 51,790 bytes |
| `assets/images/yugo-render-preview.jpg` | Supplied `YugoRenderPreview.jpg` | Retained project preview |
| `assets/images/character-portrait.png` | Supplied `tests/vrm_sampleA.blend` in the Yugo development repository | Retained sample render |
| `assets/images/character-full.png` | Same supplied Blender sample | Retained sample material render; currently unused |
| `assets/images/character-geometry.png` | Same sample, rendered with Workbench shading | Retained sample geometry render; currently unused |
| `assets/images/nodes-inputs.png` | `Screenshot 2026-10-10 000230.png` | Inputs and Custom Inputs |
| `assets/images/nodes-math-flow.png` | `Screenshot 2026-10-10 000306.png` | Math / Mixer and Flow Control |
| `assets/images/nodes-motion-expression.png` | `Screenshot 2026-10-10 000320.png` | Motion Operation and Expression Operation |
| `assets/images/nodes-outputs.png` | `Screenshot 2026-10-10 000335.png` | Outputs |
| `assets/images/nodes-physics.png` | `Screenshot 2026-10-10 000350.png` | Physics |

The editor screenshots and `YugoRenderPreview.jpg` were copied unchanged from `D:/Projects/BCON26/motion_codedev/git images`. Node screenshots retain their original socket colors and can be opened at full size. The website interface itself uses only neutral grays, black, and white. The retained project preview carries its embedded HIIIO Digital / ReLive Project credit.

## Cover image optimization

The current cover uses the supplied `doc_pages.png` from the same folder. The original is a 3840 × 2160 RGBA PNG, 4,857,534 bytes, and is preserved at its source location. Only fully transparent outside space was removed: the retained source rectangle is x=1082, y=242, width=1743, height=1918. This includes every visible source pixel and 60 pixels of headroom above the ears.

The image was resized proportionally to 960px and 480px high and encoded with Sharp 0.35.4 as WebP, quality 90, alpha quality 100, effort 6. The 960px version is about 97.4% smaller than the original. Its decoded alpha channel was checked against the resized PNG and is identical. The conversion removes unneeded render metadata. WebP supports transparency with lossy color compression; see [Google's WebP documentation](https://developers.google.com/speed/webp).

For comparison, the same 960px-high image is 867,084 bytes as PNG and 444,252 bytes as lossless WebP. The selected high-quality WebP is 128,280 bytes. Browsers choose between the two cover sizes using `srcset`. The layout uses `object-fit: contain`, preserving the entire supplied character view, with no additional head or ear cropping.

The Blender images were rendered in a separate background process using Blender 5.2. The source file was opened into memory; it was not saved, overwritten, or loaded into the user's active Blender session. The upper arms were posed for the documentation renders. Original sample materials were retained for the portrait and material render.

The retained material and geometry renders show different views of the same character; they are not before/after performance measurements and are currently unused. Add the supplied model's credits to image captions if these renders are used later.

The header uses the text **Yugo - Blender Vtubing**. The provisional logo is no longer displayed.

The sidebar maker section uses the supplied hiiio wordmark from `D:/Projects/BCON26/motion_codedev/git images/logo.svg`. Its viewBox is tightened to `250 403 1420 273` around the original paths; the original source file is preserved. CSS inverts the black vector mark in dark mode and retains black in light mode. The studio description, website, and public email were verified against [HIIIO Digital](https://hiiiodigital.com/).

## Assets to add later

| Priority | Asset | Destination |
| --- | --- | --- |
| High | Current Optimize dialog screenshot | VRM Character Performance |
| High | Current Composing panel and Main FX screenshots with control labels | Composing Presets |
| High | Confirm the settings used for the supplied `comp_preset_before.jpg` and `comp_preset.jpg` comparison | Composing Presets |
| Medium | Complete verified node connection examples | Node Reference |
| Later | Step-by-step Yugo Layer material to accompany the supplied `YugoLayouts.jpg` overview | Yugo Layer |
| Later | Camera setup screenshots | Camera |
| Later | Installation, first-graph screenshots, and short recordings | Tutorials |

## Reproduce renders

Run `scripts/render-assets.py` using a background Blender process compatible with the sample file. The first version expects the sibling development repository and `tests/vrm_sampleA.blend`. Images are written to `assets/images/`; the sample `.blend` is never saved. See the script for framing and light settings.
