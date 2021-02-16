import { readdirSync } from 'fs'
import { join } from 'path'

const commands = readdirSync(join(__dirname))
    .filter(f => !f.startsWith('index'))
    .map(f => require(join(__dirname, f)).default);

export default {
    commands,
    name: 'Currency',
    description: 'Gamble, spend and do everything with your coins.'
}