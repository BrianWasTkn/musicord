/**
 * Starting Point
 * Author: BrianWasTkn
 */

import 'dotenv/config'
import Lava from './lib/structures/Lava'
import config from './config'

new Lava({
    ...config.bot,
    config: config,
}).build()
