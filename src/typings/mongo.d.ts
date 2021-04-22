/**
 * Mongo Profiles
*/

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
		bled: boolean;
	}

	interface DailyData {
		streak: number;
		time: number;
	}

	interface QuestSlot {
		target: number;
		count: number;
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
