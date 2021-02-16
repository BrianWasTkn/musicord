"use strict";
/**
 * Ping Command
 * Made by: BrianWasTkn
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.Command({
    name: 'ping',
    triggers: ['pong']
}, async ({ msg }) => {
    const ponge = msg.channel.guild.shard.latency;
    return `**Ponge:** \`${ponge}ms\``;
});
