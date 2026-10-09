Calculate numeric and vector values, remap ranges, and combine compatible data. Math and Mixer share this page to keep the reference compact.

![Yugo Math, Mixer, and FlowControl frames in Blender](../assets/images/nodes-math-flow.png)

## Math

Common float arithmetic, minimum, maximum and absolute value.

Choose Add, Subtract, Multiply, Divide, Multiply Add, Minimum, Maximum, or Absolute. Connect the operands needed by that operation. Multiply Add uses A × B + C; Divide returns zero for a zero divisor.

**Inputs:** A (Float); B (Float); C (Float).

**Output:** Value (Float).

## Clamp

Limit a numeric value between Min and Max.

Connect the source to Value and set the permitted range. For example, Min 0 and Max 1 keep a weight inside a normalized range.

**Inputs:** Value (Float); Min (Float); Max (Float).

**Output:** Value (Float).

## Map Range

Map a value from an input range to an output range.

Set From Min and From Max to the source range, then To Min and To Max to the desired range. Enable Clamp to limit the mapped factor to 0–1 before applying the output range.

**Inputs:** Value (Float); From Min (Float); From Max (Float); To Min (Float); To Max (Float).

**Output:** Value (Float).

## Combine XYZ

Combine three numeric values into a vector.

Connect or enter X, Y, and Z separately. Use the Vector output when another node expects all three components in a single connection.

**Inputs:** X (Float); Y (Float); Z (Float).

**Output:** Vector (Vector).

## Separate XYZ

Separate a vector into three numeric values.

Connect Vector, then send each component to numeric processing. Combine XYZ can put the adjusted components back together.

**Inputs:** Vector (Vector).

**Outputs:** X (Float); Y (Float); Z (Float).

## Vector Math

Common vector arithmetic and directional measurements.

Choose an operation and connect the required vectors. Add, Subtract, Scale, Cross Product, and Normalize produce a vector. Dot Product, Length, and Distance produce a numeric value. Normalize returns zero for a zero vector.

**Inputs:** Vector A (Vector); Vector B (Vector); Scale (Float).

**Outputs:** Vector (Vector); Value (Float).

## Mixer

Blend typed values or merge maps and physics descriptions.

Choose Type before connecting data; the sockets change to match. Supported types include Float, Vector, Humanoid Motion, Bone Transforms, Expressions, Bone Map, Expression Map, Physics Description, and Object Transforms. Use Factor for blending where available. Expression modes are Replace, Add, and Maximum; Clamp Factor keeps the factor within 0–1.

**Default Float sockets:** Factor, Float A, Float B → Float Result. Other types expose their own sockets.
