export interface LottoConfig {
	requirementID?: string;
	channelID: string;
	interval: number;
	guildID: string;
	rewards: {
		cap: number;
		max: number;
		min: number;
	}
}

export const lottoConfig: LottoConfig = {
	guildID: '691416705917779999',
	// channelID: '717351680676462712',
	channelID: '809489910351921192',
	requirementID: '692517500814098462',
	interval: 1e3 * 60 * 60, // 1hr
	rewards: {
		cap: 3e6,
		max: 15e5,
		min: 5e5,
	}
}