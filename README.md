# hexo-theme-Minimalist
A minimalist style Hexo theme, [Demo](http://cn-dxtz.github.io/)

## Preview
- Pure Color, Navigation bar stays at the top, scrolling becomes hyaline

![Minimalist_2.jpg](https://cdn.jsdelivr.net/gh/CN-DXTZ/Blog-Img-Bed/PicGo/Minimalist_2.jpg)

- Code block highlight:

![Minimalist_3.jpg](https://cdn.jsdelivr.net/gh/CN-DXTZ/Blog-Img-Bed/PicGo/Minimalist_3.jpg)

- Markdown render, common effects include: 
    - nested blockquote: corresponding level, highlighted at the left end
    - nested ordered and unordered lists: corresponding level and its parent , highlighted at the left end
    - auto sequence number and links of multi level title

![Minimalist_4.jpg](https://cdn.jsdelivr.net/gh/CN-DXTZ/Blog-Img-Bed/PicGo/Minimalist_4.jpg)

- categories, archive and tags cloud, key parts display

![Minimalist_5.jpg](https://cdn.jsdelivr.net/gh/CN-DXTZ/Blog-Img-Bed/PicGo/Minimalist_5.jpg)

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
  Although the hexo-renderer-marked is the default plugin now, it has some bugs of unordered lists' render and is not compatible with our code highlight javascript —— [prismjs](https://prismjs.com/), and you can customize supported languages and plugins like "Line Numbers", "Copy to Clipboard Button" and so on in that official website, maybe some plugins need to modify something manually
  So if your Markdown renderer plugin is default or others, you can do or reference by this:

```bash
npm uninstall -s hexo-renderer-marked
npm install -s  hexo-renderer-kramed@0.1.4
```

## More functions to be realized
- [ ] Support TOC
- [ ] Support display the before and after article
- [ ] Support click to top or bottom
- [ ] Support picture full screen
- [ ] Support the comment plugin