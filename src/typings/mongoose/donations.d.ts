/**
 * Mongoose "donations" collection.
 */
export declare global {
	import { Document } from 'mongoose';

	/**
	 * Interfaced model for donations in Crib.
	 */
	interface DonationProfile extends Document {
		/**
		 * The idiot who owns a ton of donations.
		 */
		_id: string;
		/**
		 * The array of donation craps.
		 */
		donations: DonationData[];
	}

	/**
	 * The donation data itself obviously what else?
	 */
	interface DonationData {
		/**
		 * The id of this type of donation.
		 */
		id: 'default' | string;
		/**
		 * The amount they have donated for this type of donation.
		 */
		amount: number;
	}
}