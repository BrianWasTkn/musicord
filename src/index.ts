import 'module-alias/register';
import 'dotenv/config';

import { config } from '@config/index';
import { Lava } from '@lib/Lava';

(async (config) => {
  const bot = new Lava(config);
  try {
    await bot.build();
  } catch (error) {
    throw error;
  }
})(config);