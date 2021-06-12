import 'module-alias/register';
import 'dotenv/config';

import { Context, Command } from 'lava/index';
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
 * Load command arguments.
 */
Lava.handlers.argument.addTypes();

/**
 * Command Handler
 */
Lava.handlers.command.on('error', (ctx: Context, cmd: Command, args: any, error: Error) => {
  Lava.console.error('Command', error, true);
  return ctx.channel.send('Something wrong occured :c');
})

/**
 * Plug our bot in discord's butthole.
 */
Lava.login(process.env.DISCORD_TOKEN);