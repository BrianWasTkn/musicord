import 'dotenv/config'
import { Client } from './structures/Client'
import config from './config'

const lava: Akairo.Client = new Client(config);
lava.build();