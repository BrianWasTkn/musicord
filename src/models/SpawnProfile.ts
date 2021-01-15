import { Schema, model } from 'mongoose'

const SpawnProfile: Schema = new Schema({
	userID: { type: String, required: true },
	paid: { type: Number, required: false, default: 0 },
	unpaid: { type: Number, required: false, default: 0 },
	eventsJoined: { type: Number, required: false, default: 0 },
});

export default model('spawn-profile', SpawnProfile);