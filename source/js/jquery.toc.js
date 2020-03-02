// TOC 滚动到固定位置开始固定
var post_toc = document.getElementsByClassName("post-toc")[0]
var toc_rest = document.documentElement.clientWidth * 7.5 / 100.0;
window.addEventListener("scroll", e => {
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    if (top > toc_rest) {
        post_toc.style = "position:fixed;top:4.5vw;";
    } else {
        post_toc.style = "";
    }
});


// 对应目录小标题高亮
var $ol = $('.toc');
var titleList = $('.post-content').find('h1,h2,h3,h4,h5,h6');
$(window).scroll(function (e) {
    var top = $(document).scrollTop();
    var currentID = '';
    titleList.each(function () {
        var $this = $(this);
        var itemTop = $this.offset().top;
        if (top > itemTop - 50) {
            currentID = '#' + $this.attr('id');
        } else {
            return false;
        }
    });
    var currentLink = $ol.find('.actived');
    if (currentID && currentLink.attr('href') !== currentID) {
        currentLink.removeClass('actived');
        var aList = $ol.find("[href='" + currentID + "']");
        aList.addClass('actived');
    }
});
