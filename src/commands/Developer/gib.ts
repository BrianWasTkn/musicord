import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Argument } from 'discord-akairo';
import { Command } from '@lib/handlers/command'; 

export default class Currency extends Command {
	constructor() {
		super('gib', {
			aliases: ['gib', 'g'],
			description: 'Gib coins to users.',
			category: 'Dev',
			ownerOnly: true,
			args: [
				{
        	id: 'amount',
        	type: 'number',
        },
        {
          id: 'member',
          type: 'member',
        },
			]
		});
	}

	public async exec(msg: MessagePlus, args: { 
  	member: GuildMember, 
  	amount: number
  }): Promise<string | MessageOptions> {
  	const { member, amount } = args;
  	if (!member || !amount) return;

    const r = await msg.fetchDB(member.user.id);
  	let give: number;
  	if (isNaN(amount)) {
  		return 'Needs to be a whole number yeah?'
  	} else { 
  		give = amount; 
  	}

  	if (r.pocket >= this.client.config.currency.maxSafePocket)
  		return `Hah! Having over ${this.client.config.currency.maxSafePocket.toLocaleString()} makes them too rich, no thanks.`

		let { pocket } = await msg.dbAdd(member.user.id, 'pocket', amount);
  	return `You gave ${member.user.username} **${amount.toLocaleString()}** coins. They now have **${pocket.toLocaleString()}** coins.`
  }
} 