import { AbstractModuleOptions, AbstractModule, Command, CommandHandler } from '..';
import { MessageOptions } from 'discord.js';
import { QuestHandler } from '.';

interface QuestRewardItem {
	amount: number; 
	item: string;
}

interface QuestReward {
	coins: number;
	item: QuestRewardItem;
}

export interface QuestOptions extends AbstractModuleOptions {
	command: string;
	method: string;
	rewards: QuestReward;
	target: number;
}

export class Quest extends AbstractModule {
	/**
	 * The handler this quest module belongs to.
	 */
	public handler: QuestHandler;
	/**
	 * The command this quest is dependent from.
	 */
	public command: Command;
	/**
	 * The method of command interaction, idk.
	 */
	public method: string;
	/**
	 * The rewards for this quest.
	 */
	public rewards: QuestReward;
	/**
	 * The target amount for this quest.
	 */
	public target: number;

	/**
	 * Construct a quest.
	 */
	public constructor(id: string, options: QuestOptions) {
		super(id, { name: options.name, category: options.category });

		const commandPlugin = this.client.plugins.plugins.get('command');
		this.command = (commandPlugin.handler as CommandHandler).modules.get(options.command);
		this.method = String(options.method);
		this.rewards = options.rewards;
		this.target = Number(options.target);
	}

	private _assign<A>(o1: PartialUnion<A>, o2: A): A {
		return Object.assign(o2, o1);
	}
}