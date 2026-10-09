"""Capture the actual available node interfaces in an isolated Blender process."""
import sys
import json
from pathlib import Path
import bpy
import argparse

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, default=ROOT.parent/'Yugo-BlenderVtubing-Dev')
args = parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
sys.path.insert(0, str(args.source/'addons'))
import yugo_node
yugo_node.register()
from yugo_node.nodes import NODE_MENU
from yugo_node.availability import is_available
menu = list(NODE_MENU) + [('Physics', [('YUGUS_NODE_spring_to_physics','Spring to YugoPhysics'),('YUGUS_NODE_rigid_to_physics','Rigid Body to YugoPhysics'),('YUGUS_NODE_physics_solver','YugoPhysics Solver')])]
tree = bpy.data.node_groups.new('Documentation inspection', 'YUGUS_NT_humanoid_motion')
catalog = []
for category, items in menu:
    for kind, label in items:
        if not is_available(kind): continue
        node = tree.nodes.new(kind)
        params = []
        declared = set()
        for base in type(node).__mro__:
            declared.update(getattr(base, '__annotations__', {}))
        for p in node.bl_rna.properties:
            if p.identifier not in declared or p.is_readonly or p.type=='COLLECTION': continue
            if p.is_hidden or p.is_skip_save: continue
            val = getattr(node, p.identifier, None)
            if p.type=='POINTER': val = None
            elif getattr(p, 'is_array', False): val = list(val)
            elif not isinstance(val, (str,int,float,bool,list,tuple,type(None))): val = str(val)
            if p.identifier.endswith('_index'): continue
            params.append(dict(key=p.identifier,name=p.name,description=p.description,default=val,choices=[dict(name=e.name,value=e.identifier,description=e.description) for e in p.enum_items] if p.type=='ENUM' else []))
        def sockets(items): return [dict(name=s.name,type=s.bl_label,default=getattr(s,'default_value',None) if isinstance(getattr(s,'default_value',None),(str,int,float,bool)) else None) for s in items]
        catalog.append(dict(id=kind,title=label,category=category,description=node.bl_description,inputs=sockets(node.inputs),outputs=sockets(node.outputs),parameters=params))
(ROOT/'.cache'/'live-nodes.json').write_text(json.dumps(catalog,indent=2),encoding='utf-8')
print('CATALOG_COMPLETE',len(catalog))
yugo_node.unregister()
