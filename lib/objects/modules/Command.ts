import { DefaultArgumentOptions, MissingPermissionSupplier, IgnoreCheckPredicate, RegexSupplier, KeySupplier, ArgumentOptions, PrefixSupplier, CommandOptions, Argument } from 'discord-akairo';
import { PermissionResolvable, Message, Snowflake, MessageOptions } from 'discord.js';
import { ModulePlus, ModulePlusOptions } from '../interface/ModulePlus';
import { ArgumentRunner } from '../private/ArgumentRunner';
import { CommandHandler } from '..';
import { ContentParser } from '../private/ContentParser';
import { AkairoError } from 'lib/utility/error';
import { Context } from 'lib/extensions';

/**
 * Represents a Command.
 * @abstract
*/
export abstract class Command extends ModulePlus {
	public handler: CommandHandler<this>;
	public args: ArgumentOptions[];
	public aliases: string[];
	public contentParser: ContentParser;
	public argumentRunner: ArgumentRunner;
	public argumentGenerator: any;
	public channel: string;
	public ownerOnly: boolean;
	public editable: boolean;
	public typing: boolean;
	public cooldown: number;
	public ratelimit: number;
	public argumentDefaults: DefaultArgumentOptions;
	public description: string | any;
	public prefix: ArrayUnion<string> | PrefixSupplier;
	public clientPermissions: ArrayUnion<PermissionResolvable> | MissingPermissionSupplier;
	public userPermissions: ArrayUnion<PermissionResolvable> | MissingPermissionSupplier;
	public regex: RegExp | RegexSupplier;
	public condition: (ctx: Context) => boolean;
	public before: (ctx: Context) => any;
	public lock: KeySupplier | "guild" | "channel" | "user";
	public locker: Set<string>;
	public ignoreCooldown: ArrayUnion<Snowflake> | IgnoreCheckPredicate;
	public ignorePermissions: ArrayUnion<Snowflake> | IgnoreCheckPredicate;
	public id: string;
	public constructor(id: string, options: Handlers.Command.Constructor) {
		super(id, { category: options.category, name: options.name });

		const {
			aliases = [],
			args = this.args || [],
			quoted = true,
			separator,
			channel = null,
			ownerOnly = false,
			editable = true,
			typing = false,
			cooldown = null,
			ratelimit = 1,
			argumentDefaults = {},
			description = '',
			prefix = this.prefix,
			clientPermissions = this.clientPermissions,
			userPermissions = this.userPermissions,
			regex = this.regex,
			condition = this.condition || (() => false),
			before = this.before || (() => undefined),
			lock,
			ignoreCooldown,
			ignorePermissions,
			flags = [],
			optionFlags = []
		} = options;

		this.aliases = aliases;
		const { flagWords, optionFlagWords } = Array.isArray(args)
            ? ContentParser.getFlags(args)
            : { flagWords: flags, optionFlagWords: optionFlags };
        this.contentParser = new ContentParser({
            flagWords,
            optionFlagWords,
            quoted,
            separator
        });
        this.argumentRunner = new ArgumentRunner(this);
        this.argumentGenerator = Array.isArray(args)
        	// @ts-ignore
            ? ArgumentRunner.fromArguments(args.map(arg => [arg.id, new Argument(this, arg)]))
            : args.bind(this);
        this.channel = channel;
        this.ownerOnly = Boolean(ownerOnly);
        this.editable = Boolean(editable);
        this.typing = Boolean(typing);
        this.cooldown = cooldown;
        this.ratelimit = ratelimit;
        this.argumentDefaults = argumentDefaults;
        this.description = Array.isArray(description)
        	? description.join('\n') : description;
        this.prefix = typeof prefix === 'function'
        	? prefix.bind(this) : prefix;
        this.clientPermissions = typeof clientPermissions === 'function'
        	? clientPermissions.bind(this) : clientPermissions;
        this.userPermissions = typeof userPermissions === 'function'
        	? userPermissions.bind(this) : userPermissions;
        this.regex = typeof regex === 'function'
        	? regex.bind(this) : regex;
        this.condition = condition.bind(this);
        this.before = before.bind(this);
        this.lock = lock;
        if (typeof lock === 'string') {
        	this.lock = {
        		guild: (msg: Message) => msg.guild && msg.guild.id,
                channel: (msg: Message) => msg.channel.id,
                user: (msg: Message) => msg.author.id
        	}[lock];
        }
        if (this.lock) {
        	this.locker = new Set();
        }
        this.ignoreCooldown = typeof ignoreCooldown === 'function'
        	? ignoreCooldown.bind(this) : ignoreCooldown;
        this.ignorePermissions = typeof ignorePermissions === 'function'
        	? ignorePermissions.bind(this) : ignorePermissions;
	}

	public exec(ctx: Context): PromiseUnion<MessageOptions>;
	public exec(ctx: Context): PromiseUnion<MessageOptions> {
		throw new AkairoError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
	}

	public parse(ctx: Context, content: string) {
		const parsed = this.contentParser.parse(content);
		// @ts-ignore
		return this.argumentRunner.run(ctx, parsed, this.argumentGenerator);
	}
}

export default Command;