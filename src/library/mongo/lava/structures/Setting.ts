import { LavaClient, Structure } from 'src/library';

export class LavaSetting extends Structure {
	public cooldown: number;
	public enabled: boolean;
	public id: string;
	public constructor(client: LavaClient, setting: LavaSettings) {
		super({ client, id: setting.id });
		this.enabled = setting.enabled;
		this.cooldown = setting.cooldown ?? 0;
	}
}