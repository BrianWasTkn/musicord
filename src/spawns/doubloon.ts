import { GuildMember } from 'discord.js';
import Spawn from '../lib/structures/Spawn';

const config: Akairo.SpawnConfig = {
  odds: 1,
  type: 'spam',
  enabled: true,
  timeout: 30000,
  entries: 3,
  rewards: {
    min: 50000,
    max: 50000,
    first: 100000,
  },
};

const visuals: Akairo.SpawnVisual = {
  emoji: '<:memerGold:753138901169995797>',
  type: 'GODLY',
  title: 'Gold Doubloon',
  description: 'Ah shit here we go again',
  strings: [
    'peter piper picked a pack of pickled cheese',
    'a pack of shredded cheese the chinese sneezed',
    'what is 1 + 1?',
    'she sells shitshells by the shitshore',
    'i scream, you scream, we all scream for ice scheme',
    'betty booper bought some buttar',
    'e',
    'nein',
    'spill the jeans of the belly jeans',
    'damk meder in crim bemers',
    'lady gaga more like lady lava',
  ],
};

export default class GODLY extends Spawn {
  public constructor() {
    super(config, visuals, (member: GuildMember): number => {
      // "Crib Booster" role
      if (member.roles.cache.has('693324853440282654')) return 10;
      // "Donator #M+" roles (minimum)
      if (member.roles.cache.has('768858996659453963')) return 15;
      // "Mastery #" roles (minimum)
      if (member.roles.cache.has('794834783582421032')) return 20;
      // "Amari #" roles (minimum)
      if (member.roles.cache.has('693380605760634910')) return 30;
      // Else
      return 60;
    });
  }
}
