Build physics descriptions from VRM springs and rigid objects, then run them through the shared YugoPhysics solver.

![Yugo Physics frame with spring conversion, rigid body conversion, and YugoPhysics Solver](../assets/images/nodes-physics.png)

## Spring to YugoPhysics

Convert authored VRM spring settings into a YugoPhysics description for the shared MuJoCo solver.

Connect VRM Data → Spring Data to this node, then route Physics Description to the solver.

**Inputs:** Spring Data (Spring Data).

**Output:** Physics Description (Physics Description).

## Rigid Body to YugoPhysics

Convert the selected object list into a rigid-body physics description.

Create an Objects List for the rigid objects and connect it here. Route Physics Description to the solver, or combine descriptions with a Mixer configured for physics data.

**Inputs:** Objects (Objects List).

**Output:** Physics Description (Physics Description).

## YugoPhysics Solver

Build and run a shared MuJoCo simulation from a physics description, then expose object transforms, bone transforms, and diagnostic samples.

Connect Physics Description and use Build before Play. Route Object Transforms or Bone Transforms to the corresponding [output nodes](outputs.html), and drive their Enter sockets with Updated. After changing the description, use Stop → Build → Play. Physics Hz controls the simulation step rate; recording adds diagnostic overhead. Connect Simulation Data to Data Viewer to inspect samples.

**Inputs:** Physics Description (Physics Description); Play (Update Event); Stop (Update Event); Reset (Update Event).

**Outputs:** Object Transforms (Object Transforms); Bone Transforms (Bone Transform); Updated (Update Event); Simulation Data (Simulation Data).
