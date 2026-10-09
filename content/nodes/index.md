The building blocks for tracking, animation, expressions, and physics in Yugo. Browse eight groups arranged to match the frames in the node screenshots.

## Browse the nodes

| Group | What you can do |
| --- | --- |
| [Inputs](inputs.html) | Receive tracking, sample animation, and read character data. |
| [Custom Inputs](custom-inputs.html) | Supply values, object references, images, and custom maps. |
| [Math / Mixer](math-mixer.html) | Calculate, remap, clamp, and combine data. |
| [Flow Control](flow-control.html) | Schedule, route, delay, and coordinate update events. |
| [Motion Operation](motion-operation.html) | Shape humanoid motion and convert it to bone transforms. |
| [Expression Operation](expression-operation.html) | Control expression channels and convert them to shape-key values. |
| [Outputs](outputs.html) | Apply object transforms, bone transforms, and shape-key values. |
| [Physics](physics.html) | Convert spring and rigid-object data into a shared simulation. |

## Example Nodes

Example node setups are coming soon. Use them to explore Yugo, learn how nodes connect, and build your own workflows.

## A character workflow

1. Read the character with [VRM Data](inputs.html#vrm-data), and choose a tracking or animation source from Inputs.
2. Shape its [motion](motion-operation.html) and [expressions](expression-operation.html) as needed. Use the character maps when converting these streams into bone transforms and shape-key values.
3. Use [Output nodes](outputs.html) to apply the processed data to objects in your Blender scene. Connect [Hz Trigger](flow-control.html#hz-trigger) or another update event source to Enter to apply the changes.
4. Add [Physics](physics.html) for authored springs or rigid objects. The solver Updated event can drive the related transform outputs.
