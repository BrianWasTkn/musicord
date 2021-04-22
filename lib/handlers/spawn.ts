import { Context } from 'lib/extensions/message';
import { Lava } from 'lib/Lava';
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
} from 'lib/interface/handlers/spawn';
import {
  AkairoHandlerOptions,
  AkairoHandler,
  AkairoModule,
  AkairoError,
  Category,
} from 'discord-akairo';
import { 
  BaseHandler, 
  BaseModule 
} from './Base';
import config from 'config/index' ;

export class Spawn extends BaseModule {
  answered: Collection<string, boolean>;
  config: Partial<SpawnConfig>;
  spawn: SpawnVisual;

  constructor(id: string, spawn: SpawnVisual, config: Partial<SpawnConfig>) {
    super(id, { category: spawn.type });
    this.answered = new Collection();
    this.config = config;
    this.spawn = spawn;
  }

  cd = (): { [id: string]: number } => ({
    '693324853440282654': 1, // Booster
    '768858996659453963': 3, // Donator
    '794834783582421032': 5, // Mastery
    '693380605760634910': 10, // Amari
  });

  getCooldown(m: GuildMember, cds: { [role: string]: number }) {
    for (const [r, cd] of Object.entries(cds)) {
      if (m.roles.cache.has(r)) return cd;
    }
  }
}

export class SpawnHandler<Module extends Spawn> extends BaseHandler<Module> {
  cooldowns: Collection<Snowflake, Module>;
  messages: Collection<Snowflake, Context>;
  queue: Collection<Snowflake, SpawnQueue>;

  constructor(client: Lava, options: AkairoHandlerOptions) {
    super(client, options);
    this.cooldowns = new Collection();
    this.messages = new Collection();
    this.queue = new Collection();
  }

  handleMessageCollect<T extends Context>(args: {
    collector: MessageCollector;
    spawner: Module;
    ctx: T;
  }): boolean {
    const { ctx, collector, spawner } = args;
    const { collected } = collector;
    const isFirst = collected.first().id === ctx.id;
    const handler = this;

    if (spawner.config.type === 'spam') {
      const filter = ({ author }: T) => author.id === ctx.author.id;
      const authorEntries = collected.array().filter(filter);
      if (authorEntries.length > 1) collected.delete(ctx.id);
    }

    return this.emit('messageCollect', {
      ctx,
      spawner,
      handler,
      isFirst,
    });
  }

  handleMessageEnd<T extends Context>(args: {
    collected: Collection<string, T>;
    spawner: Module;
    ctx: T;
  }): boolean {
    const { collected, spawner, ctx } = args;
    const isEmpty = Boolean(collected.size);
    const handler = this;
    return this.emit('messageResults', {
      ctx,
      spawner,
      collected,
      handler,
      isEmpty,
    });
  }

  handleReactionCollect(
    reaction: MessageReaction,
    user: User,
    ctx: {
      collector: ReactionCollector;
      spawner: Module;
      msg: Context;
    }
  ): boolean {
    const { collector, spawner, msg } = ctx;
    const { users } = collector.collected.first();
    const isFirst = users.cache.first().id === user.id;
    const handler = this;

    return this.emit('reactionCollect', {
      handler,
      spawner,
      ctx: msg,
      reaction,
      user,
      isFirst,
    });
  }

  handleReactionRemove(
    reaction: MessageReaction,
    user: User,
    ctx: {
      collector: ReactionCollector;
      spawner: Module;
      msg: Context;
    }
  ): boolean {
    const { collector, spawner, msg } = ctx;
    const handler = this;
    return this.emit('reactionCollect', {
      handler,
      spawner,
      ctx: msg,
      reaction,
      user,
    });
  }

  handleReactionEnd(
    collected: Collection<string, MessageReaction>,
    ctx: { msg: Context; spawner: Module }
  ): boolean {
    const { msg, spawner } = ctx;
    const isEmpty = Boolean(collected.size);
    const handler = this;

    return this.emit('reactionResults', {
      handler,
      spawner,
      ctx: msg,
      collected,
      isEmpty,
    });
  }

