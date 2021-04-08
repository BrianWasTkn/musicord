import { CooldownData } from '@lib/interface/mongo/currency/currencyprofile';
import { MessagePlus } from '@lib/extensions/message';
import { Util } from '@lib/utility/util';
import { Lava } from '@lib/Lava';
import {
  CommandHandlerOptions as HandlerOptions,
  CommandHandler as AkairoCommandHandler,
  CommandOptions as AkairoCommandOptions,
  Command as AkairoCommand,
  DefaultArgumentOptions,
  Constants,
  Category,
} from 'discord-akairo';
import { 
  MessageOptions, 
  MessageEmbed, 
  Collection, 
  Message,
} from 'discord.js';

const { CommandHandlerEvents: Events, BuiltInReasons } = Constants;

// Local Types
export type ExamplePredicate = (msg: MessagePlus) => string | string[];
export type CommandReturn = void | string | MessageOptions;

export interface CommandHandlerOptions extends HandlerOptions {
	commandTyping?: boolean;
}
export interface CommandOptions extends AkairoCommandOptions {
	examples?: string | string[] | ExamplePredicate;
}

export class Command extends AkairoCommand {
  // @ts-ignore
  handler: CommandHandler<Command>;
  client: Lava;

  constructor(id: string, opts: CommandOptions) {
    super(id, opts);
  }

  exec(msg: MessagePlus, args?: any): CommandReturn | Promise<CommandReturn> {
    return {
      embed: {
        title: 'What ya doing?',
        description: 'This command exists but is not done yet, bro.',
        color: 'BLURPLE',
      },
    };
  }
}

export class CommandHandler<
  CommandModule extends Command
> extends AkairoCommandHandler {
  commandTyping: boolean;
// @ts-ignore
  categories: Collection<string, Category<string, CommandModule>>;
// @ts-ignore
  modules: Collection<string, CommandModule>;
  client: Lava;

  constructor(
    client: Lava,
    {
      directory = './commands',
      handleEdits = true,
      commandUtil = true,
      allowMention = true,
      classToHandle = Command,
      commandTyping = false,
      defaultCooldown = 1500,
      aliasReplacement = /(-|\.)/gi,
      automateCategories = true,
    }: CommandHandlerOptions
  ) {
    super(client, {
      directory,
      handleEdits,
      commandUtil,
      allowMention,
      classToHandle,
      defaultCooldown,
      aliasReplacement,
      automateCategories,
      prefix: (msg: MessagePlus) => 
        this.prefixPredicate(msg),
      // @ts-ignore
      ignoreCooldown: (msg: MessagePlus, cmd: CommandModule) =>
        this.basePredicate(msg, cmd),
      // @ts-ignore
      ignorePermissions: (msg: MessagePlus, cmd: CommandModule) =>
        this.basePredicate(msg, cmd),
    });

    this.commandTyping = Boolean(commandTyping);
  }

  // @ts-ignore
  findCategory(thing: string) {
    return this.categories.get(thing)
    || this.categories.find(c => c.id.toLowerCase() === thing.toLowerCase())
    || this.categories.find(c => c.id.toLowerCase().includes(thing.toLowerCase()));
  }

  basePredicate(msg: MessagePlus, cmd: CommandModule): boolean {
    const g = this.client.guilds.cache.get('691416705917779999');
    const byp = g.roles.cache.get('692941106475958363');
    return (
      msg.member.roles.cache.has(byp.id) 
      || this.client.isOwner(msg.author.id)
    );
  }

  prefixPredicate(msg: MessagePlus): string | string[] {
    return this.client.config.bot.prefix;
  }

  // @ts-ignore
  findCommand(name: string): CommandModule {
    return this.modules.get(this.aliases.get(name.toLowerCase()));
  }

  // @ts-ignore
  async runCommand(
    message: MessagePlus,
    command: CommandModule,
    args: any[]
  ): Promise<any> {
    try {
      this.emit(Events.COMMAND_STARTED, message, command, args);
      try {
        const returned = await command.exec(message, args); // expect all commands to return strings or embed objects
        this.emit(Events.COMMAND_FINISHED, message, command, args, returned);
        if (!returned) return;
        await message.channel.send(returned as MessageOptions);
      } catch (error) {
        this.emit('commandError', message, command, args, error);
      }
    } finally {
      if (this.commandTyping || command.typing) {
        message.channel.stopTyping();
      }
    }
  }

  async runPostTypeInhibitors(message: MessagePlus, command: AkairoCommand) {
    if (command.ownerOnly) {
      const isOwner = this.client.isOwner(message.author);
      if (!isOwner) {
        this.emit(Events.COMMAND_BLOCKED, message, command, BuiltInReasons.OWNER);
        return true;
      }
    }

    if (command.channel === 'guild' && !message.guild) {
        this.emit(Events.COMMAND_BLOCKED, message, command, BuiltInReasons.GUILD);
        return true;
    }

    if (command.channel === 'dm' && message.guild) {
        this.emit(Events.COMMAND_BLOCKED, message, command, BuiltInReasons.DM);
        return true;
    }

    if (await this.runPermissionChecks(message, command)) {
        return true;
    }

    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test('post', message, command)
      : null;

    if (reason != null) {
      this.emit(Events.COMMAND_BLOCKED, message, command, reason);
      return true;
    }

    if (await this.runCooldowns(message, command as unknown as CommandModule)) {
        return true;
    }

    return false;
  }

  // @ts-ignore
  async runCooldowns(msg: MessagePlus, cmd: CommandModule): Promise<boolean> {
    const ignorer = cmd.ignoreCooldown || this.ignoreCooldown;
    const isIgnored = Array.isArray(ignorer)
      ? ignorer.includes(msg.author.id)
      : typeof ignorer === 'function'
        ? ignorer(msg, cmd as unknown as AkairoCommand)
        : msg.author.id === ignorer;

    if (isIgnored) return false;

    const time = cmd.cooldown != null ? cmd.cooldown : this.defaultCooldown;
    if (!time) return false;

    const expire = msg.createdTimestamp + time;
    const data = await msg.author.fetchDB();

    let cd = data.cooldowns.find(c => c.id === cmd.id);
    if (!cd) {
      data.cooldowns.push({ expire, uses: 0, id: cmd.id });
      cd = (await data.save()).cooldowns.find(c => c.id === cmd.id);
    }

    const diff = cd.expire - msg.createdTimestamp;
    if (cd.uses >= cmd.ratelimit && diff > 0) {
      this.emit(Events.COOLDOWN, msg, cmd, diff);
      return true;
    }

    // increment for ratelimit
    cd.uses++;
    if (diff < 0) cd.expire = expire;
    await data.save();
    return false;
  }
}
