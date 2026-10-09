import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The checked-in catalog is the documented snapshot. Regeneration never changes it.
const catalogPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'data/nodes.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const descriptions = {
  vrm_data: 'Read a VRM character snapshot: its armature, mesh objects, humanoid bone map, expression map, spring data, and metadata.',
  armature_value: 'Choose a Blender armature and provide it to nodes that need a character target.',
  objects_value: 'Build an explicit list of Blender objects for shape-key output or rigid-body conversion.',
  bone_map_value: 'Create a humanoid-to-Blender bone mapping for a chosen armature.',
  expression_map_value: 'Create a mapping between expression channels and their character targets.',
  data_viewer: 'View a brief summary of connected data directly on the Data Viewer node in the Yugo node editor.',
  object_value: 'Provide a reference to one Blender object.',
  collection_value: 'Provide a reference to a Blender collection.',
  vmc_source: 'Receive humanoid motion and expression channels from a VMC sender over the network.',
  ifacial_source: 'Receive facial expression channels and head motion from iFacialMocap, with a calibration input and optional mirroring.',
  action_source: 'Sample a Blender Action as humanoid motion using a source bone map.',
  head_profile: 'Distribute head rotation across the head, neck, chest, and spine using a preset or custom multipliers.',
  humanoid_mask: 'Define per-region weights for selected parts of the humanoid skeleton.',
  motion_smooth: 'Smooth humanoid motion, with an optional mask to select the regions affected.',
  mirror_motion: 'Mirror humanoid motion before mapping it to the target character.',
  motion_weight: 'Scale the influence of humanoid motion, optionally using different weights for masked regions.',
  motion_to_rotation: 'Convert humanoid motion into Blender bone transforms using a humanoid bone map.',
  expression_action: 'Provide an expression at a chosen strength when its Trigger input is active.',
  expression_mask: 'Apply a weight to a comma-separated selection of expression channels.',
  expression_smooth: 'Smooth expression values for named channels, or for all channels when Names is empty.',
  expression_lock: 'Lock eye or mouth expression groups while passing expression data through the graph.',
  expression_weight: 'Scale the influence of expression channels with a Weight value.',
  expression_to_shapes: 'Translate expression channels into shape-key values using the character expression map.',
  apply_object_transform: 'Write object transforms to Blender when an update event reaches Enter.',
  apply_rotation: 'Write bone transforms to the target armatures when an update event reaches Enter.',
  apply_shapes: 'Write shape-key values to the target objects when an update event reaches Enter.',
  hz_trigger: 'Emit update events at a chosen rate to drive a graph branch.',
  flow_repeat: 'Run the Body event branch for a configured number of repetitions.',
  spring_to_physics: 'Convert authored VRM spring settings into a YugoPhysics description for the shared MuJoCo solver.',
  rigid_to_physics: 'Convert the selected object list into a rigid-body physics description.',
  physics_solver: 'Build and run a shared MuJoCo simulation from a physics description, then expose object transforms, bone transforms, and diagnostic samples.'
};
const special = {
  vrm_data: ['Choose the character armature or connect an Armature node. Use Reload after changing the imported character data. Connect Bone Map and Expression Map to the corresponding conversion nodes.', 'This node provides character data; applying motion and expressions requires the output nodes.'],
  mixer: ['Choose Type before connecting values. The visible inputs and result change with that choice. Use Factor for interpolation where supported; maps and physics descriptions use the available merge mode.', 'The socket diagram shows the default Float configuration. Other types expose their own sockets.'],
  vmc_source: ['Set Port to match the VMC sender, then use the connection controls on the node. Route the motion and expression outputs through the appropriate processing and conversion nodes.', 'Default receiver port: 39539. Data reception does not apply a pose to Blender by itself.'],
  ifacial_source: ['Set iPhone Address and Device Port for the device on your network. Use the connection controls and calibrate from the node or its Calibrate input before tuning head motion.', 'The initial address is 127.0.0.1; replace it with the device address for a remote iPhone. Default Device Port: 49983.'],
  action_source: ['Select the Action and supply the bone map for the armature that authored it. Adjust Speed, Frame Offset, and Cyclic to fit the performance.', 'The source bone map describes the animation source; the later Motion to Bone Transform node uses the target character map.'],
  meta_value: ['Enter Name and Author; expand Details for the remaining fields. Connect String nodes to override individual text fields.', 'Disconnect a text input to restore its manually entered value. This does not rewrite the imported VRM metadata.'],
  image_value: ['Choose an image already loaded in Blender, or use the node control to open a local image file. Connect Image to a compatible consumer.', 'This value node does not download an image.'],
  image_from_url: ['Connect a String node to URL, then connect Image to a compatible consumer.', 'A connected consumer requests the download. The value node itself samples the URL reference.'],
  humanoid_mask: ['Adjust the region weights, then connect Mask to Motion Smooth or Motion Weight.', 'This node outputs a mask, not motion.'],
  motion_smooth: ['Connect Motion and adjust Smooth. Supply a Humanoid Mask when only selected regions should be affected.', 'Smoothing trades immediate response for a steadier result. A zero smoothing value passes motion through.'],
  motion_delay: ['Connect Motion and choose Delay Seconds manually or through a Float connection.', 'A delay intentionally adds latency. Check its effect alongside live tracking and other animation sources.'],
  expression_smooth: ['Connect Expressions, adjust Smooth, and use Names to select channels. Leave Names empty to affect all expressions.', 'Repeated reads at the same timestamp reuse the filtered result rather than advancing the filter again.'],
  apply_rotation: ['Connect Bone Transform and Armatures. Connect Hz Trigger, a flow node, or a solver Updated event to Enter so Blender receives updates.', 'Data connections alone do not schedule scene writes. End reports completion of this output event.'],
  apply_shapes: ['Connect Shape Keys Values and Objects. Drive Enter with an update event to apply expressions to the meshes.', 'Use the object list belonging to the character whose expression map produced the values.'],
  apply_object_transform: ['Connect Object Transforms from the solver and connect its Updated event to Enter.', 'Use the Apply control to enable or disable scene writes.'],
  spring_to_physics: ['Connect VRM Data → Spring Data to this node, then route Physics Description to the solver.', 'This conversion uses authored spring settings. The retired Spring Simulation (Legacy) node is unavailable in 0.10.0.'],
  rigid_to_physics: ['Create an Objects List for the rigid objects and connect it here. Route Physics Description to the solver, or combine descriptions with a Mixer configured for physics data.', 'Check the source objects and their physics configuration before rebuilding the solver.'],
  physics_solver: ['Connect a physics description. Use Build before Play, then route Object Transforms or Bone Transforms to their output nodes. Updated can drive those nodes when the simulation advances.', 'After changing the description, use Stop → Build → Play. Recording adds overhead; export diagnostic data before loading another file, Undo, or shutting down the add-on.'],
  flow_repeat: ['Choose Count and connect Body to the event path to repeat. Enter starts the run; Cancel stops it.', 'Check the completion behavior of the connected event path when building a repeating workflow.']
};
const groups = JSON.parse(fs.readFileSync(path.join(root, 'data/node-groups.json'), 'utf8'));
const byId = new Map(catalog.map(node => [node.id, node]));
const usage = {
  float_value: 'Set Value and connect it to a numeric control such as a weight, smoothing amount, or math input. Values are not restricted to 0–1; use Clamp when a downstream control needs a fixed range.',
  vector_value: 'Set X, Y, and Z together when a graph needs a constant or animated vector. Use Combine XYZ instead when each component should come from a separate connection.',
  string_value: 'Enter a string and connect Text to a text input, such as Image From URL or a metadata field.',
  armature_value: 'Choose the armature and connect Armatures to the target input. Keep the armature consistent with the bone map used to convert its motion.',
  object_value: 'Choose the object with the picker and connect Object to a compatible input. For consumers that require a list, use Objects List instead.',
  objects_value: 'Add the objects that a downstream operation should affect. A character mesh list can feed shape-key output; a rigid object list can feed Rigid Body to YugoPhysics.',
  collection_value: 'Choose a collection and connect Collection to a compatible input. This socket carries the collection reference rather than an Objects List.',
  bone_map_value: 'Choose the armature and assign its bones to the humanoid entries. Use the resulting Bone Map for an Action source or a motion conversion. For an imported VRM character, VRM Data can supply its existing map.',
  expression_map_value: 'Add the expression entries and configure their bindings. Connect Expression Map to Expression Action or Expressions to ShapeKeysValues. Use VRM Data when the imported character already contains the mapping you need.',
  data_viewer: 'Connect data to the matching input and read the summary on the node, such as bone, expression, or spring counts, the character name, or a simulation summary.',
  math: 'Choose Add, Subtract, Multiply, Divide, Multiply Add, Minimum, Maximum, or Absolute. Connect the operands needed by that operation. Multiply Add uses A × B + C; Divide returns zero for a zero divisor.',
  clamp: 'Connect the source to Value and set the permitted range. For example, Min 0 and Max 1 keep a weight inside a normalized range.',
  map_range: 'Set From Min and From Max to the source range, then To Min and To Max to the desired range. Enable Clamp to limit the mapped factor to 0–1 before applying the output range.',
  combine_xyz: 'Connect or enter X, Y, and Z separately. Use the Vector output when another node expects all three components in a single connection.',
  separate_xyz: 'Connect Vector, then send each component to numeric processing. Combine XYZ can put the adjusted components back together.',
  vector_math: 'Choose an operation and connect the required vectors. Add, Subtract, Scale, Cross Product, and Normalize produce a vector. Dot Product, Length, and Distance produce a numeric value. Normalize returns zero for a zero vector.',
  mixer: 'Choose Type before connecting data; the sockets change to match. Supported types include Float, Vector, Humanoid Motion, Bone Transforms, Expressions, Bone Map, Expression Map, Physics Description, and Object Transforms. Use Factor for blending where available. Expression modes are Replace, Add, and Maximum; Clamp Factor keeps the factor within 0–1.',
  hz_trigger: 'Choose 8, 12, 24, 30, or 60 Hz, then connect Trigger to an output node or a flow branch. The default is 60 Hz. The event schedules graph work; it does not guarantee the scene will render at that frame rate.',
  flow_if: 'Connect Enter to the incoming event. It emits True when Condition is above zero, and False otherwise. Connect each output to the corresponding branch.',
  flow_gate: 'Connect Enter to the incoming events and use Open to control the gate. Events pass to End while Open is above zero, allowing you to enable or pause a branch without changing its data connections.',
  flow_delay: 'Set Seconds and send an event to Enter. End fires after the wait. Additional Enter events are ignored while waiting; Reset cancels the pending wait.',
  flow_wait_until: 'Send an event to Enter to begin waiting. End fires when Condition becomes true. Reset cancels the wait.',
  flow_once: 'The first Enter reaches End. Further events are ignored until Reset allows the node to run again.',
  flow_sequence: 'Connect the steps to Then 1, Then 2, and Then 3. Each Enter emits those outputs in that order. Use a completion event when a later step depends on an earlier asynchronous operation finishing.',
  flow_every_n: 'Set Every N to the interval you need. End fires at that interval, and Reset restarts the count. This can reduce how often an event branch runs.',
  flow_repeat: 'Set Count, connect the repeated work to Body, and start through Enter. Cancel stops the run. Check the completion behavior of the connected branch when combining this node with waiting operations.',
  head_profile: 'Connect Motion and select Normal, Live2D, or Custom. Custom lets you keep manually adjusted rotation multipliers. Compare the result on your character while turning and tilting your head.',
  motion_weight: 'Connect Motion and adjust Weight. Supply a Humanoid Mask to use different influence across regions. Use [Mixer](math-mixer.html#mixer) when combining two motion sources.',
  mirror_motion: 'Insert this node in the motion path when you need a mirrored result, then continue to Motion to Bone Transform.',
  motion_to_rotation: 'Connect Motion and the target character Bone Map. Send Bone Transform to [Bone Transforms to Armature](outputs.html#bone-transforms-to-armature), along with the matching armature and an update event.',
  expression_action: 'Connect the character Expression Map, choose an Expression, and set Strength. Use [Mixer](math-mixer.html#mixer) in Expressions mode to combine this expression with facial tracking.',
  expression_mask: 'Enter the channel names in Names, separated by commas, and set Weight. For example, selecting blinkLeft and blinkRight lets you adjust those channels within the expression stream.',
  expression_smooth: 'Connect Expressions and adjust Smooth. Enter comma-separated Names to choose channels, or leave Names empty to affect all expressions. Check fast movements such as blinks while tuning the smoothing amount.',
  expression_lock: 'Connect Expressions and enable Lock Eyes, Lock Mouth, or both for the groups you want to lock. The node passes the resulting expression data to the next operation.',
  expression_weight: 'Connect Expressions and adjust Weight manually or through a Float input. Use Expression Mask when only named channels should be adjusted.',
  expression_to_shapes: 'Connect Expressions and the target character Expression Map. Send Shape Keys Values to [ShapeKeysValues to Objects List](outputs.html#shapekeysvalues-to-objects-list), using that character mesh list and an update event.',
  physics_solver: 'Connect Physics Description and use Build before Play. Route Object Transforms or Bone Transforms to the corresponding [output nodes](outputs.html), and drive their Enter sockets with Updated. After changing the description, use Stop → Build → Play. Physics Hz controls the simulation step rate; recording adds diagnostic overhead. Connect Simulation Data to Data Viewer to inspect samples.'
};
const notes = {
  data_viewer: 'For detailed VRM data, press **N** in the node editor and open **Yugo Node → VRM Snapshot**. Expand **Humanoid Mapping**, **Expression Targets**, **Spring Data**, or **Meta**. These panels display the first **VRM Data** node in the current graph.',
  vrm_data: 'Data connections provide the character information; [output nodes](outputs.html) apply the evaluated motion and expressions to Blender.',
  vmc_source: 'The default receiver port is 39539. Receiving data does not apply a pose to Blender by itself.',
  ifacial_source: 'The initial address is 127.0.0.1; replace it with the device address for a remote iPhone. The default Device Port is 49983. Mirror reverses head yaw and roll.',
  action_source: 'The source bone map describes the animation source; the later Motion to Bone Transform node uses the target character map.',
  meta_value: 'Disconnect a text input to restore its manually entered value. This node does not rewrite imported VRM metadata.',
  image_from_url: 'A connected consumer requests the download when it needs the image.',
  humanoid_mask: 'This node produces a selection mask; the receiving operation determines how that mask affects motion.',
  motion_smooth: 'Smoothing trades immediate response for a steadier result. A zero smoothing value passes motion through.',
  motion_delay: 'A delay intentionally adds latency. Check its effect alongside live tracking and other animation sources.',
  apply_rotation: 'Data connections alone do not schedule scene writes. End reports completion of this output event.',
  apply_shapes: 'Use the object list belonging to the character whose expression map produced the values.',
  apply_object_transform: 'Use Apply to enable or disable scene writes.',
  flow_repeat: 'Available in the current catalog; not shown in the screenshot above.'
};

