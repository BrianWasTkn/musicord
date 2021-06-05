import { AbstractModuleOptions, AbstractModule, Command, CommandHandler } from '..';
import { MessageOptions, EmojiResolvable } from 'discord.js';
import { SpawnHandler } from '.';

/**
 * The tier of the event.
 */
export type SpawnTier = 'COMMON' | 'UNCOMMON' | 'SUPER' | 'GODLY';
/**
 * How the spawn should handle messages/reactions.
 */
export type SpawnMethod = 'message' | 'spam' | 'react';

export interface SpawnDisplay {
	description: string;
	emoji: string;
	strings: string[];
	tier: SpawnTier;
	title: string;
}

export interface SpawnConfig {
	cooldown: number;
	enabled: boolean;
	duration: number;
	maxEntries: number;
	method: SpawnMethod;
	odds: number;
	rewards: [number, number];
}

export interface SpawnOptions extends AbstractModuleOptions {
	config: SpawnConfig;
	display: SpawnDisplay;
}

export class Spawn extends AbstractModule {
	/**
	 * The handler this spawn module belongs to.
	 */
	public handler: SpawnHandler;
	public config: SpawnConfig;
	public display: SpawnDisplay;

	/**
	 * Construct a spawn.
	 */
	public constructor(id: string, options: SpawnOptions) {
		super(id, { name: options.name, category: options.category });
		this.config = options.config;
		this.display = options.display;
	}
}