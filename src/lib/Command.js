export class Command {
	constructor(props, fn) {
		this.props = props;
		this.fn = fn;
	}

	async execute({ Bot, msg, args }) {
		return await this.fn({ Bot, msg, args });
	}
}