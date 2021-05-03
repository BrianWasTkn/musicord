/**
 * Utilities for our client. 
 * @author BrianWasTaken
 * {@link https://dankmemer.lol/source Dank Memer}
*/

import { Collection, Role } from 'discord.js';
import { CommandQueue } from './queue';
import { ClientUtil } from 'discord-akairo';
import { Effects } from './effects';
import { Console } from './console';
import { COLORS } from './constants';
import { Lava } from '../Lava';
import config from 'config/index';

import chalk from 'chalk';
import moment from 'moment';

export class Util extends ClientUtil {
    cmdQueue: Collection<string, CommandQueue>;
    curHeist: Collection<string, boolean>;
    effects: Collection<string, Collection<string, Effects>>;
    console: Console;
    events: Collection<string, string>;
    heists: Collection<string, Role>;
    client: Lava;

    constructor(client: Lava) {
        super(client);

        this.heists = new Collection();
        this.events = new Collection();
        this.effects = new Collection();
        this.cmdQueue = new Collection();
        this.curHeist = new Collection();
        this.console = 

        for (const color of Object.keys(COLORS)) {
            require('discord.js').Constants.Colors[color.toUpperCase()] = COLORS[color];
        }
    }

    /**
     * Divides the items of an array into arrays (dankmemer.lol/source)
     * @param array An array with usually many items
     * @param size The number of items per array in return
     */
    paginateArray = <T>(array: T[], size?: number): T[][] => {
        let result = [];
        let j = 0;
        for (let i = 0; i < Math.ceil(array.length / (size || 5)); i++) {
            result.push(array.slice(j, j + (size || 5)));
            j = j + (size || 5);
        }
        return result;
    };

    /**
     * Checks if something is a valid number or not. 
    */
    isNumber = (val: string | number): boolean => {
        return Boolean(Number(val));
    };

    /**
     * Lazy convert a string or number into lowercase.
    */
    lowercase = (s: string | number) => {
        return s.constructor === String ? s.toLowerCase() : s.toString().toLowerCase();
    };

    /**
     * Lazy convert a string or number into uppercase.
    */
    uppercase = (s: string | number) => {
        return s.constructor === String ? s.toUpperCase() : s.toString().toUpperCase();
    };

    /**
     * Returns a random item from an array
     * @param array An array of anything
     */
    randomInArray = <T>(array: T[]): T => {
        return array[Math.floor(Math.random() * array.length)];
    };

    /**
     * Generates a random number
     * @param min The minimum number possible
     * @param max The maximum number possible
     */
    randomNumber = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * Generates a random decimal color resolvable (what?)
     */
    randomColor = (): number => {
        return Math.random() * 0xffffff;
    };

    codeBlock = (lang: string = 'js', content: string): string => {
        return `${'```'}${lang}\n${content}\n${'```'}`;
    };

    tableSlots = () => {
        const { slots } = config.currency;
        const [keys, vals] = [Object.keys(slots), Object.values(slots)];

        const single = keys[keys.length - 1];
        const sMulti = slots[single][0];
        const double = keys.filter((k) => keys[k][2]);
        const dMulti = double.map((d) => slots[d][1]);
        const jackpot = keys.filter((k) => slots[k][1]);

        return {
            single: single,
            double: { double, multi: dMulti },
            jackpot: { jackpot },
        };
    };

    toRoman = (int: number): string => {
        let lets = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'],
            nums = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
            roman = '',
            ind = 0;

        while (ind < lets.length) {
            roman += lets[ind].repeat(int / nums[ind]);
            int %= nums[ind]; ind++;
        }

        return roman;
    }

    toNumber = (s: string[]) => {
        const sym: { [k: string]: number } = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }

        let result = 0;
        for (let i = 0; i < s.length; i++) {
            const cur = sym[s[i]];
            const next = sym[s[i + 1]];

            if (cur < next) {
                result += next - cur // IV -> 5 - 1 = 4
                i++;
            } else {
                result += cur
            }
        }

        return result;
    }

    /**
     * Parses time resolvables into human readable times
     * @param time time in seconds
     * @param [short] shorten the time
     */
    parseTime = (time: number, short = false): string => {
        const methods = [
            { name: ['mo', 'month'], count: 2592000 },
            { name: ['d', 'day'], count: 86400 },
            { name: ['h', 'hour'], count: 3600 },
            { name: ['m', 'minute'], count: 60 },
            { name: ['s', 'second'], count: 1 },
        ];

        function pluralize(str: string, num: number) {
            if (short) return str;
            return num > 1 ? `${str}s` : str;
        }

        function and(arr: any[]): any {
            const secToLast = arr[arr.length - 2];
            const last = arr.pop();
            return [...arr.slice(0, arr.length - 1), [secToLast, last].join(' and ')];
        }

        const firstCnt = Math.floor(time / methods[0].count);
        const timeStr = [
            firstCnt.toString() + `${short ? '' : ' '}` + pluralize(methods[0].name[short ? 0 : 1], firstCnt),
        ];
        for (let i = 0; i < methods.length - 1; i++) {
            const raw = (time % methods[i].count) / methods[i + 1].count;
            const calced = Math.floor(raw);
            timeStr.push(
                calced.toString() + `${short ? '' : ' '}` + pluralize(methods[i + 1].name[short ? 0 : 1], calced)
            );
        }

        const raw: string[] = timeStr.filter((g) => !g.startsWith('0'));
        return raw.length === 2
            ? raw.join(' and ')
            : raw.length >= 3
                ? and(raw).join(', ')
                : raw.join(', ');
    };

    isPromise = (something: any): boolean => {
        return (
            something &&
            typeof something.then === 'function' &&
            typeof something.catch === 'function'
        );
    };

    /**
     * Delay for a specified amount of time
     * @param ms number in milliseconds
     */
    sleep = (ms: number): Promise<number> => {
        return new Promise((resolve: Function) =>
            this.client.setTimeout(() => resolve(ms), ms)
        );
    };
}

export default Util;