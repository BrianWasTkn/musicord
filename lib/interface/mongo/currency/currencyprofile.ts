import { InventorySlot } from '@lib/interface/handlers/item';
import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';

export interface CurrencyProfile extends Document {
  cooldowns: CooldownData[];
  marriage: MarriageData;
  lastRan: number;
  lastCmd: string;
  userID: Snowflake;
  pocket: number;
  items: InventorySlot[];
  quest: QuestSlot;
  vault: number;
  space: number;
  multi: number;
}

export interface QuestSlot {
	target: number;
	count: number;
	id: string;
}

export interface MarriageData {
	since: number;
	id: string;
}

export interface CooldownData {
  expire: number;
  uses: number;
  id: string;
}