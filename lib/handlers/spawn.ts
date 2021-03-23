import { MessagePlus } from '@lib/extensions/message';
import { Lava } from '@lib/Lava';
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
  User,
} from 'discord.js';
import type {
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
  Category,
} from 'discord-akairo';

export class Spawn extends AkairoModule {
  answered: Collection<string, boolean>;
  config: Partial<SpawnConfig>;
  client: Lava;
  spawn: SpawnVisual;

  constructor(
    config: Partial<SpawnConfig>,
    spawn: SpawnVisual,
    rewards: SpawnReward
  ) {
    super(spawn.title, { category: spawn.type });
    this.answered = new Collection();
    this.config = { ...config, rewards };
    this.spawn = spawn;
  }

  has(member: GuildMember, role: string): boolean {
    return member.roles.cache.has(role);
  }
}

export class SpawnHandler<SpawnModule extends Spawn> extends AkairoHandler {
  cooldowns: Collection<Snowflake, SpawnModule>;
  categories: Collection<string, Category<string, SpawnModule>>;
  messages: Collection<Snowflake, MessagePlus>;
  modules: Collection<string, SpawnModule>;
  client: Lava;
  queue: Collection<Snowflake, SpawnQueue>;

  constructor(client: Lava, options: AkairoHandlerOptions) {
    super(client, options);
    this.cooldowns = new Collection();
    this.messages = new Collection();
    this.queue = new Collection();
  }

  handleMessageCollect<T extends MessagePlus>(args: {
    collector: MessageCollector;
    spawner: SpawnModule;
    msg: T;
  }): boolean {
    const { msg, collector, spawner } = args;
    const { collected } = collector;

    if (spawner.config.type === 'spam') {
      const filter: CollectorFilter = ({ author }: T) =>
        author.id === msg.author.id;
      const authorEntries = collected.array().filter(filter);
      if (authorEntries.length > 1) collected.delete(msg.id);
    }

    return this.emit('messageCollect', {
      msg,
      spawner,
      handler: this,
      isFirst: collected.first().id === msg.id,
    });
  }

  handleMessageEnd<T extends MessagePlus>(args: {
    collected: Collection<string, T>;
    spawner: SpawnModule;
    msg: T;
  }): boolean {
    const { collected, spawner, msg } = args;
    return this.emit('messageResults', {
      msg,
      spawner,
      collected,
      handler: this,
      isEmpty: Boolean(collected.size),
    });
  }

  handleReactionCollect(
    reaction: MessageReaction,
    user: User,
    ctx: {
      collector: ReactionCollector;
      spawner: SpawnModule;
      message: MessagePlus;
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
      spawner: SpawnModule;
      message: MessagePlus;
    }
  ): boolean {
    const { collector, spawner, message } = ctx;
    return this.emit('reactionCollect', this, spawner, message, reaction, user);
  }

  handleReactionEnd(
    collected: Collection<string, MessageReaction>,
    ctx: { message: MessagePlus; spawner: SpawnModule }
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
  public async spawn(spawner: SpawnModule, message: MessagePlus): Promise<void> {
    if (['spam', 'message'].includes(spawner.config.type)) {
      const str = this.client.util.randomInArray(spawner.spawn.strings);
      const options: MessageCollectorOptions = {
        max: spawner.config.entries,
        time: spawner.config.timeout,
      };

      const filter: CollectorFilter = async (
        msg: MessagePlus
      ): Promise<boolean> => {
        const { author, content } = msg;
        const { fetch } = this.client.db.spawns;
        const { cap } = this.client.config.spawn;
        const isSpam = spawner.config.type === 'spam';

        return (
          !author.bot &&
          (await fetch(author.id)).unpaid <= cap &&
          content.toLowerCase() === str.toLowerCase() &&
          (isSpam ? true : !spawner.answered.has(author.id))
        );
      };

      this.emit('messageStart', {
        str,
        spawner,
        msg: message,
        handler: this,
      });

      const cooldown = spawner.config.cooldown(message.member);
      this.cooldowns.set(message.author.id, spawner);
      const deleteCD = () => this.cooldowns.delete(message.author.id);
      this.client.setTimeout(deleteCD, cooldown * 60 * 1000);
      const collector = message.channel.createMessageCollector(filter, options);

      collector
        .on('collect', (msg: MessagePlus) => {
          this.handleMessageCollect<MessagePlus>({ msg, collector, spawner });
        })
        .on('end', (collected: Collection<string, MessagePlus>) => {
          this.handleMessageEnd<MessagePlus>({ collected, spawner, msg: message });
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
          this.handleReactionCollect(reaction, user, {
            collector,
            message,
            spawner,
          });
        })
        .on('remove', (reaction: MessageReaction, user: User) => {
          this.handleReactionRemove(reaction, user, {
            collector,
            message,
            spawner,
          });
        })
        .on('end', (collected: Collection<string, MessageReaction>) => {
          this.handleReactionEnd(collected, { message, spawner });
        });
    } else {
      throw new AkairoError(
        `[INVALID_TYPE] Spawn type "${spawner.config.type}" is invalid.`
      );
    }
  }
}
