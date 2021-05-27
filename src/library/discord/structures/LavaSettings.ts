import { LavaClient } from '../..';
import { Base } from '.';

export class LavaSetting extends Base {
	public cooldown: number;
	public enabled: boolean;
	public id: string;
	public constructor(client: LavaClient, setting: LavaSettings) {
		super(client);
		this.id = setting.id;
		this.enabled = setting.enabled;
		this.cooldown = setting.cooldown ?? 0;
	}
}