import { EventEmitter } from 'events'
import { Client } from 'eris'

class Collector extends EventEmitter {
    public constructor(public bot: Client) {
        super();
        this.bot = bot;
    }
}

export default Collector;