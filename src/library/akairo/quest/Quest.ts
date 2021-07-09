import { AbstractModuleOptions, AbstractModule } from 'lava/akairo';
import { MessageOptions } from 'discord.js';
import { QuestHandler } from '.';

interface QuestRewardItem {
	/** The amount of items. */
	amount: number; 
	/** The item id. */
	item: string;
}

interface QuestReward {
	/** The coins they get when they finish this. */
	coins: number;
	/** The items they get when they finish. */
	item: QuestRewardItem;
}

export interface QuestOptions extends AbstractModuleOptions {
	/** The command ID where this quest belongs to. */
	command: string;
	/** The element of the command to increment the count. */
	method?: string;
	/** The rewards they get. */
	rewards: QuestReward;
	/** The target amount. */
	target: number;
	/** Short description. */
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
	public command: string;
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
		/** @type {string} */
		this.command = options.command;
		/** @type {string} */
		this.method = options.method ?? options.name;
		/** @type {QuestReward} */
		this.rewards = options.rewards;
		/** @type {number} */
		this.target = options.target;
		/** @type {string} */
		this.info = options.info.replace(/{target}/g, this.target.toLocaleString());
	}

	private _assign<A>(o1: PartialUnion<A>, o2: A): A {
		return Object.assign(o2, o1);
	}
}