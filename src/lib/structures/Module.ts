import { 
	AkairoModule,
	AkairoModuleOptions 
} from 'discord-akairo'

export class Module extends AkairoModule implements Akairo.Module {
	public client: Akairo.Client;
	public handler: Akairo.ModuleHandler;
	public constructor(id: string, options: AkairoModuleOptions) {
		super(id, options);
	}
}