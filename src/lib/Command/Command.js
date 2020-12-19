export class Command {
	constructor(props, fn) {
		this.run = fn;
		this.props = props;
	}

	async execute(msg) {
		return await this.run(msg);
	}
}