import 'module-alias/register';
import 'dotenv/config';
import Instance from './instance';
import config from 'config/index';
// import './sharder';

const { akairo, discord, handlers, bot: { mongo: { uri, options } } } = config;
const lava = Instance(akairo, discord, handlers);

lava.setMongoPath(uri, options)
	.loadAll()
	.addTypes()
	.start();