import { 
	AkairoHandler,
	AkairoHandlerOptions,
	AkairoModule
} from 'discord-akairo'
import { 
	Collection 
} from 'discord.js'

class Module extends AkairoModule {}

export default class ModuleHandler extends AkairoHandler {
	public modules: Collection<string, Module>;
	public client: Akairo.Client;
	public constructor(client: Akairo.Client, options: AkairoHandlerOptions) {
		super(client, options);
	}
}