/**
 * The model for our lava collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';
import { Build as build } from '..';

const LavaSchema = new Schema({
	_id: { type: String, required: true },
	
	cooldowns: [{
		id: build(String, 'help'),
		expire: build(Number, 0)
	}],

	settings: [{
		id: build(String, 'currency.dms'),
		enabled: build(Boolean, false),
		cooldown: build(Number, 0)
	}],

	commands: {
		spams: build(Number, 0),
		commands_ran: build(Number, 1),
		last_ran: build(Number, Date.now()),
		last_cmd: build(String, 'help')
	},

	punishments: {
		banned: build(Boolean, false),
		blocked: build(Boolean, false),
		expire: build(Number, 0),
		count: build(Number, 0),
	},
});

export const LavaModel = model<LavaProfile>('lava', LavaSchema);