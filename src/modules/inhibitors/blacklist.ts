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

	exec(m: Context, c: Command): Promise<boolean> {
		return m.db.fetch().then(({ data }) => data.bled);
	}
}