declare module 'discord.js' {
	import {
		Message as DJSMessage,
		GuildChannel,
		NewsChannel
	} from 'discord.js'

	// Types
	export type GuildTextChannel = GuildChannel | NewsChannel;
	
	// Structures
	export class Message<T = GuildTextChannel> extends DJSMessage {}
}