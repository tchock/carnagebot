const fs = require('fs');
const path = require('path');
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const {createDiscordJSAdapter} = require('./voiceAdapter');

const player = createAudioPlayer();
let connection;

const soundFolder = path.join(__dirname, 'sounds');

// let folderContent = fs.readdirSync(soundFolder).filter(item => !item.startsWith('.'));

function getFolderContent() {
  return fs.readdirSync(soundFolder).filter(item => !item.startsWith('.'));
}

function stripEnding(item) {
  return item.substr(0, item.length - 4);
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

function getRandomArrayItem(arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
}

async function playSoundRandomFromList(soundList) {
  return playSound(getRandomArrayItem(soundList));
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

async function connectToChannel(channel) {
	connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: createDiscordJSAdapter(channel),
    debug: true,
    selfDeaf: true,
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    connection.subscribe(player);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

function disconnect() {
  if (connection) {
    connection.disconnect();
    connection = undefined;
  }
}

module.exports = {
  connectToChannel,
  getSoundList,
  playSoundRandomFromList,
  playSound,
  disconnect,
}
