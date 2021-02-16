"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: 'ready',
    run() {
        const tag = `${this.user.username}#${this.user.discriminator}`;
        return console.log(`${tag} has flown within Discord.`);
    }
};
