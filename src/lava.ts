import 'dotenv/config'
import Bot from './structures/Client'
import config from './config'

new Bot(config.token);