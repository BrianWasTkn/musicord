import { SpawnConfig, SpawnVisual } from '@lib/interface/handlers/spawn'
import { GuildMember } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn'

const visuals: SpawnVisual = {
  emoji: '<:memerGold:753138901169995797>',
  type: 'GODLY',
  title: 'Gold Doubloon',
  description: 'Ah shit here we go again',
  strings: [
    'noolbouD dloG', 'lady lava', 'queen lava',
    'peter piper picked a pack of pickled pepper',
    'she sells shells by the seashore'
  ],
};

export default class GODLY extends Spawn {
  constructor() {
    super({
      cooldown: m => this.cd(m),
      timeout: 60000,
      enabled: true,
      entries: 5,
      type: 'spam',
      odds: 2,
    }, visuals, {
      first: 100000,
      min: 50000,
      max: 50000,
    });
  }

  cd(member: GuildMember): number {
    const them = {
      '693324853440282654': 10, // Booster
      '768858996659453963': 15, // Donator
      '794834783582421032': 20, // Mastery
      '693380605760634910': 30, // Amari
    };

    for (const [id, cd] of Object.entries(them)) {
      if (this.has(member, id)) return cd;
    }

    return 60; // Default
  }
}