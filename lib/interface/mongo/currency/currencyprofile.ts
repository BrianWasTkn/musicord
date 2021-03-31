import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';
import { InventorySlot } from '@lib/interface/handlers/item';

export interface CurrencyProfile extends Document {
  marriage: MarriageData;
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