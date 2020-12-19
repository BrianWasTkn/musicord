export class Command {
	constructor(props, fn) {
		this.props = props;
		this.run = fn;
	}

	async execute({ Bot, msg, args }) {
		return await this.run({ Bot, msg, args });
	}
}