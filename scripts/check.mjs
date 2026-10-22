import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(project, 'dist');
const siteConfig = JSON.parse(fs.readFileSync(path.join(project, 'src/site-config.json'), 'utf8'));
let siteUrl;
try {
  siteUrl = new URL(siteConfig.siteUrl);
  if (siteUrl.protocol !== 'https:' || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password) throw new Error();
} catch {
  console.error('src/site-config.json: siteUrl debe ser una URL raíz HTTPS sin credenciales, parámetros ni fragmentos.');
  process.exit(1);
}
const SITE = siteUrl.origin;
const TOTAL_BUDGET = 4_000_000;
const IMAGE_BUDGET = 300_000;
const HOME_BUDGET = 600_000;
const errors = [];
const checked = new Set();
const allFiles = [];
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const attr = (tag, key) => decode(tag.match(new RegExp(`(?:\\s|<)${key}="([^"]*)"`, 'i'))?.[1] || '');

function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const full = path.join(directory, item.name);
    if (item.isDirectory()) walk(full);
    else allFiles.push(full);
  }
}
if (!fs.existsSync(root)) {
  console.error('No existe dist/. Ejecutá npm run build antes de comprobar la web.');
  process.exit(1);
}
walk(root);
const files = allFiles.filter(file => file.endsWith('.html'));
if (files.length !== 22) errors.push(`Se esperaban 22 páginas HTML; se encontraron ${files.length}.`);

