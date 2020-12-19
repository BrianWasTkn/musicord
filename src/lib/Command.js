export class Command {
	constructor(props, fn) {
		this.props = props;
		this.run = fn;
	}

	async execute(msg) {
		return await this.run(msg);
	}
}