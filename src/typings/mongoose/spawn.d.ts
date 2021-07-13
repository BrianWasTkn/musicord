/**
 * Mongoose "spawn" collection.
 */
export declare global {
	/**
	 * Interfaced model for a spawn document.
	 */
	interface SpawnProfile extends BaseProfile {
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