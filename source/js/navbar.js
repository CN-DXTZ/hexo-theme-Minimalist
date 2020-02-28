var header = document.getElementsByClassName("header")[0];
window.onscroll = function () {
    if (document.documentElement.scrollTop > (0)) {
        header.classList.add('header-fixed');
    } else {
        header.classList.remove('header-fixed');
    }
}
