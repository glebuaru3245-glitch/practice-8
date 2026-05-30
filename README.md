# Практична робота № 8: Streams in Node.js

**Мета роботи:** Навчитися працювати зі streams у Node.js: читати файли через readable stream, записувати тіло HTTP-запиту через writable stream, трансформувати дані під час стрімінгу, рахувати chunks/bytes та реалізувати безпечну обробку помилок.

---

## 📊 Результати ручної перевірки (Логи curl)

Через відомі системні обмеження прав доступу навчальної утиліти `eu-node-basics-workshop` на ОС Windows (`EPERM`), коректність роботи всіх розроблених стрімів було повністю протестовано та валідовано вручну за допомогою утиліти `curl.exe`.

### 1️⃣ [8.1] Readable Stream: Потокове читання файлу
Сервер успішно транслює файл порціями, про що свідчить заголовок віддачі `Transfer-Encoding: chunked`.
```bash
PS C:\Users\user\Desktop\node-practice8> curl.exe -i http://localhost:3000/stream-file
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked