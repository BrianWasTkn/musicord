import 'module-alias/register';
import 'dotenv/config';
import { Lava } from '@lib/Lava';
import { SpawnConfig } from '@lib/interface/handlers';
import { config } from '@config/index';

// TODO: update all imports
new Lava(config).build();
