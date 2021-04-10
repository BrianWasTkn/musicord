export type { SpawnDocument } from '@lib/interface/mongo/spawns';
import type { SpawnDocument } from '@lib/interface/mongo/spawns';
import { Document, Schema, model } from 'mongoose';

export default model<Document<SpawnDocument>>(
  'spawn-profile',
  new Schema({
    eventsJoined: { type: Number, required: false, default: 0 },
    allowDM: { type: Boolean, required: false, default: false },
    unpaid: { type: Number, required: false, default: 0 },
    userID: { type: String, required: true },
  })
);
