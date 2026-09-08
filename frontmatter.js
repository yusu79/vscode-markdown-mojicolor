'use strict';

const yaml = require('js-yaml');

function getMarkdownMojicolor(tokens) {
	const token = tokens.find(item => item.type === 'front_matter');
	if (!token || !token.meta || typeof token.meta.content !== 'string') {
		return undefined;
	}

	let document;
	try {
		document = yaml.load(token.meta.content);
	} catch {
		return undefined;
	}

	if (!document || typeof document !== 'object' || Array.isArray(document)) {
		return undefined;
	}
	const markdown = document.markdown;
	if (!markdown || typeof markdown !== 'object' || Array.isArray(markdown)) {
		return undefined;
	}
	// An empty YAML mapping value is null while the user is typing.
	return Object.hasOwn(markdown, 'mojicolor') && markdown.mojicolor !== null
		? markdown.mojicolor : undefined;
}

function applyFrontMatter(state) {
	const styles = getMarkdownMojicolor(state.tokens);
	if (styles !== undefined) {
		// Keep document overrides local to this parse, preserving the caller's env.
		state.env = { ...state.env, markdownMojicolor: styles };
	}
}

module.exports = {
	applyFrontMatter,
	getMarkdownMojicolor
};
