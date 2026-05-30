import http from 'http';
import fs from 'fs';

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/stream-file' && req.method === 'GET') {
    // Перевіряємо, чи існує тестовий файл
    if (!fs.existsSync('bigfile.txt')) {
      fs.writeFileSync('bigfile.txt', 'Hello World from Node.js Streams! '.repeat(1000));
    }

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    // Створюємо стрім для читання
    const readStream = fs.createReadStream('bigfile.txt');

    // Перенаправляємо потік читання прямо в HTTP-відповідь (res)
    readStream.pipe(res);

    // Обробка помилок стріму, щоб сервер не падав
    readStream.on('error', (err) => {
      console.error('Stream error:', err.message);
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
  console.log(`Server running on port ${PORT}`);
});