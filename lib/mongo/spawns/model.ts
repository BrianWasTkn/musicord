export type { SpawnDocument } from '@lib/interface/mongo/spawns';
import type { SpawnDocument } from '@lib/interface/mongo/spawns';
import { Document, Schema, model } from 'mongoose';
import { Type } from '../Type';

export default model<Document<SpawnDocument>>(
  'spawn-profile',
  new Schema({
    eventsJoined: Type(Number, false, 0),
    allowDM: Type(Boolean, false, true),
    userID: Type(String, true, '123'),
    unpaid: Type(Number, false, 0)
  })
);
