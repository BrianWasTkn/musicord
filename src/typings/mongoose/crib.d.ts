/**
 * Mongoose "memers.crib" collection.
 */
export declare global {
	import { Document } from 'mongoose';

	/**
	 * Interfaced model for donations in Crib.
	 */
	interface CribProfile extends Document {
		/**
		 * The idiot who owns a ton of donations.
		 */
		_id: string;
		/**
		 * The array of donation craps.
		 */
		donations: CribDonation[];
		/**
		 * The booster shitshow.
		 */
		booster: CribBoost;
	}

	/**
	 * The donation data itself obviously what else?
	 */
	interface CribDonation extends DataSlot {
		/**
		 * The amount they have donated for this type of donation.
		 */
		amount: number;
		/**
		 * Count of how many times they donated for this typeof dono.
		 */
		count: number;
		/**
		 * The donations recorded.
		 */
		donations: number[];
	}

	/**
	 * The booster stuff.
	 */
	interface CribBoost {
		/**
		 * The id of their custom role.
		 */
		role: string;
		/**
		 * The expiration date for this perk.
		 */
		expires: number;
	}
}