import mongoose, { Schema } from 'mongoose'

const currency = new Schema({
	userID: { type: String, required: false },
	// Balance
	pocket: { type: Number, required: false, default: 100000 },
	vault: { type: Number, required: false, default: 100000 },
	space: { type: Number, required: false, default: 100000 },
	// Gambling
	multiplier: { type: Number, required: false, default: 5 },
	totalWon: { type: Number, required: false, default: 0 },
	totalLost: { type: Number, required: false, default: 0 },
	timesWon: { type: Number, required: false, default: 0 },
	timesLost: { type: Number, required: false, default: 0 },
	// Items
	items: { type: Array, required: false, default: [] }
});

export default mongoose.model('currency', currency);