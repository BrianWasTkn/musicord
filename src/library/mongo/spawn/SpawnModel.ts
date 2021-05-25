/**
 * The model for our spawn plugin.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';
import { Build as build } from '..';

const SpawnSchema = new Schema({
	_id: { type: String, required: true },

	props: {
		balance: build(Number, 0),
		joined_events: build(Number, 0),
	},
});

export const SpawnModel = model<SpawnData>('spawns', SpawnSchema);