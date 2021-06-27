import { EventEmitter } from 'events';
import { LavaModule } from './LavaModule';
import { Collection } from 'discord.js';

export class LavaHandler extends EventEmitter {
	public modules: Collection<string, LavaModule>;
}