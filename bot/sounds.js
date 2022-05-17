const fs = require('fs');
const path = require('path');
const {
	createAudioResource,
  StreamType,
  createAudioPlayer,
  AudioPlayerStatus,
  entersState,
} = require('@discordjs/voice');
const soundFolder = path.join(__dirname, 'sounds');

const player = createAudioPlayer();

function getFolderContent() {
  return fs.readdirSync(soundFolder).filter(item => !item.startsWith('.'));
}

function getRandomArrayItem(arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
}

function stripEnding(item) {
  return item.substr(0, item.length - 4);
}

function getFullSoundList() {
  const folderContent = getFolderContent().map(stripEnding);
  return folderContent;
}

function getSoundList(filter) {
  const folderContent = getFolderContent();
  if (!filter) {
    return Array.from(new Set(folderContent.map(item => item.split('_')[0])));
  }
  const subList = filter ? folderContent.filter(item => item.includes(filter)) : folderContent;
  return subList.map(stripEnding).reduce((acc, item) => {
    const listWords = acc.map(innerItem => innerItem.length).reduce((pervLength, wordLength) => pervLength + wordLength, 0);
    if (listWords < 1500) {
      return [...acc, item];
    }

    return acc;
  }, []);
}

async function playSound(sound) {
  try {
    const folderContent = getFolderContent();
    const filteredList = folderContent.filter(item => sound.split(' ').every(word => item.includes(word)));
    const fileName = getRandomArrayItem(filteredList);

    if (!fileName) {
      return Promise.reject('no sound');
    }

    const filePath = path.join(soundFolder, fileName);
    var readStream = fs.createReadStream(filePath);
    const resource = createAudioResource(readStream, {
      inputType: StreamType.Arbitrary,
    });
  
    player.play(resource);

    console.log(`Play ${fileName}`)
  
    return await entersState(player, AudioPlayerStatus.Idle, 5e3);
  } catch(err) {
    console.log('/shrug', err);
  }
}

async function playSoundRandomFromList(soundList) {
  return playSound(getRandomArrayItem(soundList));
}

module.exports = {
  getFullSoundList,
  getSoundList,
  playSoundRandomFromList,
  playSound,
  player,
}
