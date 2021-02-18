import { Document, Schema, model } from 'mongoose'

export default model<Document<Lava.SpawnDocument>>(
    'spawn-profile',
    new Schema({
        userID: { type: String, required: true },
        unpaid: { type: Number, required: false, default: 0 },
        eventsJoined: { type: Number, required: false, default: 0 },
    })
)
