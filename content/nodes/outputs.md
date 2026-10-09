Apply evaluated data to Blender objects, bones, and shape keys. Each output needs both its data connections and an update event at Enter.

![Yugo Outputs frame with Apply Transform, Bone Transforms to Armature, and ShapeKeysValues to Objects List](../assets/images/nodes-outputs.png)

For a regular update rate, connect [Hz Trigger](flow-control.html#hz-trigger). For simulated transforms, the [YugoPhysics Solver](physics.html#yugophysics-solver) Updated event can drive the output when simulation data advances.

## Apply Transform

Write object transforms to Blender when an update event reaches Enter.

Connect Object Transforms from the solver and connect its Updated event to Enter.

Use Apply to enable or disable scene writes.

**Inputs:** Enter (Update Event); Object Transforms (Object Transforms).

**Output:** End (Update Event).

## Bone Transforms to Armature

Write bone transforms to the target armatures when an update event reaches Enter.

Connect Bone Transform and Armatures. Connect Hz Trigger, a flow node, or a solver Updated event to Enter so Blender receives updates.

Data connections alone do not schedule scene writes. End reports completion of this output event.

**Inputs:** Enter (Update Event); Bone Transform (Bone Transform); Armatures (Armatures).

**Output:** End (Update Event).

## ShapeKeysValues to Objects List

Write shape-key values to the target objects when an update event reaches Enter.

Connect Shape Keys Values and Objects. Drive Enter with an update event to apply expressions to the meshes.

Use the object list belonging to the character whose expression map produced the values.

**Inputs:** Enter (Update Event); Shape Keys Values (Shape Keys Values); Objects (Objects List).

**Output:** End (Update Event).
