/**
 * Mongoose "lava" collection.
 */
export declare global {
	import { Snowflake } from 'discord.js';

	/**
	 * Interfaced model for global cooldowns.
	 */
	interface LavaProfile extends BaseProfile {
		/**
		 * The array of cooldowns for this user.
		 */
		cooldowns: LavaCooldowns[];
		/**
		 * The settings for this user.
		 */
		settings: LavaSettings[];
		/**
		 * The command data for this user.
		 */
		commands: LavaCommands;
		/**
		 * Punishment records if they were bad.
		 */
		punishments: LavaPunishments;
	}

	/**
	 * The cooldown data owo
	 */
	interface LavaCooldowns extends DataSlot {
		/**
		 * The expiration timestamp.
		 */
		expire: number;
	}

	/**
	 * The final shitshow.
	 */
	interface LavaSettings extends DataSlot {
		/**
		 * State wether it's enabled or not.
		 */
		enabled: boolean;
		/**
		 * The cooldown for this command, if any.
		 */
		cooldown?: number;
	}

	/**
	 * Their command track info.
	 */
	interface LavaCommands {
		/**
		 * Number of spams >:)
		 */
		spams: number;
		/**
		 * Number of commands ran.
		 */
		commands_ran: number;
		/**
		 * Last timestamp they ran a command.
		 */
		last_ran: number;
		/**
		 * Last command they ran.
		 */
		last_cmd: string
	}

	/**
	 * The dumbfuckeries.
	 */
	interface LavaPunishments {
		/**
		 * Wether they are banned or not.
		 */
		banned: boolean;
		/**
		 * Wether they are just blocked or not.
		 */
		blocked: boolean;
		/**
		 * The expiration for the punishment.
		 */
		expire: number;
		/**
		 * Amount of times they got punished.
		 */
		count: number;
	}
}