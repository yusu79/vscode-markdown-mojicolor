# Changelog

[日本語](#changelog) | [English](#english)

すべての重要な変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づき、
バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) を採用しています。

変更の種類
- 追加              新機能の追加
- 変更              既存機能の変更
- 廃止予定          間もなく削除される機能
- 削除              今回で削除された機能
- 修正              不具合修正
- セキュリティ      脆弱性に関する報告

バージョン X.Y.Z
- X メジャーバージョン      パブリックAPIに対して後方互換性を持たない変更
- Y マイナーバージョン      後方互換性を保ちつつ機能性をパブリックAPIに追加した場合
- Z パッチバージョン        後方互換性を保ったバグ修正を取り込んだ場合

---

### [1.2.0] - 2026-09-12

#### 追加
- 太字・斜体の自動着色設定を追加
- YAML Front Matterの`markdown.mojicolor`による文書単位の自動着色設定を追加
- 追加の色辞書JSONファイルを読み込む設定を追加
- 太字や斜体などのインライン記法に対応
- Markdown MojiColorの設定変更時に、VS Codeの再読み込みを案内するメッセージを追加
- 拡張機能とVS Code設定の説明文を日本語と英語で表示するローカライズを追加

#### 変更
- 太字・斜体の自動着色の色をVS Code設定UIの入力欄から直接指定できるように変更
- `markdown-it-mojicolor`を1.4.0へ更新

#### 修正
- YAML Front Matterの入力途中・未対応キー・不正な色指定によってMarkdown言語機能が失敗しないように修正

### [1.1.0]
- 日本語対応
  - 和色､洋色､メトロカラー､レールカラーに対応
- RGB指定やHSL指定に対応
  - 変換先を`<font color="色">`から`<span style="color: 色">`に変更

### [1.0.0]
- Initial release

## English

[日本語](#changelog) | [English](#english)

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

Change types:

- Added: new features
- Changed: changes to existing functionality
- Deprecated: features scheduled for removal
- Removed: removed features
- Fixed: bug fixes
- Security: vulnerability-related changes

Version X.Y.Z:

- X, major version: incompatible changes to the public API
- Y, minor version: backward-compatible additions to functionality
- Z, patch version: backward-compatible bug fixes

---

### [1.2.0] - 2026-09-12

#### Added

- Added settings for automatically coloring bold and italic text.
- Added per-document automatic coloring through `markdown.mojicolor` in YAML Front Matter.
- Added a setting for loading additional color dictionary JSON files.
- Added support for Markdown syntax inside colored text.
- Added a prompt recommending a VS Code window reload after Markdown MojiColor settings change.
- Added Japanese and English localization for the extension and VS Code setting descriptions.

#### Changed

- Changed the bold and italic automatic-color settings so their colors can be entered directly in the VS Code settings UI.
- Updated `markdown-it-mojicolor` to 1.4.0.

#### Fixed

- Prevented incomplete input, unsupported keys, and invalid color values in YAML Front Matter from causing Markdown language features to fail.

### [1.1.0]

- Added Japanese support.
  - Added Japanese traditional colors, international traditional colors, metro colors, and rail colors.
- Added RGB and HSL notation.
  - Changed the generated element from `<font color="color">` to `<span style="color: color">`.

### [1.0.0]

- Initial release.
