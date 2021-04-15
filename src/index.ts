import 'module-alias/register';
import 'dotenv/config';

import { config } from '@config/index';
import { Lava } from '@lib/Lava';

new Lava(config).build();
