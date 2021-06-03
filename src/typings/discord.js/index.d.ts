declare module 'discord.js' {
	import { LavaClient } from 'lava/index';
	
	/**
	 * Base structure for all structures.
	 */
	interface Base {
		/**
		 * The client instance for tis structure.
		 */
		client: LavaClient;
	}
}