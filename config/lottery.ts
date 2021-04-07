export interface LottoConfig {
	requirementID?: string;
	channelID: string;
	interval: number;
	guildID: string;
	rewards: {
		min: number;
		max: number;
		cap: number;
	}
}

export const lottoConfig: LottoConfig = {
	guildID: '691416705917779999',
	channelID: '717351680676462712',
	requirementID: '692517500814098462',
	interval: 1000 * 60 * 60 * 6,
	rewards: {
		min: 100000,
		max: 1000000,
		cap: 1.5e6
	}
}