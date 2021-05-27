/**
 * Mongoose "booster" collection.
 */
export declare global {
	import { Document } from 'mongoose';

	/**
	 * Interfaced model for booster perks in Crib.
	 */
	interface BoosterProfile extends Document {
		/**
		 * The id of the booster.
		 */
		_id: string;
		/**
		 * The id of their custom role.
		 */
		role: string;
		/**
		 * The cooldown until their perks expire (1w)
		 */
		expires: string;
	}
}