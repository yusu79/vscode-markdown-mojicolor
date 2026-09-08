# Changelog
すべての重要な変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づき、
バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) を採用しています。

変更の種類
- Added         新機能
- Changed       既存機能の変更
- Deprecated    間もなく削除される機能
- Removed       今回で削除された機能
- Fixed         不具合修正
- Security      脆弱性に関する報告

バージョン X.Y.Z
- X メジャーバージョン      パブリックAPIに対して後方互換性を持たない変更
- Y マイナーバージョン      後方互換性を保ちつつ機能性をパブリックAPIに追加した場合
- Z パッチバージョン        後方互換性を保ったバグ修正を取り込んだ場合


---

## [Unreleased]

### Added
- 太字・斜体の自動着色設定を追加
- YAML Front Matterの`markdown.mojicolor`による文書単位の自動着色設定を追加
- 追加の色辞書JSONファイルを読み込む設定を追加
- 色付き文字内のMarkdown記法に対応

### Changed
- `markdown-it-mojicolor`を1.3.0へ更新

## [1.2.0] -

## v1.1.0
- 日本語対応
  - 和色､洋色､メトロカラー､レールカラーに対応
- RGB指定やHSL指定に対応
  - 変換先を`<font color="色">`から`<span style="color: 色">`に変更

## v1.0.0
- Initial release
