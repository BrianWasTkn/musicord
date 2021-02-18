import 'dotenv/config'
import { Client } from './lib/structures/Client'
import config from './config'

async function run(): Promise<void> {
    const lava: Akairo.Client = new Client(config)

    try {
        await lava.build()
    } catch (error) {
        lava.util.log('Core', 'error', 'Unable to login.', undefined)
        throw error
    }
}

try {
    run()
} catch (error) {
    throw error
}
