import { SpawnConfig, SpawnVisual } from '@lib/interface/handlers/spawn'
import { GuildMember } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn'

const visuals: SpawnVisual = {
  emoji: '<:memerRed:729863510716317776>',
  type: 'UNCOMMON',
  title: 'Toes',
  description: 'Rated D (13)',
  strings: ['pjsalt', 'big daddy', 'damn son'],
};

export default class UNCOMMON extends Spawn {
  constructor() {
    super({
      cooldown: m => this.cd(m),
      enabled: true,
      timeout: 10000,
      entries: Infinity,
      type: 'message',
      odds: 14,
    }, visuals, {
      first: 150,
      min: 50,
      max: 100,
    });
  }

  cd(member: GuildMember): number {
    const them = {
      '693324853440282654': 1, // Booster
      '768858996659453963': 3, // Donator
      '794834783582421032': 10, // Mastery
      '693380605760634910': 15, // Amari
    };

    for (const [id, cd] of Object.entries(them)) {
      if (this.has(member, id)) return cd;
    }

    return 60; // Default
  }
}