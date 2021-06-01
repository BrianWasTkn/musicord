import { GuildMember, Structures } from 'discord.js';
import { Structure, UserPlus } from '.';
import { LavaClient } from '../..';

export declare interface GuildMemberPlus extends GuildMember {
	client: LavaClient;
	user: UserPlus;
}

export class GuildMemberPlus extends GuildMember implements Structure {

}

Structures.extend('GuildMember', () => GuildMemberPlus);