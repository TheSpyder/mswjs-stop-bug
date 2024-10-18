import express from 'express';
import path from 'path';

const app = express();

const PORT = 3000;

app.get('/mockServiceWorker.js', (req, res) => {
  res.sendFile(path.resolve('node_modules/msw/lib/mockServiceWorker.js'));
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

