import http from 'http';

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/upload' && req.method === 'POST') {
    let chunkCount = 0;
    let totalBytes = 0;

    // req — це Readable Stream. Слухаємо подію 'data' (приліт порції даних)
    req.on('data', (chunk) => {
      chunkCount++;
      totalBytes += chunk.length; // chunk.length повертає розмір у байтах
    });

    // Коли стрім повністю вичитано
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ chunks: chunkCount, bytes: totalBytes }));
    });

    // Безпека: обробка помилок
    req.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Count server running on port ${PORT}`);
});