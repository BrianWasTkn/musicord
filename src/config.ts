/**
 * Base Config
 * Author: BrianWasTkn
 */

const currency: Lava.ConfigCurrency = {
  gambleCaps: {
    minBet: 50,
    maxBet: 500000,
    maxWin: 2222222,
    maxPocket: 10000000,
    maxMulti: 120,
  },
};

const spawns: Lava.ConfigSpawn = {
  enabled: true,
  unpaidCap: 10000000,
  defaultCooldown: 60,
  blacklistedChannels: [
    '791659327148261406', // Public
    '801471120192438312',
    '801413467080622120',
    '692923254872080395',
    '756101559938449449',
    '796019885775126560',
    '691597490411012137',
    '691594488103305216', // Dank
    '692547222017015828',
    '691595376524001290',
    '694697159848886343',
  ],
  whitelistedCategories: [
    '691416705917780000',
    '691595121866571776',
    '791576124185378817',
    '724618509958774886',
  ],
};

const bot: Lava.ConfigLava = {
  dev: false,
  prefix: ['lava', ';;'],
  token: process.env.TOKEN,
  ownerID: ['605419747361947649'],
  intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
};

export default <Lava.Config>{
  bot,
  currency,
  spawns,
};
