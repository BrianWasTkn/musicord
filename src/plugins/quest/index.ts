import { Plugin, QuestHandler, Quest, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Quest', (client: LavaClient) => new QuestHandler(
		client, {
			automateCategories: true,
			classToHandle: Quest,
			debug: true,
			directory: join(__dirname, 'modules'),
		}
	)
);