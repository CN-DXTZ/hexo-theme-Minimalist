# hexo-theme-Minimalist
A minimalist style Hexo theme, [Demo](http://cn-dxtz.github.io/)

## Features
![Minimalist_8.png](https://cdn.jsdelivr.net/gh/CN-DXTZ/Blog-Img-Bed/PicGo/Minimalist_8.png)
- Pure Color, Navigation bar stays at the top, scrolling becomes hyaline
- code block highlight:
- nested blockquote: corresponding level, highlighted at the left end
- nested ordered and unordered lists: corresponding level and its parent , highlighted at the left end
- auto sequence number and links of multi level title

## Instructions
- install

```bash
cd themes
git clone https://github.com/CN-DXTZ/hexo-theme-Minimalist.git
```

- modify the configs file —— `_config.yml` ,  to modify the theme name and disable the highlight, in the end, look like this:

```yaml
themes: hexo-theme-Minimalist

highlight:
  enable: false
```

- Make sure that the plugin [hexo-wordcount](https://github.com/willin/hexo-wordcount) is installed.
  if you not, to install it by this:

```bash
npm install -s  hexo-wordcount
```

- Make sure that the Markdown renderer plugin is [hexo-renderer-kramed](https://github.com/sun11/hexo-renderer-kramed), not [hexo-renderer-marked](https://github.com/hexojs/hexo-renderer-marked)  
  Although the hexo-renderer-marked is the default plugin now, it has some bugs of unordered lists' render and is not compatible with our code highlight javascript —— [prismjs](https://prismjs.com/)
  So if your Markdown renderer plugin is default or others, you can do or reference by this:

```bash
npm uninstall -s hexo-renderer-marked
npm install -s  hexo-renderer-kramed@0.1.4
```

## Attention:
- For the code highlight, the theme use the [prismjs](https://prismjs.com/)
  - you can customize supported languages and plugins like "Line Numbers", "Copy to Clipboard Button" and so on in that official website, maybe some plugins need to modify something manually
  - when you write Markdown, for support some languages which is symbol suffix, like c++, c# ..., you must use the language sign as cpp, csharp... , for details, please refer to the official website

## More functions to be realized
- [×] Support display the before and after article
- [ ] Support TOC
- [ ] Support click to top or bottom
- [ ] Support picture full screen
- [ ] Support the comment plugin
- [ ] Support the search plugin