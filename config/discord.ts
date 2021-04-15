import type { ClientOptions, WebSocketOptions } from 'discord.js';

const intents: ClientOptions['intents'] = [
  'DIRECT_MESSAGE_TYPING',
  'DIRECT_MESSAGES',
  'GUILD_PRESENCES',
  'GUILD_MESSAGES',
  'GUILD_MEMBERS',
  'GUILD_EMOJIS',
  'GUILDS',
];

export const discordOptions: ClientOptions = {
  intents, allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: true,    
  }
};
