/**
 * Mongo Profiles
*/

import { TargetMethod } from 'lib/interface/handlers/quest';
import { Snowflake } from 'discord.js';
import { Document } from 'mongoose';

declare global {
	interface CurrencyData extends Document {
		cooldowns: CooldownData[];
		marriage: MarriageData;
		lastRan: number;
		lastCmd: string;
		userID: Snowflake;
		banned: boolean;
		pocket: number;
		items: InventorySlot[];
		daily: DailyData;
		quest: QuestSlot;
		vault: number;
		space: number;
		multi: number;
		stats: Stats;
		misc: MiscData;
		bled: boolean;
		prem: number;
	}

	interface InventorySlot {
		active?: boolean;
		expire?: number;
		amount?: number;
		multi?: number;
		id?: string;
		cd?: number;
	}

	interface Stats {
		wins: number;
		loses: number;
		won: number;
		lost: number;
		xp: number;
		prestige: number;
	}

	interface MiscData {
		beingHeisted: boolean;
	}

	interface DailyData {
		streak: number;
		time: number;
	}

	interface QuestSlot {
		target: number;
		count: number;
		type: TargetMethod;
		id: string;
	}

	interface MarriageData {
		since: number;
		id: string;
	}

	interface CooldownData {
		expire: number;
		uses: number;
		id: string;
	}

	type CurrencyProfile = Document & CurrencyData;
}
