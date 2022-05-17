const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {getFullSoundList, playSoundRandomFromList} = require('./sounds');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json())

app.get('/sounds', async (req, res) => {
  const allSounds = getFullSoundList();
  res.json(allSounds);
});

app.post('/play', async (req, res) => {
  if (req.body.sounds && req.body.sounds.length > 0) {
    playSoundRandomFromList(req.body.sounds);
  }
  res.json({played: true});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

