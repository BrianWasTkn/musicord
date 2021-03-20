import { Message, CollectorFilter, Collection, TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Spawn } from '@lib/handlers/spawn';

async function handleDonation(this: ClientListener, msg: Message) {
	try {
		await msg.delete();
		const dm = await msg.author.createDM();
		const res = new Collection<string, string>();
		try {
			const questions = {
				'Giveaway': 'What do you wanna giveaway?',
				'Winners': 'Please specify a number of winners',
				'Duration': 'What is the duration for this giveaway?',
				'Requirement': 'What should be the requirement for this giveaway?',
				'Message': 'Any extra message for your giveaway?'
			}

			await dm.send('**Welcome to our interactive giveaway donation menu**\n*I will ask you series of questions for your giveaway donation. You have **30 seconds** for each question. You can type `cancel` anytime. Type anything to continue.*')
			const filter: CollectorFilter = (m: Message) => m.author.id === msg.author.id;
			const fcol = (await dm.awaitMessages(filter, { max: 1, time: 30000 })).first();
			if (fcol.content.toLowerCase() === 'cancel') return await dm.send('The request is cancelled.');

			let qArr: string[] = Object.keys(questions);
			let index: number = 0;
			async function collect(question: string) {
				await dm.send(question);
				const col = await dm.awaitMessages(filter, { max: 1, time: 30000 });
				const m = col.first();
				if (!m || m.content.toLowerCase() === 'cancel') return false;
				res.set(qArr[index], m.content);
				index++;
				const q = questions[qArr[index]];
				return !q ? true : await collect(q);
			}

			const col = await collect(questions[qArr[index]]);
			if (!col) return await dm.send('The request is cancelled.');
			let results: string[] = [];
			for (const [type, response] of res) {
				results.push(`**${type}:** ${response}`);
			}

			const chan = msg.guild.channels.cache.get('691596367776186379') as TextChannel;
			const role = chan.guild.roles.cache.get('692892567787929691');
			const r = results.join('\n');
			await chan.send({ 
				content: `${role.toString()} ${msg.author.toString()}`,
				embed: {
					description: r,
					title: 'Giveaway Donation',
					color: 'RANDOM',
					footer: {
						text: `${msg.author.tag} (${msg.author.id})`,
						icon_url: msg.author.avatarURL({ dynamic: true })
					}
				}
			});

			const accChan = msg.guild.channels.cache.get('691596367776186379');
			await msg.member.roles.add('715507078860505091');
			return await dm.send(`Thanks for your donation! You now have access to ${accChan.toString()} to give your donation to our staffs.`);
		} catch {
			await dm.send('Something wrong occured :c')
		}
	} catch {
		const m = await msg.channel.send('Please open your DMs.');
		return await m.delete({ timeout: 1e4 });
	}
}

async function handleHeistDonation(this: ClientListener, msg: Message) {
	try {
		await msg.delete();
		const dm = await msg.author.createDM();
		const res = new Collection<string, string>();
		try {
			const questions = {
				'Amount': 'How much coins you wanna sponsor?',
				'Requirement': 'What should be the requiement? Type none if none.'
			}

			await dm.send('**Welcome to our interactive heist donation menu**\n*I will ask you series of questions for your heist donation. You have **30 seconds** for each question. You can type `cancel` anytime. Type anything to continue.*')
			const filter: CollectorFilter = (m: Message) => m.author.id === msg.author.id;
			const fcol = (await dm.awaitMessages(filter, { max: 1, time: 30000 })).first();
			if (fcol.content.toLowerCase() === 'cancel') return await dm.send('The request is cancelled.');

			let qArr: string[] = Object.keys(questions);
			let index: number = 0;
			async function collect(question: string) {
				await dm.send(question);
				const col = await dm.awaitMessages(filter, { max: 1, time: 30000 });
				const m = col.first();
				if (!m || m.content.toLowerCase() === 'cancel') return false;
				res.set(qArr[index], m.content);
				index++;
				const q = questions[qArr[index]];
				return !q ? true : await collect(q);
			}

			const col = await collect(questions[qArr[index]]);
			if (!col) return await dm.send('The request is cancelled.');
			let results: string[] = [];
			for (const [type, response] of res) {
				results.push(`**${type}:** ${response}`);
			}

			const chan = msg.guild.channels.cache.get('691596367776186379') as TextChannel;
			const role = chan.guild.roles.cache.get('697007407011725312');
			const r = results.join('\n');
			await chan.send({ 
				content: `${role.toString()} ${msg.author.toString()}`,
				embed: {
					description: r,
					title: 'Heist Donation',
					color: 'RANDOM',
					footer: {
						text: `${msg.author.tag} (${msg.author.id})`,
						icon_url: msg.author.avatarURL({ dynamic: true })
					}
				}
			});

			const accChan = msg.guild.channels.cache.get('691596367776186379');
			await msg.member.roles.add('715507078860505091');
			return await dm.send(`Thanks for your donation! You now have access to ${accChan.toString()} to give your donation to our staffs.`);
		} catch {
			await dm.send('Something wrong occured :c')
		}
	} catch {
		const m = await msg.channel.send('Please open your DMs.');
		return await m.delete({ timeout: 1e4 });
	}
}

export default class ClientListener extends Listener {
  constructor() {
    super('donation', {
      emitter: 'client',
      event: 'message',
    });
  }

  public async exec(msg: Message): Promise<void | Message> {
  	if (msg.channel.id !== '818667160918425630') return;
    const haha = { 1: handleDonation, 2: handleHeistDonation };
    const query = haha[msg.content];
    if (!query) return;

    return query.call(this, msg);
  }
}
