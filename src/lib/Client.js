const { 
	AkairoClient,
	ListenerHandler,
	CommandHandler 
} = require('discord-akairo');
const {
  Collection
} = require('discord.js');
const { 
  join 
} = require('path');
const { 
  readdirSync 
} = require('fs');
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

    this.spawners = new Collection();

    this.config = config;
  }

  importSpawners() {
    const spawns = readdirSync(join(__dirname, '..', 'spawns'));
    spawns.forEach((s, i) => {
      const spawn = require(join(__dirname, '..', 'spawns', s));
      this.spawners.set(i.toString(), new Spawner(this, spawn.config, spawn.visuals));
      this.util.log(spawn.constructor.name, 'main', `Spawner "${spawn.visuals.title}" loaded.`)
    });
  }

  loadEmitters() {
  	this.listenerHandler.setEmitters({
  		process: process
  	});
  }

  async login(token) {
  	this.loadEmitters();
    this.importSpawners();
  	this.commandHandler.loadAll();
  	this.commandHandler.useListenerHandler(this.listenerHandler);
  	this.listenerHandler.loadAll();
  	return super.login(token);
  }

  async restart() {
  	return super.destroy(this.token);
  }
}