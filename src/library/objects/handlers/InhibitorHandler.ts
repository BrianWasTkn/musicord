import { HandlerPlus, Inhibitor, Command } from '..';
import { AkairoError } from 'lib/utility/error';
import { isPromise } from 'lib/utility/akairo';
import { Context } from 'lib/extensions';
import { Lava } from 'lib/Lava';

export type InhibitorType = 'all' | 'pre' | 'post';

export class InhibitorHandler<Mod extends Inhibitor = Inhibitor> extends HandlerPlus<Mod> {
	public constructor(client: Lava, {
		directory,
		classToHandle = Inhibitor,
		extensions = ['.js', '.ts'],
		automateCategories,
		loadFilter,
	}: Constructors.Handlers.Inhibitor = {}) {
		if (!(
			classToHandle.prototype instanceof Inhibitor || classToHandle === Inhibitor)
		) {
			throw new AkairoError(
				'INVALID_CLASS_TO_HANDLE', 
				classToHandle.name, 
				Inhibitor.name
			);
		}

		super(client, {
			directory,
			classToHandle,
			extensions,
			automateCategories,
			loadFilter
		});
	}

	public async test(type: InhibitorType, message: Context, command?: Command) {
		if (!this.modules.size) return null;

		const inhibitors = this.modules.filter(i => i.type === type);
		if (!inhibitors.size) return null;

		const promises: Promise<Mod>[] = [];

		for (const inhibitor of inhibitors.values()) {
			promises.push((async () => {
				let inhibited = inhibitor.exec(message, command);
				if (isPromise(inhibited)) inhibited = await inhibited;
				if (inhibited) return inhibitor;
				return null;
			})());
		}

		const inhibitedInhibitors = (await Promise.all(promises)).filter(r => r);
		if (!inhibitedInhibitors.length) return null;

		inhibitedInhibitors.sort((a: Mod, b: Mod) => b.priority - a.priority);
		return inhibitedInhibitors[0].reason;
	}
}