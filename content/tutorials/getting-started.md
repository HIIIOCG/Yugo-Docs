Install Yugo, open its editor, and prepare your character. You can connect live tracking after the first setup.

> Start here after installation
> In the **3D Viewport**, press **N**, select **Yugo**, and click **Open Yugo Node Editor** at the top of the panel. In the editor, press **N → Yugo** to find **Fast Started**, **Help**, and the output controls.

## What you need

- **Windows x64 and Blender 5.1 or 5.2.**
- **Yugo 0.2.2.** Yugo Node and the other Yugo tools are included in one ZIP.
- **A VRM character.** Use [VRM Add-on for Blender](https://vrm-addon-for-blender.info/en-us/) to import it with its humanoid mapping and expression data.
- **Optional: a tracking app.** This example supports VMC body tracking and VMC or iFacialMocap face tracking. VMC is a way for tracking apps to send motion to Blender. You can prepare the character setup before connecting an app.

## Install Yugo

1. Open the [latest official Yugo release](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools/releases/latest) and download **yugo-0.2.2.zip**.
2. In Blender, open **Edit → Preferences → Get Extensions**, then open its menu and choose **Install from Disk**.
3. Select the Yugo ZIP and enable **Yugo**.
4. Install and enable the VRM add-on if your character is not already imported.

> For older separate installations
> Yugo already includes Yugo Node. Keep **Yugo** enabled. If Blender also lists an older add-on named **Yugo Node** or **Yugu Node Studio** that you installed separately, disable that older entry. First-time users can skip this step.

## Prepare your character and graph

1. Import your VRM character and save a working copy of the scene.
2. In the **3D Viewport**, press **N → Yugo**, then click the top **Open Yugo Node Editor** button. This area changes into the node editor.
3. In the node editor, press **N → Yugo → Fast Started**.
4. Choose your imported armature under **Character**. Leave **Body Motion** as **VMC** for body tracking. For **Face Capture**, choose **None**, **VMC**, or **iFacialMocap** to match your tracking app. At least one face or body source must be selected.
5. Press **OK**. Yugo creates a new connected graph for this character and opens it. Existing graphs remain available in the node editor header's graph selector.

The new setup starts with **Outputs paused** and its tracking receivers disconnected. Fast Started selects the character and connects its motion and expression outputs for you; adding a separate Avatar List entry is not required for this node workflow.

Use **Help** in the Yugo sidebar to open the [official handbook](https://hiiiodigital.com/Yugo-Docs/) in your browser. If you open the editor before using Fast Started, its first example uses Blender Action; you can still use Fast Started from the editor sidebar to create the tracking setup.

## Connect live body motion

The Fast Started graph already contains the connections for your chosen sources. To start tracking:

1. Set the receiver details in the graph. For **VMC Receiver**, match **Address** and **Port** to your setup. The default is **127.0.0.1:39539** for an app on the same computer. If the app runs on another device, use the Blender computer's network address in the receiver and send the app's VMC output to that address and port.
2. If you chose **iFacialMocap**, set **iPhone Address** to your phone's network address. Its default **Device Port** is **49983**.
3. Find the node labelled **Connect receivers** and click its **Trigger** button.
4. In the editor's **N → Yugo** sidebar, click **Start Outputs**. The status changes to **Outputs running**. When the tracking app sends motion, the character should follow it.

The connection starts the receiver; Start Outputs starts the character updates. These are separate controls. If you selected facial tracking, the graph also has its expression connections. Facial movement requires expression bindings to the character's shape keys; the sidebar shows a warning when those targets are missing.

For the individual receiver settings and connections, see [Inputs](../nodes/inputs.html) and [Outputs](../nodes/outputs.html).

## Pause and check the setup

Click **Pause Outputs** in **N → Yugo** to pause character updates. To stop the tracking connections too, click **Trigger** on the **Disconnect receivers** node. After editing the character's VRM mapping or expressions, click **Trigger** on **Reload character**.

| If you see this | Check this first |
| --- | --- |
| The Yugo tab is missing | Yugo is enabled and your pointer is over the 3D Viewport or Yugo Node editor when you press N |
| Fast Started cannot create the setup | Choose an armature in the current scene and at least one tracking source; check its VRM humanoid mapping |
| A warning says facial targets are missing | Add the character's VRM expression bindings, then use Reload character |
| The receiver has no motion | Match the address and port to the tracking app, then click Trigger on Connect receivers |
| Data arrives but the character does not move | Click Start Outputs; check that the character output nodes are Enabled |
| The pose or expressions conflict | Pause other Motion Layers or controllers that are writing to the same character |

Save the scene after checking the result. Click **Pause Outputs** before saving if you want it to reopen paused. Tracking receivers need their connection controls when you reopen the file.

## Optional physics add-on

The main Yugo ZIP covers the steps on this page. For ProtoMotions experiments, install [Yugo PhysX Tracker 0.4.0](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools/releases/download/v0.2.1/yugo_physx_tracker-0.4.0.zip) as a separate add-on alongside Yugo. Follow its bundled README for its skeleton and physics setup.

## Next steps

- [Node Reference](../nodes/index.html) explains motion processing, values, timing, expressions, and physics.
- [Compositing Presets](../composing-presets.html) describes YugoComp and the shared Main FX controls.
- [VRM Character Performance](../optimizing-vrm-character-performance.html) explains the Optimize tools.
- [Official source and issue tracker](https://github.com/HIIIOCG/Yugo-BlenderVtubingTools) provide release notes and a place to report a problem.
