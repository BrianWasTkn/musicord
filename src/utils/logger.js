import chalk from 'chalk'
import moment from 'moment'

export const log = (type, content, error = null) => {
	const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

	switch(type) {
		case 'node':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`[${chalk.green('Process')}]`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`);
			break;
		case 'main':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.hex('#57d6ff')('Launcher')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`);
			break;
		case 'command':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.magentaBright('Commands')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`);
			break;
		case 'event':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.blueBright('Emitters')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`);
			break;
		case 'error':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.redBright('Error   ')}`,
			`${chalk.whiteBright('=>')} ${chalk.redBright(content)}`);
			break;
		default: 
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.whiteBright('Console ')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`)
	}
}

export const logInit = (tag, message) => {
	const timestamp = moment().format("YYYY-MM-DD HH:mm:ss")
	console.log(chalk.magentaBright(`[${timestamp}]:`), chalk.hex('#57d6ff')(`[${tag}]`), chalk.greenBright('[X]'), chalk.blueBright(`${message}`))
}

export const logError = (tag, message, error, stack = false) => {
	const timestamp = moment().format("YYYY-MM-DD HH:mm:ss")
	console.log(chalk.magentaBright(`[${timestamp}]:`), chalk.hex('#57d6ff')(`[${tag}]`), chalk.redBright('[X]'), chalk.blueBright(message))
	console.log(chalk.whiteBright(stack ? error : error.stack))
}

export const logCommandError = (command, message, error) => {
	console.log()
}