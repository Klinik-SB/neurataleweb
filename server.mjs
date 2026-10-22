import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.NEURATALE_PORT || 5188);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml; charset=utf-8' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Solicitud inválida'); return; }
  const resolved = path.resolve(root, '.' + pathname);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  let target = resolved;
  try { if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html'); } catch {}
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
    res.end(fs.readFileSync(path.join(root, '404.html'))); return;
  }
  res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin'});
  if (req.method === 'HEAD') { res.end(); return; }
  fs.createReadStream(target).pipe(res);
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `El puerto ${port} está ocupado. Si Neuratale ya está iniciado, abrí http://127.0.0.1:${port}` : error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Neuratale · http://127.0.0.1:${port}`));
