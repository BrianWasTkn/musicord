import { PresenceData, TextChannel } from 'discord.js'
import { Listener } from 'discord-akairo'

export default class DiscordListener extends Listener {
    public client: Akairo.Client
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        })
    }

    public async exec(): Promise<void> {
        const activity: PresenceData['activity'] = {
            name: 'discord.gg/memer',
            type: 'STREAMING',
            url: 'https://twitch.tv/badboyhaloislive',
        }

        const channel = await this.client.channels.fetch('789692296094285825')
        const embed = this.client.util.embed({
            color: 'ORANGE',
            title: 'Logged in',
            description: `**${this.client.user.tag}** logged in.`,
            timestamp: Date.now(),
            footer: {
                text: this.client.user.tag,
                icon_url: this.client.user.avatarURL(),
            },
        })

        ;(channel as TextChannel).send({
            embed,
            content: '<@605419747361947649>',
        })
        await this.client.user.setPresence({ activity })
        const message = `${this.client.user.tag} has flown within Discord.`
        return this.client.util.log('Discord', 'main', message)
    }
}
