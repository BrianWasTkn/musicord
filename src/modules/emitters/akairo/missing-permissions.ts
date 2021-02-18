import { Message, MessageEmbed } from 'discord.js'
import { Listener, Command } from 'discord-akairo'

export default class CommandListener extends Listener {
    public client: Akairo.Client
    public constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions',
        })
    }

    public async exec(
        _: Message,
        command: Command,
        type: string,
        missing: any
    ): Promise<Message> {
        type = type === 'client' ? 'I' : 'You'
        const description: string[] = []
        description[0] = `${type} don\'t have enough permissions to run the \`${command.id}\` command.`
        description[1] = `Ensure ${type} have the following permissions:`

        const embed = new MessageEmbed()
            .setDescription(description.join('\n'))
            .setColor('RED')
            .addField(
                `Missing Permissions • ${missing.length}`,
                `\`${missing.join('`, `')}\``
            )
            .setFooter(this.client.user.username, this.client.user.avatarURL())
            .setTitle('Well rip, no perms.')

        return _.channel.send({ embed })
    }
}
