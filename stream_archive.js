import http from 'http';
import fs from 'fs';
import zlib from 'zlib';

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/archive' && req.method === 'GET') {
    if (!fs.existsSync('bigfile.txt')) {
      fs.writeFileSync('bigfile.txt', 'Hello World from Streams Archive! '.repeat(1000));
    }

    // Встановлюємо заголовок, що передаємо саме gzip-архів
    res.writeHead(200, {
      'Content-Type': 'application/gzip',
      'Content-Disposition': 'attachment; filename="bigfile.txt.gz"'
    });

    const readStream = fs.createReadStream('bigfile.txt');
    const gzip = zlib.createGzip(); // Трансформуючий стрім для стиснення

    // Конвеєр: Читаємо -> Стискаємо в Gzip -> Віддаємо у відповідь
    readStream.pipe(gzip).pipe(res);

    readStream.on('error', (err) => {
      console.error('Read error:', err.message);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Archive server running on port ${PORT}`);
});