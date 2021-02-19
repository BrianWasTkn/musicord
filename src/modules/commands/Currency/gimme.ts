import { Message } from 'discord.js'
import { Command } from 'discord-akairo'

export default class Currency extends Command {
    public client: Akairo.Client
    
    constructor() {
        super('gimme', {
            aliases: ['gimme'],
            channel: 'guild',
            description:
                'Gives you a random amount of coins from 100k to 1m coins',
            category: 'Currency',
            cooldown: 5000,
        })
    }

    async exec(_: Message): Promise<Message> {
        const user = _.member
        const amount = this.client.util.randomNumber(100, 1000) * 1000
        await this.client.db.currency.addPocket(user.user.id, amount)
        return _.channel.send(
            `Successfully added **${amount.toLocaleString()}** coins to your pocket.`
        )
    }
}
