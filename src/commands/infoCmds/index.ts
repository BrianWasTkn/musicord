import { readdirSync } from 'fs'
import { join } from 'path'

const commands = readdirSync(join(__dirname))
    .filter(f => !f.startsWith('index'))
    .map(f => require(join(__dirname, f)).default);

export default {
    commands,
    name: 'Information',
    description: 'Display certain info about the bot or commands.'
}