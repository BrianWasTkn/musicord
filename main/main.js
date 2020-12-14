const Client = require('./lib/client/Client');
const config = require('./config.js');

const { clientOptions, playerConfig } = config;
const ctx = new Client(clientOptions, playerConfig);

// 3e6bfeb3-626f-42f9-b71c-f954dfad7c56 dsc.gg api token

ctx.login('Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs');