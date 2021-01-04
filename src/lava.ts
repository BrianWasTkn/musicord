import 'dotenv/config';
import { LavaClient } from './structures/LavaClient'
import { config } from './config'

const lava = new LavaClient(config);
lava.login(config.token);