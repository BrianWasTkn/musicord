/**
 * Ping Command
 * Made by: BrianWasTkn
 */

import { Command } from '../../structures/Command'

export default new Command({
    name: 'ping',
    triggers: ['pong']
}, async ({ msg }) => {
    const ponge = msg.channel.guild.shard.latency;
    return `**Ponge:** \`${ponge}ms\``;
});