/**
 * The model for our lava collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';

const LavaSchema = new Schema<LavaProfile, Model<LavaProfile>, LavaProfile>({
	_id: { 
		type: String, 
		required: true 
	},
	cooldowns: [
		{
			id: { 
				type: String, 
				default: 'help' 
			},
			expire: { 
				type: Number, 
				default: 0 
			}
		}
	],
	settings: [
		{
			id: { 
				type: String, 
				default: 'notifs.dm' 
			},
			enabled: { 
				type: Boolean, 
				default: false 
			},
			cooldown: {
				type: Number, 
				default: 0 
			},
		}
	],
	commands: {
		spams: { 
			type: Number, 
			default: 0
		},
		commands_ran: { 
			type: Number, 
			default: 0
		},
		last_cmd: { 
			type: String, 
			default: 'help'
		},
		last_ran: { 
			type: Number, 
			default: Date.now()
		},
	},
	punishments: {
		banned: { 
			type: Boolean, 
			default: false 
		},
		blocked: { 
			type: Boolean, 
			default: false 
		},
		expire: { 
			type: Number, 
			default: 0 
		},
		count: { 
			type: Number, 
			default: 0 
		},
	},
});

export const LavaModel = model<LavaProfile>('lava', LavaSchema);