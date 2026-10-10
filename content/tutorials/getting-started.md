Install Yugo, prepare a VRM character, and connect a live motion source to a character output.

## What you need

- **Windows x64 and Blender 5.1 or 5.2.** Yugo's bundled native physics runtime targets these versions.
- **Yugo 0.2.x.** This unified extension includes Yugo Node 0.10.0 and the original Yugo tools.
- **A VRM character.** Use [VRM Add-on for Blender](https://vrm-addon-for-blender.info/en-us/) to import it with its humanoid mapping and expression data.
- **A VMC sender for the live example below.** You can prepare the graph before connecting a sender. Blender Action is another motion source for an existing animation.

## Install the unified package

1. Open the [latest official Yugo release](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools/releases/latest) and download the **yugo-0.2.x.zip** asset matching that release.
2. Disable separately installed **Yugo Node** or **Yugu Node Studio** before enabling unified Yugo. They use the same graph identifiers.
3. In Blender, open **Edit → Preferences → Get Extensions**, then open its menu and choose **Install from Disk**.
4. Select the Yugo ZIP and enable **Yugo**. Install and enable the VRM add-on if your character is not already imported.
5. In the 3D Viewport, press **N** and open the **Yugo** tab. The original controls and the **Yugo Node** graph launcher share this tab.

The main Yugo package provides the workflow used here. **Yugo PhysX Tracker 0.4.0 / ProtoMotions** is an optional, independent ZIP available with the official release assets. It requires Yugo; installing the Tracker alone does not provide the main graph editor. Follow its bundled README for its own skeleton and physics workflow.

## Prepare your character and graph

1. Import your VRM character and save a working copy of the scene.
2. In **Yugo → Avatar List**, press **+** and choose the imported **VRM Armature**. This list is used by the original Yugo controls and the shared compositing tools.
3. Expand the **Yugo Node** panel. Use the graph selector's new button to create a graph, then press **Open Node Editor**.
4. The new graph includes **VRM Data**, **Blender Action**, motion and expression outputs, and an **Hz Trigger**. Turn off **Enabled** on the output nodes while preparing the connections.
5. In **VRM Data**, choose the imported armature in its **Armature** input, then use **Reload**. The node should report **Ready**. Its Bone Map, Expression Map, Armatures, and Objects outputs describe this character.

The Avatar List and VRM Data selection serve different controls. Selecting an avatar in the sidebar does not replace the graph's explicit character selection.

## Connect live body motion

Use **Add → Inputs → VMC Receiver**. Replace the starter graph's Blender Action motion connection with VMC Receiver's **Humanoid Motion** output, and check the following connections:

| From | To |
| --- | --- |
| VMC Receiver → Humanoid Motion | Motion to Bone Transform → Motion |
| VRM Data → Bone Map | Motion to Bone Transform → Bone Map |
| Motion to Bone Transform → Bone Transform | Bone Transforms to Armature → Bone Transform |
| VRM Data → Armatures | Bone Transforms to Armature → Armatures |
| Hz Trigger → Trigger | Bone Transforms to Armature → Enter |

Set the receiver's **Port** to match your VMC sender; its default is **39539**. Point the sender at the computer running Blender and use the receiver's **Connect** control. Then enable **Bone Transforms to Armature**. When the sender supplies motion, the character should follow it.

Data connections describe what to apply; **Enter** events tell the output when to write it to Blender. Receiving VMC data by itself does not move the character. The connected Hz Trigger runs automatically; it has no separate Play button.

For facial expressions, connect the receiver's **Expressions** to **Expressions to ShapeKeysValues**, connect **VRM Data → Expression Map** to that converter, then send its **Shape Keys Values** and **VRM Data → Objects** to **ShapeKeysValues to Objects List**. Connect **Hz Trigger → Trigger** to that output's **Enter** and enable it. See [Inputs](../nodes/inputs.html) and [Outputs](../nodes/outputs.html) for the individual node interfaces.

## Pause and check the setup

Turn off an output's **Enabled** checkbox to pause its writes. Use **Disconnect** on the VMC Receiver to stop its network connection. Pause the corresponding original Motion Layers before letting a node output drive the same character.

| If you see this | Check this first |
| --- | --- |
| The Yugo tab is missing | Yugo is enabled and you are looking at the 3D Viewport sidebar |
| VRM Data is not Ready | The selected object is the imported VRM armature; reload after changing its mapping or data |
| The receiver has no motion | Sender address and port match Blender's receiver, and Connect is active |
| Data arrives but the character does not move | Bone Map and Armatures target this character; Hz Trigger reaches Enter; the output is Enabled |
| The pose or expressions conflict | Another Motion Layer, Apply node, or controller is writing the same targets |

Save the configured scene after checking the result. Connected Hz Trigger routes can resume their output updates when a scene opens; network sources still need their own connection controls. Disable outputs before saving when you want the file to reopen paused.

## Next steps

- [Node Reference](../nodes/index.html) explains motion processing, values, timing, expressions, and physics.
- [Compositing Presets](../composing-presets.html) describes YugoComp and the shared Main FX controls.
- [VRM Character Performance](../optimizing-vrm-character-performance.html) explains the Optimize tools.
- [Official source and issue tracker](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools) provide release notes and a place to report a problem.
