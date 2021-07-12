/**
 * The model for our spawn collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';

const SpawnSchema = new Schema<SpawnProfile, Model<SpawnProfile>, SpawnProfile>({
	_id: { 
		type: String, 
		required: true 
	},
	unpaids: { 
		type: Number, 
		default: 0 
	},
	joined: { 
		type: Number, 
		default: 0 
	},
});

export const SpawnModel = model<SpawnProfile>('spawns', SpawnSchema);