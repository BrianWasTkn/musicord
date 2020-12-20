const LavaClient = require('./lib/Client.js');

const { config } = require('./config.js');
require('dotenv').config();

const bot = new LavaClient();

bot.login(config.token);