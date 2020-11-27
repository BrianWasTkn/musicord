const idPattern = /^([0-9]{17,19})$/;
const userMentionPattern = /<@!?([0-9]{17,19})>/;
const channelMentionPattern = /<#([0-9]{17,19})>/;
const roleMentionPattern = /<@&([0-9]{17,19})>/;

class ArgParser {
	constructor(client, message, args) {
		/** @property {Discord.Message} the message object instantiated */
		this.msg = message;
		/** @property {Discord.Client} the discord.client */
		this.client = client;
		/** @property {Array<any>} the arguments */
		this.args = args;
	}

	get isEmpty() {
		return !this.args[0];
	}

	get stringLength() {
		return this.args.join().length;
	}

	random(limit = 0) {
		return this.args[Math.floor(Math.random() * (this.args.length - limit))];
	}

	gather() {
		return this.args.join();
	}

	get(index) {
		return this.args[index];
	}

	resolveUser(rest = false) {
		let user = rest ? this.args.gather() : this.args.shift();
		const args = this.args, message = this.msg;
		let resolved = null;
		if (!user) {
			return;
		} else {
			const idMatch = idPattern.exec(args) || userMentionPattern.exec(args);
			// <GuildMember>.id
			if (idMatch) {
				resolved = message.guild.members.cache.get(idMatch[1]);
			} // <GuildMember>.tag
			else if (args.length > 5 && args.slice(-5, -4) === '#') {
				resolved = message.guild.members.cache.find(m => m.tag === args || `${m.displayName}#${m.discriminator}` === args);
			} // <GuildMember>.username || <GuildMember>.displayName
			else {
				resolved = message.guild.members.cache.find(m => m.username === args || m.displayName === args);
			}
		}

		return resolved || null;
	}

	resolveChannel(rest = false) {
		let channel = rest ? this.args.gather() : this.args.shift();
		const args = this.args, message = this.msg;
		let resolved = null;
		if (!channel) {
			return;
		} else {
			const idMatch = idPattern.exec(args) || channelMentionPattern.exec(args);
			// <GuildChannel>.id
			if (idMatch) {
				resolved = message.guild.channels.cache.get(idMatch[1]);
			} // <GuildChannel>.name
			else {
				resolved = message.guild.channels.cache.find(c => c.name === args);
			}
		}

		return resolved || null;
	}

	resolveRole(rest = false) {
		let role = rest ? this.args.gather() : this.args.shift();
		const args = this.args, message = this.msg;
		let resolved = null;
		if (!role) {
			return;
		} else {
			const idMatch = idPattern.exec(args) || roleMentionPattern.exec(args);
			// <Role>.id
			if (idMatch) {
				resolved = message.guild.channels.cache.get(idMatch[1]);
			} // <Role>.name
			else {
				resolved = message.guild.channels.cache.find(c => c.name === args);
			}
		}

		return resolved || null;
	}

	resolveUsers() {
		const resolved = [];
		let user;
		while((user === this.resolveUser()) !== null) {
			resolved.push(user);
		}
		return resolved;
	}

}

export default ArgParser;