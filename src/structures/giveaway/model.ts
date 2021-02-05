import { Model, Document, model, Schema } from 'mongoose'
import { GiveawayData } from 'discord-giveaways'

interface GiveawayDocument {
	giveaways: GiveawayData[];
}

const GiveawayModel: Model<Document<GiveawayDocument>> = model('giveaways', new Schema({
	giveaways: { type: Array, required: false, default: [] }
}))

export default GiveawayModel;