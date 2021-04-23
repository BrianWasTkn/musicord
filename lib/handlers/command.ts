import { Listener, ListenerHandler } from 'lib/handlers/listener';
import { Context, ContextDatabase } from 'lib/extensions/message';
import { CooldownData } from 'lib/interface/mongo/currency/currencyprofile';
import { AkairoError } from 'lib/utility/error';
import { UserPlus } from 'lib/extensions/user';
import { Util } from 'lib/utility/util';
import { Lava } from 'lib/Lava';
import {
  CommandHandler as OldCommandHandler,
  Command as AkairoCommand,
  DefaultArgumentOptions,
  MentionPrefixPredicate,
  IgnoreCheckPredicate,
  ParsedComponentData,
  InhibitorHandler,
  PrefixSupplier,
  AkairoHandler,
  LoadPredicate,
  AkairoModule,
  TypeResolver,
  CommandUtil,
  Constants,
  Category,
  Flag,
} from 'discord-akairo';
import {
  MessageOptions,
  MessageEmbed,
  GuildChannel,
  Collection,
  Snowflake,
  Channel,
  Message,
} from 'discord.js';
import {
  CommandHandlerOptions,
  CommandOptions,
  CommandReturn,
} from 'lib/interface/handlers/command';

const { CommandHandlerEvents: Events, BuiltInReasons } = Constants;

function isPromise(value) {
  return (
    value &&
    typeof value.then === 'function' &&
    typeof value.catch === 'function'
  );
}

function deepAssign(o1, ...os) {
  for (const o of os) {
    for (const [k, v] of Object.entries(o)) {
      const vIsObject = v && typeof v === 'object';
      const o1kIsObject =
        Object.prototype.hasOwnProperty.call(o1, k) &&
        o1[k] &&
        typeof o1[k] === 'object';
      if (vIsObject && o1kIsObject) {
        deepAssign(o1[k], v);
      } else {
        o1[k] = v;
      }
    }
  }

  return o1;
}

function prefixCompare(aKey: string | Function, bKey: string | Function) {
  if (aKey === '' && bKey === '') return 0;
  if (aKey === '') return 1;
  if (bKey === '') return -1;
  if (typeof aKey === 'function' && typeof bKey === 'function') return 0;
  if (typeof aKey === 'function') return 1;
  if (typeof bKey === 'function') return -1;
  return aKey.length === bKey.length
    ? aKey.localeCompare(bKey)
    : bKey.length - aKey.length;
}

declare global {
  type PromiseOr<T> = Promise<T> | T;
}

export class Command extends AkairoCommand {
  manualCooldown: boolean;
  // @ts-ignore
  handler: CommandHandler<Command>;
  client: Lava;

  constructor(id: string, args: CommandOptions) {
    super(id, args);
    this.manualCooldown = Boolean(args.manualCooldown);
  }

  run(ctx: Context): PromiseOr<CommandReturn> {
    return {
      embed: {
        title: 'What ya doing?',
        color: 'BLURPLE',
        description: "Command hasn't been implemented yet.",
      },
    };
  }

  exec(ctx: Context): PromiseOr<CommandReturn> {
    return {
      embed: {
        title: 'What ya doing?',
        color: 'BLURPLE',
        description: "Command hasn't been implemented yet.",
      },
    };
  }
}

export class CommandHandler<
  CommandModule extends Command
