import discord from 'discord.js'

const idPattern = /^([0-9]{17,19})$/;
const userMentionPattern = /<@!?([0-9]{17,19})>/;
const channelMentionPattern = /<#([0-9]{17,19})>/;
const roleMentionPattern = /<@&([0-9]{17,19})>/;

class ArgParser {
	constructor(client, message, args) {
		/** @property {discord.Message} the message object */
		this.message = message;
		/** @property {discord.Client} the client instantiated */
		this.client = client;
		/** @property {Array<any>} the command arguments */
		this.args = args;
	}

	get isEmpty() {
		return !this.args[0];
	}

	get stringLength() {
		return this.gather().length;
	}

	random() {
		return this.args[Math.floor(Math.random() * this.args.length)];
	}

	gather() {
		return this.args.join(' ');
	}

	resolveUser(rest = false) {
		let user = rest ? this.args.gather() : this.args.shift();
		const args = user;
		let resolved = null;
		if (!user) {
			return;
		} else {
			const idMatch = idPattern.exec(args) || userMentionPattern.exec(args);
			// <GuildMember>.id
			if (idMatch) {
				resolved = this.message.guild.members.cache.get(idMatch[1]);
			} // <GuildMember>.tag
			else if (args.length > 5 && args.slice(-5, -4) === '#') {
				resolved = this.message.guild.members.cache.find(m => m.tag === args || `${m.displayName}#${m.discriminator}` === args);
			} // <GuildMember>.username || <GuildMember>.displayName
			else {
				resolved = this.message.guild.members.cache.find(m => m.username === args || m.displayName === args);
			}
		}

		return resolved || null;
	}

	resolveChannel(rest = false) {
		let channel = rest ? this.args.gather() : this.args.shift();
		const args = channel;
		let resolved = null;
		if (!channel) {
			return;
		} else {
			const idMatch = idPattern.exec(args) || channelMentionPattern.exec(args);
			// <GuildChannel>.id
			if (idMatch) {
				resolved = this.message.guild.channels.cache.get(idMatch[1]);
			} // <GuildChannel>.name
			else {
				resolved = this.message.guild.channels.cache.find(c => c.name === args);
			}
		}

		return resolved || null;
	}

	resolveRole(rest = false) {
		let role = rest ? this.args.gather() : this.args.shift();
		const args = role;
		let resolved = null;
		if (!role) {
			return;
		} else {
			const idMatch = idPattern.exec(args) || roleMentionPattern.exec(args);
			// <Role>.id
			if (idMatch) {
				resolved = this.message.guild.channels.cache.get(idMatch[1]);
			} // <Role>.name
			else {
				resolved = this.message.guild.channels.cache.find(c => c.name === args);
			}
		}

		return resolved || null;
	}

	_massResolve(type) {
		const resolved = [];
		// A function to check what method we'll use
		// depending to whatever the resolve type is.
		const resolve = (type) => {
			if (type === 'user') {
				return this.resolveUser;
			} else if (type === 'role') {
				return this.resolveRole;
			} else if (type === 'channel') {
				return this.resolveChannel;
			}
		};

		let res;
		while((res === resolve(type)()) !== null) {
			// Push
			resolved.push(user);
		}

		// Return the array of resolved items
		// Either: <GuildMember>, <GuildChannel>, or <Role>
		return resolved;
	}

	resolveUsers() {
		return this._massResolve('user');
	}

	resolveChannels() {
		return this._massResolve('channel');
	}

	resolveRoles() {
		return this._massResolve('role');
	}

}

export default ArgParser;