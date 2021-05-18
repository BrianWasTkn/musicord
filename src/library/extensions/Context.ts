import { MemberPlus, UserPlus } from '.';
import { Command, Quest } from 'lib/objects';
import { Currency } from 'lib/utility/constants';
import { Effects } from 'lib/utility/effects';
import { Lava } from 'lib/Lava';
import config from 'config/index';
import {
	MessageCollectorOptions,
	MessageEmbedOptions,
	TextBasedChannel,
	CollectorFilter,
	MessageOptions,
	GuildChannel,
	MessageEmbed,
	NewsChannel,
	TextChannel,
	GuildMember,
	Structures,
	Collection,
	DMChannel,
	Message,
	Channel,
	Base,
} from 'discord.js';

type TextableChannel = DMChannel | TextChannel | NewsChannel;
type Constructor = [Lava, object, TextableChannel];

export class Context<Args extends {} = {}> extends Message {
	public channel: TextableChannel;
	public db: ContextDatabase;
	public member: MemberPlus;
	public command: Command;
	public author: UserPlus;
	public client: Lava;
	public args: Args;

	public constructor(...args: Constructor) {
		super(...args);
		this.command = null;
		this.args = Object.create(null);
		this.db = new ContextDB(this);
	}

	say(content: string) {
		return this.channel.send.call(this.channel, { content }, null);
	}

	send(args: MessageOptions) {
		return this.channel.send.call(this.channel, args, null);
	}

	embed(embed?: MessageEmbedOptions) {
		return this.channel.send.call(this.channel, { embed }, undefined);
	}

	fetchMember(id: string = null, force = false, limit?: number) {
		return this.guild?.members.fetch({
			user: id != null ? id : this.member.user.id,
			force,
			limit,
		});
	}

	fetchMessage(id: string = null, cache = false, force = false) {
		return this.channel.messages.fetch(id != null ? id : this.id);
	}

	awaitMessage(user = this.author.id, time = 3e4) {
		const options: MessageCollectorOptions = { max: 1, time };
		const filter: CollectorFilter<[Context]> = ({ author }) => user === author.id;
		return this.channel.awaitMessages.call(this.channel, filter as ((m: Message) => boolean), options);
	}

	toString() {
		return `[${this.constructor.name} ${this.author?.id}]`;
	}
}

export class ContextDatabase extends Base {
	public readonly client: Lava;
	public readonly saved: boolean;
	public readonly ctx: Context;
	public data: CurrencyProfile;

	public constructor(ctx: Context) {
		super(ctx.client);
		this.saved = false;
		this.data = Object.create(null);
		this.ctx = ctx;
	}

	private async init(userID: string, assign: boolean): Promise<this> {
		const data = await this.ctx.client.db.currency.fetch(userID);
		const temp = new ContextDB(this.ctx);
		(assign ? this : temp).data = data;
		return assign ? this : temp as this;
	}

	fetch(id = this.ctx.author.id, assign = true) {
		return this.init(id, assign);
	}

	get banned() {
		if (!this.data) this._reportError();
		return this.data.banned;
	}

	//# Single-Return methods
	hasInventoryItem(id: string) {
		if (!this.data) this._reportError();
		return !!this.data.items.find(i => i.id === id);
	}

	//# Loopable methods 
	addCd(cmd = this.ctx.command, time?: number) {
		if (!this.data) this._reportError();
		if (this.client.isOwner(this.ctx.author.id)) return this;

		const expire = this.ctx.createdTimestamp + (typeof time !== 'undefined' ? time : cmd.cooldown);
		const cd = this.data.cooldowns.find(c => c.id === cmd.id);
		
		if (!cd) {
			this.data.cooldowns.push({ expire, uses: 0, id: cmd.id });
			return this;
		}

		cd.expire = expire;
		return this;
	}

	addPremiumKeys(amount: number): this {
		if (!this.data) this._reportError();
		this.data.prem += amount;
		return this;
	}

	removePremiumKeys(amount: number): this {
		if (!this.data) this._reportError();
		this.data.prem -= amount;
		return this;
	}

