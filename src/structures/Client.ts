import { Client, Collection } from 'eris'

class Bot extends Client implements Lava.Bot {
    public constructor(token: Lava.Config["token"]) {
        super(token as string); // thanks dotenv :rolling_eyes:
    }
}

export default Bot