/**
 * The model for our currency collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';
import { Build as build } from '..';

const CurrencySchema = new Schema({
	_id: { type: String, required: true },

	props: {
		pocket: build(Number, 0),
		vault: {
			amount: build(Number, 0),
			locked: build(Boolean, false),
		},
		space: build(Number, 0),
		multi: {
			base: build(Number, 3),
			level_rewards: build(Number, 0),
		},
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

	prestige: {
		level: build(Number, 0),
		title: build(String, ''),
		earned: {
			multis: build(Number, 0),
			coins: build(Number, 0),
		}
	},

	quests: [{
		id: build(String, ''),
		count: build(Number, 0),
	}],

	gamble: [{
		id: build(String, 'gamble'),
		wins: build(Number, 0),
		loses: build(Number, 0),
		won: build(Number, 0),
		lost: build(Number, 0),
		streak: build(Number, 0),
	}],

	trade: [{
		id: build(String, 'share'),
		in: build(Number, 0),
		out: build(Number, 0),
	}],

	daily: {
		streak: build(Number, 0),
		time: build(Number, Date.now())
	},

	rob: {
		wins: build(Number, 0),
		fails: build(Number, 0),
		fined: build(Number, 0),
		stolen: build(Number, 0),
	}
});

export const CurrencyModel = model<CurrencyProfile>('economy', CurrencySchema);