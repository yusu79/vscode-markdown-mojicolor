'use strict';

const yaml = require('js-yaml');

const STYLE_NAMES = ['bold', 'italic'];

function isSafeColor(value) {
	return typeof value === 'string' && value.trim() !== '' &&
		!/[;{}\\]/u.test(value) &&
		!Array.from(value).some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) &&
		!value.includes('/*') && !value.includes('*/');
}

function sanitizeStyles(styles) {
	if (!styles || typeof styles !== 'object' || Array.isArray(styles)) {
		return {};
	}

	const result = {};
	for (const name of STYLE_NAMES) {
		if (!Object.hasOwn(styles, name)) continue;
		const value = styles[name];
		if (value === null || isSafeColor(value)) {
			result[name] = value;
		}
	}
	return result;
}

function setFrontMatterStyles(env, styles) {
	const source = env && typeof env === 'object' ? env : {};
	const frontmatter = source.frontmatter && typeof source.frontmatter === 'object' && !Array.isArray(source.frontmatter)
		? source.frontmatter : {};
	const markdown = frontmatter.markdown && typeof frontmatter.markdown === 'object' && !Array.isArray(frontmatter.markdown)
		? frontmatter.markdown : {};
	return {
		...source,
		frontmatter: {
			...frontmatter,
			markdown: { ...markdown, mojicolor: sanitizeStyles(styles) }
		}
	};
}

function sanitizeFrontMatterStyles(env) {
	const frontmatter = env && env.frontmatter;
	if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
		return env;
	}
	const markdown = frontmatter.markdown;
	if (!markdown || typeof markdown !== 'object' || Array.isArray(markdown)) {
		return env;
	}
	if (!Object.hasOwn(markdown, 'mojicolor')) {
		return env;
	}
	return setFrontMatterStyles(env, markdown.mojicolor);
}

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
	const sanitizedEnv = sanitizeFrontMatterStyles(state.env);
	const styles = getMarkdownMojicolor(state.tokens);
	state.env = styles === undefined || sanitizedEnv !== state.env
		? sanitizedEnv
		: setFrontMatterStyles(sanitizedEnv, styles);
}

module.exports = {
	applyFrontMatter,
	getMarkdownMojicolor
};
