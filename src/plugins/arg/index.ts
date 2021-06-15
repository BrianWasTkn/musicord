import { Plugin, ArgumentHandler, Argument, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Argument', (client: LavaClient) => new ArgumentHandler(
		client, {
			automateCategories: true,
			classToHandle: Argument,
			directory: join(__dirname, 'modules'),
		}
	)
);