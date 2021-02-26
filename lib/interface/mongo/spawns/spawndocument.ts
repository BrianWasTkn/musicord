import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';

export interface SpawnDocument extends Document {
  userID: Snowflake;
  unpaid: number;
  eventsJoined: number;
}
