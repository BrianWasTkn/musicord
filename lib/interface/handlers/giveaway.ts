import { TextChannel } from 'discord.js';

export type GiveawayBypassOptions = {
  roles?: string[];
};


export interface GiveawayStartOptions {
  channel: TextChannel;
  winners: number;
  bypass: GiveawayBypassOptions;
  prize: string;
  time: number;
}

export interface GiveawayEditOptions {
  winners: number;
  prize: string;
  time: number;
}

export interface GiveawayData {
  startedAt: number;
  winners: string[];
  endedAt: number;
  guildID: string;
  wCount: number;
  chanID: string;
  ended: boolean;
  msgID: string;
}
