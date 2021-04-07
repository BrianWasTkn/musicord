import { Collection, GuildMember, TextChannel, Guild, Role } from 'discord.js';
import { QuestOptions, QuestReward } from '@lib/interface/handlers/quest';
import { EventEmitter } from 'events';
import { MessagePlus } from '@lib/extensions/message';
import { LottoConfig } from '@config/lottery';
import { Lava } from '../Lava';

export class LotteryHandler extends EventEmitter {
  client: Lava;

  ticked: boolean;

  requirement: string;
  interval: number;
  rewards: LottoConfig['rewards'];
  channel: string;
  guild: string;

  constructor(client: Lava) {
    super();
    this.client = client;
    this.ticked = false;
    this.prepare();
  }

  prepare() {
  	return this.client.once('ready', async () => {
      const { channelID, guildID, interval, rewards, requirementID } = this.client.config.lottery;
  		
      this.requirement = requirementID;
      this.interval = Number(interval);
      this.channel = channelID;
      this.rewards = rewards;
      this.guild = guildID;

      this.emit('patch', this);
      await this.startClock(new Date());
  	});
  }

  startClock(date: Date) {
    const left = 60 - date.getMinutes();
    this.client.util.console({ 
      type: 'def', klass: 'Lottery',
      msg: `Lotto clock starting in ${left} minutes.` 
    });

    return this.tick(Boolean(left));
  }

  async tick(first: boolean) {
    let catchup = first;
    let now = new Date();

    return this.client.setTimeout(async () => {
      // The 60-second tick
      const tick = `${now.getHours()}:${LotteryHandler.pad(now.getMinutes())}`;
      const remaining = 60 - now.getMinutes();

      // Immediate roll if catching up (let's say, bot login)
      if (catchup) {
        const { winner, coins, raw } = await this.roll();
        this.emit('roll', this, winner, coins, raw);
        catchup = false;
      }

      // Tick
      if (now.getSeconds() === 0) {
        const __tick__ = this.emit('tick', this, tick, remaining);
        if (!this.ticked) this.ticked = __tick__;
        if (this.ticked) this.runInterval.call(this);
        console.log({ ticked: this.ticked, __tick__ });
      }

      // Roll Interval at HH:00 (0 minutes) for interval
      // if (this.ticked && now.getMinutes() === 0) {
      //   this.runInterval.call(this);
      // }

      return this.tick(false);
    }, ((60 - now.getSeconds()) * 1e3) - now.getMilliseconds());
  }

  async runInterval() {
    return this.client.setTimeout(async () => {
      const { winner, coins, raw } = await this.roll();
      this.emit('roll', this, winner, coins, raw);
      console.log({ winner, coins, raw }); // debug
      return await this.runInterval();
    }, this.interval);
  }

  async roll() {
    const guild = await this.client.guilds.fetch(this.guild);
    const members = guild.members.cache.array();

    const { randomNumber, randomInArray } = this.client.util;
    const { cap, min, max } = this.rewards;
    const { requirement } = this;

    const { coins, raw, multi } = LotteryHandler.calcCoins(min, max, cap);
    const hasRole = (m: GuildMember, r: string) => m.roles.cache.has(r) && !m.user.bot;
    const winner = randomInArray([...members.values()].filter(m => hasRole(m, requirement)));

    return { winner, coins, raw, multi };
  }

  static pad(int: number): string {
    if (int < 10) return `0${int}`;
    else return int.toString();
  }

  static calcCoins(min: number, max: number, cap: number) {
    const randomNumber = (a: number, b: number) => Math.floor(Math.random() * (max - min + 1) + min);
    
    let odds = Math.random();
    let coins = randomNumber(min, max);
    let raw = coins;
    let multi: number;

    function getMulti() {
      switch(true) {
        case odds > 0.9:
          return randomNumber(91, 100); // 10 (differences for all odds)
        case odds > 0.8:
          return randomNumber(76, 90); // 15
        case odds > 0.6:
          return randomNumber(51, 75); // 25
        case odds > 0.5:
          return randomNumber(26, 50); // 25
        case odds > 0.3:
          return randomNumber(11, 25); // 15
        default:
          return randomNumber(1, 10); // 10
      }
    }

    multi = getMulti();
    coins += Math.ceil(coins * (multi / 100));
    coins = Math.min(cap, coins);

    return { coins, raw, multi };
  }
}
