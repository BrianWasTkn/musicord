import 'module-alias/register';
import 'dotenv/config';

import { config } from '@config/index';
import { Lava } from '@lib/Lava';

const bot = new Lava(config);
bot.build();
// epic