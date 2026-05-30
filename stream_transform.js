import http from 'http';
import { Transform } from 'stream';

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/uppercase' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    // Створюємо Transform Stream для модифікації чанків
    const uppercaseTransform = new Transform({
      transform(chunk, encoding, callback) {
        // Перетворюємо шматок бінарних даних у рядок, робимо великими літерами
        const upperChunk = chunk.toString().toUpperCase();
        // Передаємо трансформовані дані далі по конвеєру
        callback(null, upperChunk);
      }
    });

    // Конвеєр: Клієнт (Readable) -> Трансформація (Transform) -> Відповідь (Writable)
    req.pipe(uppercaseTransform).pipe(res);

    req.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Transform server running on port ${PORT}`);
});