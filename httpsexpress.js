const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const HTTP_PORT = process.env.HTTP_PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Halo dari server Express (HTTPS)!');
});

app.get('/api/hello/:name', (req, res) => {
  res.json({ message: `Halo, ${req.params.name}!` });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route tidak ditemukan' });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});


const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
};


https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
  console.log(`Server HTTPS berjalan di https://localhost:${HTTPS_PORT}`);
});


http
  .createServer((req, res) => {
    const host = (req.headers.host || 'localhost').split(':')[0];
    res.writeHead(301, { Location: `https://${host}:${HTTPS_PORT}${req.url}` });
    res.end();
  })
  .listen(HTTP_PORT, () => {
    console.log(`Redirect HTTP -> HTTPS aktif di port ${HTTP_PORT}`);
  });
