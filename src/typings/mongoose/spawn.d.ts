/**
 * Mongoose "spawn" collection.
 */
export declare global {
	import { Document } from 'mongoose';

	/**
	 * Interfaced model for a spawn document.
	 */
	interface SpawnProfile extends Document {
		/**
		 * The id of the clown who owns this bullshit.
		 */
		_id: string;
		/**
		 * Their unpaid bullshits that made us bankrupt.
		 */
		unpaids: number;
		/**
		 * The amount of times they joined events to bankrupt us.
		 */
		joined: number;
	}
}