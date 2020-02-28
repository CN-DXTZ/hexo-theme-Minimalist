// <a onclick="pageToTop()">返回顶部</a>
function pageToTop() {
    window.scrollBy(0, -100);
    scrolldelay = setTimeout('pageToTop()', 100);
    var sTop = document.documentElement.scrollTop + document.body.scrollTop;
    if (sTop == 0) clearTimeout(scrolldelay);
}