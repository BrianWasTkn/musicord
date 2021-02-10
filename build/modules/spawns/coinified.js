"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Spawn_1 = __importDefault(require("../../lib/structures/Spawn"));
const config = {
    odds: 3,
    type: 'message',
    enabled: true,
    timeout: 10000,
    entries: Infinity,
    rewards: {
        min: 1000,
        max: 5000,
        first: 10000
    }
};
const visuals = {
    emoji: '<:memerGreen:729863510296887398>',
    type: 'SUPER',
    title: 'Get Coinified',
    description: 'Do you want coins?',
    strings: [
        'coinifocation', 'give me now or stupid',
        'frick off lava', 'lol imagine being',
        'yes', 'rain on me', 'crib op',
        'i\'ll join the taken cult', 'ig so',
        'well yes but actually....'
    ]
};
class SUPER extends Spawn_1.default {
    constructor(client) {
        super(client, config, visuals, (member) => {
            // "Crib Booster" role
            if (member.roles.cache.has('693324853440282654'))
                return 5;
            // "Donator #M+" roles (minimum)
            if (member.roles.cache.has('768858996659453963'))
                return 10;
            // "Mastery #" roles (minimum)
            if (member.roles.cache.has('794834783582421032'))
                return 15;
            // "Amari #" roles (minimum)
            if (member.roles.cache.has('693380605760634910'))
                return 20;
            // Else
            return 60;
        });
    }
}
exports.default = SUPER;
