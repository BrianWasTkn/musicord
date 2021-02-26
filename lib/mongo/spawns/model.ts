export { SpawnDocument } from '../../interface/mongo/spawns';
import { SpawnDocument } from '../../interface/mongo/spawns';
import { Document, Schema, model } from 'mongoose';

export default model<Document<SpawnDocument>>(
  'spawn-profile',
  new Schema({
    userID: { type: String, required: true },
    unpaid: { type: Number, required: false, default: 0 },
    eventsJoined: { type: Number, required: false, default: 0 },
  })
);
