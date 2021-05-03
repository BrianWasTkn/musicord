import { QuestHandler, ModulePlus } from '..';
import { Context } from 'lib/extensions';

const priority = {
	Extreme: 1,
	Difficult: 2,
	Hard: 3,
	Medium: 4,
	Easy: 5,
};

const emojis = {
	Extreme: ':fire:',
	Difficult: ':dragon:',
	Hard: ':bomb:',
	Medium: ':leaves:',
	Easy: ':snowflake:'
};

export abstract class Quest extends ModulePlus {
	public handler: QuestHandler<this>;
	public rawDiff: Handlers.Quest.Difficulty;
	public rewards: Handlers.Quest.Rewards;
	public target: Handlers.Quest.Target;
	public emoji: string;
	public diff: number;
	public info: string;
	public name: string;

	public constructor(id: string, opt: Handlers.Quest.Constructor) {
		super(id, { category: opt.category });

		this.rawDiff = opt.difficulty;
		this.rewards = opt.rewards;
		this.target = opt.target;
		this.diff = priority[opt.difficulty];
		this.emoji = emojis[opt.difficulty];
		this.info = opt.info;
		this.name = opt.name;
	}

	public check(ctx: Context, args: Handlers.Quest.CheckArgs): PromiseUnion<boolean> {
		const aq = ctx.db.data.quest;

		if (args.cmd.id !== this.target[1]) return false;
		if (aq.type !== this.target[2]) return false;
		if (aq.count < this.target[0]) return false;

		return true;
	}
}

export default Quest;