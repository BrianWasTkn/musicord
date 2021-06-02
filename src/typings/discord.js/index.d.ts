declare module 'discord.js' {
	import { LavaClient } from 'src/library';
	
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