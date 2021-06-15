import { Plugin, InhibitorHandler, Inhibitor, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Inhibitor', (client: LavaClient) => new InhibitorHandler(
		client, {
			automateCategories: true,
			classToHandle: Inhibitor,
			directory: join(__dirname, 'modules'),
		}
	)
);