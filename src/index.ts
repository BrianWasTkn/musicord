import 'module-alias/register';
import 'dotenv/config';
import Lava from './client';

/**
 * When discord spits out informative shit.
 */
Lava.on('debug', m => {
	Lava.console.debug('Client', m);
});

/**
 * Establish a MongoDB connection.
 */
Lava.db.connect(process.env.MONGO_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

/**
 * Load all plugins.
 */
Lava.plugins.loadAll();

/**
 * Plug our bot in discord's butthole.
 */
Lava.login(process.env.DISCORD_TOKEN);