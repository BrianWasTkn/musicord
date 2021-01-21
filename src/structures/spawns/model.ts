import { Schema, model } from 'mongoose'

export default model('spawn-profile', new Schema({
	userID: { type: String, required: true },
	unpaid: { type: Number, required: false, default: 0 },
	eventsJoined: { type: Number, required: false, default: 0 },
}));