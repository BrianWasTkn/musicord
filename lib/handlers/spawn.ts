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
} from 'discord.js';
import {
  SpawnVisualsType,
  SpawnConfigType,
  SpawnCooldown,
  SpawnReward,
  SpawnConfig,
  SpawnVisual,
  SpawnQueue,
} from '@lib/interface/handlers/spawn';
import {
  AkairoHandlerOptions,
  AkairoHandler,
  AkairoModule,
  AkairoError,
} from 'discord-akairo';
import { Lava } from '@lib/Lava';

export class Spawn extends AkairoModule {
  answered: Collection<string, User>;
  config: Partial<SpawnConfig>;
  client: Lava;
  spawn: SpawnVisual;

  constructor(
    config: Partial<SpawnConfig>,
    spawn: SpawnVisual,
    rewards: SpawnReward
  ) {
    super(spawn.title, { category: spawn.type });
    this.spawn = spawn;
    this.config = { ...config, rewards };
    this.answered = new Collection();
  }

  has(member: GuildMember, role: string): boolean {
    return member.roles.cache.has(role);
  }
}

export class SpawnHandler extends AkairoHandler {
  cooldowns: Collection<Snowflake, Spawn>;
  messages: Collection<Snowflake, Message>;
  modules: Collection<string, Spawn>;
  client: Lava;
  queue: Collection<Snowflake, SpawnQueue>;

  constructor(client: Lava, options: AkairoHandlerOptions) {
    super(client, options);
    this.queue = new Collection();
    this.cooldowns = new Collection();
    this.messages = new Collection();
  }

  handleMessageCollect(
    message: Message,
    ctx: {
      collector: MessageCollector;
      spawner: Spawn;
    }
  ): boolean {
    const isFirst = ctx.collector.collected.first().id === message.id;
    return this.emit('messageCollect', this, ctx.spawner, message, isFirst);
  }

  handleMessageEnd(
    collected: Collection<string, Message>,
    ctx: { message: Message; spawner: Spawn }
  ): boolean {
    const { spawner, message } = ctx;
    spawner.answered.clear();
    return this.emit(
      'messageEnd',
      this,
      spawner,
      message,
      collected,
      Boolean(collected.size)
    );
  }

  handleReactionCollect(
    reaction: MessageReaction,
    user: User,
    ctx: {
      collector: ReactionCollector;
      spawner: Spawn;
      message: Message;
    }
  ): boolean {
    const { collector, spawner, message } = ctx;
    const isFirst =
      collector.collected.first().users.cache.first().id === user.id;
    return this.emit(
      'reactionCollect',
      this,
      spawner,
      message,
      reaction,
      user,
      isFirst
    );
  }

  handleReactionRemove(
    reaction: MessageReaction,
    user: User,
    ctx: {
      collector: ReactionCollector;
      spawner: Spawn;
      message: Message;
    }
  ): boolean {
    const { collector, spawner, message } = ctx;
    return this.emit('reactionCollect', this, spawner, message, reaction, user);
  }

  handleReactionEnd(
    collected: Collection<string, MessageReaction>,
    ctx: {
      message: Message;
      spawner: Spawn;
    }
  ): boolean {
    return this.emit(
      'reactionResults',
      this,
      ctx.spawner,
      ctx.message,
      collected,
      Boolean(collected.size)
    );
  }

  /**
   * Self-explanatory
   * @param {Spawn} spawner the spawn module to run
   * @param {Message} message a discord message obj
   */
  public async spawn(spawner: Spawn, message: Message): Promise<void> {
    if (['spam', 'message'].includes(spawner.config.type)) {
      const str = this.client.util.randomInArray(spawner.spawn.strings);
      const options: MessageCollectorOptions = {
        max: spawner.config.entries,
        time: spawner.config.timeout,
      };

      const filter: CollectorFilter = async ({
        author,
        content,
      }: Message): Promise<boolean> => {
        const notCapped =
          (await this.client.db.spawns.fetch(author.id)).unpaid <= 10e6;
        // this.client.config.spawns.unpaidCap
        return (
          notCapped &&
          !author.bot &&
          !spawner.answered.has(author.id) &&
          content.toLowerCase() === str.toLowerCase()
        );
      };

      this.emit('messageStart', this, spawner, message, str);
      const cooldown = spawner.config.cooldown(message.member);
      this.cooldowns.set(message.author.id, spawner);
      const deleteCD = () => this.cooldowns.delete(message.author.id);
      this.client.setTimeout(deleteCD, cooldown * 60 * 1000);
      const collector = message.channel.createMessageCollector(filter, options);

      collector
        .on('collect', (m: Message) => {
          this.handleMessageCollect(m, { collector, spawner });
        })
        .on('end', (coll: Collection<string, Message>) => {
          this.handleMessageEnd(coll, { message, spawner })
        });
    } else if (spawner.config.type === 'react') {
      const options: ReactionCollectorOptions = {
        maxUsers: spawner.config.entries,
        maxEmojis: 1,
        max: 1,
      };
      const filter: CollectorFilter = async (
        reaction: MessageReaction,
        user: User
      ) => {
        const notCapped =
          (await this.client.db.spawns.fetch(user.id)).unpaid <= 10e6;
        // this.client.config.spawns.unpaidCap
        return (
          notCapped &&
          !user.bot &&
          !spawner.answered.has(user.id) &&
          reaction.toString() === spawner.spawn.emoji
        );
      };

      this.emit('reactionStart', this, spawner, message); // send message, react to "react :emoji:" and call runCooldown()
      const collector = message.createReactionCollector(filter, options);
      collector
        .on('collect', (reaction: MessageReaction, user: User) => {
          this.handleReactionCollect(reaction, user, { collector, message, spawner })
        })
        .on('remove', (reaction: MessageReaction, user: User) => {
          this.handleReactionRemove(reaction, user, { collector, message, spawner })
        })
        .on('end', (collected: Collection<string, MessageReaction>) => {
          this.handleReactionEnd(collected, { message, spawner })
        });
    } else {
      throw new AkairoError(
        `[INVALID_TYPE] Spawn type "${spawner.config.type}" is invalid.`
      );
    }
  }
}
