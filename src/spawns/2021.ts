import { 
	Client,
	SpawnConfig, 
	SpawnVisuals, 
} from 'discord-akairo'
import { 
	GuildMember 
} from 'discord.js'
import Spawn from '../structures/Spawn'

const config: SpawnConfig = {
	odds: 5,
	type: 'message',
	enabled: true,
	timeout: 10000,
	entries: 5,
	rewards: {
		min: 210000,
		max: 210000,
		first: 2100000
	}
};

const visuals: SpawnVisuals = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: '2021',
	description: 'A fresh start.',
	strings: [
		'vaccine', '2 in 1', 'use discord instead of skype',
		'a fresh start', 'the roaring 20s', 'electroswing',
		'bye 2020, hi 2021', 'back to square twenty one'
	]
}

export default class Common extends Spawn {
	public constructor(client: Client) {
		super(client, config, visuals, (member: GuildMember): number => {
			// "Crib Booster" role
			if (member.roles.cache.has('693324853440282654')) return 3;
			// "Donator #M+" roles (minimum)
			if (member.roles.cache.has('768858996659453963')) return 5;
			// "Mastery #" roles (minimum)
			if (member.roles.cache.has('794834783582421032')) return 10;
			// "Amari #" roles (minimum)
			if (member.roles.cache.has('693380605760634910')) return 20;
			// Else
			return 60;
		});
	}
}