import { Message, MessageEmbed } from 'discord.js'
import { Command } from 'discord-akairo'

export default class Currency extends Command {
    public client: Akairo.Client
    
    constructor() {
        super('bal', {
            aliases: ['balance', 'bal'],
            channel: 'guild',
            description: "Check yours or someone else's coin balance",
            category: 'Currency',
            cooldown: 1e3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: (message: Message) => message.member,
                },
            ],
        })
    }

    public async exec(_: Message, { member }: any): Promise<Message> {
        const data = await this.client.db.currency.fetch(member.user.id)
        const embed: MessageEmbed = new MessageEmbed({
            title: `${member.user.username}'s balance`,
            color: 'RANDOM',
            description: [
                `**Pocket:** ${data.pocket.toLocaleString()}`,
                `**Vault:** ${data.vault.toLocaleString()}/${data.space.toLocaleString()}`,
                `**Total:** ${(data.pocket + data.vault).toLocaleString()}`,
            ].join('\n'),
            footer: {
                text: 'discord.gg/memer',
            },
        })

        return _.channel.send({ embed })
    }
}
