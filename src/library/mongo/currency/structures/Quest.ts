import { QuestHandler, LavaClient, Structure } from 'lava/index';

export class Mission extends Structure {
	/**
	 * The amount of times they hit this quest.
	 */
	public count: number;
	/**
	 * Constructor for this bs.
	 */
	public constructor(client: LavaClient, data: CurrencyQuests) {
		super({ client, id: data.id });
		/** @type {number} */
		this.count = data.count;
	}

	/**
	 * Shortcut to the quest module.
	 */
	get module() {
		const { handler } = this.client.plugins.plugins.get('command');
		return (handler as QuestHandler).modules.get(this.id);
	}

	/**
	 * Check if the human who owns this quest already finished.
	 */
	isFinished() {
		return this.count >= this.module.target;
	}
}