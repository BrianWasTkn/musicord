/**
 * The model for our currency plugin.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';
import { Build as build } from '..';

const CurrencySchema = new Schema({
	_id: { type: String, required: true },

	props: {
		blocked: build(Boolean, false),
		banned: build(Boolean, false),
		pocket: build(Number, 0),
		vault: build(Number, 0),
		space: build(Number, 0),
		multi: build(Number, 3),
		prem: build(Number, 0),
		xp: build(Number, 0),
	},

	items: [{
		expire: build(Number, 0),
		amount: build(Number, 0),
		level: build(Number, 0),
		multi: build(Number, 0),
		uses: build(Number, 0),
		id: build(String, 0)
	}],

	cooldowns: [{
		id: build(Number, ''),
		expire: build(Number, 0)
	}],

	prestige: {
		level: build(Number, 0),
		title: build(String, ''),
		earned: {
			multis: build(Number, 0),
			coins: build(Number, 0),
			items: build(Number, 0),
		}
	},

	quests: [{
		id: build(String, ''),
		count: build(Number, 0),
	}],

	daily: {
		streak: build(Number, 0),
		earned: build(Number, 0),
		time: build(Number, Date.now())
	},

	settings: [{
		id: build(String, ''),
		enabled: build(Boolean, false),
		cooldown: build(Number, 0)
	}],

	gamble_stats: [{
		id: build(String, 'gamble'),
		wins: build(Number, 0),
		loses: build(Number, 0),
		won: build(Number, 0),
		lost: build(Number, 0),
	}],

	trade: [{
		id: build(String, 'share'),
		shared: build(Number, 0),
		recieved: build(Number, 0),
	}],

	command: {
		last_ran: build(Number, 0),
		commands_ran: build(Number, 0),
		last_command: build(String, 'help'),
	},

	rob: {
		stolen: build(Number, 0),
		fined: build(Number, 0),
		wins: build(Number, 0),
		loses: build(Number, 0),
	}
});

export const CurrencyModel = model<CurrencyData>('economy', CurrencySchema);