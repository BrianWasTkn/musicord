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
import { MessageOptions, MessageEmbed, Collection, Message } from 'discord.js';

const { CommandHandlerEvents: Events } = Constants;

export interface CommandHandlerOptions extends HandlerOptions {
  commandTyping?: boolean;
}
export interface CommandOptions extends AkairoCommandOptions {
  examples?: string | string[];
}

export type CommandReturn =
  | void
  | string
  | MessageEmbed
  | MessageOptions
  | Promise<string | MessageOptions | MessageEmbed>;

export class Command extends AkairoCommand {
  handler: CommandHandler<Command>;
  client: Lava;

  constructor(id: string, opts: CommandOptions) {
    super(id, opts);
  }

  exec(msg: MessagePlus, args: any): CommandReturn {
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
      prefix: (msg: MessagePlus) => this.prefPred(msg),
      ignoreCooldown: (msg: MessagePlus, cmd: CommandModule) =>
        this.basePredicate(msg, cmd),
      ignorePermissions: (msg: MessagePlus, cmd: CommandModule) =>
        this.basePredicate(msg, cmd),
    });

    this.commandTyping = commandTyping;
  }

  basePredicate(msg: MessagePlus, cmd: CommandModule): boolean {
    const g = this.client.guilds.cache.get('691416705917779999');
    const byp = g.roles.cache.get('692941106475958363');
    return (
      msg.member.roles.cache.has(byp.id) || this.client.isOwner(msg.author.id)
    );
  }

  prefPred(msg: MessagePlus): string | string[] {
    return this.client.config.bot.prefix;
  }

  findCommand(name: string): CommandModule {
    return this.modules.get(this.aliases.get(name.toLowerCase()));
  }

  async runCommand(
    message: MessagePlus,
    command: CommandModule,
    args: any[]
  ): Promise<void> {
    const { util } = this.client;

    if (util.cmdQueue.has(message.author.id)) {
      return;
    }

    if (this.commandTyping || command.typing) {
      message.channel.startTyping();
    }

    try {
      this.emit(Events.COMMAND_STARTED, message, command, args);
      try {
        const returned = await command.exec(message, args); // expect all commands to return strings or embed objects
        this.emit(Events.COMMAND_FINISHED, message, command, args, returned);
      } catch (error) {
        this.emit('commandError', message, command, args, error);
      }
    } finally {
      if (this.commandTyping || command.typing) {
        message.channel.stopTyping();
      }
    }
  }

  runCooldowns(msg: MessagePlus, cmd: CommandModule) {
    const time = cmd.cooldown != null ? cmd.cooldown : this.defaultCooldown;
    if (!time) return false;

    // TODO: Database Cooldowns
    if (time < 30000) return super.runCooldowns(msg, cmd);
    return true;
  }
}
