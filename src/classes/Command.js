import Discord from 'discord.js'

/**
 * Creates a command class
 * @class @exports Command 
 */
export default class Command {
	constructor(client, props, propsExt) {
		/* {Discord.Client} Discord Client (Musicord) */
		this.client = client;
		/* {String} Command Name */
		this.name = props.name;
		/* {String[]} Array of command triggers */
		this.aliases = props.aliases || props.triggers || [props.name];
		/* {String} Command Description */
		this.description = props.description;
		/* {String} Command Usage*/
		this.usage = props.usage === 'command' ? props.name : `${props.name} ${props.usage}`;
		/* {Number} Command Cooldown */
		this.cooldown = props.cooldown || 5000;

		/* {String} Command Category */
		this.category = propsExt.category;
		/* {PermissionString[]} Required Permissions to run */
		this.permissions = ['SEND_MESSAGES'].concat(propsExt.user_permissions || []);
		/* {PermissionString[]} Required Client permissions to run */
		this.clientPermissions = ['SEND_MESSAGES'].concat(propsExt.client_permissions || []);
		/* {String[]} `dj`, `voice`, or `queue` */
		this.checks = propsExt.music_checks || [];
		/* {Boolean} Args Required */
		this.argsRequired = propsExt.args_required;
		/* {String} Expected arguments */
		this.expectedArgs = props.usage === 'command' ? null : props.usage;

		/* {Boolean} Owner-Only */
		this.ownerOnly = propsExt.owner_only || false;
		/* {Snowflake[]} Exclusive only for these/this guild(s) */
		this.exclusive = propsExt.exclusive || [];
	}

	/**
	 * A shortcut for logging
	 * @param {String} msg the tag of the command
	 * @param {Error} error an object of an error
	 */
	log(msg, error) {
		return this.client.utils.log('Command', 'error', msg, error);
	}

	/**
	 * An alternative for a Discord.MessageEmbed
	 * @param {Object} Options An object of re-structured Discord.Embed
	 */
	createEmbed({
		author = {}, fields = {}, footer = {},
		title = null, icon = null, text = null,
		color = 'RANDOM'
	} = {}) {
		return this.client.utils.dynamicEmbed({
			author, fields, footer,
			title, text, icon, color
		});
	}

	/**
	 * Handles the cooldown for each user using this command.
	 * @param {Object} Options an object of parameters
	 * @param {Discord.Client} Options.Bot The discord client
	 * @param {Command} Options.command This command
	 * @param {Discord.Message} Options.msg The discord message
	 * @returns {Discord.MessageEmbed|null} An embed, if any
	 */
	handleCooldown({ Bot, command, msg }) {
		/* Destructure */
		const { name, cooldown } = command;
		const { cooldowns, utils } = Bot;
		/** Check if on cooldown collection */
		if (!cooldowns.has(name)) cooldowns.set(name, new Discord.Collection());
		/** Variables */
		const now = Date.now();
		const timestamps = cooldowns.get(name);
		const cd = cooldown;

		/** Check if on timestamps */
		if (timestamps.has(msg.author.id)) {
			const expiration = timestamps.get(msg.author.id) + cd;
			/* Check if on cd */
			if (now < expiration) {
				/* Time Left */
				let timeLeft = (expiration - now) / 1000;
				timeLeft = timeLeft > 60 
				? utils.formatCooldown(timeLeft * 1000) 
				: `${timeLeft.toFixed(1)} seconds`;
				/* Return the cooldown str */
				return timeLeft;
			} 
		} 
		
		/* Timeout */
		timestamps.set(msg.author.id, now)
		setTimeout(() => {
			Bot.cooldowns.delete(msg.author.id)
		}, cooldown);
	}

	/**
	 * Checks if the member has the right permissions to run this command.
	 * @param {Object} Options an object of parameters
	 * @param {Discord.Client} Options.Bot The discord client
	 * @param {Command} Options.command This command
	 * @param {Discord.Message} Options.msg The discord message
	 * @returns {Discord.MessageEmbed|null} An embed, if any
	 */
	checkPermissions({ Bot, command, msg }) {
		const { permissions, client_permissions } = command;
		/* User Permissions */
		if (!msg.member.permissions.has(permissions)) {
			return { type: 'user', permissions };
		} else if (!msg.guild.me.permissions.has(client_permissions)) {
			return { type: 'client', permissions };
		} else {
			return false;
		}
	}
}
