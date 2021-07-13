/**
 * The model for our crib collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';

const CribSchema = new Schema<CribProfile, Model<CribProfile>, CribProfile>({
	_id: { 
		type: String, 
		required: true 
	},
	donations: [
		{
			id: {
				type: String,
				default: 'default'
			},
			amount: {
				type: Number,
				default: 0
			},
			count: {
				type: Number,
				default: 0
			},
			donations: [
				{
					type: Number,
					default: 0
				}
			]
		}
	],
	booster: {
		role: {
			type: String,
			default: '',
		},
		expires: {
			type: Number,
			default: 1000 * 60 * 60 * 24 * 7
		},
	}
});

export const CribModel = model<CribProfile>('memers.crib', CribSchema);