import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const config=JSON.parse(fs.readFileSync(path.join(root,'site.json'),'utf8'));
const nodePages=JSON.parse(fs.readFileSync(path.join(root,'data/node-pages.json'),'utf8'));
const nodes=JSON.parse(fs.readFileSync(path.join(root,'data/nodes.json'),'utf8'));
const sections=['Welcome','Tutorials','User Guide','Node Reference'];
const pages=sections.flatMap(section=>[...config.pages,...nodePages].filter(p=>p.section===section));
if(new Set(pages.map(p=>p.id)).size!==pages.length)throw Error('Duplicate page IDs');
// Remove obsolete generated pages when the navigation is consolidated.
const previousManifest=path.join(out,'pages.json');
if(fs.existsSync(previousManifest))for(const page of JSON.parse(fs.readFileSync(previousManifest,'utf8'))){
  if(pages.some(p=>p.id===page.id))continue;
  const obsolete=path.resolve(out,page.id+'.html');
  if(!obsolete.startsWith(out+path.sep))throw Error('Invalid generated page path');
  if(fs.existsSync(obsolete))fs.unlinkSync(obsolete);
}
fs.mkdirSync(out,{recursive:true});
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
fs.writeFileSync(path.join(out,'.nojekyll'),'');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const href=(page,target)=>path.posix.relative(path.posix.dirname(page.id),target+'.html');
const prefix=page=>'../'.repeat(page.id.split('/').length-1);
const inline=s=>escape(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<figure><img src="$2" alt="$1" loading="lazy"></figure>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
function nodeDiagram(node){
  const sockets=(items,direction)=>items.map(s=>`<div class="socket ${direction}"><i></i><span>${escape(s.name)}</span></div>`).join('');
  return `<figure class="node-figure"><div class="node-preview"><div class="node-title"><span class="node-icon">◇</span>${escape(node.title)}</div><div class="node-sockets"><div>${sockets(node.inputs,'input')}</div><div>${sockets(node.outputs,'output')}</div></div></div><figcaption>Initial configuration · ${escape(node.category)}</figcaption></figure>`;
}
function markdown(source){
  const lines=source.replaceAll('\r','').split('\n'),toc=[],html=[];let i=0;
  const ids=new Map();
  while(i<lines.length){
    const line=lines[i];if(!line.trim()){i++;continue;}
    const image=line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if(image){html.push(`<figure class="reference-figure"><a href="${escape(image[2])}" aria-label="Open full-size image: ${escape(image[1])}"><img src="${escape(image[2])}" alt="${escape(image[1])}" loading="lazy"></a><figcaption>${escape(image[1])} · <a href="${escape(image[2])}">Open full size</a></figcaption></figure>`);i++;continue;}
    if(line.startsWith('<!-- node-diagram:')){const id=line.match(/node-diagram:([^ ]+)/)?.[1]?.replace('-->','');const node=nodes.find(n=>n.id===id);if(!node)throw Error('Unknown node '+id);html.push(nodeDiagram(node));i++;continue;}
    if(line==='<!-- performance-diagram -->'){html.push('<figure class="performance-figure"><div class="performance-images"><div><img src="assets/images/character-full.png" alt="VRM sample character with its original materials" width="1000" height="1100" loading="lazy"><span>Material view</span></div><div><img src="assets/images/character-geometry.png" alt="Geometry-focused render of the same VRM character" width="1000" height="1100" loading="lazy"><span>Geometry view</span></div></div><figcaption>Same sample character · illustrative views</figcaption></figure>');i++;continue;}
    if(line==='<!-- workflow-diagram -->'){html.push('<div class="workflow" aria-label="Data sources flow through processing into scene outputs"><div><small>01 / INPUT</small><strong>Sources</strong><span>Tracking · Actions · Values</span></div><b aria-hidden="true">→</b><div><small>02 / SHAPE</small><strong>Processing</strong><span>Mask · Smooth · Mix</span></div><b aria-hidden="true">→</b><div><small>03 / APPLY</small><strong>Blender</strong><span>Motion · Expressions · Physics</span></div></div>');i++;continue;}
    const heading=line.match(/^(#{2,3}) (.+)/);if(heading){let id=slug(heading[2]);const count=ids.get(id)||0;ids.set(id,count+1);if(count)id+='-'+count;toc.push({id,title:heading[2],level:heading[1].length});html.push(`<h${heading[1].length} id="${id}">${inline(heading[2])}<a class="heading-anchor" href="#${id}" aria-label="Link to ${escape(heading[2])}">#</a></h${heading[1].length}>`);i++;continue;}
    if(line.startsWith('>')){const block=[];while(i<lines.length&&lines[i].startsWith('>'))block.push(lines[i++].replace(/^> ?/,''));const wip=block[0]==='Page Work in Progress';html.push(`<aside class="callout ${wip?'wip':''}"><span class="callout-icon" aria-hidden="true">${wip?'◷':'i'}</span><div><strong>${inline(block[0])}</strong><p>${inline(block.slice(1).join(' '))}</p></div></aside>`);continue;}
    if(line.startsWith('|')&&/^\|[\s:|-]+\|$/.test(lines[i+1]||'')){const cells=s=>s.split('|').slice(1,-1).map(c=>c.trim());const heads=cells(line);i+=2;const rows=[];while(i<lines.length&&lines[i].startsWith('|'))rows.push(cells(lines[i++]));html.push(`<div class="table-wrap"><table><thead><tr>${heads.map(c=>'<th scope="col">'+inline(c)+'</th>').join('')}</tr></thead><tbody>${rows.map(row=>'<tr>'+row.map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>').join('')}</tbody></table></div>`);continue;}
    if(/^(- |\d+\. )/.test(line)){const ordered=/^\d+\./.test(line),items=[];while(i<lines.length&&new RegExp(ordered?'^\\d+\\. ':'^- ').test(lines[i]))items.push(lines[i++].replace(ordered?/^\d+\. /:/^- /,''));html.push(`<${ordered?'ol':'ul'}>${items.map(s=>'<li>'+inline(s)+'</li>').join('')}</${ordered?'ol':'ul'}>`);continue;}
    const paragraph=[];while(i<lines.length&&lines[i].trim()&&!/^(##|>|\||- |\d+\. |<!--)/.test(lines[i]))paragraph.push(lines[i++]);if(!paragraph.length)throw Error('Unsupported Markdown '+line);html.push('<p>'+inline(paragraph.join(' '))+'</p>');
  }
  return {html:html.join('\n'),toc};
}
function nav(page){
  let result='';
  for(const section of sections){
    result+=`<div class="nav-section"><div class="nav-label">${section}</div>`;
    const members=pages.filter(p=>p.section===section);
    for(const p of members)result+=navLink(page,p);
    result+='</div>';
  }
  return result;
}
function navLink(current,p,label){return `<a class="nav-link ${current.id===p.id?'active':''}" href="${href(current,p.id)}" ${current.id===p.id?'aria-current="page"':''}>${escape(label||p.shortTitle||p.title)}${p.status==='wip'?'<span class="wip-dot" title="Work in progress" aria-label="Work in progress"></span>':''}</a>`;}
// Fixed positions keep the decorative stars away from the character's face.
const heroStars=[
  {x:28,y:28,size:23,duration:7.8,delay:-2.3,rise:62,drift:-9,turn:48,outline:true},
  {x:63,y:16,size:12,duration:6.7,delay:-4.1,rise:46,drift:7,turn:-58},
  {x:81,y:26,size:29,duration:8.6,delay:-1.8,rise:72,drift:10,turn:-42,outline:true},
  {x:87,y:52,size:11,duration:6.2,delay:-4.7,rise:58,drift:-7,turn:64},
  {x:77,y:68,size:21,duration:8.1,delay:-3.2,rise:80,drift:9,turn:52,outline:true},
  {x:31,y:66,size:12,duration:7.1,delay:-5.6,rise:64,drift:-8,turn:-60},
  {x:23,y:83,size:26,duration:8.9,delay:-6.4,rise:86,drift:11,turn:44,outline:true},
  {x:52,y:88,size:11,duration:6.8,delay:-1.2,rise:56,drift:-6,turn:-54},
  {x:91,y:85,size:8,duration:7.6,delay:-3.9,rise:70,drift:-9,turn:68},
  {x:39,y:20,size:8,duration:6.5,delay:-5.2,rise:42,drift:6,turn:-46}
];
const heroSparkles=()=>`<div class="hero-sparkles" aria-hidden="true">${heroStars.map(star=>`<span class="hero-star${star.outline?' hero-star-outline':''}" style="--x:${star.x}%;--y:${star.y}%;--size:${star.size}px;--duration:${star.duration}s;--delay:${star.delay}s;--rise:${star.rise}px;--drift:${star.drift}px;--turn:${star.turn}deg"><svg viewBox="0 0 32 40" focusable="false"><path d="M16 2C14.4 13.4 11.4 17.4 2 20C11.4 22.6 14.4 26.6 16 38C17.6 26.6 20.6 22.6 30 20C20.6 17.4 17.6 13.4 16 2Z"/></svg></span>`).join('')}</div>`;
const hero=p=>`<section class="hero" aria-label="Yugo overview"><div class="hero-layout"><div class="hero-copy"><p class="hero-kicker">BUILT INSIDE BLENDER</p><h2><span>Your character</span> <span class="hero-title-secondary">&amp; workflow.</span></h2><p class="hero-description">Bring data together.</p><a class="hero-link" href="${href(p,'nodes/index')}">Explore the nodes <span aria-hidden="true">↗</span></a></div><div class="hero-visual"><img src="${prefix(p)}assets/images/doc-character.webp" srcset="${prefix(p)}assets/images/doc-character-small.webp 436w, ${prefix(p)}assets/images/doc-character.webp 872w" sizes="(max-width: 460px) calc(100vw - 46px), (max-width: 640px) 420px, 520px" alt="Yugo character rendered in Blender" width="872" height="960" fetchpriority="high">${heroSparkles()}</div></div></section>`;
const maker=base=>`<section class="sidebar-maker" aria-labelledby="maker-heading"><h2 id="maker-heading">Meet the makers</h2><a class="maker-brand" href="https://x.com/HiiioDigital" aria-label="Visit hiiio Digital on X"><img src="${base}assets/images/hiiio-logo.svg" alt="hiiio" width="110" height="21"></a><p>A 3D character studio in Taipei, and the team behind Yugo.</p><div class="maker-contacts"><a href="https://hiiiodigital.com/">Website <span aria-hidden="true">↗</span></a><a href="mailto:studio.hiiiocg@gmail.com">studio.hiiiocg@gmail.com</a></div></section>`;
const search=[];
for(let index=0;index<pages.length;index++){
  const page=pages[index],source=fs.readFileSync(path.join(root,page.file),'utf8').replaceAll('\r','');
  if(/[\u3400-\u9fff]/u.test(source))throw Error('Non-English content: '+page.file);
  const rendered=markdown(source),base=prefix(page),lead=source.split('\n')[0];
  const prev=pages[index-1],next=pages[index+1];
  const article=rendered.html.replace(/^<p>/,'<p class="lead">');
  const main=page.id==='index'?article.replace('</p>','</p>'+hero(page)):article;
  const breadcrumbs=escape(page.section);
  const html=`<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(lead)}"><meta name="theme-color" content="#161616"><title>${escape(page.title)} | ${config.title}</title><link rel="stylesheet" href="${base}assets/styles.css"><script>try{const theme=localStorage.getItem('yugo-theme');if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme}catch{}</script><script src="${base}assets/app.js" defer></script></head>
<body data-base="${base}"><a class="skip-link" href="#main">Skip to content</a><header class="topbar"><button class="menu-button icon-button" aria-label="Open navigation" aria-expanded="false" aria-controls="sidebar">☰</button><a class="brand" href="${href(page,'index')}">Yugo - Blender Vtubing</a><nav class="top-links" aria-label="Project links"><a href="${href(page,'index')}" class="selected">Documentation</a><a href="${config.sourceRepository}">GitHub <span aria-hidden="true">↗</span></a></nav><div class="top-actions"><button class="search-button" aria-label="Search documentation"><span aria-hidden="true">⌕</span><span>Search docs</span><kbd>Ctrl K</kbd></button><button class="theme-button icon-button" aria-label="Switch to light theme">☀</button></div></header>
<div class="nav-backdrop" hidden></div><aside class="sidebar" id="sidebar" aria-label="Documentation navigation"><div class="sidebar-intro"><span class="edition-dot"></span>Yugo Node <strong>${config.version}</strong></div><nav>${nav(page)}</nav>${maker(base)}<div class="sidebar-footer">We can’t wait to see the unique effects you create by combining nodes.</div></aside>
<div class="content-layout"><main id="main"><div class="breadcrumbs">Handbook <span>/</span> ${breadcrumbs}</div><h1>${escape(page.title)}</h1><article>${main}</article><div class="page-meta"><a href="${config.repository}/blob/main/${page.file}">Edit this page on GitHub <span aria-hidden="true">↗</span></a><span>First edition · Yugo ${config.version}</span></div><nav class="pagination" aria-label="Previous and next pages">${prev?`<a href="${href(page,prev.id)}"><small>← Previous</small><strong>${escape(prev.title)}</strong></a>`:'<span></span>'}${next?`<a href="${href(page,next.id)}" class="next"><small>Next →</small><strong>${escape(next.title)}</strong></a>`:''}</nav><footer class="site-footer">Yugo Handbook <span>·</span> Tracking. Animation. Interaction.</footer></main><aside class="toc" aria-label="On this page"><div>On this page</div>${rendered.toc.map(h=>`<a href="#${h.id}" class="toc-level-${h.level}">${escape(h.title)}</a>`).join('')}${page.status==='wip'?'<p class="toc-status">◷ Work in progress</p>':''}</aside></div>
<dialog class="search-dialog" aria-label="Search documentation"><div class="search-field"><span aria-hidden="true">⌕</span><input type="search" id="doc-search" placeholder="Search the handbook…" aria-label="Search the handbook" autocomplete="off"><button class="close-search" aria-label="Close search">Esc</button></div><div class="search-results" aria-live="polite"><p>Search pages, nodes, and concepts.</p></div><div class="search-help">Search the complete English handbook <kbd>Esc to close</kbd></div></dialog></body></html>`;
  const filename=path.join(out,page.id+'.html');fs.mkdirSync(path.dirname(filename),{recursive:true});fs.writeFileSync(filename,html);
  const plain=s=>s.replace(/<!--.*?-->/g,'').replace(/!\[[^\]]*\]\([^)]+\)/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[#*|>]/g,'').replace(/\s+/g,' ').trim();
  search.push({id:page.id,url:page.id+'.html',title:page.title,section:page.section,status:page.status||'ready',text:plain(source)});
  for(const nodeId of page.nodeIds||[]){
    const node=nodes.find(n=>n.id===nodeId);
    if(!node)throw Error('Unknown node '+nodeId);
    const anchor=slug(node.title);
    if(!rendered.toc.some(h=>h.id===anchor))throw Error('Missing node heading '+node.title);
    const start=source.indexOf('## '+node.title+'\n');
    if(start<0)throw Error('Missing node section '+node.title);
    const end=source.indexOf('\n## ',start+1);
    const detail=source.slice(start,end<0?undefined:end);
    search.push({id:page.id+'#'+anchor,url:page.id+'.html#'+anchor,title:node.title,section:page.title,status:'ready',text:plain(detail)});
  }
}
fs.writeFileSync(path.join(out,'search-index.json'),JSON.stringify(search));
fs.writeFileSync(path.join(out,'search-index.js'),'window.YugoSearchIndex = '+JSON.stringify(search)+';\n');
for(const page of pages){const filename=path.join(out,page.id+'.html');const html=fs.readFileSync(filename,'utf8');fs.writeFileSync(filename,html.replace(`<script src="${prefix(page)}assets/app.js" defer>`,`<script src="${prefix(page)}search-index.js" defer></script><script src="${prefix(page)}assets/app.js" defer>`));}
fs.writeFileSync(path.join(out,'pages.json'),JSON.stringify(pages));
fs.writeFileSync(path.join(out,'404.html'),`<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found | Yugo Handbook</title></head><body style="color-scheme:dark;background:#161616;color:#e8e8e8;font:18px system-ui;max-width:640px;margin:15vh auto;padding:24px"><h1>Page not found</h1><p>This handbook page may have moved.</p><a href="./index.html">Return to the handbook</a></body></html>`);
console.log(`Built ${pages.length} pages into ${out}`);
