import { Spawn } from '../../handlers/spawn';
import {
  EmojiResolvable,
  GuildMember,
  TextChannel,
  Snowflake,
} from 'discord.js';

export type SpawnVisualsType = 'COMMON' | 'UNCOMMON' | 'SUPER' | 'GODLY';
export type SpawnConfigType = 'message' | 'spam' | 'react';
export type SpawnCooldown = (member?: GuildMember) => { [k: string]: number };
export type SpawnReward = { [reward: string]: number };

export interface SpawnConfig {
  cooldown?: SpawnCooldown;
  rewards: SpawnReward;
  enabled: boolean;
  timeout: number;
  entries: number;
  type: SpawnConfigType;
  odds: number;
}

export interface SpawnVisual {
  description: string;
  strings: string[];
  emoji: EmojiResolvable;
  title: string;
  type: SpawnVisualsType;
}

export interface SpawnQueue {
  channel: Snowflake;
  spawn: Spawn;
  msg: Snowflake;
}
