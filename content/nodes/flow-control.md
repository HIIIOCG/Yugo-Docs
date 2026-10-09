Decide when a graph branch runs, where its update events go, and when it continues. This page follows the FlowControl frame in the screenshot.

![Yugo Math, Mixer, and FlowControl frames, including event routing nodes](../assets/images/nodes-math-flow.png)

Update Event sockets carry scheduled events. Trigger sockets such as Condition and Open carry a value used as a condition.

## Hz Trigger

Emit update events at a chosen rate to drive a graph branch.

Choose 8, 12, 24, 30, or 60 Hz, then connect Trigger to an output node or a flow branch. The default is 60 Hz. The event schedules graph work; it does not guarantee the scene will render at that frame rate.

**Output:** Trigger (Update Event).

## If

Send Enter to True when Condition is above zero, otherwise False.

Connect Enter to the incoming event. It emits True when Condition is above zero, and False otherwise. Connect each output to the corresponding branch.

**Inputs:** Enter (Update Event); Condition (Trigger).

**Outputs:** True (Update Event); False (Update Event).

## Gate

Pass Enter to End while Open is above zero.

Connect Enter to the incoming events and use Open to control the gate. Events pass to End while Open is above zero, allowing you to enable or pause a branch without changing its data connections.

**Inputs:** Enter (Update Event); Open (Trigger).

**Output:** End (Update Event).

## Delay

Wait before End; ignore further Enter while waiting; Reset cancels the wait.

Set Seconds and send an event to Enter. End fires after the wait. Additional Enter events are ignored while waiting; Reset cancels the pending wait.

**Inputs:** Enter (Update Event); Reset (Update Event).

**Output:** End (Update Event).

## Wait Until

After Enter, wait for Condition to become true; Reset cancels the wait.

Send an event to Enter to begin waiting. End fires when Condition becomes true. Reset cancels the wait.

**Inputs:** Enter (Update Event); Condition (Trigger); Reset (Update Event).

**Output:** End (Update Event).

## Once

Pass the first Enter to End; Reset allows it to run again.

The first Enter reaches End. Further events are ignored until Reset allows the node to run again.

**Inputs:** Enter (Update Event); Reset (Update Event).

**Output:** End (Update Event).

## Flow Sequence

Run Then 1, Then 2, and Then 3 in order for each Enter.

Connect the steps to Then 1, Then 2, and Then 3. Each Enter emits those outputs in that order. Use a completion event when a later step depends on an earlier asynchronous operation finishing.

**Inputs:** Enter (Update Event).

**Outputs:** Then 1 (Update Event); Then 2 (Update Event); Then 3 (Update Event).

## Every N

Pass every Nth Enter to End; Reset restarts the count.

Set Every N to the interval you need. End fires at that interval, and Reset restarts the count. This can reduce how often an event branch runs.

**Inputs:** Enter (Update Event); Reset (Update Event).

**Output:** End (Update Event).

## Repeat

Run the Body event branch for a configured number of repetitions.

Set Count, connect the repeated work to Body, and start through Enter. Cancel stops the run. Check the completion behavior of the connected branch when combining this node with waiting operations.

Available in the current catalog; not shown in the screenshot above.

**Inputs:** Enter (Update Event); Cancel (Update Event).

**Outputs:** End (Update Event); Cancelled (Update Event); Failed (Update Event); Running (Trigger); Body (Update Event).
