# vscode-markdown-mojicolor
![GitHub](https://img.shields.io/github/license/yusu79/vscode-markdown-mojicolor)
![Visual Studio Marketplace Version (including pre-releases)](https://img.shields.io/visual-studio-marketplace/v/yusu79.markdown-mojicolor)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/yusu79.markdown-mojicolor)



Markdownの文字色を変更可能にするVScode拡張機能です｡

以下のように､`%文字%{色}`とすると､文字が指定した色でレンダリングされます｡

![](./images/intro.png)

<!-- omit in toc -->
## 目次
- [使い方](#使い方)
- [使用しているmarkdown-itプラグイン](#使用しているmarkdown-itプラグイン)

## 使い方

Works:
| 入力                    | レンダリング                                           | 説明                                                     | 
| ----------------------- | ------------------------------------------------------ | -------------------------------------------------------- | 
| `%トマト%{tomato}`      | `<font color="tomato">トマト</font>`                   | 色を直接指定できます｡                                   | 
| `%オレンジ%{#ffa500}`     | `<font color="#ffa500">オレンジ</font>`                  | 16進数でも色を指定できます｡                             | 
| `**%オレンジ%{#ffa500}**` | `<strong><font color="#ffa500">オレンジ</font></strong>` | 太字にしたいなら､`**%文字%{色}**`のようにしてください｡ | 

Doesn't work:
| 入力                      | レンダリング                                       | 説明                      | 
| -------------------------- | -------------------------------------------- | -------------------------------- | 
| `%アクア%{rgb(0,255,255)}`   | `<font color="rgb(0,255,255)">アクア</font>`   | `<font>` はRGBをサポートしていません｡   | 
| `%ビスク%{hsb(33,23,100)}` | `<font color="hsb(33,23,100)">ビスク</font>` | `<font>` はHSBをサポートしていません｡   | 
| `%**オレンジ**%{#ffa500}`    | `<font color="#ffa500">**オレンジ**</font>`    | `%**文字**%{色}`のようにすると､太字にならず､そのまま記号として表示されます｡ | 



## 使用しているmarkdown-itプラグイン
- [yusu79/markdown-it-mojicolor](https://l.pg1x.com/sggo)
