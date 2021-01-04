import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandOptions } from 'discord-akairo'

export default class Util extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'pong'],
            channel: 'guild'
        });
    }

    async exec(_: Message): Promise<Message> {
        const { channel, client: { user, ws }, guild } = _;
        const { id, ping } = guild.shard;
        const embed = new MessageEmbed({
            title: guild.name,
            color: 'ORANGE',
            description: [
                `**Shard ID:** ${id}`,
                `**Latency:** \`${ping}ms\`**`,
                `**Websocket:** \`${ws.ping}ms\`**`
            ].join('\n'),
            timestamp: Date.now(),
            footer: {
                iconURL: user.avatarURL({ dynamic: true }),
                text: user.username
            }
        });

        return channel.send(embed);
    }
}