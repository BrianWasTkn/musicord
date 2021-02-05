import 'dotenv/config'
import { Config } from 'lava'
import { Client } from './structures/Client'
import config from './config'

const lava = new Client(config);
lava.login();