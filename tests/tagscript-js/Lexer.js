const Token = require('./Token');

module.exports = class Lexer {
	static lex(script) {
		const tokens = [];
		let content = script.split(/(\{|\}|;)/);
		content = content.map((c, i) => {
			return (c == '' && (
				content[i + 1] === '{' || 
				content[i - 1] === '}')
			) ? undefined : c;
		}).filter((c) => c !== undefined);

		for (const token of content) {
			switch(token) {
				case '{':
					tokens.push(new Token('LBRACKET', token));
					break;
				case '}':
					tokens.push(new Token('RBRACKET', token));
					break;
				case ';':
					tokens.push(new Token('SEMI', token));
					break;
				default:
					tokens.push(new Token('WORD', token));
					break;
			}
		}

		tokens.push(new Token('EOF', ''));
		return tokens;
	}
}