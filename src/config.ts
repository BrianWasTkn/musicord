
import gamble from './configs/gamble'
import lava from './configs/lava'
import locks from './configs/locks'
import spawn from './configs/spawn'

export default {
	gamble: { ...gamble },
	bot: { ...lava },
	heist: { ...locks },
	spawn: { ...spawn },
}