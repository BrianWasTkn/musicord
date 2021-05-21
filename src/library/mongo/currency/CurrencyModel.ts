/// <reference path="../../../typings/mongo.currency.d.ts" />

import { Schema, Model, model } from 'mongoose';
import { Build as build } from '..';

const CurrencySchema = new Schema({
	props: {
		cooldowns: [{ 
			expire: Number, 
			id: String
		}],
		items: [{ 
			consumed: Number, 
			active: Boolean,
			expire: Number, 
			amount: Number, 
			multi: Number, 
			id: String
		}],
		blacklisted: build(Boolean, false),
		banned: build(Boolean, false),
		pocket: build(Number, 0),
		vault: build(Number, 0),
		space: build(Number, 0),
		multi: build(Number, 3),
		prem: build(Number, 0)
	},

	settings: {
		dmNotifs: build(Boolean, false),
		devMode: build(Boolean, false)
	},

	stats: [{
		id: String,
		wins: Number,
		loses: Number,
		won: Number,
		lost: Number
	}],

	upgrades: {
		prestige: build(Number, 0),
		xp: build(Number, 0)
	},

	misc: {
		quest: [{
			done: {
				done: Boolean,
				count: Number
			},
			target: String,
			count: Number,
			id: String,
		}],
		heisted: {
			suspect: String,
			state: Boolean,
			guild: String,
		},
		daily: {
			streak: Number,
			time: Number
		},
		work: {
			id: String,
			hours: Number,
			gained: Number,
			failed: Number
		}
	}
});

export const CurrencyModel = model<CurrencyData>('economy', CurrencySchema);