import { Inhibitor, Command } from 'lib/objects';
import { Context } from 'lib/extensions';

export default class Blacklist extends Inhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklisted',
			priority: 1,
			type: 'pre',
		});
	}

	async exec(m: Context, c: Command): Promise<boolean> {
		const { data } = await m.db.fetch();
		return data.bled;
	}
}