import Manager from '../classes/Manager.js'
import Player from '../classes/Player.js'
import playerConfig from '../config/playerConfig.js'

export default class PlayerManager extends Manager {
	constructor(client) {
		super(client);
		this.distube = new Player(client, playerConfig);

		/* Search Events */
		for (const event of ['searchResult', 'searchCancel']) {
			this.distube.on(event, (...args) => this.handleSearch({ 
				Event: event, 
				params: { 
					...args 
				} 
			}));
		}

		/** Song Events */
		for (const event of ['playSong', 'addSong']) {
			this.distube.on(event, (...args) => this.handleSong({ 
				Event: event, 
				params: { 
					...args 
				} 
			}));
		}

		/** Other Events */
		this.distube.on('error', this.onError);
		this.distube.on('empty', this.onEmpty);
		this.distube.on('finish', this.onFinish);
		this.distube.on('addList', this.handleList);
		this.distube.on('noRelated', this.onNoFound);
		this.distube.on('initQueue', this.handleQueue);
	}

	async handleSearch({ Event,  })

}