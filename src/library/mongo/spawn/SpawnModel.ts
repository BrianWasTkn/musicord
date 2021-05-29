/**
 * The model for our spawn collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';
import { Build as build } from '..';

const SpawnSchema = new Schema({
	_id: { type: String, required: true },
	joined: build(Number, 0),
	unpaids: build(Number, 0),
});

export const SpawnModel = model<SpawnProfile>('spawns', SpawnSchema);