import clientConfig from './client'
import guildConfig from './crib'
import playerConfig from './player'
import supportConfig from './support'

export default {
	...clientConfig,
	...guildConfig,
	...playerConfig,
	...supportConfig
}