import { HandlerPlusOptions, HandlerPlus, Command, Quest, Item } from '..';
import { AkairoError } from 'lib/utility/error';
import { Context } from 'lib/extensions';
import { Lava } from 'lib/Lava';

export class QuestHandler<Mod extends Quest = Quest> extends HandlerPlus<Mod> {
	public constructor(client: Lava, {
		directory,
		classToHandle = Quest,
		extensions = ['.js', '.ts'],
		automateCategories,
		loadFilter,
	}: Constructors.Handlers.Quest = {}) {
		if (!(
			classToHandle.prototype instanceof Quest || classToHandle === Quest)
		) {
			throw new AkairoError(
				'INVALID_CLASS_TO_HANDLE', 
				classToHandle.name, 
				Quest.name
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

	findQuest(query: string): Mod {
		return (
			this.modules.get(query) ||
			this.modules.find((m) => {
				return m.name.toLowerCase().includes(query.toLowerCase());
			})
		);
	}
}
