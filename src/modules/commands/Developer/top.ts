import { Message, MessageEmbed } from 'discord.js'
import { Command } from 'discord-akairo'
import mongoose from 'mongoose'

export default class Dev extends Command {
    public client: Akairo.Client;
    public constructor() {
        super('top', {
            aliases: ['top', 't'],
			description: 'View global top leaderboards for both Currency and Spawns.',
			category: 'Dev',
			ownerOnly: true,
            args: [
                { id: 'type', type: 'string' },
                { id: 'amount', type: 'number' }
            ]
        });
    }

    private async map<T extends Lava.CurrencyProfile | Lava.SpawnDocument>(docs: (mongoose.Document & T)[], amount: number, key: string): Promise<string[]> {
        let all = docs.filter((m: mongoose.Document & T) => m[key] < Infinity)
        .sort((a: (mongoose.Document & T), b: (mongoose.Document & T)) => b[key] - a[key])
        .slice(0, amount).map(async(m: mongoose.Document & T, i: number) => {
            const user = await this.client.users.fetch(m.userID);
            return (<string>(`${i + 1}. **${m[key].toLocaleString()}** - ${user.tag}`));
        });

        return await Promise.all(all);
    }

    public async exec(_: Message, args: any): Promise<Message> {
        const { type = 'unpaids', amount = 10 } = args;
        const embed = new MessageEmbed();
        let docs: any[];
        
        if (['unpaid', 'unpaids', 'spawns', 'spawn'].includes(type)) {
            docs = await mongoose.models["spawn-profile"].find({});
            embed.setTitle('Top Unpaids').setColor('RANDOM')
            .setDescription((await this.map<Lava.SpawnDocument>(docs, amount, 'unpaid')).join('\n'));
        } else if (['pocket', 'wallet'].includes(type)) {
            docs = await mongoose.models["currency"].find({});
            embed.setTitle('Top Pockets').setColor('RANDOM')
            .setDescription((await this.map<Lava.CurrencyProfile>(docs, amount, 'pocket')).join('\n'));
        }

        return _.channel.send({ embed });
    }
}