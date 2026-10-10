Yugo Blender VTube brings live tracking, animation, expressions, and physics together in Blender. Build a performance setup that works the way you do.

## What is Yugo?

Yugo is a Blender add-on for VTubing and interactive character workflows. It turns Blender into a data mixing hub: bring in a live performance, combine it with animation, and decide how that data affects your character and scene.

The same building blocks can support an avatar on stream, a character interacting with objects, or an experiment built around motion and expressions.

## What can you do?

- **Receive a live performance.** Bring in humanoid motion and expression channels through VMC, or facial tracking through iFacialMocap. Support for additional motion and tracking sources, including MediaPipe, VBridger, mocopi, SteamVR, and more, is in development.
- **Shape motion and expressions.** Control smoothing, strength, masks, mirroring, and motion delay before applying the result.
- **Combine live input with animation.** Use Blender Actions alongside tracking sources in a visual node graph.
- **Add physical interaction.** Convert VRM spring data and rigid objects into descriptions for the shared YugoPhysics solver.
- **Apply VTuber-style looks.**

## Find your way around

| Goal | Guide |
| --- | --- |
| Get started | [Getting Started](tutorials/getting-started.html) |
| Use layers | [Yugo Layer](yugo-layer.html) — WIP |
| Explore nodes | [Node Reference](nodes/index.html) |
| Improve performance | [VRM Performance](optimizing-vrm-character-performance.html) |
| Style your character | [Compositing Presets](composing-presets.html) |
| Set up a camera | [Camera](camera.html) — WIP |

## Layers and nodes

Yugo Layer is the user-facing workflow for organizing a character setup. Its guide is being prepared.

Yugo Node exposes the building blocks directly. A graph connects data sources, transformations, and scene outputs. Data sockets carry values; update events tell an output when to apply them. The [Node Reference](nodes/index.html) explains the available nodes and their connections.

## Current package

This handbook covers **Yugo 0.2.x**, the unified package containing **Yugo Node 0.10.0** and the original Yugo tools. It targets **Windows x64** and **Blender 5.1 / 5.2**. Download it from the [latest official release](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools/releases/latest) and follow [Getting Started](tutorials/getting-started.html). Read the notes supplied with the package you download; compatibility and available features can differ between releases.

Some sections are marked **Page Work in Progress** while screenshots and instructions are prepared. These pages remain visible so you can see where future documentation will live.

## Project links

- [Yugo source repository](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools)
- [Latest release](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools/releases/latest)
- [Report a problem](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools/issues)
- [Improve this handbook](https://github.com/HIIIOCG/Yugo-Docs)
