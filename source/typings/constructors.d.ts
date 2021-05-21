/**
 * Constructor types for classes obviously.
 * @author BrianWasTaken
*/

import { ListenerOptions, InhibitorOptions, CommandOptions, CommandHandlerOptions } from 'discord-akairo';
import { HandlerPlusOptions, ModulePlusOptions } from 'lib/objects';
import { EmojiResolvable } from 'discord.js';

declare global {
	//# Handlers
	namespace Constructors.Handlers {
		interface Inhibitor extends HandlerPlusOptions {}
		interface Argument extends HandlerPlusOptions {}
		interface Listener extends HandlerPlusOptions {}
		interface Command extends HandlerPlusOptions, CommandHandlerOptions {}
		interface Spawn extends HandlerPlusOptions {}
		interface Quest extends HandlerPlusOptions {}
		interface Item extends HandlerPlusOptions {}
	}

	//# Modules
	namespace Constructors.Modules {
		interface Inhibitor extends ModulePlusOptions, InhibitorOptions {}
		interface Listener extends ModulePlusOptions, ListenerOptions {}
		interface Argument extends ModulePlusOptions {}
		interface Command extends ModulePlusOptions, CommandOptions {}
		interface Spawn extends ModulePlusOptions {
			visual: Handlers.Spawn.Visual;
			config: Handlers.Spawn.Config;
		}
		interface Quest extends ModulePlusOptions {
			difficulty: Handlers.Quest.Difficulty;
			rewards: Handlers.Quest.Rewards;
			target: Handlers.Quest.Target;
			info: string;
		}
		interface Item extends ModulePlusOptions {
			showInventory: boolean;
			showInShop: boolean;
			sellable: boolean;
			buyable: boolean;
			premium: boolean;
			checks: Handlers.Item.CheckState;
			usable: boolean;
			emoji: EmojiResolvable;
			info: Handlers.Item.Info;
			cost: number;
			tier: number;
		}
	}
}