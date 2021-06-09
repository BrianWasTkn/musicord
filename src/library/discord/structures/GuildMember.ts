import { GuildMember, Structures } from 'discord.js';
import { UserPlus, Structure } from '.';
import { LavaClient } from 'lava/akairo';

export declare interface GuildMemberPlus extends GuildMember {
	/**
	 * The client instance.
	 */
	client: LavaClient;
	/**
	 * The user object.
	 */
	user: UserPlus;
}

export class GuildMemberPlus extends GuildMember implements Structure {}
Structures.extend('GuildMember', () => GuildMemberPlus);