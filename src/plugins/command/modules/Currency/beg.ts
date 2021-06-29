import { Context, Command, LavaClient } from 'lava/index';
import { MessageEmbedOptions } from 'discord.js';

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
    coins: BegCoins;
    msgs: BegMessage;
    odds: number;
}

export default class extends Command {
    constructor() {
        super('beg', {
            aliases: ['beg', 'gimme'],
            category: 'Currency',
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 1000 * 30,
            description: 'Extract small amount of coins into your pocket!',
            name: 'Beg'
        });
    }

    get beg() {
        return beg(this.client);
    }

    getWon(coins: BegCoins) {
        const { min, max } = coins;
        return this.client.util.randomNumber(min, max);
    }

    getSuccessMsg(ctx: Context, { coins, person, msgs }: BegData): MessageEmbedOptions {
        return {
            author: { name: typeof person === 'function' ? person(ctx) : person },
            description: `"${msgs.success(this.getWon(coins))}"`,
            color: 'GREEN'
        };
    }

    getFailMsg(ctx: Context, { coins, person, msgs }: BegData): MessageEmbedOptions {
        return {
            author: { name: typeof person === 'function' ? person(ctx) : person },
            footer: { text: 'Lol imagine begging' },
            description: `"${msgs.fail}"`,
            color: 'RED',
        };
    }

    async exec(ctx: Context) {
        const entry = await ctx.currency.fetch(ctx.author.id);
        const beg = ctx.client.util.randomInArray(this.beg);

        if (Math.random() > beg.odds) {
            await entry.addPocket(this.getWon(beg.coins)).save();
            return ctx.channel.send({ embed: this.getSuccessMsg(ctx, beg) });
        }

        return ctx.channel.send({ embed: this.getFailMsg(ctx, beg) });
    }
}

const beg = (client: LavaClient): BegData[] => [
    { 
        odds: 0.2,
        person: 'Rick Astley',
        msgs: {
            success: w => `Ok im done rickrolling, here's ${w} coins`,
            fail: client.util.randomInArray([
                'Never gonna give you up',
                'Never gonna let you down',
                'Never gonna run around and desert you',
                'Never gonna make u cry',
                'Never gonna say goodbye',
                'Never gonna tell a lie and hurt you',
                '**Say goodbye**'
            ])
        },
        coins: {
            max: 5000,
            min: 500
        },
    },
    {
        odds: 0.5,
        person: 'Elon Mask',
        msgs: {
            success: w => `Ok im rich so ima give u ${w.toLocaleString()} coins`,
            fail: 'Go back to ur poorhole and beg to someone else'
        },
        coins: {
            max: 10000,
            min: 1000
        }
    },
    {
        odds: 0.4,
        person: 'Dua L',
        msgs: {
            success: w => `If you don't wanna see me giving ${w.toLocaleString()} coins to somebody`,
            fail: 'Don\'t show up, don\'t beg now'
        },
        coins: {
            max: 6500,
            min: 650
        }
    },
    {
        odds: 0.65,
        person: 'Binran',
        msgs: {
            success: w => `Aww ur so poor, take my ${w} coins`,
            fail: `The phaser gram phaser test suggests you to fuck off <3`
        },
        coins: {
            max: 100000,
            min: 10000
        }
    }
];