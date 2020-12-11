import { Musicord } from './lib/client/Client'
import config from './config/main'

const run = async () => {
	const { main, clientOptions, playerOptions, crib } = config;
	const ctx = new Musicord({ clientOptions, playerOptions, crib, main });

	const { token } = main;
	if (token) {
		try {
			ctx.utils.log('Musicord', 'main', 'Logging in...');
			await ctx.login(token);
		} catch(error) {
			ctx.utils.log('Musicord', 'error', 'Unable to login', error);
		}
	}
};

run();