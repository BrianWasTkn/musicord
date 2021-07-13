import { Plugin, LavaClient, DonationHandler, Donation } from 'lava/index';
import { join } from 'path';

export default new Plugin(
	'Donation', (client: LavaClient) => new DonationHandler(client, {
		automateCategories: true,
		classToHandle: Donation,
		debug: true,
		directory: join(__dirname, 'modules'),
	})
);