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

const Player = require('./Player.js');
const ClientUtil = require('./Util.js');
const LavaManager = require('./Manager.js');


module.exports = class LavaClient extends AkairoClient {
  constructor(config) {
    super({
      ownerID: config.owners
    }, {
      disableMentions: 'everyone'
    });

    this.player = new Player(this);

    this.util = new ClientUtil(this);

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

    this.lavaManager = new LavaManager(this);

    this.config = config;
  }

  loadEmitters() {
  	this.listenerHandler.setEmitters({
  		distube: this.player, 
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