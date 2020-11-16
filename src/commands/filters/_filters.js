import Command from '../../Command.js'

import { join } from 'path'
import { readdirSync } from 'fs'

export default readdirSync(join(__dirname))
.filter(f => f !== '_filters.js')
.map(f => require(join(__dirname, f)).default)
.forEach(f => new Command({
	name: f.name,
	aliases: f.aliases,
	description: f.description,
	usage: f.usage,
	music: true,
	cooldown: 10000
}, f.run))