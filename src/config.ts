import Lava from 'discord-akairo'

const config: Lava.Config = {
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
				intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS']
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
		emojis: [
			{ emoji: 'clown', winnings: 0.20451345 },
			{ emoji: 'eyes', winnings: 0.34646045 }, 
			{ emoji: 'alien', winnings: 0.34546106 }, 
			{ emoji: 'peach', winnings: 0.432563624 }, 
			{ emoji: 'star2', winnings: 0.45504585 }, 
			{ emoji: 'flushed', winnings: 0.50845608 }, 
			{ emoji: 'medal', winnings: 0.6056438 }, 
			{ emoji: 'trophy', winnings: 0.8025581 }, 
			{ emoji: 'fire', winnings: 1.0638134 }
		]
	},
	// Spawns
	spawns: {
		cooldown: 60,
		enabled: true,
		blacklisted: {
			users: [],
			channels: [],
			categories: [],
			guilds: []
		},
		whitelisted: {
			users: [],
			channels: [],
			categories: [],
			guilds: []
		}
	}
}

export default config;