/**
 * The model for our currency collection.
 * @author BrianWasTaken
*/

import { Schema, Model, model } from 'mongoose';

const CurrencySchema = new Schema<CurrencyProfile, Model<CurrencyProfile>, CurrencyProfile>({
	_id: { 
		type: String, 
		required: true 
	},
	props: {
		pocket: {
			type: Number, 
			default: 0,
		},
		vault: {
			amount: {
				type: Number,
				default: 0,
			},
			locked: {
				type: Boolean,
				default: false
			}
		},
		space: {
			type: Number,
			default: 0
		},
		multi: {
			base: {
				type: Number,
				default: 3
			},
			level_rewards: {
				type: Number,
				default: 0
			}
		},
		prem: {
			type: Number,
			default: 0
		},
		xp: {
			type: Number,
			default: 0
		},
	},

	items: [
		{
			expire: {
				type: Number,
				default: 0,
			},
			amount: {
				type: Number,
				default: 0,
			},
			level: {
				type: Number,
				default: 0
			},
			multi: {
				type: Number,
				default: 0
			},
			uses: {
				type: Number,
				default: 0,
			},
			id: {
				type: String,
				default: 0
			}
		}
	],
	prestige: {
		level: {
			type: Number,
			default: 0
		},
		title: {
			type: String,
			default: 'Beginner'
		},
		earned: {
			multis: {
				type: Number,
				default: 0
			},
			coins: {
				type: Number,
				default: 0
			},
			items: {
				type: Number,
				default: 0
			}
		}
	},
	quests: [
		{
			id: {
				type: String,
				default: 0
			},
			count: {
				type: Number,
				default: 0
			}
		}
	],
	gamble: [
		{
			id: {
				type: String,
				default: 'gamble'
			},
			wins: {
				type: Number,
				default: 0,
			},
			loses: {
				type: Number,
				default: 0,
			},
			won: {
				type: Number,
				default: 0
			},
			lost: {
				type: Number,
				default: 0
			},
			streak: {
				type: Number,
				default: 0
			}
		}
	],
	trade: [
		{
			id: {
				type: String,
				default: 'share'
			},
			in: {
				type: Number,
				default: 0
			},
			out: {
				type: Number,
				default: 0
			}
		}
	],
	daily: {
		streak: {
			type: Number,
			default: 0
		},
		time: {
			type: Number,
			default: Date.now()
		},
	},
	rob: {
		wins: {
			type: Number,
			default: 0
		},
		fails: {
			type: Number,
			default: 0
		},
		fined: {
			type: Number,
			default: 0
		},
		stolen: {
			type: Number,
			default: 0
		},
	}
});

export const CurrencyModel = model<CurrencyProfile>('economy', CurrencySchema);