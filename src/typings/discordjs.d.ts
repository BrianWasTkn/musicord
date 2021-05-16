/**
 * DiscordJS Extensions
 * @author BrianWasTaken
*/

import { Context, UserPlus } from 'lib/extensions';
import { Item } from 'lib/objects';
import { Lava } from 'lib/Lava';

declare module 'discord.js' {
	interface Client {
		// @TODO: Replace all handlers to managers
		// and assign the handler on that manager.
		// items: ItemManager;
		users: UserManager;
	}
	interface BaseManager<K, Holds, R> {
		client: Lava;
	}
	interface TextChannel {
		messages: MessageManager;
	}

	type ItemResolvable = string | Item;
	interface ItemManager extends BaseManager<Snowflake, Item, ItemResolvable> {
		use(ctx: Context, item: ItemResolvable, amount?: number): PromiseUnion<Item>;
		remove(ctx: Context, item: ItemResolvable): PromiseUnion<Item>;
	}

	type UserResolvable = string | UserPlus;
	interface UserManager extends BaseManager<Snowflake, UserPlus, UserResolvable> {
		fetch(id: Snowflake, cache?: boolean, force?: boolean): Promise<UserPlus>;
	}

	type MessageResolvable = string | Context;
	interface MessageManager extends BaseManager<Snowflake, Context, MessageResolvable> {
		channel: TextBasedChannelFields;
		cache: Collection<Snowflake, Context>;
		fetch(message: Snowflake, cache?: boolean, force?: boolean): Promise<Context>;
		fetch(options: ChannelLogsQueryOptions, cache?: boolean, force?: boolean): Promise<Collection<Snowflake, Context>>;
		fetchPinned(cache?: boolean): Promise<Collection<Snowflake, Context>>;
		delete(message: MessageResolvable): Promise<void>;
	}
}
