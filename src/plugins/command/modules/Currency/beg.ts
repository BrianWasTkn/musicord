import { Context, Command, LavaClient } from 'lava/index';

type PersonPredicate = (ctx: Context) => string;
type MessagePredicate = (won: number) => string;

interface BegCoins {
    min: number;
    max: number;
}

interface BegMessage {
    success: MessagePredicate;
    fail: string;
}

interface BegData {
    person: string | PersonPredicate;
    coins: number | BegCoins;
    msgs: BegMessage;
    odds: number;
}

export default class extends Command {
    constructor() {
        super('beg', {
            aliases: ['beg', 'gimme'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 1000 * 30,
            description: 'Extract small amount of coins to start!',
            name: 'Beg'
        });
    }

    get beg() {
        return beg(this.client);
    }

    async exec(ctx: Context) {
        const entry = await ctx.currency.fetch(ctx.author.id);
    }
}

const beg = (client: LavaClient): BegData[] => [
    { 
        odds: 0.4,
        person: 'Rick Astley',
        msgs: {
            success: w => `Ok im done, here's ${w} coins`,
            fail: 'Never gonna give you up'
        },
        coins: {
            max: 5000,
            min: 500
        },
    }
];