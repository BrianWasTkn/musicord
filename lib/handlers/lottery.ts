import { Collection, GuildMember, TextChannel, Guild, Role } from 'discord.js';
import { QuestOptions, QuestReward } from 'lib/interface/handlers/quest';
import { EventEmitter } from 'events';
import { LottoConfig } from 'config/lottery';
import config from 'config/index' ;
import { Lava } from '../Lava';

export class LotteryHandler extends EventEmitter {
  client: Lava;

  // helpers
  intIsRunning: boolean;
  lastRoll: number;
  nextRoll: number;
  ticked: boolean;

  // lotto
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
      const {
        channelID,
        guildID,
        interval,
        rewards,
        requirementID,
      } = config.lottery;

      this.requirement = requirementID;
      this.interval = Number(interval);
      this.channel = channelID;
      this.rewards = rewards;
      this.guild = guildID;

      this.intIsRunning = false;
      this.ticked = false;

      this.emit('patch', this);
      this.startClock(new Date());
    });
  }

  startClock(date: Date) {
    const left = 60 - date.getMinutes();
    this.client.util.console({
      type: 'def',
      klass: 'Lottery',
      msg: `Lotto clock starting in ${left} minutes.`,
    });

    return this.tick(Boolean(left));
  }

  tick(first: boolean) {
    let catchup = first;
    let now = new Date();

    if (!this.ticked) {
      this.client.util.console({
        type: 'def',
        klass: 'Lottery',
        msg: `Ticking in ${60 - now.getSeconds()} seconds.`,
      });
    }

    return setTimeout(async () => {
      // The 60-second tick
      now = new Date(); // reassign to prevent unnecessary infinite loops
      const tick = `${now.getHours()}:${LotteryHandler.pad(now.getMinutes())}`;
      const remaining = 60 - now.getMinutes();

      // Immediate roll if catching up (let's say, bot login)
      if (catchup) {
        const { winner, coins, raw, multi } = this.roll();
        this.emit('roll', this, winner, coins, raw, multi);
        catchup = false;
      }

      // Tick
      if (now.getSeconds() === 0) {
        if (!this.ticked)
          this.ticked = this.emit('tick', this, tick, remaining);
        else this.emit('tick', this, tick, remaining);
      }

      // Roll Interval (only once)
      if (!this.intIsRunning && now.getMinutes() === 0 && this.ticked) {
        this.intIsRunning = true;
        this.runInterval.call(this);
      }

      return this.tick(false);
    }, (60 - now.getSeconds()) * 1e3 - now.getMilliseconds());
  }

  runInterval() {
    return this.client.setTimeout(() => {
      const { winner, coins, raw, multi } = this.roll();
      this.emit('roll', this, winner, coins, raw, multi);
      return this.runInterval();
    }, this.interval);
  }

  roll() {
    const { guilds } = this.client;
    const guild = guilds.cache.get(this.guild);
    const members = guild.members.cache.array();

    const { randomNumber, randomInArray } = this.client.util;
    const { requirement } = this;

    const { coins, raw, multi } = LotteryHandler.calcCoins(this.rewards);
    const hasRole = (m: GuildMember, r: string) =>
      m.roles.cache.has(r) && !m.user.bot;
    const winner = randomInArray(
      [...members.values()].filter((m) => hasRole(m, requirement))
    );

    return { winner, coins, raw, multi };
  }

  static pad(int: number): string {
    if (int < 10) return `0${int}`;
    else return int.toString();
  }

  static calcCoins(args: LottoConfig['rewards']) {
    const randomNumber = (a: number, b: number) =>
      Math.floor(Math.random() * (b - a + 1) + a);

    const { min, max, cap } = args;
    let coins = randomNumber(min / 1e3, max / 1e3);
    let raw = coins * 1e3;
    let multi: number;

    multi = randomNumber(10, 250);
    coins += Math.round(coins * (multi / 100));
    coins *= 1e3;
    coins = Math.min(cap + 1, coins);

    return { coins, raw, multi };
  }
}
