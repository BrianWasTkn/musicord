import {
    ReactionCollectorOptions,
    MessageCollectorOptions,
    ReactionCollector,
    MessageCollector,
    CollectorFilter,
    MessageReaction,
    EmojiResolvable,
    GuildMember,
    TextChannel,
    Collection,
    Snowflake,
    Message,
    User,
} from 'discord.js'
import {
    SpawnVisualsType,
    SpawnConfigType,
    SpawnCooldown,
    SpawnReward,
    SpawnConfig,
    SpawnVisual,
    SpawnQueue,
} from '../interface/handlers'
import {
    AkairoHandlerOptions,
    AkairoHandler,
    AkairoModule,
    AkairoError,
} from 'discord-akairo'
import {
    Lava
} from '../Lava'

export class Spawn extends AkairoModule {
    answered: Collection<User['id'], User>
    config: SpawnConfig
    client: Lava
    spawn: SpawnVisual

    constructor(
        config: SpawnConfig,
        spawn: SpawnVisual,
        cooldown: SpawnCooldown
    ) {
        super(spawn.title, { category: spawn.type })
        this.spawn = spawn
        this.config = { ...config, cooldown }
        this.answered = new Collection()
    }
}

export class SpawnHandler extends AkairoHandler {
    cooldowns: Collection<Snowflake, Spawn>
    messages: Collection<Snowflake, Message>
    modules: Collection<string, Spawn>
    client: Lava;
    queue: Collection<Snowflake, SpawnQueue>

    constructor(client: Lava, options: AkairoHandlerOptions) {
        super(client, options)
        this.queue = new Collection()
        this.cooldowns = new Collection()
        this.messages = new Collection()
    }

    handleMessageCollect(this: SpawnHandler, message: Message, ctx: {
        collector: MessageCollector, spawner: Spawn,
    }): boolean {
        const isFirst = ctx.collector.collected.first().id === message.id
        return this.emit('messageCollect', this, ctx.spawner, message, isFirst)
    }

    handleMessageEnd(
        this: SpawnHandler,
        collected: Collection<string, Message>,
        ctx: { message: Message, spawner: Spawn, }
    ): boolean {
        const { spawner, message } = ctx;
        spawner.answered.clear();
        return this.emit('messageEnd', this, spawner, message, collected, Boolean(collected.size))
    }

    handleReactionCollect(
        this: SpawnHandler,
        reaction: MessageReaction,
        user: User,
        ctx: {
            collector: ReactionCollector,
            spawner: Spawn,
            message: Message
        }
    ): boolean {
        const { collector, spawner, message } = ctx;
        const isFirst =
            collector.collected.first().users.cache.first().id ===
            user.id
        return this.emit(
            'reactionCollect', this, spawner,
            message, reaction, user, isFirst
        )
    }

    handleReactionRemove(
        this: SpawnHandler,
        reaction: MessageReaction,
        user: User,
        ctx: {
            collector: ReactionCollector,
            spawner: Spawn,
            message: Message
        }
    ): boolean {
        const { collector, spawner, message } = ctx;
        return this.emit(
            'reactionCollect', this, spawner,
            message, reaction, user
        )
    }

    handleReactionEnd(
        this: SpawnHandler,
        collected: Collection<string, MessageReaction>,
        ctx: {
            message: Message,
            spawner: Spawn
        }
    ): boolean {
        return this.emit(
            'reactionResults',
            this,
            ctx.spawner,
            ctx.message,
            collected,
            Boolean(collected.size)
        )
    }

    /**
     * Self-explanatory
     * @param {Spawn} spawner the spawn module to run
     * @param {Message} message a discord message obj
     */
    public async spawn(spawner: Spawn, message: Message): Promise<void> {
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
                    10e6
                // this.client.config.spawns.unpaidCap
                return (
                    notCapped &&
                    !author.bot &&
                    !spawner.answered.has(author.id) &&
                    content.toLowerCase() === str.toLowerCase()
                )
            }

            this.emit('messageStart', this, spawner, message, str)
            const cooldown = spawner.config.cooldown(message.member)
            this.cooldowns.set(message.author.id, spawner);
            const deleteCD = () => this.cooldowns.delete(message.author.id);
            this.client.setTimeout(deleteCD, cooldown * 60 * 1000)
            const collector = message.channel
                .createMessageCollector(filter, options);

            collector
                .on('collect', this.handleMessageCollect.bind(this, { collector, spawner }))
                .on('end', this.handleMessageEnd.bind(this, { message, spawner }))

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
                    10e6
                // this.client.config.spawns.unpaidCap
                return (
                    notCapped &&
                    !user.bot &&
                    !spawner.answered.has(user.id) &&
                    reaction.toString() === spawner.spawn.emoji
                )
            }

            this.emit('reactionStart', this, spawner, message) // send message, react to "react :emoji:" and call runCooldown()
            const collector = message.createReactionCollector(filter, options)
            collector.on('collect', this.handleReactionCollect.bind(this, { message, spawner, }))
                .on('remove', this.handleReactionCollect.bind(this, { message, spawner, }))
                .on('end', this.handleReactionEnd.bind(this, { message, spawner }))

        } else {
            throw new AkairoError(
                `[INVALID_TYPE] Spawn type "${spawner.config.type}" is invalid.`
            )
        }
    }
}
