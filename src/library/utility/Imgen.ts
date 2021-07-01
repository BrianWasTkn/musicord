import { MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';

export class Imgen {
	/**
	 * The fetch url.
	 */
	public apiURL: string;
	/**
	 * Construct dank memer's image generation.
	 */
	public constructor(apiURL: string) {
		this.apiURL = apiURL;
	}

	private get token() {
		return process.env.MEME_TOKEN;
	}

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