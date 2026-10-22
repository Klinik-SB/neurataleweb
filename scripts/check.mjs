import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const files = [];
function walk(dir) { for (const item of fs.readdirSync(dir,{withFileTypes:true})) { const full=path.join(dir,item.name); if(item.isDirectory()) walk(full); else if(item.name.endsWith('.html')) files.push(full); } }
walk(root);
const errors=[]; const checked=new Set();
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 const label=path.relative(root,file);
 const h1=[...html.matchAll(/<h1[ >]/g)].length;
 if(h1!==1) errors.push(`${label}: ${h1} encabezados h1.`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 if(new Set(ids).size!==ids.length) errors.push(`${label}: identificadores repetidos.`);
 for(const [,reference] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(/^(?:https?:|mailto:|tel:|data:)/.test(reference)) continue;
  const [location,hash]=reference.split('#');
  if(!location){ if(hash&&!ids.includes(hash))errors.push(`${label}: ancla #${hash} ausente.`); continue; }
  const url=location.split('?')[0];
  let destination=url.startsWith('/')?path.join(root,url):path.resolve(path.dirname(file),url);
  if(fs.existsSync(destination)&&fs.statSync(destination).isDirectory())destination=path.join(destination,'index.html');
  if(!fs.existsSync(destination))errors.push(`${label}: recurso ausente ${url}`);
  checked.add(url);
 }
 for(const image of html.matchAll(/<img\b([^>]+)>/g)){if(!/\balt="/.test(image[1]))errors.push(`${label}: imagen sin texto alternativo.`);}
}
const content=JSON.parse(fs.readFileSync(path.join(root,'..','src','content.json'),'utf8'));
const catalog=fs.readFileSync(path.join(root,'soluciones','index.html'),'utf8');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const menu=home.slice(home.indexOf('id="solutions-menu"'),home.indexOf('</nav>'));
for(const project of [...content.products,...content.research]){
 const route=`/${content.products.some(item=>item.slug===project.slug)?'soluciones':'investigacion'}/${project.slug}/`;
 if(!catalog.includes(`data-project="${project.slug}"`))errors.push(`Catálogo: falta ${project.name}.`);
 if(!menu.includes(`href="${route}"`))errors.push(`Menú: falta ${project.name}.`);
}
const css=fs.readFileSync(path.join(root,'assets/styles.css'),'utf8');
for(const [,url]of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){if(url.startsWith('/')&&!fs.existsSync(path.join(root,url)))errors.push(`CSS: recurso ausente ${url}`);}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`Verificación completa: ${files.length} páginas, ${checked.size} rutas/recursos internos y los ${content.products.length+content.research.length} proyectos presentes en catálogo y menú.`);