function destinationOf(reference, file) {
  let pathname = reference.split(/[?#]/)[0];
  if (/^https?:\/\//.test(pathname)) {
    const url = new URL(pathname);
    if (url.origin !== SITE) return null;
    pathname = url.pathname;
  }
  try { pathname = decodeURIComponent(pathname); }
  catch { errors.push(`${path.relative(root, file)}: URL mal codificada ${reference}`); return null; }
  let destination = pathname.startsWith('/') ? path.resolve(root, '.' + pathname) : path.resolve(path.dirname(file), pathname);
  if (destination !== root && !destination.startsWith(root + path.sep)) {
    errors.push(`${path.relative(root, file)}: recurso fuera de dist ${reference}`);
    return null;
  }
  if (fs.existsSync(destination) && fs.statSync(destination).isDirectory()) destination = path.join(destination, 'index.html');
  return destination;
}
function checkReference(reference, file) {
  if (!reference || /^(?:mailto:|tel:|data:)/i.test(reference)) return;
  if (/^https?:\/\//i.test(reference) && new URL(reference).origin !== SITE) return;
  const [location, hash] = reference.split('#');
  const destination = location ? destinationOf(reference, file) : file;
  if (!destination) return;
  checked.add(location || path.relative(root, file));
  if (!fs.existsSync(destination) || !fs.statSync(destination).isFile()) {
    errors.push(`${path.relative(root, file)}: recurso ausente ${reference}`);
    return;
  }
  if (hash && destination.endsWith('.html')) {
    const target = fs.readFileSync(destination, 'utf8');
    if (![...target.matchAll(/\bid="([^"]+)"/g)].some(match => match[1] === decodeURIComponent(hash))) errors.push(`${path.relative(root, file)}: ancla #${hash} ausente en ${location || 'esta página'}`);
  }
}
function meta(html, key, property = false) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]).find(tag => attr(tag, property ? 'property' : 'name') === key) || '';
}
function canonicalOf(html) {
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).filter(tag => attr(tag, 'rel') === 'canonical');
  return canonical.length === 1 ? attr(canonical[0], 'href') : '';
}
function jsonLd(html, label) {
  const documents = [];
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      documents.push(...(Array.isArray(data) ? data : data['@graph'] || [data]));
    } catch { errors.push(`${label}: JSON-LD inválido.`); }
  }
  return documents;
}
function pageUrl(file) {
  return SITE + '/' + path.relative(root, file).replaceAll(path.sep, '/').replace(/(?:^|\/)index\.html$/, match => match.startsWith('/') ? '/' : '');
}

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const label = path.relative(root, file).replaceAll(path.sep, '/');
  const expected = pageUrl(file);
  const h1 = [...html.matchAll(/<h1[ >]/g)].length;
  if (h1 !== 1) errors.push(`${label}: ${h1} encabezados h1.`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${label}: identificadores repetidos.`);
  for (const [, reference] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) checkReference(decode(reference), file);
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const image = match[0];
    if (!/\balt="/.test(image)) errors.push(`${label}: imagen sin texto alternativo.`);
    const sourceSet = attr(image, 'srcset');
    if (sourceSet) {
      if (!attr(image, 'sizes')) errors.push(`${label}: imagen con srcset sin sizes.`);
      const widths = new Set();
      for (const candidate of sourceSet.split(',')) {
        const parsed = candidate.trim().match(/^(\S+)\s+(\d+)w$/);
        if (!parsed || Number(parsed[2]) <= 0 || widths.has(parsed[2])) { errors.push(`${label}: candidato srcset inválido ${candidate.trim()}`); continue; }
        widths.add(parsed[2]);
        checkReference(parsed[1], file);
      }
    }
    const source = attr(image, 'src');
    if (/^\/assets\/(?:art|screens|photos)\//.test(source) && attr(image, 'id') !== 'dialog-image' && !sourceSet) errors.push(`${label}: imagen de contenido sin variantes adaptables ${source}`);
  }
  if (canonicalOf(html) !== expected) errors.push(`${label}: canonical ausente, duplicada o distinta de ${expected}`);
  if (attr(meta(html, 'og:url', true), 'content') !== expected) errors.push(`${label}: og:url no coincide con la URL pública.`);
  const ogImage = attr(meta(html, 'og:image', true), 'content');
  if (!ogImage.startsWith(`${SITE}/`)) errors.push(`${label}: og:image debe ser absoluta y del sitio.`);
  else checkReference(ogImage, file);
  if (attr(meta(html, 'og:locale', true), 'content') !== 'es_AR') errors.push(`${label}: falta og:locale es_AR.`);
  if (attr(meta(html, 'og:site_name', true), 'content') !== siteConfig.name) errors.push(`${label}: falta og:site_name.`);
  if (attr(meta(html, 'twitter:card'), 'content') !== 'summary_large_image') errors.push(`${label}: falta twitter:card.`);
  const stylesheet = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).find(tag => attr(tag, 'rel') === 'stylesheet');
  if (!/^\/assets\/styles\.[a-f0-9]{10}\.css$/.test(attr(stylesheet || '', 'href'))) errors.push(`${label}: CSS sin hash de contenido.`);
  if (![...html.matchAll(/<script\b[^>]*>/gi)].some(match => /^\/assets\/site\.[a-f0-9]{10}\.js$/.test(attr(match[0], 'src')))) errors.push(`${label}: JavaScript sin hash de contenido.`);
  const font = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).find(tag => attr(tag, 'rel') === 'preload' && attr(tag, 'as') === 'font');
  if (!font || !attr(font, 'href').endsWith('.woff2') || attr(font, 'type') !== 'font/woff2') errors.push(`${label}: falta precarga WOFF2.`);
  if (label === '404.html' && !/noindex/i.test(attr(meta(html, 'robots'), 'content'))) errors.push('404.html: falta noindex.');
  const structured = jsonLd(html, label);
  if (label === 'index.html' && !structured.some(item => item['@type'] === 'Organization' && [SITE, SITE + '/'].includes(item.url))) errors.push('Inicio: falta Organization con URL pública.');
  if (/^soluciones\/[^/]+\/index\.html$/.test(label) && !structured.some(item => ['WebPage', 'SoftwareApplication'].includes(item['@type']))) errors.push(`${label}: falta JSON-LD de la solución.`);
}

const content = JSON.parse(fs.readFileSync(path.join(project, 'src/content.json'), 'utf8'));
const catalog = fs.readFileSync(path.join(root, 'soluciones/index.html'), 'utf8');
const homeFile = path.join(root, 'index.html');
const home = fs.readFileSync(homeFile, 'utf8');
const menu = home.slice(home.indexOf('id="solutions-menu"'), home.indexOf('</nav>'));
for (const [group, projects] of [['soluciones', content.products], ['investigacion', content.research]]) {
  for (const item of projects) {
    const route = `/${group}/${item.slug}/`;
    if (!catalog.includes(`data-project="${item.slug}"`)) errors.push(`Catálogo: falta ${item.name}.`);
    if (!menu.includes(`href="${route}"`)) errors.push(`Menú: falta ${item.name}.`);
    if (item.access) {
      try {
        const access = new URL(item.access.url);
        if (access.protocol !== 'https:' || access.username || access.password || !access.hostname) throw new Error();
      } catch { errors.push(`${item.name}: access.url debe ser absoluta y HTTPS, sin credenciales.`); }
      if (!['app', 'demo', 'docs'].includes(item.access.kind) || !item.access.label?.trim()) errors.push(`${item.name}: access requiere kind app/demo/docs y label.`);
      const detail = fs.readFileSync(path.join(root, group, item.slug, 'index.html'), 'utf8');
      const accessLinks = html => [...html.matchAll(/<a\b[^>]*>/gi)].map(match => match[0]).filter(tag => {
        try { return new URL(attr(tag, 'href')).href === new URL(item.access.url).href; }
        catch { return false; }
      });
      if (!accessLinks(catalog).length || !accessLinks(detail).length) errors.push(`${item.name}: falta acceso en catálogo o página.`);
      if (item.access.kind === 'app' && !accessLinks(home).length) errors.push(`${item.name}: falta acceso en el inicio.`);
      for (const [location, html] of [['catálogo', catalog], ['página', detail], ...(item.access.kind === 'app' ? [['inicio', home]] : [])]) {
        const links = accessLinks(html);
        if (links.some(tag => attr(tag, 'target') !== '_blank' || !attr(tag, 'rel').split(/\s+/).includes('noopener'))) errors.push(`${item.name}: acceso externo sin target/rel seguro en ${location}.`);
      }
    }
  }
}

for (const file of allFiles.filter(file => file.endsWith('.css'))) {
  const css = fs.readFileSync(file, 'utf8');
  for (const [, url] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) checkReference(url, file);
  if (/Manrope.*\.ttf/.test(css)) errors.push('CSS: se sigue utilizando la fuente TTF sin comprimir.');
  if (!/font-display:\s*swap/.test(css)) errors.push('CSS: falta font-display: swap.');
}

const sitemapFile = path.join(root, 'sitemap.xml');
if (!fs.existsSync(sitemapFile)) errors.push('Falta sitemap.xml.');
else {
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
  const expected = files.filter(file => path.basename(file) !== '404.html').map(pageUrl);
  if (!/<urlset\b[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(xml)) errors.push('Sitemap: namespace ausente.');
  if (locations.length !== new Set(locations).size) errors.push('Sitemap: URLs duplicadas.');
  if (locations.length !== expected.length || expected.some(url => !locations.includes(url))) errors.push(`Sitemap: debe incluir las ${expected.length} páginas indexables, sin 404.`);
  for (const url of locations) checkReference(url, sitemapFile);
}
const robots = path.join(root, 'robots.txt');
if (!fs.existsSync(robots) || !fs.readFileSync(robots, 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`)) errors.push('robots.txt: falta el sitemap público.');
const headersFile = path.join(root, '_headers');
if (!fs.existsSync(headersFile)) errors.push('Falta _headers para Cloudflare Pages.');
else {
  const headers = fs.readFileSync(headersFile, 'utf8');
  for (const required of ['X-Content-Type-Options: nosniff', 'Referrer-Policy: strict-origin-when-cross-origin', 'X-Frame-Options: DENY', 'Permissions-Policy: camera=(), microphone=(), geolocation=()']) if (!headers.includes(required)) errors.push(`_headers: falta ${required}`);
  if (!/\/assets\/\*[\s\S]*Cache-Control:\s*public,\s*max-age=31536000,\s*immutable/.test(headers)) errors.push('_headers: falta caché larga para assets con hash.');
}
for (const filename of ['apple-touch-icon.png', 'favicon-32.png']) if (!fs.existsSync(path.join(root, filename))) errors.push(`Falta ${filename}.`);
if (allFiles.some(file => /\.(?:ttf|jpg|jpeg)$/i.test(file) || (/\.png$/i.test(file) && !['apple-touch-icon.png', 'favicon-32.png'].includes(path.basename(file))))) errors.push('Quedan imágenes/fuentes sin optimizar en dist/.');
const total = allFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
if (total >= TOTAL_BUDGET) errors.push(`dist/ pesa ${total.toLocaleString('es-AR')} bytes: debe ser menor a ${TOTAL_BUDGET.toLocaleString('es-AR')}.`);
for (const file of allFiles.filter(file => /\.(?:webp|png|jpe?g|avif)$/i.test(file))) if (fs.statSync(file).size > IMAGE_BUDGET) errors.push(`${path.relative(root, file)}: supera ${IMAGE_BUDGET.toLocaleString('es-AR')} bytes por imagen.`);

