# vscode-markdown-mojicolor
EN:  VScode extension that allows changing Markdown text color with `%character%{color}`.

JP: `%文字%{色}`でMarkdownの文字色を変更可能にするVScode拡張機能｡

![](https://github.com/yusu79/vscode-markdown-mojicolor/blob/main/img/intro.png)

<!-- omit in toc -->
## TOC
- [Quick usage](#quick-usage)
- [markdown-it-plugin in use](#markdown-it-plugin-in-use)

## Quick usage

Works:
| Input                   | Render                                                 | 
| ----------------------- | ------------------------------------------------------ | 
| `%Tomato%{tomato}`      | `<font color="tomato">Tomato</font>`                   | 
| `%Orange%{#ffa500}`     | `<font color="#ffa500">Orange</font>`                  | 
| `**%Orange%{#ffa500}**` | `<strong><font color="#ffa500">Orange</font></strong>` | 

Doesn't work:
| Input                      | Render                                       | Description                      | 
| -------------------------- | -------------------------------------------- | -------------------------------- | 
| `%Aqua%{rgb(0,255,255)}`   | `<font color="rgb(0,255,255)">Aqua</font>`   | `<font>` does not support RGB.   | 
| `%Bisque%{hsb(33,23,100)}` | `<font color="hsb(33,23,100)">Bisque</font>` | `<font>` does not support HSB.   | 
| `%**Orange**%{#ffa500}`    | `<font color="#ffa500">**Orange**</font>`    | The `**` is output as it is. | 



## markdown-it-plugin in use
- [yusu79/markdown-it-mojicolor](https://l.pg1x.com/sggo)
