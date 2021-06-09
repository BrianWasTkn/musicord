import { Plugin, SettingHandler, Setting, LavaClient } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Setting', (client: LavaClient) => new SettingHandler(
		client, {
			automateCategories: true,
			classToHandle: Setting,
			directory: join(__dirname, 'modules'),
		}
	)
);