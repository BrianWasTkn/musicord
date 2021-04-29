import { Item, Command } from 'lib/handlers';
import { TargetMethod } from 'lib/interface/handlers/quest';

declare global {
	namespace Handlers {
		interface QuestArgs {
			target?: TargetMethod;
			count?: number;			
			item?: Item;
			cmd?: Command;
		}
	}
}