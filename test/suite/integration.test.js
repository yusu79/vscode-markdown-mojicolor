'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const MarkdownIt = require('markdown-it');
const vscode = require('vscode');
const { extendMarkdownIt } = require('../../extension');

function configuration(values = {}) {
	return {
		get(key, defaultValue) {
			return Object.hasOwn(values, key) ? values[key] : defaultValue;
		}
	};
}

function frontMatter(md) {
	md.block.ruler.before('fence', 'front_matter', (state, startLine, endLine, silent) => {
		if (startLine !== 0) return false;
		const start = state.bMarks[startLine] + state.tShift[startLine];
		const maximum = state.eMarks[startLine];
		if (state.src.slice(start, maximum).trimEnd() !== '---') return false;

		let nextLine = startLine + 1;
		for (; nextLine < endLine; nextLine++) {
			const nextStart = state.bMarks[nextLine] + state.tShift[nextLine];
			const nextMaximum = state.eMarks[nextLine];
			if (state.src.slice(nextStart, nextMaximum).trimEnd() === '---') break;
		}
		if (nextLine >= endLine) return false;
		if (silent) return true;

		const token = state.push('front_matter', '', 0);
		token.meta = {
			content: state.src.slice(state.bMarks[startLine + 1], state.bMarks[nextLine]).replace(/\n$/u, '')
		};
		token.map = [startLine, nextLine + 1];
		state.line = nextLine + 1;
		return true;
	});
	md.renderer.rules.front_matter = () => '';
}

function parser(values) {
	const md = new MarkdownIt();
	frontMatter(md);
	return extendMarkdownIt(md, configuration(values));
}

