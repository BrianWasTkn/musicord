import { AkairoError } from 'lib/utility/error';
import { Context } from 'lib/extensions';
import { Command } from '..';
import { 
	Constants, Argument, Flag, 
	Command as AkairoCommand,
	ContentParserResult, 
	ArgumentRunnerState,
	ArgumentGenerator, 
	ArgumentOptions,
} from 'discord-akairo';
const { ArgumentMatches } = Constants;

/**
 * Runs arguments.
*/
export class ArgumentRunner {
	public command: Command;
    constructor(command: Command) {
        this.command = command;
    }

    get client() {
        return this.command.client;
    }

    get handler() {
        return this.command.handler;
    }

    /**
     * Runs the arguments.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentGenerator} generator - Argument generator.
     * @returns {Promise<Flag|any>}
     */
    async run(message: Context, parsed: ContentParserResult, generator: ArgumentGenerator) {
        const state = {
            usedIndices: new Set<number>(),
            phraseIndex: 0,
            index: 0
        };

        const augmentRest = (val: any) => {
            if (Flag.is(val, 'continue')) {
                val.rest = parsed.all.slice(state.index).map(x => x.raw).join('');
            }
        };

        const iter = generator(message, parsed, state);
        let curr = await iter.next();
        while (!curr.done) {
            const value = curr.value;
            if (ArgumentRunner.isShortCircuit(value)) {
                augmentRest(value);
                return value;
            }

            const res = await this.runOne(message, parsed, state, new Argument(this.command as unknown as AkairoCommand, value));
            if (ArgumentRunner.isShortCircuit(res)) {
                augmentRest(res);
                return res;
            }

            curr = await iter.next(res);
        }

        augmentRest(curr.value);
        return curr.value;
    }

