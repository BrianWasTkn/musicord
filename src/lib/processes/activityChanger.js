function randomInArray(array) {
	return array[Math.floor(Math.random() * array.length)]
}

export async function run() {
	this.on('ready', async () => {
		this.user.setPresence({
			status: 'online',
			activity: {
				type: 'LISTENING',
				name: `${this.prefix}help`
			}
		}).then(presence => {
			const { 
				status, [activies[0]]: { 
					type, name 
				} 
			} = presence;

			try {
				setInterval(async () => {
					this.user.setPresence({ activity: randomInArray(this.config.bot.activies(this)) })
				}, this.config.main.presence_interval * 1000);
			} catch(error) {
				this.utils.log(
					'Musicord', 'error',
					'activityChanger@presence_interval', error
				);
			}
			
			this.utils.log(
				'Musicord', 'main', 
				`Now ${type === 'LISTENING' ? `${type} TO` : type} ${name}`
			);
			this.utils.log(
				'Musicord', 'main',
				`${this.user.tag} is now ready to play some beats!`
			);
		}).catch(error => {
			this.utils.log('Musicord', 'error', 'activityChanger@presence', error);
		})
	})
}

export async function runDev() {
	this.on('ready', async () => {
		this.user.setPresence({
			status: 'dnd',
			activity: {
				type: 'WATCHING',
				name: 'Developer Mode'
			}
		}).then(presence => {
			const { 
				status, [activies[0]]: { 
					type, name 
				} 
			} = presence;
			
			this.utils.log(
				'Musicord', 'main', 
				`Now ${type === 'LISTENING' ? `${type} TO` : type} ${name}`
			);
			this.utils.log(
				'Musicord', 'main',
				`${this.user.tag} is now ready to play some beats!`
			);
		}).catch(error => {
			this.utils.log('Musicord', 'error', 'dev:activityChanger@presence', error);
		})
	})
}