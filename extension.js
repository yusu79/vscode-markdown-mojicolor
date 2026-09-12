'use strict';

const vscode = require('vscode');
const { applyFrontMatter } = require('./frontmatter');

const RELOAD_MESSAGE = 'You need to reload VS Code to apply the settings.\nDo you want to reload?';
let reloadPrompt;

function getStyle(configuration, key) {
	const value = configuration.get(key, '');
	return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function recommendReload(event, api = vscode) {
	if (!event.affectsConfiguration('markdownMojicolor')) {
		return Promise.resolve(false);
	}
	if (reloadPrompt) {
		return reloadPrompt;
	}

	reloadPrompt = (async () => {
		const reload = api.l10n.t('Reload');
		const selected = await api.window.showInformationMessage(api.l10n.t(RELOAD_MESSAGE), reload);
		if (selected !== reload) {
			return false;
		}
		await api.commands.executeCommand('workbench.action.reloadWindow');
		return true;
	})().finally(() => {
		reloadPrompt = undefined;
	});
	return reloadPrompt;
}

function getPluginOptions(configuration) {
	return {
		colorFiles: configuration.get('colorFiles', []),
		styles: {
			bold: getStyle(configuration, 'styles.bold'),
			italic: getStyle(configuration, 'styles.italic')
		}
	};
}

function extendMarkdownIt(md, configuration) {
	md.use(require('markdown-it-mojicolor'), getPluginOptions(configuration));
	md.core.ruler.before('mojicolor_styles', 'markdown_mojicolor_front_matter', applyFrontMatter);
	return md;
}

function activate(context) {
	const configuration = vscode.workspace.getConfiguration('markdownMojicolor');
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
		void recommendReload(event);
	}));

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
	getPluginOptions,
	recommendReload
};
