import { CurrencyType, currencyConfig } from './currency';
import { ConfigInterface, lavaConfig } from './lava';
import { SpawnConfig, spawnConfig } from './spawn';
import type { AkairoOptions } from 'discord-akairo';
import type { ClientOptions } from 'discord.js';
import { discordOptions } from './discord';
import { akairoConfig } from './akairo';

export interface Config {
  currency: CurrencyType;
  discord: ClientOptions;
  akairo: AkairoOptions;
  spawn: SpawnConfig;
  bot: ConfigInterface;
}

export const config: Config = {
  currency: currencyConfig,
  discord: discordOptions,
  akairo: akairoConfig,
  spawn: spawnConfig,
  bot: lavaConfig,
};
