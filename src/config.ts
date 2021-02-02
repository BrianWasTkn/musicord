import { 
	Snowflake, 
	EmojiResolvable, 
	ClientOptions 
} from 'discord.js'
import { Config } from 'discord-akairo'

interface Cfg {
	bot: ConfigBot;
	spawns: ConfigSpawns;
	currency: ConfigCurrency;
}

interface ConfigBot {
	dev: boolean;
	token: string;
	prefix: string[];
	ownerID: Snowflake[];
	clientOptions: ClientOptions;
}

interface ConfigSpawns {
	enabled: boolean;
	unpaidCap: number;
	defaultCooldown: number;
	blacklistedChannels: Snowflake[];
	whitelistedCategories: Snowflake[];
}

interface ConfigCurrency { 
	slotEmojis: Array<{ 
		winnings: number,
		emoji: EmojiResolvable
	}>;
	gambleCaps: {
		[property: string]: number;
	}
}

const currency: ConfigCurrency = {
	gambleCaps: {
		minBet: 50,
		maxBet: 500000,
		maxWin: 2222222,
		maxPocket: 10000000,
		maxMulti: 120
	},
	slotEmojis: [{
		emoji: 'clown', 
		winnings: 1.1 
	},{
		emoji: 'peach', 
		winnings: 1.3 
	},{
		emoji: 'flushed', 
		winnings: 1.7 
	},{	
		emoji: 'star2', 
		winnings: 2.4 
	}, {	
		emoji: 'fire', 
		winnings: 3.0 
	}]
}

const spawns: ConfigSpawns = {
	enabled: true,
	unpaidCap: 10000000,
	defaultCooldown: 60,
	blacklistedChannels: [],
	whitelistedCategories: []
}

const bot: ConfigBot = {
	dev: false,
	prefix: ['lava', ';;',],
	token: process.env.TOKEN,
	ownerID: ['605419747361947649'],
	clientOptions: {
		disableMentions: 'everyone',
		fetchAllMembers: false,
		ws: { 
			intents: [
				'GUILDS', 
				'GUILD_MEMBERS', 
				'GUILD_MESSAGES'
			]
		}
	}
}



export const cfg: Cfg = { bot, currency, spawns };

const config: Config = {
	// Bot
	lava: {
		devMode: false,
		prefix: ["lava", ";;"],
		token: process.env.TOKEN,
		akairo: {
			ownerID: ['605419747361947649']
		},
		client: {
			disableMentions: 'everyone',
			fetchAllMembers: false,
			ws: {
				intents: [
					'GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'
				]
			}
		}
	},
	// Currency
	currency: {
		caps: {
			minBet: 420,
			maxBet: 500000,
			maxWin: 2222222,
			maxPocket: 15000000,
			maxMulti: 150
		},
		slots: {
			emojis: [
				'clown', 'peach', 'star2',
				'medal', 'fire'

				// 'clown', 'eyes', 'alien',
				// 'peach', 'star2', 'flushed',
				// 'medal', 'trophy', 'fire'
			],
			winnings: [
				1.1234310, 1.8642608, 2.14641060,
				2.63464804, 3.85641601
				
				// 1.1234310, 1.3654613, 1.5646046,
				// 1.8642608, 2.14641060, 2.3564610,
				// 2.63464804, 3.288604160, 3.85641601
			]
		}
		// emojis: [
		// 	{ emoji: 'clown', winnings: 0.50451345 },
		// 	{ emoji: 'eyes', winnings: 0.64646045 }, 
		// 	{ emoji: 'alien', winnings: 0.84546106 }, 
		// 	{ emoji: 'peach', winnings: 1.032563624 }, 
		// 	{ emoji: 'star2', winnings: 1.25504585 }, 
		// 	{ emoji: 'flushed', winnings: 1.30845608 }, 
		// 	{ emoji: 'medal', winnings: 1.5056438 }, 
		// 	{ emoji: 'trophy', winnings: 1.88025581 }, 
		// 	{ emoji: 'fire', winnings: 2.0638134 }
		// ]
	},
	// Spawns
	spawns: {
		cooldown: 60,
		enabled: true,
		cap: 20000000,
		blacklisted: {
			users: [],
			channels: [
				// Public Chat
				'791659327148261406',
				'801471120192438312',
				'801413467080622120',
				'692923254872080395',
				'756101559938449449',
				'796019885775126560',
				'691597490411012137',
				// Dank Memer
				'691594488103305216',
				'692547222017015828',
				'691595376524001290',
				'694697159848886343'
			],
			categories: [],
			guilds: []
		},
		whitelisted: {
			users: [],
			channels: [],
			categories: [
				'692516869328076841',
				'691416705917780000', 
				'691595121866571776', 
				'791576124185378817',
				'724618509958774886'
			],
			guilds: []
		}
	}
}

export default config;