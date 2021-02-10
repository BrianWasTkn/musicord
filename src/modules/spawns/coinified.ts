import { 
	GuildMember 
} from 'discord.js'
import Spawn from '../../lib/structures/Spawn'

const config: Akairo.SpawnConfig = {
	odds: 3,
	type: 'message',
	enabled: true,
	timeout: 10000,
	entries: Infinity,
	rewards: {
		min: 1000,
		max: 5000,
		first: 10000
	}
};

const visuals: Akairo.SpawnVisual = {
	emoji: '<:memerGreen:729863510296887398>',
	type: 'SUPER',
	title: 'Get Coinified',
	description: 'Do you want coins?',
	strings: [
		'coinifocation', 'give me now or stupid',
		'frick off lava', 'lol imagine being',
		'yes', 'rain on me', 'crib op',
		'i\'ll join the taken cult', 'ig so',
		'well yes but actually....'
	]
}

export default class SUPER extends Spawn {
	public constructor(client: Akairo.Client) {
		super(client, config, visuals, (member: GuildMember): number => {
			// "Crib Booster" role
			if (member.roles.cache.has('693324853440282654')) return 5;
			// "Donator #M+" roles (minimum)
			if (member.roles.cache.has('768858996659453963')) return 10;
			// "Mastery #" roles (minimum)
			if (member.roles.cache.has('794834783582421032')) return 15;
			// "Amari #" roles (minimum)
			if (member.roles.cache.has('693380605760634910')) return 20;
			// Else
			return 60;
		});
	}
}