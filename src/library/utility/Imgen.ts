import { MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';

export class Imgen {
	/**
	 * Construct dank memer's image generation.
	 */
	public constructor(
		/**
		 * Dank Memer's api URL
		 */
		public apiURL: string,
		/**
		 * Your requested token from the memegods.
		 */
		public token = process.env.MEME_TOKEN
	) {}

	/**
	 * Generate an image from a certain endpoint.
	 */
	generate(endpoint: string, args: URLSearchParams, ext: 'gif' | 'png') {
		return fetch(`${this.apiURL}/api/${endpoint}?${args.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: this.token,
			},
		})
			.then(response => response.body)
			.then(body => new MessageAttachment(body, `${endpoint}.${ext}`));
	}
}