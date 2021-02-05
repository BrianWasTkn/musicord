import { Client } from 'discord-akairo'

declare module 'discord-giveaways' {
	export class Manager extends GiveawaysManager {
		public constructor(client: Client, options: ManagerOptions);
		public options: ManagerOptions;

		public deleteGiveaway(messageID: string): Promise<any>;
	}

	export interface ManagerOptions extends Omit<GiveawaysManagerOptions, 'storage'> {
		storage?: any;
		updateCountdownEvery?: number;
		endedGiveawaysLifetime?: number;
		hasGuildMembersIntent?: boolean;
		default?: GiveawayStartOptions;
	}
}