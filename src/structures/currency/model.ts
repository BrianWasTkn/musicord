import { Schema, model } from 'mongoose'

export default model('currency', new Schema({
	userID: { type: String, required: false },
	// Balance
	pocket: { type: Number, required: false, default: 1000 },
	vault: { type: Number, required: false, default: 0 },
	space: { type: Number, required: false, default: 0 },
	multi: { type: Number, required: false, default: 5 },
	// Gambling
	won: { type: Number, required: false, default: 0 },
	lost: { type: Number, required: false, default: 0 },
	wins: { type: Number, required: false, default: 0 },
	loses: { type: Number, required: false, default: 0 },
	// Items
	items: { type: Array, required: false, default: [] },
	gifted: { type: Array, required: false, default: 0 }
}));