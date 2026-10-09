import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p);}}
walk(root);
const errors=[];
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  if(!html.includes('lang="en"'))errors.push(`${file}: missing English language declaration`);
  if(/[\u3400-\u9fff]/u.test(html))errors.push(`${file}: non-English text`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)errors.push(`${file}: duplicate anchor IDs`);
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const value=match[1].replaceAll('&amp;','&');
    if(/^(?:https?:|data:|mailto:)/.test(value))continue;
    const [relative,fragment]=value.split('#');
    const target=relative?path.resolve(path.dirname(file),decodeURIComponent(relative)):file;
    if(!target.startsWith(root+path.sep)||!fs.existsSync(target)){errors.push(`${path.relative(root,file)}: missing ${value}`);continue;}
    if(fragment&&target.endsWith('.html')&&!new RegExp(`\\bid="${fragment.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`).test(fs.readFileSync(target,'utf8')))errors.push(`${path.relative(root,file)}: missing anchor ${value}`);
  }
}
const index=JSON.parse(fs.readFileSync(path.join(root,'search-index.json'),'utf8'));
if(new Set(index.map(p=>p.id)).size!==index.length)errors.push('Duplicate search index pages');
for(const p of index){
  const [relative,fragment]=(p.url||p.id+'.html').split('#');
  const target=path.resolve(root,relative);
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target))errors.push('Search index target missing '+p.id);
  else if(fragment&&!fs.readFileSync(target,'utf8').includes(`id="${fragment}"`))errors.push('Search anchor missing '+p.id);
}
const pages=JSON.parse(fs.readFileSync(path.join(root,'pages.json'),'utf8'));
const expected=new Set([...pages.map(p=>path.resolve(root,p.id+'.html')),path.join(root,'404.html')]);
for(const file of files)if(!expected.has(file))errors.push('Obsolete generated page '+path.relative(root,file));
const nodes=JSON.parse(fs.readFileSync(path.join(root,'../data/nodes.json'),'utf8'));
const grouped=pages.flatMap(p=>p.nodeIds||[]);
if(new Set(grouped).size!==grouped.length)errors.push('A node appears in multiple groups');
for(const node of nodes)if(!grouped.includes(node.id))errors.push('Ungrouped node '+node.title);
for(const id of ['yugo-layer','camera','tutorials/index','tutorials/getting-started','tutorials/first-node-graph'])if(!fs.readFileSync(path.join(root,id+'.html'),'utf8').includes('Page Work in Progress'))errors.push('Missing WIP label '+id);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Checked ${files.length} HTML files, ${index.length} search entries, local links, image paths, anchors, and English/WIP markers.`);
