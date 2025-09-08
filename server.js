const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/data/houses.json', (req, res) => {
  const houses = req.body;
  const filePath = path.join(__dirname, 'data', 'houses.json');
  fs.writeFile(filePath, JSON.stringify(houses, null, 2), err => {
    if (err) {
      res.status(500).send('Failed to save house data');
    } else {
      res.send('House data updated');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Contractor backend running at http://localhost:${PORT}`);
});
