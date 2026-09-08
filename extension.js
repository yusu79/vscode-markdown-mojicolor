'use strict';

const vscode = require('vscode');
const { applyFrontMatter } = require('./frontmatter');

function getPluginOptions(configuration) {
	return {
		colorFiles: configuration.get('colorFiles', []),
		styles: {
			bold: configuration.get('styles.bold', null),
			italic: configuration.get('styles.italic', null)
		}
	};
}

function extendMarkdownIt(md, configuration) {
	md.use(require('markdown-it-mojicolor'), getPluginOptions(configuration));
	md.core.ruler.before('mojicolor_styles', 'markdown_mojicolor_front_matter', applyFrontMatter);
	return md;
}

function activate() {
	const configuration = vscode.workspace.getConfiguration('markdownMojicolor');

	return {
		extendMarkdownIt(md) {
			return extendMarkdownIt(md, configuration);
		}
	};
}


function deactivate() {}

module.exports = {
	activate,
	deactivate,
	extendMarkdownIt,
	getPluginOptions
};
