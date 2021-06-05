import { Plugin, SpawnHandler, Spawn, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Spawn', (client: LavaClient) => new SpawnHandler(
		client, {
			automateCategories: true,
			classToHandle: Spawn,
			directory: join(__dirname, 'modules'),
		}
	)
);