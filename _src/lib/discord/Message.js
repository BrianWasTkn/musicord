import { Structures } from 'discord.js'

export default Structures.extend('Message', Message => {
	class ExtendedMessage extends Message {
		constructor(...params) {
			super(...params);
		}

		/**
		 * Message.send options
		 * @prop {string} code the optional syntax for a codeblock
		 * @typedef {SendOptions} SendOptions
		 */

		/**
		 * Sends a message in this channel
		 * @param {StringResolvable} content a string message
		 * @returns {Promise<Message>}
		 */
		async send(content) {
			return this.channel.send(content);
		}

		/**
		 * Sends an embed in this channel
		 * @param {MessageEmbed} content a string message
		 * @returns {Promise<Message>}
		 */
		async embed(embed) {
			return this.channel.send({ embed });
		}
	}

	return MessageExt;
})