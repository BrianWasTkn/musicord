lava spawns
	- per member cd
		- role cooldowns per role groups (minutes)
			- amari levels: 20
			- mastery levels: 10
			- donators: 5
			- boosters: 3

```js
import mongoose, { Schema } from 'mongoose'

const SpawnProfile: typeof Schema = new Schema({
	// Public
	userID: { type: String, required: true },
	paid: { type: Number, required: false, default: 0 },
	unpaid: { type: Number, required: false, default: 0 },
	// Private
	eventsJoined: { type: Number, required: false, default: 0 },
});

export default mongoose.model('spawn-profile', SpawnProfile);
```
