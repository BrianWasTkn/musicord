/**
 * Declarations for handlers and modules. 
 * @author BrianWasTaken
*/

import { MessageOptions, EmojiResolvable, TextChannel, Snowflake } from 'discord.js';
import { ModulePlusOptions, Item, Spawn } from 'lib/objects';
import { CommandOptions } from 'discord-akairo';
import { EventEmitter } from 'events';

declare global {
	namespace Handlers.Quest {
		type SpecificCommand = [string, string];
		type TargetMethod = string;
		type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Difficult' | 'Extreme';
		type Target = [number, string | SpecificCommand, TargetMethod];

		interface CheckArgs {
			target?: TargetMethod;
			count?: number;			
			item?: Item;
			cmd?: Command;
		}
		interface Rewards {
			coins: number;
			item: [number, string];
		}
	}

	namespace Handlers.Item {
		type CheckState = ArrayUnion<('time' | 'activeState' | 'presence')>;
		type UseReturn = MessageOptions;

		interface Info {
			short: string;
			long: string;
		}
		interface SaleData {
			discount: number;
			lastSale: number;
			id: string;
		}
	}

	namespace Handlers.Spawn {
		type VisualsType = 'COMMON' | 'UNCOMMON' | 'SUPER' | 'GODLY';
		type ConfigType = 'message' | 'spam' | 'react';
		type Reward = { [reward: string]: number };

		interface Config {
			rewards: Reward;
			enabled: boolean;
			timeout: number;
			entries: number;
			type: ConfigType;
			odds: number;
		}
		interface Visual {
			description: string;
			strings: string[];
			emoji: EmojiResolvable;
			title: string;
			type: VisualsType;
		}
		interface Queue {
			channel: Snowflake;
			spawn: Spawn;
			msg: Snowflake;
		}
		interface GuildConfig {
			multiplier: number;
			timed_chan: string;
			interval: number; // (for times_chans) hours
			cooldown: number; // minutes
			enabled: boolean;
			blacklisted: {
				channels: string[];
				roles: string[];
			};
		}
	}

	namespace Handlers.Giveaway {
		type BypassOptions = {
			roles?: string[];
		};

		interface StartOptions {
			channel: TextChannel;
			winners: number;
			bypass: GiveawayBypassOptions;
			prize: string;
			time: number;
		}
		interface EditOptions {
			winners: number;
			prize: string;
			time: number;
		}
		interface Data {
			startedAt: number;
			winners: string[];
			endedAt: number;
			guildID: string;
			wCount: number;
			chanID: string;
			ended: boolean;
			msgID: string;
		}
	}
}