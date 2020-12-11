const Client = require('./lib/client/Client');
const config = require('./config.js');

const { clientOptions, playerConfig } = config;
const ctx = new Client(clientOptions, playerConfig);

ctx.login('Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs');