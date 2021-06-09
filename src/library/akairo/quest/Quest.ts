import { AbstractModuleOptions, AbstractModule, Command, CommandHandler } from 'lava/akairo';
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
	method?: string;
	rewards: QuestReward;
	target: number;
	info: string;
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
	 * The info of this quest.
	 */
	public info: string;

	/**
	 * Construct a quest.
	 */
	public constructor(id: string, options: QuestOptions) {
		super(id, { name: options.name, category: options.category });

		this.command = options.command;
		this.method = options.method ?? options.name;
		this.rewards = options.rewards;
		this.target = options.target;
		this.info = options.info.replace(/{target}/g, this.target.toLocaleString());
	}

	private _assign<A>(o1: PartialUnion<A>, o2: A): A {
		return Object.assign(o2, o1);
	}
}