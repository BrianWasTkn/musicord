/**
 * BrianWasTkn 2020
 * A module for fancy logging
*/

import chalk from 'chalk'
import moment from 'moment'

export const log = (type, content, error = null) => {
	const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

	switch(type) {
		case 'node':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.yellowBright('Process')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`);
			console.log(chalk.whiteBright(error))
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
			`${chalk.magentaBright('Command')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`);
			break;
		case 'discord':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.hex('#7289DA')('Discord')}`,
			`${chalk.whiteBright('=>')} ${chalk.hex('#7289DA')(content)}`);
			break;
		case 'event':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.blueBright('Emitter')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`);
			break;
		case 'error':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.redBright('Error')}`,
			`${chalk.whiteBright('=>')} ${chalk.redBright(content)}`);
			console.log(chalk.whiteBright(error))
			break;
		case 'eventError':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.redBright('Event Error')}`,
			`${chalk.whiteBright('=>')} ${chalk.redBright(content)}`);
			console.log(chalk.whiteBright(error))
			break;
		case 'commandError':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.redBright('Command Error')}`,
			`${chalk.whiteBright('=>')} ${chalk.redBright(content)}`);
			console.log(chalk.whiteBright(error))
			break;
		case 'listenerError':
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.redBright('Listener Error')}`,
			`${chalk.whiteBright('=>')} ${chalk.redBright(content)}`);
			console.log(chalk.whiteBright(error))
			break;
		default: 
			console.log(
			`[${chalk.whiteBright(timestamp)}]:`, 
			`${chalk.whiteBright('Console ')}`,
			`${chalk.whiteBright('=>')} ${chalk.greenBright(content)}`)
	}
}