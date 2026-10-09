Create and adjust expression channels, then convert them into shape-key values for your character. Channel names and the character expression map connect these operations to the intended facial controls.

![Yugo Motion Operation and Expression Operation frames, including facial expression nodes](../assets/images/nodes-motion-expression.png)

The Mixer in this frame is [Mixer](math-mixer.html#mixer) configured for Expressions. Its Replace, Add, and Maximum modes combine expression streams in different ways.

## Expression Action

Provide an expression at a chosen strength when its Trigger input is active.

Connect the character Expression Map, choose an Expression, and set Strength. Use [Mixer](math-mixer.html#mixer) in Expressions mode to combine this expression with facial tracking.

**Inputs:** Trigger (Trigger); Expression Map (Expression Map).

**Output:** Expressions (Expression Channels).

## Expression Mask

Apply a weight to a comma-separated selection of expression channels.

Enter the channel names in Names, separated by commas, and set Weight. For example, selecting blinkLeft and blinkRight lets you adjust those channels within the expression stream.

**Inputs:** Expressions (Expression Channels).

**Output:** Expressions (Expression Channels).

## Expression Smooth

Smooth expression values for named channels, or for all channels when Names is empty.

Connect Expressions and adjust Smooth. Enter comma-separated Names to choose channels, or leave Names empty to affect all expressions. Check fast movements such as blinks while tuning the smoothing amount.

**Inputs:** Expressions (Expression Channels); Smooth (Float).

**Output:** Expressions (Expression Channels).

## Expression Lock

Lock eye or mouth expression groups while passing expression data through the graph.

Connect Expressions and enable Lock Eyes, Lock Mouth, or both for the groups you want to lock. The node passes the resulting expression data to the next operation.

**Inputs:** Expressions (Expression Channels).

**Output:** Expressions (Expression Channels).

## Expression Weight

Scale the influence of expression channels with a Weight value.

Connect Expressions and adjust Weight manually or through a Float input. Use Expression Mask when only named channels should be adjusted.

**Inputs:** Expressions (Expression Channels); Weight (Float).

**Output:** Expressions (Expression Channels).

## Expressions to ShapeKeysValues

Translate expression channels into shape-key values using the character expression map.

Connect Expressions and the target character Expression Map. Send Shape Keys Values to [ShapeKeysValues to Objects List](outputs.html#shapekeysvalues-to-objects-list), using that character mesh list and an update event.

**Inputs:** Expressions (Expression Channels); Expression Map (Expression Map).

**Output:** Shape Keys Values (Shape Keys Values).