  /**
   * Self-explanatory
   * @param {Spawn} spawner the spawn module to run
   * @param {Message} msg a discord message obj
   */
  async spawn(
    spawner: Module,
    msg: Context
  ): Promise<ReactionCollector | MessageCollector | void> {
    if (['spam', 'message'].includes(spawner.config.type)) {
      const str = this.client.util.randomInArray(spawner.spawn.strings);

      // MessageCollector#filter
      const options: MessageCollectorOptions = {
        max: spawner.config.entries,
        time: spawner.config.timeout,
      };

      // MessageCollector#filter
      const filter: CollectorFilter<[Context]> = async ({
        author,
        content,
      }) => {
        const { fetch } = this.client.db.spawns;
        const { cap } = config.spawn;
        const isSpam = spawner.config.type === 'spam';

        return (
          !author.bot &&
          (await fetch(author.id)).unpaid <= cap &&
          content.toLowerCase() === str.toLowerCase() &&
          (isSpam ? true : !spawner.answered.has(author.id))
        );
      };

      // Crap
      this.emit('messageStart', { str, spawner, ctx: msg, handler: this });
      const cooldown = spawner.getCooldown(msg.member, spawner.cd());
      this.cooldowns.set(msg.author.id, spawner);
      const deleteCD = () => this.cooldowns.delete(msg.author.id);
      this.client.setTimeout(deleteCD, cooldown * 60 * 1000);
      const collector = msg.channel.createMessageCollector(filter, options);

      // MessageCollector#on<collect|end>
      collector
        .on('collect', (msg: Context) => {
          this.handleMessageCollect<Context>({ ctx: msg, collector, spawner });
        })
        .on('end', (collected: Collection<string, Context>) => {
          this.handleMessageEnd<Context>({ collected, spawner, ctx: msg });
        });

      return collector;
    } else if (spawner.config.type === 'react') {
      // ReactionCollector#options
      const options: ReactionCollectorOptions = {
        maxUsers: spawner.config.entries,
        maxEmojis: 1,
        max: 1,
      };

      // ReactionCollector#filter
      const filter: CollectorFilter<[MessageReaction, User]> = async (
        reaction,
        user
      ) => {
        const { fetch } = this.client.db.spawns;
        const { cap } = config.spawn;

        return (
          !user.bot &&
          (await fetch(user.id)).unpaid <= cap &&
          !spawner.answered.has(user.id) &&
          reaction.toString() === spawner.spawn.emoji
        );
      };

      // A bunch of shit
      this.emit('reactionStart', this, spawner, msg); // send message, react to "react :emoji:" and call runCooldown()
      const cooldown = spawner.getCooldown(msg.member, spawner.cd());
      this.cooldowns.set(msg.author.id, spawner);
      const deleteCD = () => this.cooldowns.delete(msg.author.id);
      this.client.setTimeout(deleteCD, cooldown * 60 * 1000);
      const collector = msg.createReactionCollector(filter, options);

      const onCollect = (r: MessageReaction, u: User) => {
        const ctx = { msg, collector, spawner };
        return this.handleReactionCollect(r, u, ctx);
      };
      const onRemove = (r: MessageReaction, u: User) => {
        const ctx = { msg, collector, spawner };
        return this.handleReactionRemove(r, u, ctx);
      };
      const onEnd = (col: Collection<string, MessageReaction>) => {
        this.handleReactionEnd(col, { msg, spawner });
      };

      // ReactionCollector#on<collect|remove|end>
      collector
        .on('collect', onCollect)
        .on('remove', onRemove)
        .on('end', onRemove);

      return collector;
    } else {
      throw new AkairoError(
        `[INVALID_TYPE] Spawn type "${spawner.config.type}" is invalid.`
      );
    }
  }
}