	addPocket(amount: number): this {
		if (!this.data) this._reportError();
		this.data.pocket = Math.round(this.data.pocket + amount);
		return this;
	}

	removePocket(amount: number): this {
		if (!this.data) this._reportError();
		this.data.pocket = Math.round(this.data.pocket - amount);
		return this;
	}

	addXp(amount = 1): this {
		if (!this.data) this._reportError();
		this.data.stats.xp += amount;
		return this;
	}

	removeXp(amount = 1): this {
		if (!this.data) this._reportError();
		this.data.stats.xp += amount;
		return this;
	}

	deposit(amount: number) {
		if (!this.data) this._reportError();
		this.data.pocket = Math.round(this.data.pocket - amount);
		this.data.vault = Math.round(this.data.vault + amount);
		return this;
	}

	withdraw(amount: number) {
		if (!this.data) this._reportError();
		this.data.pocket = Math.round(this.data.pocket + amount);
		this.data.vault = Math.round(this.data.vault - amount);
		return this;
	}

	expandSpace(amount: number) {
		if (!this.data) this._reportError();
		this.data.space += amount;
		return this;
	}

	beingHeisted(bool = true) {
		if (!this.data) this._reportError();
		this.data.misc.beingHeisted = bool;
		return this;
	}

	calcXP(vaultOffset = 55, vaultLimit = Currency.MAX_SAFE_SPACE, xpLimit = Currency.MAX_LEVEL * 100) {
		if (!this.data) this._reportError();
		const calc = (b: number) => Math.round(vaultOffset * (b / 2) + vaultOffset);
		this.data.space = Math.min(Math.trunc(this.data.space + calc(this.data.stats.prestige)), vaultLimit);
		this.data.stats.xp = Math.min(xpLimit, this.data.stats.xp + this.client.util.randomNumber(1, 4));
		return this;
	}

	calcSpace(offset: number = 55, boost: number = 1, limit: number = Currency.MAX_SAFE_SPACE) {
		if (!this.data) this._reportError();
		const calc = (boosty: number) => Math.round(offset * (boosty / 2) + offset);
		this.data.space = Math.min(Math.ceil(this.data.space + calc(boost)), limit);
		this.data.stats.xp += this.client.util.randomNumber(1, 4);
		return this;
	}

	recordDailyStreak(stamp = Date.now()) {
		if (!this.data) this._reportError();
		this.data.daily.time = stamp;
		return this;
	}

	addDailyStreak() {
		if (!this.data) this._reportError();
		this.data.daily.streak++;
		return this;
	}

	resetDailyStreak() {
		if (!this.data) this._reportError();
		this.data.daily.streak = 1;
		return this;
	}

	startQuest(id: string, args: { type: Handlers.Quest.TargetMethod, target: number }) {
		if (!this.data) this._reportError();
		this.data.quest.id = id;
		this.data.quest.count = 0;
		this.data.quest.type = args.type;
		this.data.quest.target = args.target;
		return this;
	}

	updateQuest(args: Handlers.Quest.CheckArgs) {
		if (!this.data) this._reportError();
		const { modules: quests } = this.client.handlers.quest;
		const { quest: aq } = this.data;
		if (!quests.get(aq.id)) return this;

		const mod = quests.get(aq.id);
		if (args.cmd.id !== mod.target[1]) return this;
		aq.count += args.count;

		if (aq.count >= mod.target[0]) {
			const item = this.client.handlers.item.modules.get(mod.rewards.item[1]);
			const coinR = mod.rewards.coins.toLocaleString();
			const itemR = `${mod.rewards.item[0]} ${item.emoji} ${item.name}`;

			const inv = item.findInv(this.data.items, item);
			this.addInv(item.id, mod.rewards.item[0]).addPocket(mod.rewards.coins).stopQuest();
			this.client.handlers.quest.emit('done', { ctx: this.ctx, quest: mod, itemR, coinR });
			
			return this;
		}

		return this;
	}

	stopQuest() {
		if (!this.data) this._reportError();
		if (!this.data.quest.id) return this;
		this.data.quest.count = this.data.quest.target = 0;
		this.data.quest.id = this.data.quest.type = '';
		return this;
	}

