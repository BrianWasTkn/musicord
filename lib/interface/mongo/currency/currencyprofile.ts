import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';
import { InventorySlot } from '@lib/interface/handlers/item';

export interface CurrencyProfile extends Document {
  marriage: MarriageData;
  quests: QuestSlot[];
  userID: Snowflake;
  pocket: number;
  items: InventorySlot[];
  vault: number;
  space: number;
  multi: number;
}

export interface QuestSlot {
	count?: number;
	done?: boolean;
	id?: string;
}

export interface MarriageData {
	since: number;
	id: string;
}