suite('Feature color customization integration', () => {
	test('Markdown Clipが渡すFront Matterから文書単位の色を適用する', () => {
		const md = parser({ 'styles.bold': 'red', 'styles.italic': 'green' });
		const env = {
			frontmatter: {
				markdown: {
					mojicolor: { bold: 'yellow', italic: null }
				}
			},
			markdownClip: {
				removeHeadingId: true,
				removeVSCodeAttributes: true
			}
		};

		assert.strictEqual(
			md.render('**太字** *斜体* %**青**%{blue}', env),
			'<p><strong style="color: yellow;">太字</strong> <em>斜体</em> <span style="color: blue;"><strong>青</strong></span></p>\n'
		);
	});

	test('HTML出力元のenv設定を保持し、VS Code設定と明示色の優先順位を維持する', () => {
		const md = parser({ 'styles.bold': 'red', 'styles.italic': 'green' });
		const env = Object.freeze({ markdownMojicolor: Object.freeze({ bold: 'yellow', italic: null }) });
		assert.strictEqual(md.render('**太字** *斜体* %**青**%{blue}', env),
			'<p><strong style="color: yellow;">太字</strong> <em>斜体</em> <span style="color: blue;"><strong>青</strong></span></p>\n');
		assert.strictEqual(md.render('**太字**'), '<p><strong style="color: red;">太字</strong></p>\n');
	});

	test('YAML編集中の空キーで例外を出さず、個別nullの解除を維持する', () => {
		const md = parser({ 'styles.bold': 'red' });
		const env = {};
		const cases = [
			['markdown:\n  mojicolor:\n    bold: blue', 'blue'],
			['markdown:\n  mojicolor:', 'red'],
			['markdown:\n  mojicolor: null', 'red'],
			['markdown:\n  mojicolor: {}', 'red'],
			['markdown:\n  mojicolor:\n    b:', 'red'],
			['markdown:\n  mojicolor:\n    bo:', 'red'],
			['markdown:\n  mojicolor:\n    bol:', 'red'],
			['markdown:\n  mojicolor:\n    bold:', null],
			['markdown:\n  mojicolor:\n    bold: green', 'green']
		];
		for (const [yaml, color] of cases) {
			const expected = color ? `<strong style="color: ${color};">本文</strong>` : '<strong>本文</strong>';
			assert.strictEqual(md.render(`---\n${yaml}\n---\n**本文**`, env), `<p>${expected}</p>\n`, yaml);
		}
	});

	test('mojicolorの値を入力途中でも設定オブジェクトとして扱う', () => {
		const md = parser({ 'styles.bold': 'red' });
		for (const value of ['b', 'bo', 'bold']) {
			assert.strictEqual(
				md.render(`---\nmarkdown:\n  mojicolor: ${value}\n---\n**本文**`),
				'<p><strong style="color: red;">本文</strong></p>\n',
				value
			);
		}
	});

	test('env.frontmatterでも入力途中のキーだけを無視し、元のenvを変更しない', () => {
		const md = parser({ 'styles.bold': 'red', 'styles.italic': 'green' });
		for (const key of ['b', 'bo', 'bol', 'i', 'it', 'ita', 'ital', 'itali']) {
			const env = Object.freeze({
				frontmatter: Object.freeze({
					markdown: Object.freeze({
						mojicolor: Object.freeze({ [key]: null })
					})
				})
			});
			assert.strictEqual(
				md.render('**太字** *斜体*', env),
				'<p><strong style="color: red;">太字</strong> <em style="color: green;">斜体</em></p>\n',
				key
			);
			assert.deepStrictEqual(env.frontmatter.markdown.mojicolor, { [key]: null });
		}
	});

	test('env.frontmatterのmojicolorが入力途中の値でも元のenvを変更しない', () => {
		const md = parser({ 'styles.bold': 'red' });
		const env = Object.freeze({
			frontmatter: Object.freeze({
				markdown: Object.freeze({ mojicolor: 'bo' })
			})
		});
		assert.strictEqual(
			md.render('**本文**', env),
			'<p><strong style="color: red;">本文</strong></p>\n'
		);
		assert.strictEqual(env.frontmatter.markdown.mojicolor, 'bo');
	});

	test('未対応キーと不正値を描画設定へ使用しない', () => {
		const md = parser({ 'styles.bold': 'red' });
		for (const styles of [
			{ body: null },
			{ body: 'blue' },
			{ bold: true },
			{ bold: 42 },
			{ bold: '' },
			{ bold: 'red; background: blue' }
		]) {
			assert.strictEqual(
				md.render('**本文**', { frontmatter: { markdown: { mojicolor: styles } } }),
				'<p><strong style="color: red;">本文</strong></p>\n'
			);
		}
	});

	test('markdown-it-mojicolor単体の厳格な設定検証は維持する', () => {
		const md = new MarkdownIt().use(require('markdown-it-mojicolor'));
		assert.throws(
			() => md.render('**本文**', { frontmatter: { markdown: { mojicolor: { body: 'blue' } } } }),
			/env\.frontmatter\.markdown\.mojicolor: unsupported style body/u
		);
	});

	test('VS Codeが開発中の拡張機能をactivateしてMarkdownプラグインを公開する', async () => {
		const extension = vscode.extensions.getExtension('yusu79.markdown-mojicolor');
		assert.ok(extension);
		const exports = await extension.activate();
		assert.strictEqual(typeof exports.extendMarkdownIt, 'function');

		const md = new MarkdownIt();
		exports.extendMarkdownIt(md);
		assert.strictEqual(md.renderInline('%**黄色**%{yellow}'), '<span style="color: yellow;"><strong>黄色</strong></span>');
	});

	test('YAMLキー入力途中でもMarkdown言語機能のリクエストを失敗させない', async function() {
		this.timeout(30000);
		for (const key of ['b', 'bo', 'bol', 'bold', 'i', 'it', 'ita', 'ital', 'itali', 'italic']) {
			const document = await vscode.workspace.openTextDocument({
				language: 'markdown',
				content: `---\nmarkdown:\n  mojicolor:\n    ${key}:\n---\n[リンク](./target.md)\n`
			});
			const lastLine = document.lineAt(document.lineCount - 1);
			const range = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.text.length);

			await vscode.commands.executeCommand('vscode.executeLinkProvider', document.uri);
			await vscode.commands.executeCommand('vscode.executeFoldingRangeProvider', document.uri);
			await vscode.commands.executeCommand('vscode.executeCodeActionProvider', document.uri, range);
			await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
		}

		for (const value of ['b', 'bo', 'bold']) {
			const document = await vscode.workspace.openTextDocument({
				language: 'markdown',
				content: `---\nmarkdown:\n  mojicolor: ${value}\n---\n[リンク](./target.md)\n`
			});
			const lastLine = document.lineAt(document.lineCount - 1);
			const range = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.text.length);

			await vscode.commands.executeCommand('vscode.executeLinkProvider', document.uri);
			await vscode.commands.executeCommand('vscode.executeFoldingRangeProvider', document.uri);
			await vscode.commands.executeCommand('vscode.executeCodeActionProvider', document.uri, range);
			await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
		}

		for (const yaml of [
			'mojicolor:\n    太字:',
			'mojicolor:\n    太字: 赤',
			'mojicolor:\n    bold: true',
			'mojicolor:\n    bold: 42',
			'mojicolor:\n    bold: ""',
			'mojicolor:\n    bold: "red; background: blue"'
		]) {
			const document = await vscode.workspace.openTextDocument({
				language: 'markdown',
				content: `---\nmarkdown:\n  ${yaml}\n---\n[リンク](./target.md)\n`
			});
			const lastLine = document.lineAt(document.lineCount - 1);
			const range = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.text.length);

			await vscode.commands.executeCommand('vscode.executeLinkProvider', document.uri);
			await vscode.commands.executeCommand('vscode.executeFoldingRangeProvider', document.uri);
			await vscode.commands.executeCommand('vscode.executeCodeActionProvider', document.uri, range);
			await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
		}
	});

	test('明示色だけでは太字にせず、範囲内のMarkdownを保持する', () => {
		const md = parser();
		assert.strictEqual(md.renderInline('%黄色%{yellow}'), '<span style="color: yellow;">黄色</span>');
		assert.strictEqual(md.renderInline('%**黄色**%{yellow}'), '<span style="color: yellow;"><strong>黄色</strong></span>');
		assert.strictEqual(
			md.renderInline('%[リンク](https://example.com)と`code`%{blue}'),
			'<span style="color: blue;"><a href="https://example.com">リンク</a>と<code>code</code></span>'
		);
	});

	test('VS Code設定で太字と斜体を自動着色する', () => {
		const md = parser({
			'styles.bold': 'blue',
			'styles.italic': 'green'
		});
		assert.strictEqual(
			md.renderInline('**太字** *斜体*'),
			'<strong style="color: blue;">太字</strong> <em style="color: green;">斜体</em>'
		);
	});

	test('YAMLはVS Code設定を項目単位で上書きし、明示色を最優先する', () => {
		const md = parser({
			'styles.bold': 'red',
			'styles.italic': 'green'
		});
		const source = [
			'---',
			'markdown:',
			'  mojicolor:',
			'    bold: yellow',
			'    italic: null',
			'---',
			'**太字** *斜体* %**明示色**%{blue}'
		].join('\n');
		assert.strictEqual(
			md.render(source),
			'<p><strong style="color: yellow;">太字</strong> <em>斜体</em> <span style="color: blue;"><strong>明示色</strong></span></p>\n'
		);
	});

	test('YAML設定を次の文書へ持ち越さない', () => {
		const md = parser({ 'styles.bold': 'red' });
		assert.strictEqual(
			md.render('---\nmarkdown:\n  mojicolor:\n    bold: blue\n---\n**青**'),
			'<p><strong style="color: blue;">青</strong></p>\n'
		);
		assert.strictEqual(md.render('**赤**'), '<p><strong style="color: red;">赤</strong></p>\n');
	});

	test('追加色辞書を明示色と自動着色の両方で使う', () => {
		const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-mojicolor-'));
		const file = path.join(directory, 'colors.json');
		try {
			fs.writeFileSync(file, JSON.stringify({ brand: '#00a6da' }), 'utf8');
			const md = parser({
				colorFiles: [file],
				'styles.bold': 'brand'
			});
			assert.strictEqual(
				md.renderInline('**自動** %明示%{brand}'),
				'<strong style="color: #00a6da;">自動</strong> <span style="color: #00a6da;">明示</span>'
			);
		} finally {
			fs.rmSync(directory, { recursive: true, force: true });
		}
	});
});
