const { 
	AkairoClient,
	ListenerHandler,
	CommandHandler 
} = require('discord-akairo');
const { 
  join 
} = require('path');
const { 
	config 
} = require('../config.js');

const ClientUtil = require('./Util.js');
const Manager = require('./Manager.js');
const Spawner = require('./Spawner.js');


module.exports = class LavaClient extends AkairoClient {
  constructor(config) {
    super({
      ownerID: config.owners
    }, {
      disableMentions: 'everyone'
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'emitters')
    });

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
    	prefix: config.prefix,
    	handleEdits: true,
    	commandUtil: true,
    	defaultCooldown: 1000,
    	allowMention: true
    });

    this.util = new ClientUtil(this);

    this.lavaManager = new Manager(this);

    this.config = config;
  }

  loadEmitters() {
  	this.listenerHandler.setEmitters({
  		process: process
  	});
  }

  async login(token) {
  	this.loadEmitters();
  	this.commandHandler.loadAll();
  	this.commandHandler.useListenerHandler(this.listenerHandler);
  	this.listenerHandler.loadAll();
  	return super.login(token);
  }

  async restart() {
  	return super.destroy(this.token);
  }
}