import { User as BaseUser, Structures } from 'discord.js';
import { LavaClient, Inventory } from '../..';
import { Base } from '.';

export class User extends BaseUser implements Base {
	public client: LavaClient;
}

Structures.extend('User', () => User);