"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const path_1 = require("path");
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = __importDefault(require("mongoose"));
const discord_akairo_1 = require("discord-akairo");
const GiveawayHandler_1 = __importDefault(require("../handlers/GiveawayHandler"));
const SpawnHandler_1 = __importDefault(require("../handlers/SpawnHandler"));
const Spawn_1 = __importDefault(require("./Spawn"));
const Util_1 = __importDefault(require("./Util"));
const functions_1 = __importDefault(require("./currency/functions"));
const functions_2 = __importDefault(require("./spawns/functions"));
const __modDirs = path_1.join(__dirname, '..', '..', 'modules');
const commandDir = path_1.join(__modDirs, 'commands');
const listenerDir = path_1.join(__modDirs, 'emitters');
const spawnDir = path_1.join(__modDirs, 'spawns');
/**
 * Extends the instance of AkairoClient
 * @exports @class {Client} @extends {AkairoClient} @implements {Akairo.Client}
*/
class Client extends discord_akairo_1.AkairoClient {
    constructor(config) {
        super({
            ownerID: config.bot.ownerID
        }, config.bot.clientOptions);
        // Basic Stuff
        this.config = config;
        this.util = new Util_1.default(this);
        this.db = {
            currency: functions_1.default(this),
            spawns: functions_2.default(this)
        };
        // Handlers
        this.giveawayManager = new GiveawayHandler_1.default(this);
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: listenerDir
        });
        this.spawnHandler = new SpawnHandler_1.default(this, {
            directory: spawnDir,
            classToHandle: Spawn_1.default,
            automateCategories: true
        });
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: commandDir,
            prefix: config.bot.prefix,
            commandUtil: true,
            defaultCooldown: 1500,
            allowMention: true,
            handleEdits: true
        });
    }
    /**
     * Builds all listeners and commands
     * @returns {Promise<void>}
    */
    async handle() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            giveawayManager: this.giveawayManager,
            spawnHandler: this.spawnHandler,
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        });
        const handlers = [{
                key: 'Emitter', handler: this.listenerHandler
            }, {
                key: 'Command', handler: this.commandHandler
            }, {
                key: 'Spawner', handler: this.spawnHandler
            }];
        for (const { key, handler } of handlers) {
            handler.on('load', (e) => {
                this.util.log(key, 'main', `${key} ${chalk_1.default.cyanBright(e.id)} loaded.`);
            });
        }
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();
        this.spawnHandler.loadAll();
    }
    /**
     * connect lava into mongodb
     * @returns {typeof mongoose | void}
     */
    async connectDB() {
        try {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true
            };
            return await mongoose_1.default.connect(process.env.MONGO, options);
        }
        catch (error) {
            this.util.log('Mongoose', 'error', error.message);
            process.exit(1);
        }
    }
    /**
     * Builds all handlers and logs the bot in
     * @param {string} token the discord token
     * @returns {Promise<string>}
    */
    async build(token = this.config.bot.token) {
        this.handle();
        await this.connectDB();
        return super.login(token);
    }
}
exports.Client = Client;
