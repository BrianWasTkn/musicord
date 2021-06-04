import { Command, Context } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class UtilityCommand extends Command {
	public constructor() {
		super('cooldowns', {
			name: 'Cooldowns',
			channel: 'guild',
			aliases: ['cooldowns', 'cds'],
		});
	}
}

