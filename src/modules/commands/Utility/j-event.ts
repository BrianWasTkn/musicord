import { 
    User,
    Message, 
    Collection, 
    TextChannel,
    CollectorFilter,
    MessageCollector,
    MessageCollectorOptions,
    PermissionOverwriteOption
 } from 'discord.js'
import { Command } from 'discord-akairo'

export default class Utility extends Command {
    public client: Akairo.Client;
    public constructor() {
        super('jEvent', {
            aliases: ['event', 'je'],
            channel: 'guild',
            description: 'Start an join event like \'le old days.',
            category: 'Utility',
            userPermissions: ['MANAGE_MESSAGES'],
            args: [{
                id: 'amount', type: 'number',
                default: 1000000    }, {
                id: 'lock', type: 'boolean',
                default: true       }, {
                id: 'hits', type: 'number',
                default: 50
            }]
        });
    }

    private get strings(): (((m?: Message) => string) | string)[] {
        return [
            (m: Message) => m.guild.name,
            (m: Message) => m.client.user.username,
            'EEK', 'CRIB', 'WIN',
            'COINS', 'BROANA', 'LOL',
            'MEME', 'LMAO', 'LAMO'
        ]
    }

    private handleCollect(this: Message, collector: MessageCollector, entries: Collection<string, User>): void | Collection<string, User> {
        this.react('<:memerGold:753138901169995797>');
        if (entries.has(this.author.id)) return;
        else return entries.set(this.author.id, this.author);
    }

    public async exec(_: Message, args: any): Promise<Message> {
        await _.delete().catch(() => {});
        const { amount, lock, hits }: { 
            amount: number, lock: boolean, hits: number } = args;
        const { events } = this.client.util;
        const { guild } = _;
        const channel = _.channel as TextChannel;
        const lockChan = this.lockChan.bind(_);

        if (events.has(guild.id)) return;
        else events.set(guild.id, channel.id);
        if (lock) await lockChan(true);

        let string = this.client.util.randomInArray(this.strings);
        string = typeof string === 'function' ? string(_) : string;
        await channel.send(`**<:memerGold:753138901169995797> \`CUSTOME EVENT NICE\`**\n**Spam Spam Spam**\nSplit **${amount.toLocaleString()}** coins, now.`)
        await channel.send(`Spam \`${string.toUpperCase()}\` and hit \`${hits}\` times`);
        const entries: Collection<string, User> = new Collection();
        const filter: CollectorFilter = (m: Message) => m.content.toLowerCase() === string.toLowerCase();
        const options: MessageCollectorOptions = { max: hits, time: 3e4 };
        
        const collector = channel.createMessageCollector(filter, options);
        collector.on('collect', (m: Message) => (this.handleCollect.bind(m))(collector, entries));
        collector.on('end', async (collected: Collection<string, Message>) => {
            let success: Message[] = [];
            events.delete(guild.id);
            if (lock) await lockChan(false);

            if (!collected.size || collected.size <= 1) {
                return _.reply('**:skull: RIP! No one joined.**'); 
            }

            await channel.send(`**${entries.size} people** landed **${collected.size}** hits altogether and are teaming up to split __${amount.toLocaleString()}__ coins...`);
            await this.client.util.sleep(this.client.util.randomNumber(5, 10) * 1000);
            collected.array().sort(() => Math.random() - 0.5).forEach(c => Math.random() > 0.55 && success.length <= 30 ? success.push(c) : {});
            const coins = Math.round(amount / success.length);
            const order = success.length ? success.map(s => s.author.toString()).join(', ') : '**Everybody died LOL :skull::skull::skull:**';
            return channel.send(`**Good job everybody, we split up \`${(coins ? coins : 0).toLocaleString()}\` coins each!**\n\n${order}`);
        });
    }

    private async lockChan(this: Message, bool: boolean): Promise<TextChannel> {
        const change: PermissionOverwriteOption = { SEND_MESSAGES: bool };
        return await (<TextChannel>this.channel).updateOverwrite(this.guild.id, change, `JEvent by: ${this.author.tag}`);
    }
}