import 'dotenv/config'
import { Client } from './lib/structures/Client'
import config from './config'

const lava: Akairo.Client = new Client(config);
lava.build();