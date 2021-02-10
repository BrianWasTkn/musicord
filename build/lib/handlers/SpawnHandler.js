"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
class SpawnHandler extends discord_akairo_1.AkairoHandler {
    constructor(client, handlerOptions) {
        super(client, handlerOptions);
        this.client = client;
        this.queue = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.messages = new discord_js_1.Collection();
    }
    /**
     * Self-explanatory
     * @param {Akairo.Spawn} spawner the spawn module to run
     * @param {Message} message a discord message obj
     */
    async spawn(spawner, message) {
        if (['spam', 'message'].includes(spawner.config.type)) {
            const str = this.client.util.randomInArray(spawner.spawn.strings);
            const options = {
                max: spawner.config.entries,
                time: spawner.config.timeout
            };
            const filter = async ({ author, content }) => {
                const notCapped = (await this.client.db.spawns.fetch(author.id)).unpaid <= this.client.config.spawns.unpaidCap;
                return notCapped && !author.bot && !spawner.answered.has(author.id) && content === str;
            };
            this.emit('messageStart', this, spawner, message, str);
            const cooldown = spawner.config.cooldown(message.member);
            this.cooldowns.set(message.author.id, spawner);
            this.client.setTimeout(() => this.cooldowns.delete(message.author.id), cooldown * 60 * 1000);
            const collector = await message.channel.createMessageCollector(filter, options);
            collector.on('collect', (msg) => {
                const isFirst = collector.collected.first().id === msg.id;
                this.emit('messageCollect', this, spawner, msg, isFirst);
            });
            collector.on('end', (collected) => {
                this.emit('messageResults', this, spawner, message, collected, Boolean(collected.size));
            });
        }
        else if (spawner.config.type === 'react') {
            const options = {
                maxUsers: spawner.config.entries,
                maxEmojis: 1, max: 1
            };
            const filter = async (reaction, user) => {
                const notCapped = (await this.client.db.spawns.fetch(user.id)).unpaid <= this.client.config.spawns.unpaidCap;
                return notCapped && !user.bot && !spawner.answered.has(user.id) && reaction.toString() === spawner.spawn.emoji;
            };
            this.emit('reactionStart', this, spawner, message); // send message, react to "react :emoji:" and call runCooldown()
            const collector = await message.createReactionCollector(filter, options);
            collector.on('collect', (reaction, user) => {
                const isFirst = collector.collected.first().users.cache.first().id === user.id;
                this.emit('reactionCollect', this, spawner, message, reaction, user, isFirst);
            });
            collector.on('remove', (reaction, user) => {
                this.emit('reactionRemove', this, spawner, message, reaction, user);
            });
            collector.on('end', (collected) => {
                const queue = this.queue.get(message.channel.id);
                this.emit('reactionResults', this, spawner, message, queue, collected, Boolean(collected.size));
                this.queue.delete(message.channel.id);
            });
        }
        else {
            throw new Error(`[INVALID_TYPE] Spawn type "${spawner.config.type}" is invalid.`);
        }
    }
}
exports.default = SpawnHandler;
