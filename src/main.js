require('dotenv').config();
const LavaClient = require('./lib/Client.js');

const { config } = require('./config.js');

const bot = new LavaClient();

bot.login(config.token);