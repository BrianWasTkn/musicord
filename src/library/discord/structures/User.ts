import { User, Structures } from 'discord.js';
import { LavaClient } from '../..';
import { Structure } from '.';

export declare interface UserPlus extends User {
	/**
	 * The client instance.
	 */
	client: LavaClient;
}

export class UserPlus extends User implements Structure {}
Structures.extend('User', () => User);