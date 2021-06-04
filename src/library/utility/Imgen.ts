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
	generate(endpoint: string, body: {
		text?: string;
		avatars?: string[];
	}) {
		return fetch(`${this.apiURL}/${endpoint}`, {
			body: JSON.stringify(body),
			method: 'POST',
			timeout: 1e4,
			headers: {
				Authorization: this.token,
				'Content-Type': 'application/json'
			},
		})
			.then(response => response.buffer())
			.catch(error => Promise.reject(error));
	}
}