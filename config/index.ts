import type { AkairoOptions } from 'discord-akairo';
import type { ClientOptions } from 'discord.js';

import { CurrencyType, currencyConfig } from './currency';
import { ConfigInterface, lavaConfig } from './lava';
import { LottoConfig, lottoConfig } from './lottery';
import { SpawnConfig, spawnConfig } from './spawn';
import { discordOptions } from './discord';
import { akairoConfig } from './akairo';

export interface Config {
  currency: CurrencyType;
  discord: ClientOptions;
  lottery: LottoConfig;
  akairo: AkairoOptions;
  spawn: SpawnConfig;
  bot: ConfigInterface;
}

export const config: Config = {
  currency: currencyConfig,
  discord: discordOptions,
  lottery: lottoConfig,
  akairo: akairoConfig,
  spawn: spawnConfig,
  bot: lavaConfig,
};
