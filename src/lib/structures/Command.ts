import { 
	Command as AkairoCommand,
	CommandOptions as AkairoCommandOptions
} from 'discord-akairo'
import {
	Message
} from 'discord.js'

export interface LavaCommandOptions extends AkairoCommandOptions {
	examples?: string[] | string | ExampleSupplier
	nsfw?: boolean | NSFWSupplier
	userPerms?: AkairoCommandOptions['userPermissions']
	botPerms?: AkairoCommandOptions['clientPermissions']
	premium?: boolean
}

export type ExampleSupplier = (message: Message) => string
export type NSFWSupplier = (message: Message) => string

export class Command extends AkairoCommand {
	public client: Akairo.Client
	public userPerms?: LavaCommandOptions['userPerms']
	public botPerms?: LavaCommandOptions['botPerms']
	public examples?: LavaCommandOptions['examples']
	public premium?: LavaCommandOptions['premium']
	public nsfw?: LavaCommandOptions['nsfw']

	constructor(id: string, options: LavaCommandOptions) {
		super(id, options);

		this.examples = options.examples;
		this.nsfw = Boolean(options.nsfw) || false;
		this.userPermissions = options.userPermissions || options.userPerms
		this.clientPermissions = options.clientPermissions || options.botPerms;
		this.premium = Boolean(options.premium) || false; // Premium = Booster atm.
	}
}