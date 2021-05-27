import { LavaClient } from '../..';
import { Base } from '.';

export class CurrencyGambleStats extends Base {
	public won: number;
	public lost: number;
	public wins: number;
	public loses: number;
	public id: string;
	public constructor(client: LavaClient, stat: CurrencyGamble) {
		super(client);
		this.id = stat.id;
		this.won = stat.won;
		this.lost = stat.lost;
		this.wins = stat.wins;
		this.loses = stat.loses;
	}
}