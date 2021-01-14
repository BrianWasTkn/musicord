import { Schema, model } from 'mongoose'

const SpawnProfile: Schema = new Schema({
	// Public
	userID: { type: String, required: true },
	paid: { type: Number, required: false, default: 0 },
	unpaid: { type: Number, required: false, default: 0 },
	cooldown: { type: Date, required: false, default: 0 },
	// Private
	eventsJoined: { type: Number, required: false, default: 0 },
});

export default model('spawn-profile', SpawnProfile);