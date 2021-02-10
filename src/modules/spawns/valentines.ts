import { 
	GuildMember 
} from 'discord.js'
import Spawn from '../../lib/structures/Spawn'

const config: Akairo.SpawnConfig = {
	odds: 14,
	type: 'message',
	enabled: true,
	timeout: 10000,
	entries: Infinity,
	rewards: {
		min: 1400,
		max: 1400,
		first: 14000
	}
};

const visuals: Akairo.SpawnVisual = {
	emoji: '<:memerRed:729863510716317776>',
	type: 'UNCOMMON',
	title: 'Advanced Simpy Valentines',
	description: 'King of Danks or Queen of Memes?',
	strings: [
		'i mean, why not be a queen of memes?',
		'but king of danks bettur doe', 'yes', 
		'ok', 'honey boo boo', 'love yourself',
		'relationshits', 'cupid\'s toe', 'lovers'
	]
}

export default class UNCOMMON extends Spawn {
	public constructor(client: Akairo.Client) {
		super(client, config, visuals, (member: GuildMember): number => {
			// "Crib Booster" role
			if (member.roles.cache.has('693324853440282654')) return 14;
			// "Donator #M+" roles (minimum)
			if (member.roles.cache.has('768858996659453963')) return 20;
			// "Mastery #" roles (minimum)
			if (member.roles.cache.has('794834783582421032')) return 25;
			// "Amari #" roles (minimum)
			if (member.roles.cache.has('693380605760634910')) return 30;
			// Else
			return 60;
		});
	}
}