import type { HandlerConstructor } from 'lib/Lava';
import type { AkairoOptions } from 'discord-akairo';
import type { ClientOptions } from 'discord.js';

import { CurrencyType, currencyConfig } from './currency';
import { ConfigInterface, lavaConfig } from './lava';
import { LottoConfig, lottoConfig } from './lottery';
import { SpawnConfig, spawnConfig } from './spawn';
import { ItemConfig, itemConfig } from './item';
import { discordOptions } from './discord';
import { handlerConfig } from './handlers';
import { akairoConfig } from './akairo';

export interface Config {
	handlers: HandlerConstructor;
	currency: CurrencyType;
	discord: ClientOptions;
	lottery: LottoConfig;
	akairo: AkairoOptions;
	spawn: SpawnConfig;
	item: ItemConfig;
	bot: ConfigInterface;
}

export default <Config> {
	currency: currencyConfig,
	handlers: handlerConfig,
	discord: discordOptions,
	lottery: lottoConfig,
	akairo: akairoConfig,
	spawn: spawnConfig,
	item: itemConfig,
	bot: lavaConfig,
};
