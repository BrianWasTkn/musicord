import { AbstractHandler, AbstractHandlerOptions } from '..';
import { Quest } from '.';

export class QuestHandler extends AbstractHandler<Quest> {
	public pushSlot(data: CurrencyProfile): CurrencyQuests[] {
		const { deepFilter, randomInArray } = this.client.util;
		let quests: CurrencyQuests[] = [];
		if (this.modules.size < 1 || data.quests.length === 3) {
			return quests;
		}

		for (let q = 0; q < 3 - data.quests.length; q++) {
			data.quests.push(randomInArray(
				deepFilter(this.modules.array()
					.map(q => ({ id: q.id, count: 0 })), quests
				)
			));
		}

		return quests;
	}
}