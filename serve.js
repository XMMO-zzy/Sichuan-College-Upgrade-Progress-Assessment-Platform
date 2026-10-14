/* ============================================================
   蜀岸 · 本地静态服务器（零依赖）
   用法：node serve.js [端口]   默认 8080
   ============================================================ */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = parseInt(process.argv[2] || '8080', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

http.createServer(function (req, res){
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const safe = path.normalize(urlPath).replace(/^([/\\]|\.\.[/\\])+/, '');
    const filePath = path.join(ROOT, safe);
    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)){
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('403 Forbidden');
    }
    fs.readFile(filePath, function (err, data){
      if (err){
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 Not Found: ' + urlPath);
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  } catch (e){
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 ' + e.message);
  }
}).listen(PORT, '127.0.0.1', function (){
  console.log('蜀岸备考应用已启动: http://127.0.0.1:' + PORT + '/');
});
