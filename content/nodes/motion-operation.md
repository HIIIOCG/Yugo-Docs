Adjust humanoid motion before converting it to transforms for your character. Use masks, weights, smoothing, mirroring, and timing to shape the result.

![Yugo Motion Operation and Expression Operation frames in Blender](../assets/images/nodes-motion-expression.png)

The Mixer in this frame is the same [Mixer](math-mixer.html#mixer) used elsewhere, configured for Humanoid Motion or Bone Transforms.

## Head Rotation Profile

Distribute head rotation across the head, neck, chest, and spine using a preset or custom multipliers.

Connect Motion and select Normal, Live2D, or Custom. Custom lets you keep manually adjusted rotation multipliers. Compare the result on your character while turning and tilting your head.

**Inputs:** Motion (VRM Humanoid Motion).

**Output:** Motion (VRM Humanoid Motion).

## Humanoid Mask

Define per-region weights for selected parts of the humanoid skeleton.

Adjust the region weights, then connect Mask to Motion Smooth or Motion Weight.

This node produces a selection mask; the receiving operation determines how that mask affects motion.

**Output:** Mask (Humanoid Mask).

## Motion Weight

Scale the influence of humanoid motion, optionally using different weights for masked regions.

Connect Motion and adjust Weight. Supply a Humanoid Mask to use different influence across regions. Use [Mixer](math-mixer.html#mixer) when combining two motion sources.

**Inputs:** Motion (VRM Humanoid Motion); Mask (Humanoid Mask); Weight (Float).

**Output:** Motion (VRM Humanoid Motion).

## Motion Smooth

Smooth humanoid motion, with an optional mask to select the regions affected.

Connect Motion and adjust Smooth. Supply a Humanoid Mask when only selected regions should be affected.

Smoothing trades immediate response for a steadier result. A zero smoothing value passes motion through.

**Inputs:** Motion (VRM Humanoid Motion); Mask (Humanoid Mask); Smooth (Float).

**Output:** Motion (VRM Humanoid Motion).

## Motion Delay

Delay Humanoid Motion by a number of seconds.

Connect Motion and choose Delay Seconds manually or through a Float connection.

A delay intentionally adds latency. Check its effect alongside live tracking and other animation sources.

**Inputs:** Motion (VRM Humanoid Motion); Delay Seconds (Float).

**Output:** Motion (VRM Humanoid Motion).

## Mirror Motion

Mirror humanoid motion before mapping it to the target character.

Insert this node in the motion path when you need a mirrored result, then continue to Motion to Bone Transform.

**Inputs:** Motion (VRM Humanoid Motion).

**Output:** Motion (VRM Humanoid Motion).

## Motion to Bone Transform

Convert humanoid motion into Blender bone transforms using a humanoid bone map.

Connect Motion and the target character Bone Map. Send Bone Transform to [Bone Transforms to Armature](outputs.html#bone-transforms-to-armature), along with the matching armature and an update event.

**Inputs:** Motion (VRM Humanoid Motion); Bone Map (Humanoid Bone Map).

**Output:** Bone Transform (Bone Transform).
