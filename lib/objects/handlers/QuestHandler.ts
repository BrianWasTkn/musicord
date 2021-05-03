import { HandlerPlusOptions, HandlerPlus, Command, Quest, Item } from '..';
import { Context } from 'lib/extensions';
import { Lava } from 'lib/Lava';

export class QuestHandler<Mod extends Quest = Quest> extends HandlerPlus<Mod> {
	constructor(
		client: Lava,
		{
			directory = './src/quests',
			classToHandle = Quest,
			automateCategories = true,
		}: HandlerPlusOptions
	) {
		super(client, {
			directory,
			classToHandle,
			automateCategories,
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
