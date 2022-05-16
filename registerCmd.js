const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandOptionType, ChannelType } = require('discord-api-types/v9');

const commands = [{
  name: 'schwaeba',
  description: 'Antwortet mit "Meister!"'
}, {
  name: 'sound',
  description: 'Spielt sound aus dem soundboard',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'sound_name',
    description: 'filename of the sound',
    required: true,
  }]
}, {
  name: 'trier',
  description: 'Beleidigt eine Person auf trierisch',
  options: [{
    type: ApplicationCommandOptionType.Mentionable,
    name: 'name',
    description: 'Name der Person',
    required: true,
  }]
}, {
  name: 'soundlist',
  description: 'Auflistung der vorhandenen sounds',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'filter',
    description: 'Filter um die Soundliste zu verkürzen',
  }]
}, {
  name: 'add-to-game',
  description: 'Fügt dich zu der Games Liste hinzu',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'game-code',
    description: 'Code für das Spiel',
    required: true,
  }]
}, {
  name: 'remove-from-game',
  description: 'Entfernt dich aus der Games Liste',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'game-code',
    description: 'Code für das Spiel',
    required: true,
  }]
}, {
  name: 'create-game-group',
  description: 'Erstellt eine Game gruppe',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'game-code',
    description: 'Code für das Spiel',
    required: true,
  }, {
    type: ApplicationCommandOptionType.String,
    name: 'full-name',
    description: 'Voller name des Spiels',
    required: true,
  }]
}, {
  name: 'don-hi',
  description: 'Ladet den Don in den voice channel ein',
  options: [{
    type: ApplicationCommandOptionType.Channel,
    name: 'channel',
    required: true,
    description: 'Voice channel in den eingeladen werden soll',
    channel_types: [ChannelType.GuildVoice],
  }],
}, {
  name: 'don-bye',
  description: 'Entfernt den Don aus voice channel ein',
}]; 

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('907331676655476787', process.env.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
