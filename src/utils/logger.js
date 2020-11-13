import chalk from 'chalk'

export const logInit = (tag, message) => {
	console.log(chalk.yellowBright(`[${tag}]`), chalk.greenBright(message))
}

export const logError = (tag, message, error) => {
	console.log(chalk.yellowBright(`[${tag}]`), chalk.redBright(message), chalk.white(error))
}