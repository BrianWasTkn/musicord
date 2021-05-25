/**
 * Spawn Data typings
*/

export declare global {
	interface SpawnData extends MongoDocument {
		/** Their credits and other stuff */
		props: SpawnProps;
		/** Their cooldown data */
		cooldowns: CooldownData[];
		/** Their user settings */
		settings: SettingData[];
	}

	interface SpawnProps {
		balance: number;
		joined_events: number;
	}
}