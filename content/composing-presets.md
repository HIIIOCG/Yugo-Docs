Use Yugo's bundled Composing preset to adjust the character's finish through shared Main FX controls.

## How the preset is organized

Yugo uses a shared scene compositor setup. Characters enabled for YugoComp participate in the same **Main FX** controls; they do not each receive an independent copy of the effects.

> Note
> The first version of this guide describes the bundled preset and the controls currently exposed by Yugo. A gallery of verified visual examples will be added later.

## Enable a character

1. Open the **Yugo Node** sidebar in the 3D Viewport and expand **Composing**. In the Yugo Node editor, the corresponding panel is named **Composer**.
2. Use the character list's **+** button to add an entry, then choose the character's armature. Adding an entry with an active armature fills that selection automatically.
3. Select the entry and enable **Enable YugoComp**.
4. Expand **Main FX** to adjust the shared effects. The controls become available after the compositor setup is initialized.

> Shared scene controls
> Main FX changes affect the characters participating in YugoComp. Check the complete camera view when adjusting a scene with multiple characters.

## Main FX controls

Each effect has a **Mix** control for its intensity. Expand an effect to see the additional controls it exposes.

| Effect | Additional controls |
| --- | --- |
| Scene Color Blend | Blur |
| Ambient Occlusion | Mix only |
| Rim Light | Color, Blur, X/Y Offset |
| Separated Rim | Blur, X/Y Offset |
| Secondary Shadow | Color, Blur, X/Y Offset |
| Separated Shadows | Blur, X/Y Offset |
| Gradient Color | Color, Range, Rotation |
| Dark Bloom | Color, Range, X/Y Offset |
| Light Bloom | Color, Range, X/Y Offset |

## Related pages

- [Optimizing VRM Character Performance](optimizing-vrm-character-performance.html)
- [Camera](camera.html) — work in progress
