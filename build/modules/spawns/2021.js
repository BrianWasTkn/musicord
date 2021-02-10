"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Spawn_1 = __importDefault(require("../../lib/structures/Spawn"));
const config = {
    odds: 5,
    type: 'message',
    enabled: true,
    timeout: 10000,
    entries: 5,
    rewards: {
        min: 2100,
        max: 2100,
        first: 4200
    }
};
const visuals = {
    emoji: '<:memerBlue:729863510330310727>',
    type: 'COMMON',
    title: '2021',
    description: 'A fresh start.',
    strings: [
        'super bass', 'poker face', '2 in 1',
        'yes', 'LOL', 'Gen Y', 'no politics allowed',
        'ninky mank', 'lady fafa', 'emotional twerking'
    ]
};
class COMMON extends Spawn_1.default {
    constructor(client) {
        super(client, config, visuals, (member) => {
            // "Crib Booster" role
            if (member.roles.cache.has('693324853440282654'))
                return 3;
            // "Donator #M+" roles (minimum)
            if (member.roles.cache.has('768858996659453963'))
                return 5;
            // "Mastery #" roles (minimum)
            if (member.roles.cache.has('794834783582421032'))
                return 10;
            // "Amari #" roles (minimum)
            if (member.roles.cache.has('693380605760634910'))
                return 20;
            // Else
            return 60;
        });
    }
}
exports.default = COMMON;
