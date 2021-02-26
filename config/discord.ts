import { ClientOptions, WebSocketOptions } from 'discord.js';

const intents: WebSocketOptions['intents'] = [
  'GUILD_PRESENCES',
  'GUILD_MESSAGES',
  'GUILD_MEMBERS',
  'GUILDS',
];

export const discordOptions: ClientOptions = {
  fetchAllMembers: false,
  disableMentions: 'everyone',
  ws: { intents },
};
