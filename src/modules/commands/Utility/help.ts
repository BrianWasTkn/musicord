import { EmbedField, MessageOptions, Collection, PermissionString, Message } from 'discord.js';
import { Argument, Category } from 'discord-akairo';
import { EmbedFieldData } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';
import { Embed } from 'lib/utility/embed';
import bot from 'src/../package.json';

interface Help {
	query: 
		| Category<string, Collection<string, Command>>
		| Command;
}

export default class Utility extends Command {
	constructor() {
		super('help', {
			name: 'Help',
			aliases: ['help', 'h'],
			channel: 'guild',
			description: 'Fetches all public commands of this bot.',
			category: 'Utility',
			args: [
				{
					id: 'query',
					default: null,
					type: Argument.union('command', 'commandAlias', (m: Message, phrase: string): this['category'] => {
						return this.handler.findCategory(phrase) || null;
					}),
				},
			],
		});
	}

	private mapCommands(isOwner = false): EmbedField[] {
		const entries: { [cat: string]: Command[] } = {};
		const emojis: { [cat: string]: string } = {
			Currency: ':coin:',
			Dev: ':key:',
			Fun: ':joy:',
			Spawn: ':dollar:',
			Utility: ':scroll:'
		};

		for (const [category, catCmds] of this.handler.categories) {
			const cmds = [...catCmds.values()];
			entries[category] = cmds.filter(c => !isOwner ? !c.ownerOnly : true);
			if (entries[category].length <= 0) delete entries[category];
		}

		return Object.entries(entries).map(([cat, cmds]) => ({
			name: `${emojis[cat]} • ${cat} Commands`,
			value: `\`${(this.handler.prefix as string[])[0]} help ${cat.toLowerCase()}\`\n[Hover for more info](https://google.com '${cmds.length} Commands')`,
			inline: true,
		}));
	}

	public async exec(ctx: Context<Help>): Promise<MessageOptions> {
		await (await ctx.db.fetch()).save(true);
		const { parseTime } = ctx.client.util;
		const { query } = ctx.args;

		// Command Search
		if (query instanceof Command) {
			const cmd = query as Command;
			const fields = Object.entries({
				'Triggers': `\`${cmd.aliases.join('`, `')}\``,
				'Cooldown': parseTime((cmd.cooldown || 1e3) / 1e3, true),
				'Category': cmd.category.id,
				'Permissions': `\`${['SEND_MESSAGES'].concat((cmd.userPermissions as string[]) || []).join('`, `')}\``,
			}).map(([name, value]) => ({ inline: false, name, value }));

			return {
				embed: {
					// title: `${(this.handler.prefix as string[])[0]} ${cmd.aliases[0]} info`,
					description: cmd.description || 'No description provided.',
					title: `${cmd.name} Command`, color: 'ORANGE', fields,
				}
			};
		}

		// Category Search
		if (query instanceof Category) {
			const isOwner = this.client.isOwner(ctx.author.id);
			const category = this.handler.categories.get(query.id);
			const commands = [...category.values()].filter(c => {
				return isOwner ? true : !c.ownerOnly;
			});

			// hide my control panel against normies owo
			if (commands.length <= 0) {
				return { replyTo: ctx.id, content: "Wew, all commands under that category are for my owners only." };
			}

			return {
				embed: {
					description: `\`${commands.map(c => c.aliases[0]).join('`, `')}\``,
					title: `${category.id} Commands`, color: 'ORANGE', footer: {
						icon_url: ctx.client.user.avatarURL(),
						text: `Total • ${commands.length} Commands`,
					}
				}
			};
		}

		// Neither
		return {
			embed: {
				footer: { text: `${this.handler.modules.size} Commands  •  Version ${bot.version}`, iconURL: ctx.client.user.avatarURL() },
				title: `${ctx.client.user.username} Commands`, color: 'ORANGE', fields: this.mapCommands(ctx.client.isOwner(ctx.author.id)),
				description: bot.description,
			}
		};
	}
}
