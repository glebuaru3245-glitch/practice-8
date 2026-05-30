import http from 'http';
import fs from 'fs';
import { pipeline } from 'stream/promises';

const PORT = process.argv[2] || 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/safe-stream' && req.method === 'GET') {
    const filePath = 'non-existent-file.txt';

    // Залізобетонна перевірка: якщо файлу немає, ОДРАЗУ віддаємо 404 JSON
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: `File handling error: ENOENT: no such file or directory, open '${filePath}'` }));
    }

    try {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      const sourceStream = fs.createReadStream(filePath);
      await pipeline(sourceStream, res);
    } catch (err) {
      console.log('Помилку перехоплено:', err.message);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Error handling server running on port ${PORT}`);
});