Keep your VRM character responsive while preserving the parts of its appearance and motion that matter to your performance.

## How optimization works

Full MToon materials can be demanding in Blender. **MToon Optimize** replaces them with a lighter, simplified version that keeps the essential features. Supported settings remain connected to the original MToon interface, so you can keep using its familiar controls.

Yugo then brings back selected visual effects through post-processing with [Compositing Presets](composing-presets.html). The idea is to keep the material lightweight and handle more of the final look in the compositor.

## Use Yugo's Optimize tools

In Object Mode, select the character's mesh objects. Open the **Yugo** sidebar tab in the 3D Viewport and choose **Optimize**. The same panel is available in the Yugo Node editor.

The dialog reports **Selected Objects** and **MToon Materials**. Check these counts before applying changes: the operator works on selected objects rather than automatically processing every character in the scene.

| Option | What it does | What to check |
| --- | --- | --- |
| MToon Optimize | Replaces compatible MToon materials with Yugo's simplified version while keeping supported MToon controls connected | Skin, hair, eyes, transparency, and double-sided surfaces |
| Shadow Mix | Controls shadow-color preprocessing during material optimization | The resulting shade color under your scene lighting |
| Outline Apply | Bakes selected MToon outlines into meshes and removes the source outline modifiers | Outline appearance and deformation during animation |

**Shadow Mix** is applied during optimization. It is separate from the **Secondary Shadow** effect in the compositing preset.

**Outline Apply** changes the scene's mesh setup. Keep the source copy and inspect the result while the character moves. Do not assume that baking an outline always improves performance: the result depends on the character and scene.

## Identify the expensive part

Change one part of the setup at a time, then repeat the same motion. These comparisons help narrow the cause:

| Comparison | What to investigate next |
| --- | --- |
| Solid view is responsive but rendered view slows down | Materials, transparency, lights, shadows, and render settings |
| Hiding a character mesh improves responsiveness | Mesh complexity, modifiers, or deformation work |
| Disabling physics improves responsiveness | Spring chains, collision objects, and solver settings |
| Removing compositing effects improves responsiveness | The shared Main FX setup and output resolution |

These are troubleshooting clues, not proof of a single bottleneck.

## Reduce unnecessary work

- **Geometry and modifiers:** inspect costly modifiers and subdivision levels. Preserve shape keys, skinning, and facial deformation when creating a lighter character variant.

## Further reading

- [Compositing Presets](composing-presets.html)
- [Physics nodes](nodes/physics.html)
- [Blender EEVEE documentation](https://docs.blender.org/manual/en/5.2/render/eevee/index.html)
- [VRM Add-on MToon materials](https://vrm-addon-for-blender.info/en-us/material-mtoon/)
