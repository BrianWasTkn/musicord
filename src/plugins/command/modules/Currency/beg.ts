import { Context, Command } from 'lava/index';

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
    item: string;
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

    async exec(ctx: Context) {
        const entry = await ctx.currency.fetch(ctx.author.id);
    }
}

const beg: BegData[] = [
    { 
        person: 'Rick Astley',
        coins: {
            max: 5000,
            min: 500
        },

    }
]