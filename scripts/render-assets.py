"""Render the supplied sample in memory. Never save or overwrite the blend file."""
from pathlib import Path
import bpy
import sys
import argparse
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'images'
OUT.mkdir(parents=True,exist_ok=True)
parser = argparse.ArgumentParser()
parser.add_argument('--blend', type=Path, default=ROOT.parent/'Yugo-BlenderVtubing-Dev'/'tests'/'vrm_sampleA.blend')
args = parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
bpy.ops.wm.open_mainfile(filepath=str(args.blend.resolve()),load_ui=False)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = True
scene.render.use_compositing = False
scene.render.use_sequencer = False
scene.view_settings.view_transform = 'Standard'
from mathutils import Quaternion
from math import radians
armature = next(o for o in scene.objects if o.type == 'ARMATURE')
for bone in armature.pose.bones:
    if 'UpperArm' in bone.name:
        axis = bone.bone.matrix_local.to_3x3().inverted() @ Vector((0,1,0))
        bone.rotation_mode = 'QUATERNION'
        bone.rotation_quaternion = Quaternion(axis, radians(58 if bone.bone.head_local.x > 0 else -58))
bpy.context.view_layer.update()
scene.world = bpy.data.worlds.new('Documentation World')
scene.world.use_nodes = True
scene.world.node_tree.nodes.get('Background').inputs[0].default_value = (0.65,0.7,0.8,1)
scene.world.node_tree.nodes.get('Background').inputs[1].default_value = 0.4
for o in scene.objects:
    if o.type=='LIGHT': o.hide_render=True
for name,position,energy,size in [('Key',(1,-3,4),180,3),('Fill',(-2,-1,2),100,3),('Rim',(0,2,3),230,2)]:
    data = bpy.data.lights.new('Docs '+name,'AREA'); data.energy=energy; data.shape='DISK'; data.size=size
    obj=bpy.data.objects.new('Docs '+name,data); scene.collection.objects.link(obj); obj.location=position
    obj.rotation_euler=(Vector((0,0,1.1))-obj.location).to_track_quat('-Z','Y').to_euler()
camera=scene.camera
camera.data.type='ORTHO'
def render(name,position,target,scale,width,height):
    camera.location=position; camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler(); camera.data.ortho_scale=scale
    scene.render.resolution_x=width;scene.render.resolution_y=height
    scene.render.filepath=str(OUT/name)
    bpy.ops.render.render(write_still=True)
    print('ASSET_RENDERED',name,flush=True)
render('character-portrait.png',(0.38,-3,1.48),(0,0,1.27),0.84,960,960)
render('character-full.png',(0.2,-4,1.1),(0,0,0.77),1.85,1000,1100)
scene.render.engine='BLENDER_WORKBENCH'
scene.display.shading.light='STUDIO'
scene.display.shading.color_type='SINGLE'
scene.display.shading.single_color=(0.32,0.6,0.57)
scene.display.shading.show_cavity=True
scene.display.shading.cavity_type='BOTH'
render('character-geometry.png',(0.2,-4,1.1),(0,0,0.77),1.85,1000,1100)
print('RENDER_COMPLETE',flush=True)
