const { Client, Intents, VoiceChannel } = require('discord.js');
const { createGameGroup } = require('./gameList');
const { trierInsult } = require('./trier');
const voice = require('./voice');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const GAME_CATEGORY = process.env.GAME_CATEGORY;

client.on('ready', async () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  try {

    switch(interaction.commandName) {
      case 'schwaeba': 
        voice.playSound('schwaeberei');
        await interaction.reply('Meister!'); 
        return;
      case 'trier': {
        const user = interaction.options.getMentionable('name');
        await interaction.reply({
          content: trierInsult(user.id),
          allowedMentions: {users: [user.id]},
        }); 
        return;
      }
      case 'add-to-game': {
        const gameCode = interaction.options.getString('game-code');
        const role = interaction.guild.roles.cache.find(role => role.name === `game-${gameCode}`);
        if (role) {
          await interaction.member.roles.add(role);
          await interaction.reply({ content: `Oh, nice. Du magst ${gameCode} mitspielen!`, ephemeral: true });
        } else {
          await interaction.reply({ content: `Das Spiel gibt's gar nicht!`, ephemeral: true });
        }
        return;
      }
      case 'remove-from-game': {
        const gameCode = interaction.options.getString('game-code');
        const role = interaction.guild.roles.cache.find(role => role.name === `game-${gameCode}`);
        if (role) {
          await interaction.member.roles.remove(role);
          await interaction.reply({ content: `Oh, schade. Du nicht mehr bei ${gameCode} mitspielen!`, ephemeral: true });
        } else {
          await interaction.reply({ content: `Das Spiel gibt's gar nicht!`, ephemeral: true });
        }
        return;
      }
      case 'create-game-group': {
        const gameCode = interaction.options.getString('game-code');
        const fullName = interaction.options.getString('full-name');
        createGameGroup(interaction.guild, gameCode, fullName);
        interaction.guild.roles.create({
          color: 'PURPLE',
          mentionable: true,
          name: `game-${gameCode}`,
          reason: fullName,
        });
        interaction.guild.channels.create(`${fullName} (${gameCode})`, {
          reason: fullName,
          parent: GAME_CATEGORY,
          type: 'GUILD_VOICE',
        });
  
        await interaction.reply({ content: `Yeah, es gibt jetzt das game ${fullName} (${gameCode})!`, ephemeral: true });
        return;
      }
      case 'don-hi':
        const channel = interaction.options.getChannel('channel');
        interaction.reply({ content: `Channel ${channel.name} beigetreten`, ephemeral: true });
        await voice.connectToChannel(channel);
        voice.playSoundRandomFromList(['kuckuck', 'morje', 'helge_geil', 'ficker', 'bock', 'astrein']);
        return;
      case 'don-bye':
          interaction.reply({ content: ':wave:', ephemeral: true });
          await voice.playSoundRandomFromList(['weghe', 'flesch_alles', 'flesch_erledigt', 'beleidigt', 'arno_mach_ich_nicht', 'gehweghier', 'schlong', 'tschuess']);
          await voice.disconnect();
          return;
      case 'sound':
        const splittedNames = interaction.options.getString('sound_name').split(/\s*\,\s*/);
        splittedNames.reduce((prevSound, soundName) => prevSound.then(() => voice.playSound(soundName)), Promise.resolve()).catch(() => {});
        interaction.reply({ content: 'Sound abgespielt!', ephemeral: true })
        return;
      case 'soundlist':
        const filter = interaction.options.getString('filter');
        const list = voice.getSoundList(filter);
        const description = filter ? `Folgende sounds gibt es für ${filter}` : 'Folgende Kategorien gibt es';
        await interaction.reply({
          content: `${description}:\n\n${list.map(item => `\`${item}\``).join('\n')}`,
          ephemeral: true,
        })
    }
  } catch (err) {
    console.log('Generic error happened')
    console.error(err);
  }
});

client.login(process.env.CLIENT_TOKEN);
