import { SpawnVisual } from '@lib/interface/handlers/spawn';
import { GuildMember } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn';

const visuals: SpawnVisual = {
  emoji: '<:memerGreen:729863510296887398>',
  type: 'SUPER',
  title: 'Get Coinified',
  description: 'Hey i want coins, do you want coins?',
  strings: ['yes', 'no', "yesn't", "non't"],
};

export default class SUPER extends Spawn {
  constructor() {
    super('coinified', visuals, {
      rewards: { first: 10e6, min: 5e4, max: 1e5 },
      enabled: true,
      timeout: 15000,
      entries: 3,
      type: 'message',
      odds: 5,
    });
  }

  cd = () => ({
    '693324853440282654': 3, // Booster
    '768858996659453963': 5, // Donator
    '794834783582421032': 10, // Mastery
    '693380605760634910': 20, // Amari
  });
}
