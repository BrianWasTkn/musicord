import Listener from '../../classes/Listener.js'

export default class Ready extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		client.on('ready', this.handle);
	}

	async handle() {
		/** Log */
		try {
			this.log(
				'main', 
				`${this.client.user.username} is now ready to play some beats!`
			);
		} catch(error) {
			super.log('Ready@log_ready_msg');
		}
	}
}