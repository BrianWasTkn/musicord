import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';

export interface SpawnDocument extends Document {
  eventsJoined: number;
  allowDM: boolean;
  userID: Snowflake;
  unpaid: number;
}
