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
		const env = { markdownMojicolor: { bold: 'red' } };
		const state = {
			tokens: [{
				type: 'front_matter',
				meta: { content: 'markdown:\n  mojicolor:\n    bold: blue' }
			}],
			env
		};
		applyFrontMatter(state);
		assert.deepStrictEqual(state.env.markdownMojicolor, { bold: 'blue' });
		assert.deepStrictEqual(env.markdownMojicolor, { bold: 'red' });

		applyFrontMatter({ tokens: [], env });
		assert.deepStrictEqual(env.markdownMojicolor, { bold: 'red' });
	});
});
