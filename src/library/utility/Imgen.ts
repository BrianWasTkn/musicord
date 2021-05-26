import fetch from 'node-fetch';

export class Imgen {
	public apiURL: string;
	public constructor(apiURL: string) {
		this.apiURL = apiURL;
	}

	generate(endpoint: string, body: any) {
		return fetch(`${this.apiURL}/${endpoint}`, {
			body: JSON.stringify(body),
			method: 'POST',
			headers: {
				Authorization: process.env.MEME_TOKEN,
				'Content-Type': 'application/json'
			}
		}).then(g => g.buffer());
	}
}