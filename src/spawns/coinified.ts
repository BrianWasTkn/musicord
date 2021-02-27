import { SpawnConfig, SpawnVisual } from '@lib/interface/handlers/spawn'
import { GuildMember } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn'

const visuals: SpawnVisual = {
  emoji: '<:memerGreen:729863510296887398>',
  type: 'SUPER',
  title: 'Get Coinified',
  description: 'Do you want coins?',
  strings: ['yes', 'yesn\'t', 'no'],
};

export default class SUPER extends Spawn {
  constructor() {
    super({
      cooldown: m => this.cd(m),
      entries: Infinity,
      timeout: 10000,
      enabled: true,
      type: 'message',
      odds: 3,
    }, visuals, {
      first: 250000,
      min: 25000,
      max: 5000,
    });
  }

  cd(member: GuildMember): number {
    const them = {
      '693324853440282654': 5, // Booster
      '768858996659453963': 10, // Donator
      '794834783582421032': 15, // Mastery
      '693380605760634910': 20, // Amari
    };

    for (const [id, cd] of Object.entries(them)) {
      if (this.has(member, id)) return cd;
    }

    return 60; // Default
  }
}