// 火柴大乱斗 · 自建联机服务器
// 8081 = 游戏静态页（http）   9000 = PeerJS 信令（ws）
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PeerServer } = require('peer');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8081;

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    const ext = path.extname(file);
    const type = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.js' ? 'text/javascript' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Game: http://<server-ip>:' + PORT + '/'));

PeerServer({ port: 9000, path: '/' });
console.log('PeerJS signaling: ws://<server-ip>:9000/');
