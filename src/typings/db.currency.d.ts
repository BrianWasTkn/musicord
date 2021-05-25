/**
 * Currency Data typings
*/

export declare global {
	interface CurrencyData extends MongoDocument {
		/** Their balance and other coins */
		props: CurrencyProps;
		/** Their item inventory */
		items: CurrencyInventory[];
		/** Their cooldown data */
		cooldowns: CooldownData[];
		/** Their `lava prestige` info */
		prestige: CurrencyPrestige;
		/** Their `lava daily` info */
		daily: CurrencyDaily;
		/** Their quests (3 max in this array) */
		quest: CurrencyQuests[];
		/** Their user settings */
		settings: SettingData[];
		/** Their gambling stats */
		gamble_stats: CurrencyGambleStats[];
		/** Their give/gift stats */
		trade: CurrencyTradeStats[];
		/** Their command stats */
		command: CommandData;
		/** Their rob statistics */
		rob: CurrencyRobStats[];
	}

	interface CurrencyProps {
		blocked: boolean;
		banned: boolean;
		pocket: number;
		vault: {
			locked: boolean; // they're being bankrobbed
			amount: number;
		};
		space: number;
		multi: number;
		prem: number;
		xp: number;
	}

	interface CurrencyInventory extends DataSlot {
		expire: number;
		amount: number;
		level: number;
		multi: number;
		uses: number;
	}

	interface CurrencyPrestige {
		level: number;
		title: number;
		earned: {
			multis: number;
			coins: number;
			items: number;
		}
	}

	interface CurrencyQuests extends DataSlot {
		count: number;
	}

	interface CurrencyDaily {
		streak: number;
		earned: number;
		time: number;
	}

	interface CurrencyGambleStats extends DataSlot {
		wins: number;
		loses: number;
		won: number;
		lost: number;
	}

	interface CurrencyTradeStats extends DataSlot {
		shared: number;
		recieved: number;
	}

	interface CommandData {
		last_ran: number;
		commands_ran: number;
		last_command: number;
	}

	interface CurrencyRobStats {
		stolen: number;
		fined: number;
		wins: number;
		loses: number;
	}
}