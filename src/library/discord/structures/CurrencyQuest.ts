import { LavaClient } from '../..';
import { Base } from '.';

export class CurrencyQuestStats extends Base {
	public count: number;
	public id: string;
	public constructor(client: LavaClient, quest: CurrencyQuests) {
		super(client);
		this.id = quest.id;
		this.count = quest.count;
	}
}