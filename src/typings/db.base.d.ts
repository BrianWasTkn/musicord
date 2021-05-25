/**
 * Base Data typings
*/

export declare global {
	import { Document } from 'mongoose';

	interface MongoDocument extends Document {
		/** The mongo "user" id */
		_id: string;
	}

	interface DataSlot {
		id: string;
	}

	interface CooldownData extends DataSlot {
		expire: number;
	}

	interface SettingData extends DataSlot {
		cooldown: number;
		enabled: boolean;
	}
}