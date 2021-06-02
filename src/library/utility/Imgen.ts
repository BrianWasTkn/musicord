import { MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';

export class Imgen {
	public apiURL: string;
	public constructor(apiURL: string) {
		this.apiURL = apiURL;
	}

	private get token() {
		return process.env.MEME_TOKEN;
	}

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