import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';
import { InventorySlot } from '@lib/interface/handlers/item'

export interface CurrencyProfile extends Document {
  userID: Snowflake;
  items: InventorySlot[];
  cooldowns: any[];
  pocket: number;
  vault: number;
  space: number;
  multi: number;
  won: number;
  lost: number;
  wins: number;
  loses: number;
  gifted: number;
}
