import { Listener, Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class extends Listener {
    public client: Akairo.Client;

    constructor() {
        super('cmdBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        })
    }

    async exec(msg: Message, cmd: Command, r: string): Promise<void | Message> {
        const owner = r === 'owner'
        if (owner) {
            return msg.channel.send('Woah now only my "Owners" can do dis')
        } else if (!owner) {
            if (r === 'guild') {
                return msg.channel.send('This command doesn\'t work in discord servers')
            } else if (r === 'dm') {
                return msg.channel.send('Not available in DMs sorry')
            }
        }

        return void 0;
    }
}