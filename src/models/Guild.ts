import mongoose, { Schema } from 'mongoose'

const guild= new Schema({
	guildID: { type: String, required: false },
	// Settings
	prefix: { type: String, required: false }
});

export default mongoose.model('guild', guild);