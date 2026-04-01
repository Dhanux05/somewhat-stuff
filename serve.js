const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const baseDir = process.cwd();
const port = process.env.PORT ? Number(process.env.PORT) : 5500;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  // Normalize and strip leading slashes so path.join stays under baseDir.
  const normalized = path.normalize(urlPath).replace(/^([/\\])+/, '');
  const relativePath = normalized === '' ? 'index.html' : normalized;
  const filePath = path.join(baseDir, relativePath);

  // Prevent path traversal outside the project directory.
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }

    const target = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    fs.stat(target, (innerErr, innerStats) => {
      if (innerErr || !innerStats.isFile()) {
        res.writeHead(404);
        return res.end('Not found');
      }

      const contentType = mimeTypes[path.extname(target).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(target).pipe(res);
    });
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving ${baseDir} at http://localhost:${port}`);
});
