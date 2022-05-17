const INSULTS = [
  'Ey {name}, dao nassgekämmten!',
  'Bui dei Keilo wo\'n kein haor hat, {name}',
  '{name} as schon son tapizierten Wingertspfoal',
  'Dau hast doch en Pfeil im Kopp, {name}',
  '{name}, den Bangert loa',
  '{name} as escht en heelen',
  'Ey {name}, dau hast doch en rad ab ey',
  'Den {name} as en rischtisch Gesichtbarack',
  'Ey {name}, dau krees gleich ein gebummt, dat De meins, de Porta wär en Frittenbud un et Säulemarie de Bedienung!',
  '{name}, dau greilijen',
  '{name} as en wahren Schmunkpitter',
  '{name}, dau Torpert!',
];

function getRandomArrayItem(arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
}

function trierInsult(userId) {
  return getRandomArrayItem(INSULTS).replace('{name}', `<@!${userId}>`);
}

module.exports = {
  trierInsult,
}
