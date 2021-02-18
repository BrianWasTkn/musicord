import { Message, MessageEmbed } from 'discord.js'
import { Listener, Command } from 'discord-akairo'

export default class CommandListener extends Listener {
    public client: Akairo.Client
    public constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown',
        })
    }

    public async exec(
        _: Message,
        command: Command,
        remaining: number
    ): Promise<Message> {
        const description: string[] = []
        description[0] = `You're currently on cooldown for the \`${command.id}\` command.`
        description[1] = `Please wait **${(remaining / 1000).toFixed(
            2
        )}** seconds and try again.`

        const embed = new MessageEmbed()
            .setTitle('Oh shoot, on cooldown.')
            .setColor('RED')
            .setDescription(description.join('\n'))
            .setFooter(this.client.user.username, this.client.user.avatarURL())

        return _.channel.send({ embed })
    }
}
