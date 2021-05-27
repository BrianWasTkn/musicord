/**
 * Mongoose "lava" collection.
 */
export declare global {
	import { Document } from 'mongoose';

	/**
	 * Interfaced model for global cooldowns.
	 */
	interface LavaProfile extends Document {
		/**
		 * The user id who owns the inhibited command fuckeries.
		 */
		_id: string;
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
	interface LavaCooldowns {
		/**
		 * The command id.
		 */
		id: string;
		/**
		 * The expiration timestamp.
		 */
		expire: number;
	}

	/**
	 * The final shitshow.
	 */
	interface LavaSettings {
		/**
		 * The id for this setting.
		 */
		id: string;
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
		last_cmd: number;
		/**
		 * The times they ran all commands.
		 */
		commands: {
			/**
			 * The id of the command.
			 */
			id: string;
			/**
			 * Amount of times they spammed the command.
			 */
			count: number;
		}[];
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
		 * Amount of times they got punished.
		 */
		count: number;
	}
}