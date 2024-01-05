# vscode-markdown-mojicolor
![GitHub](https://img.shields.io/github/license/yusu79/vscode-markdown-mojicolor)
![Visual Studio Marketplace Version (including pre-releases)](https://img.shields.io/visual-studio-marketplace/v/yusu79.markdown-mojicolor)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/yusu79.markdown-mojicolor)



Markdownの文字色を変更可能にするVScode拡張機能です｡

以下のように､`%文字%{色}`とすると､文字が指定した色でレンダリングされます｡

![](./images/intro.png)

<!-- omit in toc -->
## 目次（TOC）
- [インストール（Setup）](#インストールsetup)
- [使い方（Quick usage）](#使い方quick-usage)
- [解説（Usage）](#解説usage)
- [参照サイト（Reference Website）](#参照サイトreference-website)
- [使用しているmarkdown-itプラグイン（Plugins）](#使用しているmarkdown-itプラグインplugins)


## インストール（Setup）
VScodeのマーケットプレイスで「Markdown MojiColor」と入力してください｡

![](./images/markdown-mojicolor.png)


## 使い方（Quick usage）
| 入力（Input）                    | レンダリング（Rendering）                                               | 説明（Description）                                      | Description                                                                                    | 
| -------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | 
| `%トマト%{tomato}`               | `<span style="color: tomato;">トマト</span>`                            | 色を直接指定できます｡                                   | Specified by color.                                                                            | 
| `%イエロー%{#ffdc00}`            | `<span style="color: #ffdc00;">イエロー</span>`                         | 16進数で色を指定できます｡                               | Specified in hexadecimal.                                                                      | 
| `%イエロー%{イエロー}`           | `<span style="color: #ffdc00;">イエロー</span>`                         | 日本語で指定すると､対応した16進数に変換します｡         | Specified in Japanese, converted to hexadecimal.                                               | 
| `%桃%{桃色}`                     | `<span style="color: #f09199;">桃</span>`                               | [和色](https://l.pg1x.com/X3e4)も指定できます｡          | Specified in [Japanese traditional colors](https://l.pg1x.com/X3e4), converted to hexadecimal. | 
| `%桃%{ももいろ}`                 | `<span style="color: #f09199;">桃</span>`                               | 読み仮名でも指定できます｡                               | Specified in kana, converted to hexadecimal.                                                   | 
| `%アクア%{rgb(0,255,255)}`       | `<span style="color: rgb(0,255,255);">アクア</span>`                    | RGB表記で色を指定できます｡                              | Specified in RGB.                                                                              | 
| `%ビスク%{hsl(33,100%,88%)}`     | `<span style="color: hsl(33,100%,88%);">ビスク</span>`                  | HSL表記で色を指定できます｡                              | Specified in HSL.                                                                              | 
| `**%ビスク%{hsl(33,100%,88%)}**` | `<strong><span style="color: hsl(33,100%,88%);">ビスク</span></strong>` | 太字にしたいなら､`**%文字%{色}**`のようにしてください｡ | If you want to make it bold, please use `**%text%{color}**` like this.<br>                     | 


## 解説（Usage）
`%文字%{色}`を`<span style="color: 色">文字</span>`に変換するmarkdown-itプラグインです｡

色は「色名」、「16進数」、「RGB」、「HSL」等で指定します。

色名は日本語にも対応しています。
例えば、`%文字%{桃色}`とすると､桃の色に近い`#f09199`に変換されます。

どの色に対応しているかは、[日本の伝統色 和色大辞典 - Traditional Colors of Japan](https://l.pg1x.com/X3e4)を参照してください。


## 参照サイト（Reference Website）
- [日本の伝統色 和色大辞典 - Traditional Colors of Japan](https://l.pg1x.com/X3e4)
- [世界の伝統色 洋色大辞典 - Traditional Colors of World](https://l.pg1x.com/eT5p)
- [地下鉄のシンボルカラー メトロカラー - Metro Colors](https://l.pg1x.com/kCcm)
- [国鉄制定の塗装色 レールカラー(国鉄色) - Rail Colors](https://l.pg1x.com/iyJ7)




サイト元の原色大辞典（ https://www.colordic.org/ )さんには、OSSでの公開と使用の許可を頂いております。


## 使用しているmarkdown-itプラグイン（Plugins）
- [yusu79/markdown-it-mojicolor](https://l.pg1x.com/sggo)
