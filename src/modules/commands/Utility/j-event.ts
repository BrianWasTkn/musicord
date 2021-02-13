import { 
    User,
    Message, 
    Collection,
    GuildMember, 
    TextChannel,
    CollectorFilter,
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

    private handleCollect(this: Message, entries: Collection<string, GuildMember>): void | Collection<string, GuildMember> {
        this.react('<:memerGold:753138901169995797>');
        if (entries.has(this.author.id)) return;
        else return entries.set(this.author.id, this.member);
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
        await channel.send(`**<:memerGold:753138901169995797> \`CUSTOM EVENT NICE\`**\n**Spam Spam Spam**\nSplit **${amount.toLocaleString()}** coins, now.`)
        await channel.send(`Spam \`${string.toUpperCase()}\` **${hits}** times`);
        const entries: Collection<string, GuildMember> = new Collection();
        const filter: CollectorFilter = (m: Message) => m.content.toLowerCase() === string.toLowerCase();
        const options: MessageCollectorOptions = { max: hits, time: 120000 };
        
        const collector = channel.createMessageCollector(filter, options);
        collector.on('collect', (m: Message) => (this.handleCollect.bind(m))(entries));
        collector.on('end', async (collected: Collection<string, Message>) => {
            let success: GuildMember[] = [];
            events.delete(guild.id);
            if (lock) await lockChan(false);

            if (!collected.size || collected.size <= 1) {
                return _.reply('**:skull: RIP! No one joined.**'); 
            }

            await channel.send(`**${entries.size} people** landed **${collected.size}** hits altogether and are teaming up to split __${amount.toLocaleString()}__ coins...`);
            await this.client.util.sleep(this.client.util.randomNumber(5, 10) * 1000);
            entries.array().sort(() => Math.random() - 0.5).forEach(c => Math.random() > 0.65 && success.length <= 30 ? success.push(c) : {});
            const coins = Math.round(amount / success.length);
            const order = success.length ? success.map(s => `+ ${s.nickname} got ${coins.toLocaleString()}`) : ['- Everybody died LOL'];
            await channel.send(`**Good job everybody, we split up \`${(coins ? coins : 1).toLocaleString()}\` coins each!**`);
            await channel.send({
                code: 'diff',
                content: order.join('\n')
            })
        });
    }

    private async lockChan(this: Message, bool: boolean): Promise<TextChannel> {
        const change: PermissionOverwriteOption = { SEND_MESSAGES: bool };
        return await (<TextChannel>this.channel).updateOverwrite(this.guild.id, change, `JEvent by: ${this.author.tag}`);
    }
}