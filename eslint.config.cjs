'use strict';

module.exports = [
	{
		ignores: ['.vscode-test/**', 'node_modules/**']
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2019,
			sourceType: 'commonjs',
			globals: {
				__dirname: 'readonly',
				console: 'readonly',
				module: 'readonly',
				process: 'readonly',
				require: 'readonly',
				suite: 'readonly',
				test: 'readonly'
			}
		},
		rules: {
			'constructor-super': 'warn',
			'no-const-assign': 'warn',
			'no-this-before-super': 'warn',
			'no-undef': 'warn',
			'no-unreachable': 'warn',
			'no-unused-vars': 'warn',
			'valid-typeof': 'warn'
		}
	}
];
