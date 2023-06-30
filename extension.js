'use strict';

function activate() {
	return {
		extendMarkdownIt(md) {
			return md.use(require("markdown-it-mojicolor"));
		}
	}
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
