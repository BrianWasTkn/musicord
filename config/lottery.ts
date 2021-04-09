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
	interval: 1000 * 60 * 5,
	rewards: {
		cap: 25e5,
		max: 1e6,
		min: 5e5,
	}
}