import { Musicord } from './lib/Client.js'
import { config } from './config.js'
import dotenv from 'dotenv'

dotenv.config();

const bot = new Musicord(config);

bot.login(config.token);