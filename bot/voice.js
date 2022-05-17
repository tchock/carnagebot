const fs = require('fs');
const path = require('path');
const {
	joinVoiceChannel,
	entersState,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const {createDiscordJSAdapter} = require('./voiceAdapter');
const {getSoundList, playSound, playSoundRandomFromList, player} = require('./sounds');

let connection;

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
