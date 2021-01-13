import mongoose, { Schema } from 'mongoose'

const currency = new Schema({
	userID: { type: String, required: false },
	unpaid: { type: Number, required: false, default: 10000 },
});

export default mongoose.model('spawns', currency);