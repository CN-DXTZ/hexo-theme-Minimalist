var value_left = 0, isScrolled = false, isToTop = true; // 侧边点击标记变量

// 滚动到固定位置开始固定
var post_toc = document.getElementsByClassName("post-toc")[0]
var toc_ToTop = document.documentElement.clientWidth * 7 / 100.0;
$(document).scroll(function () {
    var top = $(document).scrollTop();
    isScrolled = true;
    if (top > toc_ToTop) {
        isToTop = false;
        post_toc.style = "position:fixed;top:5vw;left:-" + value_left + "vw;";
    } else {
        isToTop = true;
        post_toc.style = "position:reletive;left:-" + value_left + "vw;";
    }
});


// 对应目录标题高亮
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

// 侧边点击收起滑出
$(document).ready(function () {
    var toc = $(".post-toc"),
        title = $(".toc-title"),
        icon = $(".icon-mulu"),
        button = $(".icon-houtui"),
        isShow = true;
    title.click(function () {
        if (isShow) {
            isShow = false;
            value_left = 18.1;
            if (isToTop) {
                post_toc.style = "position:reletive;left:-" + value_left + "vw;";
            } else {
                post_toc.style = "position:fixed;top:5vw;left:-" + value_left + "vw;";
            }
            icon.css("left", "9.4vw");
            button.addClass("icon-qianjin");
            title.css("transform", "translate\(5vw,0\)");

        } else {
            isShow = true;
            value_left = 0;
            icon.css("left", "0");
            title.css("transform", "translate\(0,0\)");
            button.removeClass("icon-qianjin");
            if (isToTop) {
                post_toc.style = "position:reletive;left:-" + value_left + "vw;";
            } else {
                post_toc.style = "position:fixed;top:5vw;left:-" + value_left + "vw;";
            }
        }
    });
})