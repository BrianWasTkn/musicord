/**
 * Mongoose "memers.crib" collection.
 */
export declare global {
	/**
	 * Interfaced model for donations in Crib.
	 */
	interface CribProfile extends BaseProfile {
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