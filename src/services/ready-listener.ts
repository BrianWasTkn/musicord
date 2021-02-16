import Eris from 'eris'

export default {
    id: 'ready',
    run(this: Eris.Client): void {
        const tag = `${this.user.username}#${this.user.discriminator}`;
        return console.log(`${tag} has flown within Discord.`);
    }
}