> extends AkairoHandler {
  client: Lava;
  classToHandle: new () => CommandModule;
  resolver: TypeResolver;
  aliases: Collection<string, string>;
  aliasReplacement: RegExp;
  prefixes: Collection<string | PrefixSupplier, Set<string>>;
  blockClient: boolean;
  blockBots: boolean;
  fetchMembers: boolean;
  handleEdits: boolean;
  storeMessages: boolean;
  storeMessage: boolean; // bruh akairo's typings are broken
  commandTyping: boolean;
  commandUtil: boolean;
  commandUtilLifetime: number;
  commandUtilSweepInterval: number;
  commandUtils: Collection<string, CommandUtil>;
  cooldowns?: Collection<string, object>;
  defaultCooldown: number;
  ignoreCooldown: Snowflake | Snowflake[] | IgnoreCheckPredicate;
  ignorePermissions: Snowflake | Snowflake[] | IgnoreCheckPredicate;
  prompts: Collection<string, Set<string>>;
  argumentDefaults: DefaultArgumentOptions;
  prefix: string | string[] | PrefixSupplier;
  allowMention: boolean | MentionPrefixPredicate;
  inhibitorHandler?: InhibitorHandler;
  directory: string;
  modules: Collection<string, CommandModule>;
  categories: Collection<string, Category<string, CommandModule>>;

  add: (filename: string) => CommandModule;
  findCategory: (name: string) => Category<string, CommandModule>;
  load: (thing: string | Function, isReload?: boolean) => CommandModule;
  loadAll: (directory?: string, filter?: LoadPredicate) => this;
  reload: (id: string) => CommandModule;
  reloadAll: () => this;
  remove: (id: string) => CommandModule;
  removeAll: () => this;

  constructor(
    client: Lava,
    {
      extensions = ['.js', '.ts'],
      loadFilter,
      blockClient = true,
      blockBots = true,
      fetchMembers = false,
      storeMessages = false,
      commandUtilLifetime = 3e5,
      commandUtilSweepInterval = 3e5,
      ignoreCooldown = client.ownerID,
      ignorePermissions = [],
      argumentDefaults = {},
      prefix = '!',
      directory = './commands',
      classToHandle = Command as Function,
      handleEdits = true,
      commandUtil = true,
      allowMention = true,
      commandTyping = false,
      defaultCooldown = 1500,
      aliasReplacement = /(-|\.)/gi,
      automateCategories = true,
    }: CommandHandlerOptions = {}
  ) {
    if (
      !(classToHandle.prototype instanceof Command || classToHandle === Command)
    ) {
      throw new AkairoError(
        'INVALID_CLASS_TO_HANDLE',
        classToHandle.name,
        Command.name
      );
    }

    super(client, {
      directory,
      classToHandle,
      extensions,
      automateCategories,
      loadFilter,
    });

    this.resolver = new TypeResolver((this as unknown) as OldCommandHandler);
    this.aliases = new Collection();
    this.aliasReplacement = aliasReplacement;
    this.prefixes = new Collection();
    this.blockClient = Boolean(blockClient);
    this.blockBots = Boolean(blockBots);
    this.fetchMembers = Boolean(fetchMembers);
    this.handleEdits = Boolean(handleEdits);
    this.storeMessages = Boolean(storeMessages);
    this.storeMessage = Boolean(storeMessages);
    this.commandTyping = Boolean(commandTyping);
    this.commandUtil = Boolean(commandUtil);
    if ((this.handleEdits || this.storeMessages) && !this.commandUtil) {
      throw new AkairoError('COMMAND_UTIL_EXPLICIT');
    }
    this.commandUtilLifetime = commandUtilLifetime;
    this.commandUtilSweepInterval = commandUtilSweepInterval;
    if (this.commandUtilSweepInterval > 0) {
      this.client.setInterval(
        () => this.sweepCommandUtil(),
        this.commandUtilSweepInterval
      );
    }
    this.commandUtils = new Collection();
    this.cooldowns = new Collection();
    this.defaultCooldown = defaultCooldown;
    this.ignoreCooldown =
      typeof ignoreCooldown === 'function'
        ? ignoreCooldown.bind(this)
        : ignoreCooldown;
    this.ignorePermissions =
      typeof ignorePermissions === 'function'
        ? ignorePermissions.bind(this)
        : ignorePermissions;
    this.prompts = new Collection();
    this.argumentDefaults = deepAssign(
      {
        prompt: {
          start: '',
          retry: '',
          timeout: '',
          ended: '',
          cancel: '',
          retries: 1,
          time: 30000,
          cancelWord: 'cancel',
          stopWord: 'stop',
          optional: false,
          infinite: false,
          limit: Infinity,
          breakout: true,
        },
      },
      argumentDefaults
    );
    this.prefix = typeof prefix === 'function' ? prefix.bind(this) : prefix;
    this.allowMention =
      typeof allowMention === 'function'
        ? allowMention.bind(this)
        : allowMention;
    this.inhibitorHandler = null;
    this.setup();
  }

  setup() {
    this.client.once('ready', () => {
      this.client.on('message', async (m: Context) => {
        if (m.partial) await m.fetch();
        await this.handle(m);
      });

      if (this.handleEdits) {
        this.client.on('messageUpdate', async (o: Context, n: Context) => {
          if (o.partial) await o.fetch();
          if (n.partial) await n.fetch();
          if (o.content === n.content) return;
          if (this.handleEdits) await this.handle(n);
        });
      }
    });
  }

  /**
   * Register command modules
   */
  register(cmd: CommandModule, filepath?: string): void {
    super.register(cmd, filepath);

    for (let alias of cmd.aliases) {
      const conflict = this.aliases.get(alias.toLowerCase());
      if (conflict)
        throw new AkairoError('ALIAS_CONFLICT', alias, cmd.id, conflict);

      alias = alias.toLowerCase();
      this.aliases.set(alias, cmd.id);
      if (this.aliasReplacement) {
        const replacement = alias.replace(this.aliasReplacement, '');

        if (replacement !== alias) {
          const replacementConflict = this.aliases.get(replacement);
          if (replacementConflict)
            throw new AkairoError(
              'ALIAS_CONFLICT',
              replacement,
              cmd.id,
              replacementConflict
            );
          this.aliases.set(replacement, cmd.id);
        }
      }
    }

    if (cmd.prefix != null) {
      let newEntry = false;

      if (Array.isArray(cmd.prefix)) {
        for (const prefix of cmd.prefix) {
          const prefixes = this.prefixes.get(prefix);
          if (prefixes) {
            prefixes.add(cmd.id);
          } else {
            this.prefixes.set(prefix, new Set([cmd.id]));
            newEntry = true;
          }
        }
      } else {
        const prefixes = this.prefixes.get(cmd.prefix);
        if (prefixes) {
          prefixes.add(cmd.id);
        } else {
          this.prefixes.set(cmd.prefix, new Set([cmd.id]));
          newEntry = true;
        }
      }

      if (newEntry) {
        this.prefixes = this.prefixes.sort((aVal, bVal, aKey, bKey) =>
          prefixCompare(aKey, bKey)
        );
      }
    }
  }

  deregister(cmd: CommandModule): void {
    for (let alias of cmd.aliases) {
      alias = alias.toLowerCase();
      this.aliases.delete(alias);

      if (this.aliasReplacement) {
        const replacement = alias.replace(this.aliasReplacement, '');
        if (replacement !== alias) this.aliases.delete(replacement);
      }
    }

    if (cmd.prefix != null) {
      if (Array.isArray(cmd.prefix)) {
        for (const prefix of cmd.prefix) {
          const prefixes = this.prefixes.get(prefix);
          if (prefixes.size === 1) {
            this.prefixes.delete(prefix);
          } else {
            prefixes.delete(prefix);
          }
        }
      } else {
        const prefixes = this.prefixes.get(cmd.prefix);
        if (prefixes.size === 1) {
          this.prefixes.delete(cmd.prefix);
        } else {
          prefixes.delete(cmd.prefix as string);
        }
      }
    }

    super.deregister(cmd);
  }

  async handle(msg: Context): Promise<boolean | null> {
    try {
      if (this.fetchMembers && msg.guild && !msg.member && !msg.webhookID) {
        await msg.guild.members.fetch(msg.author);
      }

      if (await this.runAllTypeInhibitors(msg)) {
        return false;
      }

      if (this.commandUtil) {
        if (this.commandUtils.has(msg.id)) {
          msg.util = this.commandUtils.get(msg.id);
        } else {
          msg.util = new CommandUtil(
            (this as unknown) as OldCommandHandler,
            msg
          );
          this.commandUtils.set(msg.id, msg.util);
        }
      }

      if (await this.runPreTypeInhibitors(msg)) {
        return false;
      }

      let parsed = await this.parseCommand(msg);
      if (!parsed.command) {
        const overParsed = await this.parseCommandOverwrittenPrefixes(msg);
        if (
          overParsed.command ||
          (parsed.prefix == null && overParsed.prefix != null)
        ) {
          parsed = overParsed;
        }
      }

      if (this.commandUtil) {
        msg.util.parsed = parsed as ParsedComponentData;
      }

      let ran;
      if (!parsed.command) {
        ran = await this.handleRegexAndConditionalCommands(msg);
      } else {
        ran = await this.handleDirectCommand(
          msg,
          parsed.content,
          parsed.command
        );
      }

      if (ran === false) {
        this.emit(Events.MESSAGE_INVALID, msg);
        return false;
      }

      return ran;
    } catch (err) {
      this.emitError(err, msg);
      return null;
    }
  }

  async handleDirectCommand(
    msg: Context,
    content: string,
    cmd: CommandModule,
    ignore: boolean = false
  ) /*: Promise<boolean | null>*/ {
    let key;
    try {
      if (!ignore) {
        if (msg.editedAt && !cmd.editable) return false;
        if (await this.runPostTypeInhibitors(msg, cmd)) return false;
      }

      const before = cmd.before(msg);
      if (isPromise(before)) await before;

      const args = await cmd.parse(msg, content);
      if (Flag.is(args, 'cancel')) {
        this.emit(Events.COMMAND_CANCELLED, msg, cmd);
        return true;
      } else if (Flag.is(args, 'retry')) {
        this.emit('commandBreakout', msg, cmd, args.message);
        return this.handle(args.message as Context);
      } else if (Flag.is(args, 'continue')) {
        const continueCommand = this.modules.get(args.command);
        return this.handleDirectCommand(
          msg,
          args.rest,
          continueCommand,
          args.ignore
        );
      }

      if (!ignore) {
        if (cmd.lock) key = cmd.lock(msg, args);
        if (isPromise(key)) key = await key;
        if (key) {
          if (cmd.locker.has(key)) {
            key = null;
            this.emit(Events.COMMAND_LOCKED, cmd, cmd);
            return true;
          }

          cmd.locker.add(key);
        }
      }

      return await this.runCommand(msg, cmd, args);
    } catch (err) {
      this.emitError(err, msg, cmd);
      return null;
    } finally {
      if (key) cmd.locker.delete(key);
    }
  }

  async handleRegexAndConditionalCommands(msg: Context) {
    const ran1 = await this.handleRegexCommands(msg);
    const ran2 = await this.handleConditionalCommands(msg);
    return ran1 || ran2;
  }

  async handleRegexCommands(msg: Context) {
    const hasRegexCommands = [];
    for (const command of this.modules.values()) {
      if (msg.editedAt ? command.editable : true) {
        const regex =
          typeof command.regex === 'function'
            ? command.regex(msg)
            : command.regex;
        if (regex) hasRegexCommands.push({ command, regex });
      }
    }

    const matchedCommands = [];
    for (const entry of hasRegexCommands) {
      const match = msg.content.match(entry.regex);
      if (!match) continue;

      const matches = [];

      if (entry.regex.global) {
        let matched;

        while ((matched = entry.regex.exec(msg.content)) != null) {
          matches.push(matched);
        }
      }

      matchedCommands.push({ command: entry.command, match, matches });
    }

    if (!matchedCommands.length) {
      return false;
    }

    const promises = [];
    for (const { command, match, matches } of matchedCommands) {
      promises.push(
        (async () => {
          try {
            if (await this.runPostTypeInhibitors(msg, command)) return;
            const before = command.before(msg);
            if (isPromise(before)) await before;
            await this.runCommand(msg, command, { match, matches });
          } catch (err) {
            this.emitError(err, msg, command);
          }
        })()
      );
    }

    await Promise.all(promises);
    return true;
  }

  async handleConditionalCommands(msg: Context) {
    const trueCommands = [];

    const filterPromises = [];
    for (const command of this.modules.values()) {
      if (msg.editedAt && !command.editable) continue;
      filterPromises.push(
        (async () => {
          let cond = command.condition(msg);
          if (isPromise(cond)) cond = await cond;
          if (cond) trueCommands.push(command);
        })()
      );
    }

    await Promise.all(filterPromises);

    if (!trueCommands.length) {
      return false;
    }

    const promises = [];
    for (const command of trueCommands) {
      promises.push(
        (async () => {
          try {
            if (await this.runPostTypeInhibitors(msg, command)) return;
            const before = command.before(msg);
            if (isPromise(before)) await before;
            await this.runCommand(msg, command, {});
          } catch (err) {
            this.emitError(err, msg, command);
          }
        })()
      );
    }

    await Promise.all(promises);
    return true;
  }

  async runAllTypeInhibitors(msg: Context) {
    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test('all', msg)
      : null;

    if (reason != null) {
      this.emit(Events.MESSAGE_BLOCKED, msg, reason);
    } else if (this.blockClient && msg.author.id === this.client.user.id) {
      this.emit(Events.MESSAGE_BLOCKED, msg, BuiltInReasons.CLIENT);
    } else if (this.blockBots && msg.author.bot) {
      this.emit(Events.MESSAGE_BLOCKED, msg, BuiltInReasons.BOT);
    } else if (this.hasPrompt(msg.channel, msg.author)) {
      this.emit(Events.IN_PROMPT, msg);
    } else {
      return false;
    }

    return true;
  }

  async runPreTypeInhibitors(msg) {
    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test('pre', msg)
      : null;

    if (reason != null) {
      this.emit(Events.MESSAGE_BLOCKED, msg, reason);
    } else {
      return false;
    }

    return true;
  }

  async runPostTypeInhibitors(msg: Context, cmd: CommandModule) {
    if (cmd.ownerOnly) {
      const isOwner = this.client.isOwner(msg.author);
      if (!isOwner) {
        this.emit(Events.COMMAND_BLOCKED, msg, cmd, BuiltInReasons.OWNER);
        return true;
      }
    }

    if (cmd.channel === 'guild' && !msg.guild) {
      this.emit(Events.COMMAND_BLOCKED, msg, cmd, BuiltInReasons.GUILD);
      return true;
    }

    if (cmd.channel === 'dm' && msg.guild) {
      this.emit(Events.COMMAND_BLOCKED, msg, cmd, BuiltInReasons.DM);
      return true;
    }

    if (await this.runPermissionChecks(msg, cmd)) {
      return true;
    }

    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test(
          'post',
          msg,
          (cmd as unknown) as AkairoCommand
        )
      : null;

    if (reason != null) {
      this.emit(Events.COMMAND_BLOCKED, msg, cmd, reason);
      return true;
    }

    if (await this.runCooldowns(msg, cmd)) {
      return true;
    }

    return false;
  }

  async runPermissionChecks(msg: Context, cmd: CommandModule) {
    if (cmd.clientPermissions) {
      if (typeof cmd.clientPermissions === 'function') {
        let missing = cmd.clientPermissions(msg);
        if (isPromise(missing)) missing = await missing;

        if (missing != null) {
          this.emit(Events.MISSING_PERMISSIONS, msg, cmd, 'client', missing);
          return true;
        }
      } else if (msg.guild) {
        const missing = (msg.channel as GuildChannel)
          .permissionsFor(this.client.user)
          .missing(cmd.clientPermissions);
        if (missing.length) {
          this.emit(Events.MISSING_PERMISSIONS, msg, cmd, 'client', missing);
          return true;
        }
      }
    }

    if (cmd.userPermissions) {
      const ignorer = cmd.ignorePermissions || this.ignorePermissions;
      const isIgnored = Array.isArray(ignorer)
        ? ignorer.includes(msg.author.id)
        : typeof ignorer === 'function'
        ? ignorer(msg, (cmd as unknown) as AkairoCommand)
        : msg.author.id === ignorer;

      if (!isIgnored) {
        if (typeof cmd.userPermissions === 'function') {
          let missing = cmd.userPermissions(msg);
          if (isPromise(missing)) missing = await missing;

          if (missing != null) {
            this.emit(Events.MISSING_PERMISSIONS, msg, cmd, 'user', missing);
            return true;
          }
        } else if (msg.guild) {
          const missing = (msg.channel as GuildChannel)
            .permissionsFor(msg.author)
            .missing(cmd.userPermissions);
          if (missing.length) {
            this.emit(Events.MISSING_PERMISSIONS, msg, cmd, 'user', missing);
            return true;
          }
        }
      }
    }

    return false;
  }

  async runCooldowns(msg: Context, cmd: CommandModule): Promise<boolean> {
    const ignorer = cmd.ignoreCooldown || this.ignoreCooldown;
    const isIgnored = Array.isArray(ignorer)
      ? ignorer.includes(msg.author.id)
      : typeof ignorer === 'function'
      ? ignorer(msg, (cmd as unknown) as AkairoCommand)
      : msg.author.id === ignorer;

    if (isIgnored) return false;

    const time = cmd.cooldown != null ? cmd.cooldown : this.defaultCooldown;
    if (!time) return false;

    const expire = msg.createdTimestamp + time;
    const { data } = await (msg.db = new ContextDatabase(msg)).fetch();

    let cd = data.cooldowns.find((c) => c.id === cmd.id);
    if (!cd) {
      data.cooldowns.push({ expire: cmd.manualCooldown ? 0 : expire, uses: 0, id: cmd.id });
      cd = (await data.save()).cooldowns.find((c) => c.id === cmd.id);
    }

    const diff = cmd.manualCooldown ? 0 : cd.expire - msg.createdTimestamp;
    if (cd.uses >= cmd.ratelimit && diff > 0) {
      this.emit(Events.COOLDOWN, msg, cmd, diff);
      return true;
    }

    // increment for ratelimit
    if (!cmd.manualCooldown) cd.uses++;
    if (diff < 0 && cd.uses <= 1) cd.expire = expire;
    await data.save();
    return cmd.manualCooldown;
  }

  async runCommand(
    ctx: Context,
    cmd: CommandModule,
    args: any
  ): Promise<boolean> {
    ctx.command = cmd;
    ctx.args = args;
    ctx.db = new ContextDatabase(ctx);
    if (this.commandTyping || cmd.typing) {
      ctx.channel.startTyping();
    }

    try {
      this.emit(Events.COMMAND_STARTED, ctx, cmd, args);
      try {
        const returned = await cmd.exec(ctx); // expect all commands to return strings or embed objects
        this.emit(Events.COMMAND_FINISHED, ctx, cmd, args, returned);
        if (!returned) return;
        await ctx.send(returned as MessageOptions);
      } catch (error) {
        this.emit('commandError', ctx, cmd, args, error);
      }
    } finally {
      if (this.commandTyping || cmd.typing) {
        ctx.channel.stopTyping();
      }
    }
  }

  async parseCommand(msg: Context) {
    const intoCallable = (f) => (typeof f === 'function' ? f : () => f);
    const intoArray = (x) => (Array.isArray(x) ? x : [x]);
    let prefixes: string[] = intoArray(await intoCallable(this.prefix)(msg));
    const allowMention = await intoCallable(this.prefix)(msg);
    if (allowMention) {
      const mentions = [
        `<@${this.client.user.id}>`,
        `<@!${this.client.user.id}>`,
      ];
      prefixes = [...mentions, ...prefixes];
    }

    prefixes.sort(prefixCompare);
    return this.parseMultiplePrefixes(
      msg,
      prefixes.map((p) => [p, null]) as any
    );
  }

  async parseCommandOverwrittenPrefixes(msg: Context) {
    if (!this.prefixes.size) {
      return {};
    }

    function flatMap(xs, f) {
      const res = [];
      for (const x of xs) {
        res.push(...f(x));
      }

      return f;
    }

    const intoCallable = (f) => (typeof f === 'function' ? f : () => f);
    const intoArray = (x) => (Array.isArray(x) ? x : [x]);
    const promises = this.prefixes.map(async (cmds, provider) => {
      const prefixes = intoArray(await intoCallable(provider)(msg));
      return prefixes.map((p) => [p, cmds]);
    });

    const pairs = flatMap(await Promise.all(promises), (x) => x);
    pairs.sort(([a], [b]) => prefixCompare(a, b));
    return this.parseMultiplePrefixes(msg, pairs);
  }

  parseMultiplePrefixes(msg: Context, pairs: any[]) {
    const parses = pairs.map(([prefix, cmds]) =>
      this.parseWithPrefix(msg, prefix, cmds)
    );
    const result = parses.find((parsed) => parsed.command);
    if (result) {
      return result;
    }

    const guess = parses.find((parsed) => parsed.prefix != null);
    if (guess) {
      return guess;
    }

    return {};
  }

  parseWithPrefix(
    msg: Context,
    prefix: string,
    associatedCommands: Set<string> = null
  ) {
    const lowerContent = msg.content.toLowerCase();
    if (!lowerContent.startsWith(prefix.toLowerCase())) {
      return {};
    }

    const endOfPrefix =
      lowerContent.indexOf(prefix.toLowerCase()) + prefix.length;
    const startOfArgs =
      msg.content.slice(endOfPrefix).search(/\S/) + prefix.length;
    const alias = msg.content.slice(startOfArgs).split(/\s{1,}|\n{1,}/)[0];
    const command = this.findCommand(alias);
    const content = msg.content.slice(startOfArgs + alias.length + 1).trim();
    const afterPrefix = msg.content.slice(prefix.length).trim();

    if (!command) {
      return { prefix, alias, content, afterPrefix };
    }

    if (associatedCommands == null) {
      if (command.prefix != null) {
        return { prefix, alias, content, afterPrefix };
      }
    } else if (!associatedCommands.has(command.id)) {
      return { prefix, alias, content, afterPrefix };
    }

    return { command, prefix, alias, content, afterPrefix };
  }

  emitError(err: Error, msg: Context, cmd?: CommandModule) {
    if (cmd && cmd.typing) msg.channel.stopTyping();
    if (this.listenerCount(Events.ERROR)) {
      this.emit(Events.ERROR, err, msg, cmd);
      return;
    }

    throw err;
  }

  sweepCommandUtil(lifetime: number = this.commandUtilLifetime) {
    let count = 0;
    for (const commandUtil of this.commandUtils.values()) {
      const now = Date.now();
      const msg = commandUtil.message;
      if (now - (msg.editedTimestamp || msg.createdTimestamp) > lifetime) {
        count++;
        this.commandUtils.delete(msg.id);
      }
    }

    return count;
  }

  addPrompt(channel: Channel, user: UserPlus) {
    let users = this.prompts.get(channel.id);
    if (!users) this.prompts.set(channel.id, new Set());
    users = this.prompts.get(channel.id);
    users.add(user.id);
  }

  removePrompt(channel: Channel, user: UserPlus) {
    const users = this.prompts.get(channel.id);
    if (!users) return;
    users.delete(user.id);
    if (!users.size) this.prompts.delete(user.id);
  }

  hasPrompt(channel: Channel, user: UserPlus) {
    const users = this.prompts.get(channel.id);
    if (!users) return false;
    return users.has(user.id);
  }

  findCommand(name: string) {
    return this.modules.get(this.aliases.get(name.toLowerCase()));
  }

  useInhibitorHandler(inhibitorHandler: InhibitorHandler) {
    this.inhibitorHandler = inhibitorHandler;
    this.resolver.inhibitorHandler = inhibitorHandler;

    return this;
  }

  useListenerHandler(
    listenerHandler: ListenerHandler<Listener<this['client']>>
  ) {
    this.resolver.listenerHandler = listenerHandler;

    return this;
  }

  basePredicate(msg: Context, cmd: CommandModule): boolean {
    const g = this.client.guilds.cache.get('691416705917779999');
    const byp = g.roles.cache.get('692941106475958363');
    return (
      msg.member.roles.cache.has(byp.id) || this.client.isOwner(msg.author.id)
    );
  }
}
