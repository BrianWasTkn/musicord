import { 
	AkairoModule, 
	AkairoModuleOptions 
} from 'discord-akairo'

export class Module extends AkairoModule implements Akairo.Module {
	public constructor(
		id: string, public options: Akairo.ModuleOptions
	) {
		super(id, options);
	}
}