import { QuestHandler, StructureOptions, Structure } from 'src/library';

export class Mission extends Structure {
	/**
	 * The amount of times they hit this quest.
	 */
	public count: number;
	/**
	 * Constructor for this bs.
	 */
	public constructor(options: StructureOptions, data: Omit<CurrencyQuests, 'id'>) {
		super(options);
		/** @type {number} */
		this.count = data.count;
	}

	/**
	 * Shortcut for the quest module.
	 */
	get quest() {
		const handler = this.client.plugins.plugins.get('quest').handler as unknown;
		return (handler as QuestHandler).modules.get(this.id);
	}

	/**
	 * Check if the human who owns this quest already finished.
	 */
	isFinished() {
		return this.count >= this.quest.target;
	}
}