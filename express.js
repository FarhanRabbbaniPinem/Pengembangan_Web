const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Halo dari server Express (HTTP)!');
});

app.get('/api/hello/:name', (req, res) => {
  res.json({ message: `Halo, ${req.params.name}!` });
});

app.post('/api/data', (req, res) => {
  res.status(201).json({ received: req.body });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route tidak ditemukan' });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
  console.log(`Server HTTP berjalan di http://localhost:${PORT}`);
});
