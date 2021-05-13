import 'module-alias/register';
import 'dotenv/config';
import Instance from './instance';
import config from 'config/index';
import Args from './arguments';

const { akairo, discord, handlers, bot } = config;
const { uri, options } = bot.mongo;
const lava = Instance(akairo, discord, handlers);

lava.on('moduleLoad', mod => {
	lava.util.console.log(
		mod.handler.constructor.name,
		`Module "${process.env.DEV ? mod.id : mod.name}" loaded.`
	);
});

lava.on('dbConnect', db => {
	lava.util.console.log(
		'Mongoose', `v${db.version} — Connected!`
	);
});

lava.setMongoPath(uri, options)
	.loadAll()
	.addTypes(Args)
	.start();