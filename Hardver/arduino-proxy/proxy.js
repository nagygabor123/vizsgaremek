const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

// Proxy 1: getLocker kérés továbbítása
app.get('/proxy1', async (req, res) => {
  const rfid = req.query.rfid;
  if (!rfid) {
    return res.status(400).send('RFID hiányzik.');
  }

  try {
    const response = await axios.get(`https://vizsgaremek-mocha.vercel.app/api/locker/checkLocker?rfid=${rfid}`);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Hiba történt a proxy szerveren (getLocker).');
  }
});

// Proxy 2: setLockerStatus kérés továbbítása
app.patch('/proxy2', async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('Locker ID hiányzik.');
  }

  try {
    const response = await axios.put(`https://vizsgaremek-mocha.vercel.app/api/locker/setLockerStatus?id=${id}`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Hiba történt a proxy szerveren (setLockerStatus).');
  }
});

app.listen(port, () => {
  console.log(`Proxy szerver fut a http://172.16.13.9:${port} címen`);
});
