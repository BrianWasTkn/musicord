import { LavaClient } from '../..';
import { Base } from '.';

export class CurrencyTradeStats extends Base {
	public id: string;
	public shared: number;
	public recieved: number;
	public constructor(client: LavaClient, trade: CurrencyTrade) {
		super(client);
		this.id = trade.id;
		this.shared = trade.out;
		this.recieved = trade.in;
	}
}