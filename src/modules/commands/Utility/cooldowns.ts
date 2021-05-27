import { Command, Context } from 'src/library';
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

