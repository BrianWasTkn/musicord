import 'module-alias/register';
import 'dotenv/config';

import { Context, Command } from 'lava/index';
import EventEmitter from 'events';
import Lava from './client';

Lava.on('debug', m => {
	Lava.console.debug('Client', m);
});

Lava.db.connect(process.env.MONGO_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

Lava.handlers.argument.addTypes();
Lava.handlers.listener.setEmitters(Lava.handlers);
Lava.login(process.env.DISCORD_TOKEN);