const covered = groups.flatMap(group => group.nodeIds);
const unknown = covered.filter(id => !byId.has(id));
const missing = catalog.filter(node => !covered.includes(node.id));
if (unknown.length || missing.length || new Set(covered).size !== covered.length) {
  throw new Error('Invalid node groups. Unknown: ' + unknown.join(', ') + '. Missing: ' + missing.map(node => node.id).join(', ') + '. Every catalog node must appear exactly once.');
}

function sockets(label, values) {
  if (!values.length) return '';
  return '**' + label + ':** ' + values.map(socket => socket.name + ' (' + socket.type + ')').join('; ') + '.\n\n';
}
const pages = [];
fs.mkdirSync(path.join(root, 'content/nodes'), { recursive: true });
for (const group of groups) {
  let source = group.description + '\n\n![' + group.imageAlt + '](' + group.image + ')\n\n';
  if (group.note) source += group.note + '\n\n';
  for (const id of group.nodeIds) {
    const node = byId.get(id);
    const key = id.replace('YUGUS_NODE_', '');
    const description = descriptions[key] || node.description;
    const instructions = usage[key] || special[key]?.[0];
    if (!description || !instructions) throw new Error('Missing editorial text: ' + id);
    source += '## ' + node.title + '\n\n' + description.replace(/[.]$/, '') + '.\n\n' + instructions + '\n\n';
    if (notes[key]) source += notes[key] + '\n\n';
    if (key === 'mixer') source += '**Default Float sockets:** Factor, Float A, Float B → Float Result. Other types expose their own sockets.\n\n';
    else source += sockets('Inputs', node.inputs) + sockets(node.outputs.length === 1 ? 'Output' : 'Outputs', node.outputs);
  }
  const file = 'content/' + group.id + '.md';
  fs.writeFileSync(path.join(root, file), source.trimEnd() + '\n');
  pages.push({ id: group.id, title: group.title, section: 'Node Reference', category: group.title, isCategory: true, file, nodeIds: group.nodeIds });
}

