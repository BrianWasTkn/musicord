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
		min: 1000,
		max: 5000,
		first: 10000
	}
};

const visuals: SpawnVisuals = {
	emoji: '<:memerBlue:729863510330310727>',
	type: 'COMMON',
	title: 'Winter',
	description: 'Is it freezing outside?',
	strings: [
		'h', 'brian was very sleepy when making these', 
		'its cold asf', 'cold overload', 'cold lord',
		'snowballz', 'it feels like christmas', 'winter',
		'PacLantic ocean'
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