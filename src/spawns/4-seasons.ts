import { SpawnVisual } from '@lib/interface/handlers/spawn';
import { GuildMember } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn';

const visuals: SpawnVisual = {
  emoji: '<:memerBlue:729863510330310727>',
  type: 'COMMON',
  title: '4 Seasons',
  description: 'What season do you like the most?',
  strings: ['summer', 'winter', 'spring', 'autumn'],
};

export default class COMMON extends Spawn {
  constructor() {
    super('4-seasons', visuals, {
      rewards: { first: 5e4, min: 1e4, max: 4e4 },
      enabled: true,
      timeout: 15000,
      entries: 3,
      type: 'message',
      odds: 10,
    });
  }

  cd() {
    return {
      '693324853440282654': 3, // Booster
      '768858996659453963': 5, // Donator
      '794834783582421032': 10, // Mastery
      '693380605760634910': 20, // Amari
    }
  }
}
