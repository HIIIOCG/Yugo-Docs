Provide your own values, Blender references, character maps, and metadata. Use these nodes when a graph needs a specific value or a manually selected source.

![Yugo Inputs and Custom Inputs frames, with value and mapping nodes on the right](../assets/images/nodes-inputs.png)

## Float

A numeric constant or animated value without a 0–1 limit.

Set Value and connect it to a numeric control such as a weight, smoothing amount, or math input. Values are not restricted to 0–1; use Clamp when a downstream control needs a fixed range.

**Output:** Value (Float).

## Vector

A three-component vector constant or animated value.

Set X, Y, and Z together when a graph needs a constant or animated vector. Use Combine XYZ instead when each component should come from a separate connection.

**Output:** Vector (Vector).

## String

Enter text and output it through a text socket.

Enter a string and connect Text to a text input, such as Image From URL or a metadata field.

**Output:** Text (Text).

## Armature

Choose a Blender armature and provide it to nodes that need a character target.

Choose the armature and connect Armatures to the target input. Keep the armature consistent with the bone map used to convert its motion.

**Output:** Armatures (Armatures).

## Object

Provide a reference to one Blender object.

Choose the object with the picker and connect Object to a compatible input. For consumers that require a list, use Objects List instead.

**Output:** Object (Object).

## Objects List

Build an explicit list of Blender objects for shape-key output or rigid-body conversion.

Add the objects that a downstream operation should affect. A character mesh list can feed shape-key output; a rigid object list can feed Rigid Body to YugoPhysics.

**Output:** Objects (Objects List).

## Collection

Provide a reference to a Blender collection.

Choose a collection and connect Collection to a compatible input. This socket carries the collection reference rather than an Objects List.

**Output:** Collection (Collection).

## Image

Select or open a Blender image and output it as Image data.

Choose an image already loaded in Blender, or use the node control to open a local image file. Connect Image to a compatible consumer.

**Output:** Image (Image).

## Image From URL

Sample an image URL; connected consumers request its download.

Connect a String node to URL, then connect Image to a compatible consumer.

A connected consumer requests the download when it needs the image.

**Inputs:** URL (Text).

**Output:** Image (Image).

## Bone Map Value

Create a humanoid-to-Blender bone mapping for a chosen armature.

Choose the armature and assign its bones to the humanoid entries. Use the resulting Bone Map for an Action source or a motion conversion. For an imported VRM character, VRM Data can supply its existing map.

**Output:** Bone Map (Humanoid Bone Map).

## Expression Map Value

Create a mapping between expression channels and their character targets.

Add the expression entries and configure their bindings. Connect Expression Map to Expression Action or Expressions to ShapeKeysValues. Use VRM Data when the imported character already contains the mapping you need.

**Output:** Expression Map (Expression Map).

## Meta Value

Manually enter a name, author and other character metadata.

Enter Name and Author; expand Details for the remaining fields. Connect String nodes to override individual text fields.

Disconnect a text input to restore its manually entered value. This node does not rewrite imported VRM metadata.

**Inputs:** Name (Text); Author (Text); Version (Text); Copyright (Text); Contact (Text); Reference (Text).

**Output:** Meta (VRM Meta).
