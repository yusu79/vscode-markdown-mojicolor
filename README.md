# vscode-markdown-mojicolor
VScode extension to enable changing Markdown text color.

<!-- omit in toc -->
## TOC
- [Quick usage](#quick-usage)
- [markdown-it-plugin in use](#markdown-it-plugin-in-use)

## Quick usage
Works:
| Input               | Render                                | 
| ------------------- | ------------------------------------- | 
| `%Tomato%{tomato}`  | `<font color="tomato">Tomato</font>`  | 
| `%Orange%{#ffa500}` | `<font color="#ffa500">Orange</font>` | 

Doesn't work:
| Input                      | Render                                       | Description                  | 
| -------------------------- | -------------------------------------------- | ---------------------------- | 
| `%Aqua%{rgb(0,255,255)}`   | `<font color="rgb(0,255,255)">Aqua</font>`   | `<font>` does not support RGB. | 
| `%Bisque%{hsb(33,23,100)}` | `<font color="hsb(33,23,100)">Bisque</font>` | `<font>` does not support HSB. | 


## markdown-it-plugin in use
- [yusu79/markdown-it-mojicolor](https://l.pg1x.com/sggo)
