// ==UserScript==
// @name         B站合集总进度栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于B站的合集在时间维度上的总进度，设计时尽可能解耦，利于个性化修改
// @author       zweix
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

//javascript:( //function () {

window.onload = function () { //入口
    let number = 2;  //等待网页加载时间，这里选择2秒，万一不行呢
    void function (time) {  //匿名的sleep函数，用于等网页加载完
        return new Promise((resolve) => setTimeout(resolve, time));
    } (number * 1000).then(() => {  //等两秒
        let list = document.getElementsByClassName('cur-page');  //获得分P栏的表头，如果不是合集其长度为0
        if (list.length == 0) return ;
        solve();
    })
}
function get(num) {  //对于一个索引，得到从合集开始到这个索引视频的一些时间
    let hour = 0, minute = 0, second = 0;
    for (let i = 0; i < num; ++ i) {
        let vec = document
            .getElementsByClassName('duration')[i]  //这个是每一个栏的信息
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

    return {index, str , sum};  //返回这集视频的索引（为了统一）、时间 （字符串）、总用时（数字）这三者的元组（js是叫这个吧--手动捂脸--）
}

function solve() {
    //分P栏的表头，利用正则表达式提取出想要的信息
    let cur = parseInt(document
        .getElementsByClassName('cur-page')[0]
        .innerHTML.match(/(\d+)\//)[1]);
    let end = parseInt(document
        .getElementsByClassName('cur-page')[0]
        .innerHTML.match(/\/(\d+)/)[1]);
    cur = get(cur)
    end = get(end)
    //显示出来
    show(cur, end)
}

function show(cur, end) {
    let plain = document.getElementsByClassName('video-data')[0];  //确定位置
    let sam = document.getElementById('button_tag_zweix');  //原因见下
    let isNULL = (sam === null);  //因为这个地方要更新，这里的策略是如果没有就创建，没有就在其基础上修改

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
            '    ';
        sam.addEventListener("click", solve);  //更新方案，手动点击按钮来更新，为何不采用更自动的方案看说明
    }

    sam.innerHTML = "现在是第" + cur.index + "集，共用时" + cur.str + ";  已完成" + (cur.sum / end.sum * 100).toFixed(2) + "%";

    if (isNULL) plain.appendChild(sam);

}
//})();

    // Your code here...
})();
