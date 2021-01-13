import 'dotenv/config'
import { LavaClient } from './structures/Client'
import config from './config'

const lava = new LavaClient(config);
lava.login(config.bot.token);