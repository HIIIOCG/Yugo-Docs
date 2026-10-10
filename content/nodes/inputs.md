Bring tracking, animation, and character data into a node graph. These nodes follow the Inputs frame in the screenshot; Custom Inputs are documented separately.

![Yugo nodes arranged in Inputs and Custom Inputs frames in Blender](../assets/images/nodes-inputs.png)

## VMC Receiver

Receive humanoid motion and expression channels from a VMC sender over the network.

Set **Address** to the Blender computer's receiving address and **Port** to match the tracking app. The default **127.0.0.1:39539** receives an app on the same computer. For another device, use the Blender computer's network address and send the app's VMC output to that address and port.

Send an event to **Connect** to start receiving and **Disconnect** to stop. The [Getting Started](../tutorials/getting-started.html) graph provides labelled buttons for these actions. Receiving data does not apply a pose to Blender by itself; start the output updates too.

**Inputs:** Address (Text); Port (Float); Connect (Trigger); Disconnect (Trigger).

**Outputs:** Humanoid Motion (VRM Humanoid Motion); Expressions (Expression Channels).

## iFacialMocap

Receive facial expression channels and head motion from iFacialMocap, with a calibration input and optional mirroring.

Set iPhone Address and Device Port for the device on your network. Send an event to **Connect**, or use the labelled button in the [Getting Started](../tutorials/getting-started.html) graph. **Disconnect** stops the receiver. Calibrate from the node or its Calibrate input before tuning head motion.

The initial address is 127.0.0.1; replace it with the device address for a remote iPhone. The default Device Port is 49983. Mirror reverses head yaw and roll.

**Inputs:** iPhone Address (Text); Device Port (Float); Connect (Trigger); Disconnect (Trigger); Calibrate (Trigger).

**Outputs:** Humanoid Motion (VRM Humanoid Motion); Expressions (Expression Channels).

## Blender Action

Sample a Blender Action as humanoid motion using a source bone map.

Select the Action and supply the bone map for the armature that authored it. Adjust Speed, Frame Offset, and Cyclic to fit the performance.

The source bone map describes the animation source; the later Motion to Bone Transform node uses the target character map.

**Inputs:** Source Bone Map (Humanoid Bone Map); Trigger (Trigger).

**Output:** Humanoid Motion (VRM Humanoid Motion).

## VRM Data

Read a VRM character snapshot: its armature, mesh objects, humanoid bone map, expression map, spring data, and metadata.

Choose the character armature or connect an Armature node. Use Reload after changing the imported character data. Connect Bone Map and Expression Map to the corresponding conversion nodes.

Data connections provide the character information; [output nodes](outputs.html) apply the evaluated motion and expressions to Blender.

**Inputs:** Armature (Armatures); Reload (Trigger).

**Outputs:** Armatures (Armatures); Objects (Objects List); Bone Map (Humanoid Bone Map); Expression Map (Expression Map); Spring Data (Spring Data); Meta (VRM Meta).

## Data Viewer

View a brief summary of connected data directly on the Data Viewer node in the Yugo node editor.

Connect data to the matching input and read the summary on the node, such as bone, expression, or spring counts, the character name, or a simulation summary.

For detailed VRM data, press **N** in the node editor and open **Yugo → VRM Snapshot**. Expand **Humanoid Mapping**, **Expression Targets**, **Spring Data**, or **Meta**. These panels display the first **VRM Data** node in the current graph.

**Inputs:** Bone Map (Humanoid Bone Map); Expression Map (Expression Map); Spring Data (Spring Data); Meta (VRM Meta); Simulation Data (Simulation Data).
