export async function run() {
	this.on('ready', async () => {
		this.utils.log(
			this.constructor.name, 'main',
			`${this.user.tag} is ready to play sum beats.`
		);
	});
}