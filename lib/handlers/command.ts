import {
  CommandHandlerOptions as HandlerOptions,
  CommandHandler as AkairoCommandHandler,
  CommandOptions as AkairoCommandOptions,
  Command as AkairoCommand,
  DefaultArgumentOptions,
  Constants,
  Category,
} from 'discord-akairo';
import { MessageOptions, Collection, Message } from 'discord.js';
import { Util } from '@lib/utility/util';
import { Lava } from '@lib/Lava';
const { CommandHandlerEvents: Events } = Constants;

// Custom Types
export type ExamplePredicate = (msg: Message) => string;
export interface CommandHandlerOptions extends HandlerOptions {
  commandTyping?: boolean;
}
export interface CommandOptions extends AkairoCommandOptions {
  examples?: string | ExamplePredicate | (string | ExamplePredicate)[];
}

export class Command extends AkairoCommand {
  examples: CommandOptions['examples'];
  handler: CommandHandler<Command>;
  client: Lava;

  constructor(id: string, opts: CommandOptions) {
    super(id, opts);
    this.examples = opts.examples;
  }

  exec(
    message: Message,
    args: any
  ): string | MessageOptions | Promise<string | MessageOptions> {
    return {
      embed: {
        title: 'What ya doing?',
        description: 'This command exists but is not done yet, bro.',
        color: 'BLURPLE',
      },
    };
  }

  async sleep(ms: number): Promise<number> {
    const num = await this.client.util.sleep(ms);
    return num;
  }

  codeBlock(lang: string = 'js', content: any): string {
    return `${'```'}${lang}\n${content}\n${'```'}`;
  }
}

export class CommandHandler<
  CommandModule extends Command
> extends AkairoCommandHandler {
  commandTyping: boolean;
  categories: Collection<string, Category<string, CommandModule>>;
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
      prefix: (msg: Message) => this._prefixPredicate(msg),
      ignoreCooldown: (msg: Message, cmd: CommandModule) =>
        this._ignoreCooldownPredicate(msg, cmd),
      ignorePermissions: (msg: Message, cmd: CommandModule) =>
        this._ignorePermissionPredicate(msg, cmd),
    });
    this.commandTyping = commandTyping;
  }

  _prefixPredicate(msg: Message): string | string[] {
    return this.client.config.bot.prefix;
  }

  _ignoreCooldownPredicate(msg: Message, cmd: CommandModule): boolean {
    const guild = this.client.guilds.cache.get('691416705917779999');
    const staff = guild.roles.cache.get('692941106475958363');
    return msg.guild.id === guild.id && msg.member.roles.cache.has(staff.id);
  }

  _ignorePermissionPredicate(msg: Message, cmd: CommandModule): boolean {
    const guild = this.client.guilds.cache.get('691416705917779999');
    const staff = guild.roles.cache.get('692941106475958363');
    return msg.guild.id === guild.id && msg.member.roles.cache.has(staff.id);
  }

  findCommand(name: string): Command {
    return this.modules.get(this.aliases.get(name.toLowerCase()));
  }

  async runCommand(
    message: Message,
    command: CommandModule,
    args: any[]
  ): Promise<void> {
    const { util } = this.client;

    if (this.commandTyping || command.typing) {
      await message.channel.startTyping();
    }

    try {
      this.emit(Events.COMMAND_STARTED, message, command, args);
      try {
        const returned = util.isPromise(command.exec)
          ? (await command.exec(message, args))
          : command.exec(message, args); // expect all commands to return strings or embed objects
        console.log(util.isPromise(returned) ? (await returned) : returned);
        // this.emit(Events.COMMAND_FINISHED, message, command, args, returned);
      } catch (error) {
        this.emit('commandError', message, command, args, error);
      }
    } finally {
      if (this.commandTyping || command.typing) {
        await message.channel.stopTyping();
      }
    }
  }
}
