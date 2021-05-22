/**
 * Currency Data declarations
*/

import { Document } from 'mongoose';

declare global {
	interface CurrencyData extends Document {
		_id: string;
		props: CurrencyProps;
		settings: CurrencySettings;
		stats: CurrencyStats[];
		upgrades: CurrencyUpgrades;
		misc: CurrencyMisc;
	}

	interface CurrencyProps {
		cooldowns: CooldownData[];
		items: InventorySlot[];
		blacklisted: boolean;
		banned: boolean;
		pocket: number;
		vault: number;
		space: number;
		multi: number;
		prem: number;
	}

	interface InventorySlot {
		consumed: number;
		expire: number;
		amount: number;
		multi: number;
		id: string;
	}

	interface CooldownData {
		expire: number;
		id: string;
	}

	interface CurrencySettings {
		dmNotifs: boolean;
		devMode: boolean;
	}

	interface CurrencyStats {
		id: string;
		wins: number;
		loses: number;
		won: number;
		lost: number;
	}

	interface CurrencyUpgrades {
		prestige: number;
		xp: number;
	}

	interface CurrencyMisc {
		heisted: { guild: string; suspect: string; state: boolean };
		quest: { id: string, count: number, target: string, done: { done: boolean; count: number; } }[];
		daily: { streak: number; time: number };
		work: { id: string; hours: number; gained: number; fail: number; };
	}
}