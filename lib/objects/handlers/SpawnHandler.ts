import { AkairoError } from 'lib/utility/error';
import { Context } from 'lib/extensions';
import { Spawn } from '..';
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
	Message,
	User,
} from 'discord.js';
import {
	AkairoHandlerOptions,
	AkairoHandler,
	AkairoModule,
	Category,
} from 'discord-akairo';
import {
	HandlerPlusOptions,
	HandlerEvents,
	HandlerPlus,
	ModulePlus,
} from '..';
import config from 'config/index';

export interface SpawnHandlerEvents<Mod extends Spawn = Spawn> extends HandlerEvents<Mod> {
	messageCollect: [args: {
		handler: SpawnHandler;
		isFirst: boolean;
		spawner: Spawn;
		ctx: Context;
	}];
}

export class SpawnHandler<Mod extends Spawn = Spawn> extends HandlerPlus<Mod> {
	public cooldowns: Collection<Snowflake, Mod>;
	public messages: Collection<Snowflake, Context>;
	public queue: Collection<Snowflake, Handlers.Spawn.Queue>;
	public constructor(client: Lava, {
		directory,
		classToHandle = Spawn,
		extensions = ['.js', '.ts'],
		automateCategories,
		loadFilter,
	}: Constructors.Handlers.Spawn = {}) {
		if (!(
			classToHandle.prototype instanceof Spawn || classToHandle === Spawn)
		) {
			throw new AkairoError(
				'INVALID_CLASS_TO_HANDLE', 
				classToHandle.name, 
				Spawn.name
			);
		}

		super(client, {
			directory,
			classToHandle,
			extensions,
			automateCategories,
			loadFilter
		});

		this.cooldowns = new Collection();
		this.messages = new Collection();
		this.queue = new Collection();
	}

	private handleMessageCollect<T extends Context>(args: {
		collector: MessageCollector;
		spawner: Mod;
		ctx: T;
	}): boolean {
		const { ctx, collector, spawner } = args;
		const { collected } = collector;
		const isFirst = collected.first().id === ctx.id;
		const handler = this;

		if (spawner.config.type === 'spam') {
			const filter = ({ author }: T) => author.id === ctx.author.id;
			const authorEntries = collected.array().filter(filter as ((msg: Message) => boolean));
			if (authorEntries.length > 1) collected.delete(ctx.id);
		}

		return this.emit('messageCollect', { ctx, spawner, handler, isFirst });
	}

	private handleMessageEnd<T extends Context>(args: {
		collected: Collection<string, T>;
		spawner: Mod;
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

	private handleReactionCollect(
		reaction: MessageReaction,
		user: User,
		ctx: {
			collector: ReactionCollector;
			spawner: Mod;
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

	private handleReactionRemove(
		reaction: MessageReaction,
		user: User,
		ctx: {
			collector: ReactionCollector;
			spawner: Mod;
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

	private handleReactionEnd(
		collected: Collection<string, MessageReaction>,
		ctx: { msg: Context; spawner: Mod }
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
	public async spawn(
		spawner: Mod,
		msg: Context
	): Promise<ReactionCollector | MessageCollector | void> {
		if (['spam', 'message'].includes(spawner.config.type)) {
			const str = this.client.util.randomInArray(spawner.spawn.strings);

			// MessageCollector#options
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
			const collector = msg.channel.createMessageCollector(filter as ((m: Message) => PromiseUnion<boolean>) , options);

			// MessageCollector#on<collect|end>
			collector
				.on('collect', (msg: Message) => {
					this.handleMessageCollect<Context>({ ctx: msg as Context, collector, spawner });
				})
				.on('end', (collected: Collection<string, Message>) => {
					this.handleMessageEnd<Context>({ collected: collected as Collection<string, Context>, spawner, ctx: msg });
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
				return this.handleReactionEnd(col, { msg, spawner });
			};

			// ReactionCollector#on<collect|remove|end>
			collector
				.on('collect', onCollect)
				.on('remove', onRemove)
				.on('end', onRemove);

			return collector;
		} else {
			return Promise.reject(
				`[INVALID_TYPE] Spawn type "${spawner.config.type}" is invalid.`
			);
		}
	}
}
