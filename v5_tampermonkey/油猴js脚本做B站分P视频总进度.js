// ==UserScript==
// @name         B站合集视频总进度栏
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  B站在有分P的视频中，只有集数的情况，而没有从时间上考虑已看多少，此插件在打开分匹配视频是会在视频名旁边弹出这方面情况，在改变分P时要手动点击弹出的窗口来更新
// @author       zweix
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

//javascript:( //function () {

window.onload = function () {  //入口
    void function (time) {  //匿名的sleep函数，等网页加载完
        return new Promise((resolve) => setTimeout(resolve, time));
    } (2 * 1000).then(() => {  //等两秒
        let list = document.getElementsByClassName('cur-page');  //查看合集的页数，没有分P的长度是0的
        if (list.length == 0) return ;
        solve();
    })
}
function get(num) {  //对于一个索引，从开始到这个索引的时间
    let hour = 0, minute = 0, second = 0;
    for (let i = 0; i < num; ++ i) {
        let vec = document
            .getElementsByClassName('duration')[i]
            .innerHTML.match(/\d+/g);
        if (vec.length == 2) vec.unshift('0');
        hour += parseInt(vec[0]);
        minute += parseInt(vec[1]);
        second += parseInt(vec[2]);
    }
    minute += Math.floor(second / 60); second %= 60;
    hour += Math.floor(minute / 60); minute %= 60;

    let index = num;
    let str = hour + ':' + minute + ':' + second;
    let sum = hour * 3600 + minute * 60 + second

    return {index, str , sum};  //返回这个数的索引、时间（字符串）、总用时（数字）
}

function solve() {
    //获得所有——当前的和最后的
    let cur = parseInt(document
        .getElementsByClassName('cur-page')[0]
        .innerHTML.match(/(\d+)\//)[1]);
    let end = parseInt(document
        .getElementsByClassName('cur-page')[0]
        .innerHTML.match(/\/(\d+)/)[1]);
    cur = get(cur)
    end = get(end)
    //展示
    show(cur, end)
}

function show(cur, end) {
    let plain = document.getElementsByClassName('video-data')[0];  //确定位置
    let sam = document.getElementById('button_tag_zweix');  //原因见下
    let isNULL = (sam === null);  //检测这个按钮有无，如果没有，就建立，如果已经有，说明之前创建过，就在其基础上修改

    if (isNULL) {
        sam = document.createElement('button');
        sam.setAttribute('id', 'button_tag_zweix');
        sam.style = '\n' +
            '    background-color: #24c7b4;\n' +
            '    color: white;\n' +
            '    font-size: 1rem;\n' +
            '    text-align: center;\n' +
            '    margin-left: 1rem;\n' +
            '    padding:0.5rem;\n' +
            '    cursor: pointer;\n' +
            //'    border-radius: 1rem;\n' +  //借鉴的代码是圆角的，确实更好看，但是按钮的阴影会突兀
            '    ';
        sam.addEventListener("click", solve);  //借鉴的代码是计时然后周期性更新，我采用点击按钮手动更新
    }

    sam.innerHTML = "现在是第" + cur.index + "集，共用时" + cur.str + ";  已完成" + (cur.sum / end.sum * 100).toFixed(2) + "%";

    if (isNULL) plain.appendChild(sam);

}
//})();

    // Your code here...
})();