import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';
import { InventorySlot } from '@lib/interface/handlers/item'

export interface CurrencyProfile extends Document {
  userID: Snowflake;
  pocket: number;
  items: InventorySlot[];
  vault: number;
  space: number;
  multi: number;
}
