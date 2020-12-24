require('dotenv').config();
const LavaClient = require('./lib/Client.js');
const { config } = require('./config.js');

const bot = new LavaClient(config);
bot.login(config.token);