import { Plugin, ListenerHandler, Listener, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Listener', (client: LavaClient) => new ListenerHandler(
		client, {
			automateCategories: true,
			classToHandle: Listener,
			debug: true,
			directory: join(__dirname, 'modules'),
		}
	)
);