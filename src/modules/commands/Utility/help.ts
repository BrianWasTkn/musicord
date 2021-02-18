import { Message, MessageEmbed, EmbedField } from 'discord.js'
import { Command } from 'discord-akairo'

export default class Utility extends Command {
    public client: Akairo.Client
    public constructor() {
        super('help', {
            aliases: ['help', 'h'],
            channel: 'guild',
            description:
                'Sends a whole list of commands, or per commands information if you specify one.',
            category: 'Utility',
            args: [
                {
                    id: 'query',
                    type: 'command',
                    default: null,
                },
            ],
        })
    }

    private mapCommands(): EmbedField[] {
        const commands = this.handler.modules.array()
        const categories = [...new Set(commands.map((c) => c.categoryID))]
        return categories.map((c: string) => ({
            name: `${c} Commands — ${
                commands
                    .filter((cmd) => cmd.categoryID === c)
                    .map((c) => c.aliases[0]).length
            }`,
            inline: false,
            value: `\`${commands
                .filter((cmd) => cmd.categoryID === c)
                .map((c) => c.aliases[0])
                .join('`, `')}\``,
        }))
    }

    public async exec(_: Message, args: any): Promise<Message> {
        const command = args.query
        if (!command) {
            const fields: EmbedField[] = this.mapCommands()
            return _.channel.send({
                embed: {
                    title: 'Lava Commands',
                    thumbnail: { url: this.client.user.avatarURL() },
                    color: 'RED',
                    fields,
                    footer: {
                        text: `${this.handler.modules.size} commands`,
                        iconURL: this.client.user.avatarURL(),
                    },
                },
            })
        }

        if (args.query) {
            const command: Command = args.query
            return _.channel.send({
                embed: {
                    color: 'ORANGE',
                    title: command.aliases[0],
                    description:
                        command.description || 'No description provided',
                    fields: [
                        {
                            name: 'Triggers',
                            value: command.aliases.join(', '),
                        },
                        {
                            name: 'Cooldown',
                            value: command.cooldown / 1000,
                        },
                        {
                            name: 'Category',
                            value: command.categoryID,
                        },
                    ],
                },
            })
        }
    }
}
