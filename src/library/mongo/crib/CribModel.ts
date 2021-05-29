/**
 * The model for our crib collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';
import { Build as build } from '..';

const CribSchema = new Schema({
	_id: { type: String, required: true },
	
	donations: [{
		id: build(String, 'default'),
		amount: build(Number, 0)
	}],

	booster: {
		role: build(String, ''),
		expires: build(Number, 1000 * 60 * 60 * 24 * 7)
	}
});

export const SpawnModel = model<CribProfile>('memers.crib', CribSchema);