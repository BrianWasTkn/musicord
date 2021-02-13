import { 
	GuildMember 
} from 'discord.js'
import Spawn from '../../lib/structures/Spawn'

const config: Akairo.SpawnConfig = {
	odds: 5,
	type: 'message',
	enabled: true,
	timeout: 10000,
	entries: 3,
	rewards: {
		min: 1000,
		max: 5000,
		first: 5000
	}
};

const visuals: Akairo.SpawnVisual = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: 'Financial Support',
	description: 'Do you need it?',
	strings: [
		'f i n a n c i a l', 's u p p o r t', 
		'i wanna be a helicopter', 'suppwot',
		'surprised pikashit face', 
	]
}

export default class COMMON extends Spawn {
	public constructor() {
		super(config, visuals, (member: GuildMember): number => {
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