const groupTable = groups.map(group => '| [' + group.title + '](' + path.posix.basename(group.id) + '.html) | ' + group.summary + ' |').join('\n');
const index = 'The building blocks for tracking, animation, expressions, and physics in Yugo. Browse eight groups arranged to match the frames in the node screenshots.\n\n'
  + '## Browse the nodes\n\n| Group | What you can do |\n| --- | --- |\n' + groupTable + '\n\n'
  + '## Example Nodes\n\nExample node setups are coming soon. Use them to explore Yugo, learn how nodes connect, and build your own workflows.\n\n'
  + '## A character workflow\n\n'
  + '1. Read the character with [VRM Data](inputs.html#vrm-data), and choose a tracking or animation source from Inputs.\n'
  + '2. Shape its [motion](motion-operation.html) and [expressions](expression-operation.html) as needed. Use the character maps when converting these streams into bone transforms and shape-key values.\n'
  + '3. Use [Output nodes](outputs.html) to apply the processed data to objects in your Blender scene. Connect [Hz Trigger](flow-control.html#hz-trigger) or another update event source to Enter to apply the changes.\n'
  + '4. Add [Physics](physics.html) for authored springs or rigid objects. The solver Updated event can drive the related transform outputs.\n';
fs.writeFileSync(path.join(root, 'content/nodes/index.md'), index);
fs.writeFileSync(path.join(root, 'data/node-pages.json'), JSON.stringify(pages, null, 2) + '\n');
console.log('Wrote ' + groups.length + ' grouped node pages and the overview, covering ' + covered.length + ' nodes.');