    /**
     * Runs one argument.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    runOne(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
	): Promise<any> {
        const cases = {
            [ArgumentMatches.PHRASE]: this.runPhrase,
            [ArgumentMatches.FLAG]: this.runFlag,
            [ArgumentMatches.OPTION]: this.runOption,
            [ArgumentMatches.REST]: this.runRest,
            [ArgumentMatches.SEPARATE]: this.runSeparate,
            [ArgumentMatches.TEXT]: this.runText,
            [ArgumentMatches.CONTENT]: this.runContent,
            [ArgumentMatches.REST_CONTENT]: this.runRestContent,
            [ArgumentMatches.NONE]: this.runNone
        };

        const runFn = cases[arg.match];
        if (runFn == null) {
            throw new AkairoError('UNKNOWN_MATCH_TYPE', arg.match);
        }

        // @ts-ignore
        return runFn.call(this, message, parsed, state, arg);
    }

    /**
     * Runs `phrase` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    async runPhrase(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        if (arg.unordered || arg.unordered === 0) {
            const indices = typeof arg.unordered === 'number'
                ? Array.from(parsed.phrases.keys()).slice(arg.unordered as number)
                : Array.isArray(arg.unordered)
                    ? arg.unordered
                    : Array.from(parsed.phrases.keys());

            for (const i of indices) {
                if (state.usedIndices.has(i)) {
                    continue;
                }

                // @ts-ignore
                const phrase = parsed.phrases[i] ? parsed.phrases[i].value : '';
                // `cast` is used instead of `process` since we do not want prompts.
                const res = await arg.cast(message, phrase);
                if (res != null) {
                    state.usedIndices.add(i);
                    return res;
                }
            }

            // No indices matched.
            return arg.process(message, '');
        }

        const index = arg.index == null ? state.phraseIndex : arg.index;
        // @ts-ignore
        const ret = arg.process(message, parsed.phrases[index] ? parsed.phrases[index].value : '');
        if (arg.index == null) {
            ArgumentRunner.increaseIndex(parsed, state);
        }

        return ret;
    }

    /**
     * Runs `rest` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    async runRest(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        const index = arg.index == null ? state.phraseIndex : arg.index;
        const rest = parsed.phrases.slice(index, index + arg.limit).map(x => x.raw).join('').trim();
        const ret = await arg.process(message, rest);
        if (arg.index == null) {
            ArgumentRunner.increaseIndex(parsed, state);
        }

        return ret;
    }

    /**
     * Runs `separate` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    async runSeparate(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        const index = arg.index == null ? state.phraseIndex : arg.index;
        const phrases = parsed.phrases.slice(index, index + arg.limit);
        if (!phrases.length) {
            const ret = await arg.process(message, '');
            if (arg.index != null) {
                ArgumentRunner.increaseIndex(parsed, state);
            }

            return ret;
        }

        const res = [];
        for (const phrase of phrases) {
        	// @ts-ignore
            const response = await arg.process(message, phrase.value);

            if (Flag.is(response, 'cancel')) {
                return response;
            }

            res.push(response);
        }

        if (arg.index != null) {
            ArgumentRunner.increaseIndex(parsed, state);
        }

        return res;
    }

    /**
     * Runs `flag` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    runFlag(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument 
    ) {
        const names = Array.isArray(arg.flag) ? arg.flag : [arg.flag];
        if (arg.multipleFlags) {
            const amount = parsed.flags.filter(flag =>
                names.some(name =>
                	// @ts-ignore
                    name.toLowerCase() === flag.key.toLowerCase()
                )
            ).length;

            return amount;
        }

        const flagFound = parsed.flags.some(flag =>
            names.some(name =>
            	// @ts-ignore
                name.toLowerCase() === flag.key.toLowerCase()
            )
        );

        return arg.default == null ? flagFound : !flagFound;
    }

    /**
     * Runs `option` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    async runOption(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        const names = Array.isArray(arg.flag) ? arg.flag : [arg.flag];
        if (arg.multipleFlags) {
            const values = parsed.optionFlags.filter(flag =>
                names.some(name =>
                	// @ts-ignore
                    name.toLowerCase() === flag.key.toLowerCase()
                )
                // @ts-ignore
            ).map(x => x.value).slice(0, arg.limit);

            const res = [];
            for (const value of values) {
                res.push(await arg.process(message, value));
            }

            return res;
        }

        const foundFlag = parsed.optionFlags.find(flag =>
            names.some(name =>
	        	// @ts-ignore
                name.toLowerCase() === flag.key.toLowerCase()
            )
        );

        // @ts-ignore
        return arg.process(message, foundFlag != null ? foundFlag.value : '');
    }

    /**
     * Runs `text` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    runText(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        const index = arg.index == null ? 0 : arg.index;
        const text = parsed.phrases.slice(index, index + arg.limit).map(x => x.raw).join('').trim();
        return arg.process(message, text);
    }

    /**
     * Runs `content` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    runContent(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        const index = arg.index == null ? 0 : arg.index;
        const content = parsed.all.slice(index, index + arg.limit).map(x => x.raw).join('').trim();
        return arg.process(message, content);
    }

    /**
     * Runs `restContent` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    async runRestContent(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        const index = arg.index == null ? state.index : arg.index;
        const rest = parsed.all.slice(index, index + arg.limit).map(x => x.raw).join('').trim();
        const ret = await arg.process(message, rest);
        if (arg.index == null) {
            ArgumentRunner.increaseIndex(parsed, state);
        }

        return ret;
    }

    /**
     * Runs `none` match.
     * @param {Message} message - Message that triggered the command.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {Argument} arg - Current argument.
     * @returns {Promise<Flag|any>}
     */
    runNone(
    	message: Context, 
    	parsed: ContentParserResult, 
    	state: ArgumentRunnerState, 
    	arg: Argument
    ) {
        return arg.process(message, '');
    }

    /**
     * Modifies state by incrementing the indices.
     * @param {ContentParserResult} parsed - Parsed data from ContentParser.
     * @param {ArgumentRunnerState} state - Argument handling state.
     * @param {number} n - Number of indices to increase by.
     * @returns {Promise<Flag|any>}
     */
    static increaseIndex(parsed: ContentParserResult, state: ArgumentRunnerState, n = 1) {
        state.phraseIndex += n;
        while (n > 0) {
            do {
                state.index++;
            } while (parsed.all[state.index] && parsed.all[state.index].type !== 'Phrase');
            n--;
        }
    }

    /**
     * Checks if something is a flag that short circuits.
     * @param {any} value - A value.
     * @returns {boolean}
     */
    static isShortCircuit(value: any) {
        return Flag.is(value, 'cancel') || Flag.is(value, 'retry') || Flag.is(value, 'continue');
    }

    /**
     * Creates an argument generator from argument options.
     * @param {ArgumentOptions[]} args - Argument options.
     * @returns {GeneratorFunction}
     */
    static fromArguments(args: ArgumentOptions[]) {
        return function* generate() {
            const res = {};
            // @ts-ignore
            for (const [id, arg] of args) {
	            // @ts-ignore
                res[id] = yield arg;
            }

            return res;
        };
    }
}

export default ArgumentRunner;