	updateStats(key: keyof Currency.Stats, amount = 1) {
		if (!this.data) this._reportError();
		this.data.stats[key as keyof Currency.Stats] += amount;
		return this;
	}

	updateCommand(cmd = this.ctx.command, stamp = Date.now()) {
		if (!this.data) this._reportError();
		this.data.lastCmd = cmd.aliases[0];
		this.data.lastRan = stamp;
		return this;
	}

	addInv(item: string, amount = 1) {
		if (!this.data) this._reportError();
		const module = this.client.handlers.item.modules.get(item);
		const inv = module.findInv(this.data.items, module);
		inv.amount += amount;
		return this;
	}

	removeInv(item: string, amount = 1) {
		if (!this.data) this._reportError();
		const module = this.client.handlers.item.modules.get(item);
		const inv = module.findInv(this.data.items);
		inv.amount -= amount;
		return this;
	}

	updateInv(id: string, { active, expire, multi }: {
		active?: boolean,
		expire?: number,
		multi?: number
	}) {
		if (!this.data) this._reportError();
		const find = (i: Currency.InventorySlot) => i.id === id;
		const inv = this.data.items.find(find);
		if (active === true) inv.active = active;
		if (expire >= 0) inv.expire = expire;
		if (multi >= 0) inv.multi = multi;
		return this;
	}

	marry(id: string) {
		if (!this.data) this._reportError();
		this.data.marriage.since = Date.now();
		this.data.marriage.id = id;
		return this;
	}

	divorce() {
		if (!this.data) this._reportError();
		this.data.marriage.since = 0;
		this.data.marriage.id = '';
		return this;
	}

	updateItems() {
		const { util: { effects }, handlers: { item: handler } } = this.client;
		const call = () => new Effects();
		const eff = call();

		loop:
		for (const item of handler.modules.values()) {
			const inv = item.findInv(this.data.items, item);
			const trigger: { [it: string]: () => Effects } = {
				brian: () => eff.addSlotJackpotOdd(5),
				crazy: () => eff.addSlotJackpotOdd(5),
				thicc: () => eff.addGambleWinnings(0.2),
				thicm: () => eff.addBlackjackWinnings(0.2),
				dragon: () => eff.addDiceRoll(1),
			};

			if (item.checks.includes('time')) {
				if (inv.expire >= Date.now() && typeof trigger[item.id] !== 'undefined') {
					trigger[item.id]();
				} else {
					const params = { active: false, expire: 0, multi: 0 };
					this.updateInv(inv.id, params);
				}
			}
			if (item.checks.includes('presence') && inv.amount >= 1) {
				// @TODO: presence method for items with 
				// this check type and notify user it broke
				
				// Dragon
				if (item.id === 'dragon') {
					if (Math.random() <= 0.1) this.removeInv(item.id, 1);
					else trigger[item.id]();
				}
			}

			const temp = new Collection<string, Effects>();
			const { id } = this.ctx.author;
			if (effects.has(id)) {
				const effs = effects.get(id);
				temp.set(item.id, call());
				effects.get(id).set(item.id, eff);

				if ( // item checks if in inventory but amount is already 0
					(item.checks.includes('presence') && inv.amount <= 0) ||
					// item checks time but now > expire
					(item.checks.includes('time') && Date.now() > inv.expire)
				) { effects.get(id).delete(item.id); }
			} else {
				const useref = effects.get(id);
				if (!useref || useref.has(item.id)) {
					const meh = new Collection<string, Effects>();
					meh.set(item.id, eff);
					effects.set(id, meh);
				}
			}
		}

		return this;
	}

	// melmsie pls-
	save(addPls = false, saveCommand = false): Promise<CurrencyProfile> {
		if (!this.data) this._reportError();
		if (addPls) this.data.cmdsRan++;
		if (saveCommand) this.updateCommand();
		return this.data.save();
	}

	private _reportError() {
		throw new Error(`[${this.toString()}] property "db" hasn't been assigned.`);
	}

	toString() {
		return `[${typeof this}: ${this.constructor.name}]`;
	}
}

// Circular 
const ContextDB = ContextDatabase;

export default () => Structures.extend('Message', () => Context);