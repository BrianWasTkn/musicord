import { Schema, model } from 'mongoose'

const GuildConfig: Schema = new Schema({
	guildID: { type: String, required: false },
	// Settings
	prefix: { type: String, required: false }
});

export default model('guild', GuildConfig);