import { Base as GenericBase } from 'discord.js';
import { LavaClient } from '../..';

export class Base extends GenericBase {
	public client: LavaClient;
}