const initialFiles = new Set([homeFile]);
for (const match of home.matchAll(/<(?:link|script|img)\b[^>]*>/gi)) {
  const tag = match[0];
  const relevant = /^<script/i.test(tag) || (/^<link/i.test(tag) && (['stylesheet', 'icon', 'apple-touch-icon'].includes(attr(tag, 'rel')) || attr(tag, 'rel') === 'preload')) || (/^<img/i.test(tag) && attr(tag, 'loading') !== 'lazy');
  if (!relevant) continue;
  const reference = attr(tag, /^<link/i.test(tag) ? 'href' : 'src');
  if (!reference || /^(?:data:|https?:)/.test(reference)) continue;
  const destination = destinationOf(reference, homeFile);
  if (destination && fs.existsSync(destination) && fs.statSync(destination).isFile()) initialFiles.add(destination);
}
const homeBytes = [...initialFiles].reduce((sum, file) => sum + fs.statSync(file).size, 0);
if (homeBytes >= HOME_BUDGET) errors.push(`Inicio: recursos iniciales por defecto ${homeBytes.toLocaleString('es-AR')} bytes, presupuesto menor a ${HOME_BUDGET.toLocaleString('es-AR')}.`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verificación completa: ${files.length} páginas, ${checked.size} rutas/recursos internos, ${content.products.length + content.research.length} proyectos y 21 URLs indexables.`);
  console.log(`Peso: dist/ ${(total / 1_000_000).toFixed(2)} MB; recursos iniciales por defecto del inicio ${Math.round(homeBytes / 1000)} KB, sin compresión HTTP.`);
}
