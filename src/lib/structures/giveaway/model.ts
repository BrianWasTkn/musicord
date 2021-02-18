import { Document, Schema, model } from 'mongoose'

export default model<Document<Lava.Giveaway>>(
    'giveaway',
    new Schema({
        _id: { type: String, required: true },
        channelID: { type: String, required: false },
        messageID: { type: String, required: false },
        giveaway: {
            default: { startTime: Date.now(), ended: false },
            required: false,
            type: {
                winnerCount: Number,
                host: String,
                prize: String,
                startTime: Number,
                endTime: Number,
                ended: Boolean,
            },
        },
    })
)
