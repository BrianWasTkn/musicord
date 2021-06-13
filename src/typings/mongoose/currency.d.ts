/**
 * Mongoose "currency" collection.
 */
export declare global {
	import { Document } from 'mongoose';

	/**
	 * Interfaced currency profile for bot spammers.
	 */
	interface CurrencyProfile extends Document {
		/**
		 * The user id to whoever owns this complicated shitfuckery.
		 */
		_id: string;
		/**
		 * All their basic properties.
		 */
		props: CurrencyProps;
		/**
		 * Their currency items.
		 */
		items: CurrencyInventory[];
		/**
		 * Their gOdLY upgrades :rolling_eyes: 
		 */
		prestige: CurrencyPrestige;
		/**
		 * Their quests (max: 3 for this array)
		 */
		quests: CurrencyQuests[];
		/**
		 * Their gamble stats.
		 */
		gamble: CurrencyGamble[];
		/**
		 * Trade stats.
		 */
		trade: CurrencyTrade[];
		/**
		 * Their daily stats.
		 */
		daily: CurrencyDaily;
		/**
		 * Rob stats.
		 */
		rob: CurrencyRob;
	}

	/**
	 * Their basic properties. 
	 */
	interface CurrencyProps {
		/**
		 * Their pocket.
		 */
		pocket: number;
		/**
		 * Their vault.
		 */
		vault: {
			/**
			 * Wether they are being heisted.
			 */
			locked: boolean;
			/**
			 * Amount the vault has. 
			 */
			amount: number;
		};
		/**
		 * Their bankspace.
		 */
		space: number;
		/**
		 * Their multipliers.
		 */
		multi: {
			/**
			 * Their level reward multis.
			 */
			level_rewards: number;
			/**
			 * Their base multis.
			 */
			base: number;
		};
		/**
		 * Their premium keys.
		 */
		prem: number;
		/**
		 * Their level xp.
		 */
		xp: number;
	}

	/**
	 * Their silly little items they think they're rich.
	 */
	interface CurrencyInventory {
		/**
		 * The id of this item
		 */
		id: string;
		/**
		 * Amount of skittles they have eaten.
		 */
		uses: number;
		/**
		 * The multipliers of this item for a period of time only.
		 */
		multi: number;
		/**
		 * The upgrade of this item.
		 */
		level: number;
		/**
		 * When this item would expire.
		 */
		expire: number;
		/**
		 * Amount of skittles they own.
		 */
		amount: number;
	}

	/**
	 * Their stupid upgrades.
	 */
	interface CurrencyPrestige {
		/**
		 * Their prestige level.
		 */
		level: number;
		/**
		 * The title they hold.
		 */
		title: string;
		/**
		 * Earned bullshits
		 */
		earned: {
			/**
			 * Multipliers they got from level rewards.
			 */
			multis: number;
			/**
			 * Coins they got from level rewards.
			 */
			coins: number;
		}
	}

	/**
	 * Their quests.
	 */
	interface CurrencyQuests {
		/**
		 * ID of the quest.
		 */
		id: string;
		/**
		 * Amount completed.
		 */
		count: number;
	}

	/**
	 * Their gambling stats.
	 */
	interface CurrencyGamble {
		/**
		 * ID of the command.
		 */
		id: string;
		/**
		 * Total coins they won.
		 */
		won: number;
		/**
		 * Total coins they lost.
		 */
		lost: number;
		/**
		 * Amount of times they won. 
		 */
		wins: number;
		/**
		 * Amount of times they lost.
		 */
		loses: number;
		/**
		 * Their win streak.
		 */
		streak: number;
	}

	/**
	 * Their sharing stats. Hey look it's satan claus!
	 */
	interface CurrencyTrade {
		/**
		 * ID of this command.
		 */
		id: string;
		/**
		 * Coins/Items recieved.
		 */
		in: number;
		/**
		 * Coins/Items given or shared.
		 */
		out: number;
	}

	/**
	 * Their daily statistards.
	 */
	interface CurrencyDaily {
		/**
		 * Their streak.
		 */
		streak: number;
		/**
		 * Timestamp last time they claimed.
		 */
		time: number;
	}

	/**
	 * Their rob stats.
	 */
	interface CurrencyRob {
		/**
		 * Amount of times they succeeded a rob.
		 */
		wins: number;
		/**
		 * Amount of times they got fined.
		 */
		fails: number;
		/**
		 * Total amount of fined coins.
		 */
		fined: number;
		/**
		 * Total amount of stolen coins.
		 */
		stolen: number;
	}
}