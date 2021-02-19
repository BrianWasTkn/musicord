import { Listener } from 'discord-akairo'
import { Message, Collection, TextChannel } from 'discord.js'

export default class SpawnListener extends Listener {
    public client: Akairo.Client
    
    constructor() {
        super('spawn-messageResults', {
            event: 'messageResults',
            emitter: 'spawnHandler',
        })
    }

    async exec(
        handler: Akairo.SpawnHandler,
        spawner: Akairo.Spawn,
        message: Message,
        collected: Collection<string, Message>,
        isEmpty: boolean
    ): Promise<Message> {
        const emoji = '<:memerRed:729863510716317776>'
        const queue = handler.queue.get(message.channel.id)
        const msg = await message.channel.messages.fetch(queue.msgId)

        handler.queue.delete(queue.channel.id)
        spawner.answered.clear()
        msg.edit(
            `${msg.content}\n\n**${emoji} \`This event has expired\`**`
        ).catch(() => {})

        if (!isEmpty) {
            return msg.channel.send({
                embed: {
                    color: 'RED',
                    description: `**${emoji} No one got the event.**`,
                },
            })
        }

        const { min, max, first } = spawner.config.rewards
        const results: string[] = []
        const promises: Promise<void | Message>[] = []
        const verbs = ['obtained', 'got', 'procured', 'won']
        const verb = this.client.util.randomInArray(verbs)

        collected.array().forEach(async (msg: Message, i: number) => {
            const { user } = msg.member
            let coins = this.client.util.randomNumber(min, max)
            if (Math.random() > 0.65 && i === 0) coins = first
            results.push(
                `\`${
                    user.username
                }\` ${verb} **${coins.toLocaleString()}** coins`
            )
            await this.client.db.spawns.addUnpaid(user.id, coins)
            await this.client.db.spawns.incrementJoinedEvents(user.id)
            const db = await this.client.db.spawns.fetch(user.id)
            promises.push(
                user
                    .send({
                        embed: {
                            title: spawner.spawn.title,
                            color: 'GOLD',
                            description: [
                                `**Earned:** ${coins.toLocaleString()}`,
                                `**Total Unpaids:** ${db.unpaid.toLocaleString()}`,
                                `**Events Joined:** ${db.eventsJoined}`,
                                'Using `lava unpaids` will show your stats.',
                                "You can mute this DM if you don't want notifications.",
                            ].join('\n'),
                            footer: {
                                text: `From: ${message.guild.name}`,
                                iconURL: message.guild.iconURL({
                                    dynamic: true,
                                }),
                            },
                        },
                    })
                    .catch(() => {})
            )
        })

        await Promise.all(promises)
        const payouts = <TextChannel>(
            message.guild.channels.cache.get('796688961899855893')
        )
        await payouts.send({
            embed: {
                author: { name: `Results for '${spawner.spawn.title}' event` },
                description: results.join('\n'),
                color: 'RANDOM',
                footer: { text: `From: ${queue.channel.name}` },
            },
        })
        await queue.channel.send({
            embed: {
                author: { name: `Results for '${spawner.spawn.title}' event` },
                description: results.join('\n'),
                color: 'RANDOM',
                footer: { text: `Check your DMs for info.` },
            },
        })
    }
}
