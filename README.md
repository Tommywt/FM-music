# FM-music

## 功能介绍：
一款类似与豆瓣FM音乐电台的音乐播放器，提供歌曲分类选择，收藏，歌曲播放，下一曲，暂停，进度条快进等功能。

## 项目技术介绍：
  1. 使用了ajax，获取百度FM音乐的歌曲，歌词；
  2. 使用了媒体查询以及vh单位，实现了页面的响应式
  3. 使用jQuery，封装了一款歌词特效的插件
  4. 使用mvc模式，是整个代码更加易读，更加复用

## 遇到的问题：
在一个上一首歌是有歌词，下一首歌是没有歌词的情况下，会出现没有歌词的歌里是上一首的歌词

解决:在数据到了之后，就应该去判断歌词，再去渲染歌词到页面上；而不是在歌曲都开始播放了，你才去判断歌词是不是空的

## 项目的收获
- 学到了mvc去组织自己的代码结构
- 学会了响应式页面的原理
- 学会了简单jquery插件
- 学会了如何log调试

## 技术关键字
jQuery、CSS3、响应式，ajax