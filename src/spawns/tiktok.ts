import { SpawnVisual } from '@lib/interface/handlers/spawn';
import { GuildMember } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn';

const visuals: SpawnVisual = {
  emoji: '<:memerBlue:729863510330310727>',
  type: 'COMMON',
  title: 'Tiktok',
  description: 'What is TikTok for you?',
  strings: ['cringe', 'cool', 'average'],
};

export default class Common extends Spawn {
  constructor() {
    super('tiktok', visuals, {
      rewards: { first: 100, min: 1, max: 10 },
      enabled: true,
      timeout: 15000,
      entries: 3,
      type: 'message',
      odds: 10,
    });
  }

  cd = () => ({
    '693324853440282654': 3, // Booster
    '768858996659453963': 5, // Donator
    '794834783582421032': 10, // Mastery
    '693380605760634910': 20, // Amari
  });
}
