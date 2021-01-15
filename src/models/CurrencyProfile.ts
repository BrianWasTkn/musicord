import { Schema, model } from 'mongoose'

const CurrencyProfile: Schema = new Schema({
	userID: { type: String, required: false },
	// Balance
	pocket: { type: Number, required: false, default: 2500000 },
	vault: { type: Number, required: false, default: 100000 },
	space: { type: Number, required: false, default: 0 },
	// Gambling
	multi: { type: Number, required: false, default: 99 },
	won: { type: Number, required: false, default: 0 },
	lost: { type: Number, required: false, default: 0 },
	wins: { type: Number, required: false, default: 0 },
	loses: { type: Number, required: false, default: 0 },
	// Items
	items: { type: Array, required: false, default: [] }
});

export default model('currency', CurrencyProfile);