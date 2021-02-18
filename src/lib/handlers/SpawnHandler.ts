import {
    Collection,
    User,
    Snowflake,
    Message,
    MessageReaction,
    CollectorFilter,
    MessageCollectorOptions,
    ReactionCollectorOptions,
} from 'discord.js'
import { AkairoHandler, AkairoHandlerOptions } from 'discord-akairo'

export default class SpawnHandler
    extends AkairoHandler
    implements Akairo.SpawnHandler {
    public modules: Collection<string, Akairo.Spawn>
    public cooldowns: Collection<Snowflake, Akairo.Spawn>
    public queue: Collection<Snowflake, Akairo.SpawnQueue>
    public messages: Collection<Snowflake, Message>
    public constructor(
        public client: Akairo.Client,
        handlerOptions: AkairoHandlerOptions
    ) {
        super(client, handlerOptions)
        this.queue = new Collection()
        this.cooldowns = new Collection()
        this.messages = new Collection()
    }

    /**
     * Self-explanatory
     * @param {Akairo.Spawn} spawner the spawn module to run
     * @param {Message} message a discord message obj
     */
    public async spawn(spawner: Akairo.Spawn, message: Message): Promise<void> {
        if (['spam', 'message'].includes(spawner.config.type)) {
            const str = this.client.util.randomInArray(spawner.spawn.strings)
            const options: MessageCollectorOptions = {
                max: spawner.config.entries,
                time: spawner.config.timeout,
            }
            const filter: CollectorFilter = async ({
                author,
                content,
            }: Message): Promise<boolean> => {
                const notCapped =
                    (await this.client.db.spawns.fetch(author.id)).unpaid <=
                    this.client.config.spawns.unpaidCap
                return (
                    notCapped &&
                    !author.bot &&
                    !spawner.answered.has(author.id) &&
                    content === str
                )
            }

            this.emit('messageStart', this, spawner, message, str)
            const cooldown = spawner.config.cooldown(message.member)
            this.cooldowns.set(message.author.id, spawner)
            this.client.setTimeout(
                () => this.cooldowns.delete(message.author.id),
                cooldown * 60 * 1000
            )
            const collector = await message.channel.createMessageCollector(
                filter,
                options
            )
            collector.on('collect', (msg: Message) => {
                const isFirst = collector.collected.first().id === msg.id
                this.emit('messageCollect', this, spawner, msg, isFirst)
            })
            collector.on('end', (collected: Collection<string, Message>) => {
                this.emit(
                    'messageResults',
                    this,
                    spawner,
                    message,
                    collected,
                    Boolean(collected.size)
                )
            })
        } else if (spawner.config.type === 'react') {
            const options: ReactionCollectorOptions = {
                maxUsers: spawner.config.entries,
                maxEmojis: 1,
                max: 1,
            }
            const filter: CollectorFilter = async (
                reaction: MessageReaction,
                user: User
            ) => {
                const notCapped =
                    (await this.client.db.spawns.fetch(user.id)).unpaid <=
                    this.client.config.spawns.unpaidCap
                return (
                    notCapped &&
                    !user.bot &&
                    !spawner.answered.has(user.id) &&
                    reaction.toString() === spawner.spawn.emoji
                )
            }

            this.emit('reactionStart', this, spawner, message) // send message, react to "react :emoji:" and call runCooldown()
            const collector = await message.createReactionCollector(
                filter,
                options
            )
            collector.on('collect', (reaction: MessageReaction, user: User) => {
                const isFirst =
                    collector.collected.first().users.cache.first().id ===
                    user.id
                this.emit(
                    'reactionCollect',
                    this,
                    spawner,
                    message,
                    reaction,
                    user,
                    isFirst
                )
            })
            collector.on('remove', (reaction: MessageReaction, user: User) => {
                this.emit(
                    'reactionRemove',
                    this,
                    spawner,
                    message,
                    reaction,
                    user
                )
            })
            collector.on(
                'end',
                (collected: Collection<string, MessageReaction>) => {
                    const queue = this.queue.get(message.channel.id)
                    this.emit(
                        'reactionResults',
                        this,
                        spawner,
                        message,
                        queue,
                        collected,
                        Boolean(collected.size)
                    )
                    this.queue.delete(message.channel.id)
                }
            )
        } else {
            throw new Error(
                `[INVALID_TYPE] Spawn type "${spawner.config.type}" is invalid.`
            )
        }
    }
}
