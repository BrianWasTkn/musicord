import { SpawnConfig, SpawnVisual } from '@lib/interface/handlers/spawn';
import { GuildMember } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn';

const visuals: SpawnVisual = {
  emoji: '<:memerBlue:729863510330310727>',
  type: 'COMMON',
  title: 'Financial Support',
  description: 'Yes.',
  strings: ['penny', 'cash', 'coins', 'dmc', 'robux money'],
};

export default class COMMON extends Spawn {
  constructor() {
    super(
      {
        cooldown: (m) => this.cd(m),
        enabled: true,
        timeout: 10000,
        entries: 3,
        odds: 5,
        type: 'message',
      },
      visuals,
      {
        first: 69420,
        min: 10000,
        max: 10000,
      }
    );
  }

  cd(member: GuildMember): number {
    const them = {
      '693324853440282654': 3, // Booster
      '768858996659453963': 5, // Donator
      '794834783582421032': 10, // Mastery
      '693380605760634910': 20, // Amari
    };

    for (const [id, cd] of Object.entries(them)) {
      if (this.has(member, id)) return cd;
    }

    return 60; // Default
  }
}
