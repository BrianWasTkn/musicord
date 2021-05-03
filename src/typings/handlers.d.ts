/**
 * Declarations for handlers and modules. 
 * @author BrianWasTaken
*/

import { MessageOptions, EmojiResolvable, TextChannel, Snowflake } from 'discord.js';
import { ModulePlusOptions, Item, Spawn } from 'lib/objects';
import { CommandOptions } from 'discord-akairo';
import { EventEmitter } from 'events';

declare global {
	namespace Handlers {
		namespace Quest {
			type SpecificCommand = [string, string];
			type Target = [number, string | SpecificCommand, TargetMethod];
			type Difficulty =
				| 'Easy'
				| 'Medium'
				| 'Hard'
				| 'Difficult'
				| 'Extreme';
			type TargetMethod =
				| 'marrySomeone'
				| 'expandVault'
				| 'reachVault'
				| 'sellItem'
				| 'buyItem'
				| 'shareCoins'
				| 'shareItems'
				| 'craftKeys'
				| 'jackpots'
				| 'loses'
				| 'wins'
				| string;

			interface Constructor extends ModulePlusOptions {
				difficulty: Difficulty;
				rewards: Rewards;
				target: Target;
				info: string;
				name: string;
			}
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

		// Items 
		namespace Item {
			type CheckState = ArrayUnion<('time' | 'activeState' | 'presence')>;
			type UseReturn = MessageOptions;

			interface Constructor extends ModulePlusOptions {
				showInventory: boolean;
				category: string;
				sellable: boolean;
				showShop: boolean;
				buyable: boolean;
				premium: boolean;
				checks: CheckState;
				usable: boolean;
				emoji: string;
				name: string;
				cost: number;
				tier: number;
				info: Info;
			}
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

		// Spawns
		namespace Spawn {
			type VisualsType = 'COMMON' | 'UNCOMMON' | 'SUPER' | 'GODLY';
			type ConfigType = 'message' | 'spam' | 'react';
			type Cooldown = (member?: GuildMember) => { [k: string]: number };
			type Reward = { [reward: string]: number };

			interface Config {
				cooldown?: Cooldown;
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

		// Command
		namespace Command {
			interface Constructor extends ModulePlusOptions, CommandOptions {
				name?: string;
			};
		}

		// Listener
		namespace Listener {
			interface Constructor extends ModulePlusOptions {
				emitter?: string | EventEmitter;
				event?: string;
				type?: 'on' | 'once';
			}
		}

		// Giveaway
		namespace Giveaway {
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
}