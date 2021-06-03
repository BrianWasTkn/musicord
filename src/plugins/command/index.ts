import { Plugin, CommandHandler, Command, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Command', (client: LavaClient) => new CommandHandler(
		client, {
			automateCategories: true,
			classToHandle: Command,
			commandUtil: true,
			directory: join(__dirname, 'commands'),
			handleEdits: true,
			prefix: ['lava'],
		}
	)
);