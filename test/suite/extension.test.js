const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const myExtension = require('../../extension');
const { applyFrontMatter, getMarkdownMojicolor } = require('../../frontmatter');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('設定をmarkdown-it-mojicolorのオプションへ変換する', () => {
		const values = new Map([
			['colorFiles', ['C:\\colors\\project.json']],
			['styles.bold', 'blue'],
			['styles.italic', null]
		]);
		const configuration = {
			get(key, defaultValue) {
				return values.has(key) ? values.get(key) : defaultValue;
			}
		};

		assert.deepStrictEqual(myExtension.getPluginOptions(configuration), {
			colorFiles: ['C:\\colors\\project.json'],
			styles: { bold: 'blue', italic: null }
		});
	});

	test('未設定の場合は自動着色と追加辞書を無効にする', () => {
		const configuration = { get: (key, defaultValue) => defaultValue };

		assert.deepStrictEqual(myExtension.getPluginOptions(configuration), {
			colorFiles: [],
			styles: { bold: null, italic: null }
		});
	});

	test('設定UIの空欄と既存のnull設定を自動着色なしとして扱う', () => {
		for (const value of ['', '   ', null]) {
			const configuration = {
				get(key, defaultValue) {
					if (key === 'styles.bold') return value;
					return defaultValue;
				}
			};
			assert.deepStrictEqual(myExtension.getPluginOptions(configuration).styles, {
				bold: null,
				italic: null
			});
		}
	});

	test('Markdown MojiColor設定の変更時に同意した場合だけ再読み込みする', async () => {
		const calls = [];
		const translations = new Map([
			['You need to reload VS Code to apply the settings.\nDo you want to reload?', '設定を適用するにはVS Codeを再読み込みする必要があります。\n再読み込みしますか？'],
			['Reload', '再読み込み']
		]);
		const api = {
			l10n: { t: message => translations.get(message) },
			window: {
				showInformationMessage(message, action) {
					calls.push(['message', message, action]);
					return Promise.resolve(action);
				}
			},
			commands: {
				executeCommand(command) {
					calls.push(['command', command]);
					return Promise.resolve();
				}
			}
		};

		assert.strictEqual(await myExtension.recommendReload({
			affectsConfiguration: section => section === 'markdownMojicolor'
		}, api), true);
		assert.deepStrictEqual(calls, [
			['message', '設定を適用するにはVS Codeを再読み込みする必要があります。\n再読み込みしますか？', '再読み込み'],
			['command', 'workbench.action.reloadWindow']
		]);
	});

	test('無関係な設定変更や確認のキャンセルでは再読み込みしない', async () => {
		let messageCount = 0;
		let commandCount = 0;
		const api = {
			l10n: { t: message => message },
			window: {
				showInformationMessage() {
					messageCount++;
					return Promise.resolve(undefined);
				}
			},
			commands: {
				executeCommand() {
					commandCount++;
					return Promise.resolve();
				}
			}
		};

		assert.strictEqual(await myExtension.recommendReload({ affectsConfiguration: () => false }, api), false);
		assert.strictEqual(await myExtension.recommendReload({ affectsConfiguration: () => true }, api), false);
		assert.strictEqual(messageCount, 1);
		assert.strictEqual(commandCount, 0);
	});

	test('YAML Front Matterから文書単位の設定を取得する', () => {
		const tokens = [{
			type: 'front_matter',
			meta: {
				content: 'title: Sample\nmarkdown:\n  mojicolor:\n    bold: yellow\n    italic: null'
			}
		}];

		assert.deepStrictEqual(getMarkdownMojicolor(tokens), {
			bold: 'yellow',
			italic: null
		});
	});

	test('Front Matter設定をenvへ渡し、文書間に残さない', () => {
		const env = { source: 'vscode' };
		const state = {
			tokens: [{
				type: 'front_matter',
				meta: { content: 'markdown:\n  mojicolor:\n    bold: blue' }
			}],
			env
		};
		applyFrontMatter(state);
		assert.deepStrictEqual(state.env.frontmatter.markdown.mojicolor, { bold: 'blue' });
		assert.strictEqual(Object.hasOwn(state.env, 'markdownMojicolor'), false);
		assert.deepStrictEqual(env, { source: 'vscode' });

		applyFrontMatter({ tokens: [], env });
		assert.deepStrictEqual(env, { source: 'vscode' });
	});
});
