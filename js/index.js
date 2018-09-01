var EventCenter = {
  on: function(type, handler) {
    $(document).on(type, handler)
  },
  fire: function(type, data) {
    $(document).trigger(type, data)
  }
}

var footer = {
  init: function() {
    this.$footer = $("footer")
    this.$ul = this.$footer.find("ul")
    this.$box = this.$footer.find(".box")
    this.$leftBtn = this.$footer.find(".icon-left")
    this.$rightBtn = this.$footer.find(".icon-right")
    this.isToEnd = false //判断图片是否已经滚动结束了
    this.isToStart = true
    this.isAnimate = false

    this.bind()
    this.render()
  },
  bind: function() {
    var that = this
    this.$rightBtn.on('click',function(){
        if (that.isAnimate) return//判断按钮是不是正在一直点击

        var itemWidth = that.$box.find('li').outerWidth(true)//单个li的width
        var rowCount = Math.floor(that.$box.width()/itemWidth)//计算一行能放几个li
        if(!that.isToEnd){
        that.isAnimate = true
        that.$ul.animate({
            left:'-=' + rowCount*itemWidth
        },500,function(){
            that.isAnimate = false
            that.isToStart = false
            var boxWidth = parseInt(that.$box.width())
            var ulLeft = parseInt(that.$ul.css('left'))
            var ulWidth = parseInt(that.$ul.width())
            if ( boxWidth - ulLeft >= ulWidth ){
                // console.log("over")
                that.isToEnd = true
            }
        })
        }
    })

    this.$leftBtn.on('click',function(){
    var itemWidth = that.$box.find('li').outerWidth(true)//单个li的width
    var rowCount = Math.floor(that.$box.width()/itemWidth)//计算一行能放几个li
    if (that.isAnimate) return
    if (!that.isToStart){
        that.isAnimate = true
        that.$ul.animate({
            left:'+=' + rowCount*itemWidth
        },500,function(){
            that.isAnimate = false
            that.isToEnd = false
            var boxWidth = parseInt(that.$box.width())
            var ulLeft = parseInt(that.$ul.css('left'))
            var ulWidth = parseInt(that.$ul.width())
            if ( ulLeft >= 0 ){
                // console.log("over")
                that.isToStart = true
            }
        })
    }
    })

    this.$footer.on('click','li',function(){
        $(this).addClass('active')
        .siblings().removeClass('active')

        EventCenter.fire('music-albumn',{
        channelId: $(this).attr('data-channel-id'),
        channelName: $(this).attr('data-channel-name')
        })
    })
  },
  render: function() {
    var that = this
    $.ajax({
      url: "https://jirenguapi.applinzi.com/fm/getChannels.php",
      dataType: "json"
    })
      .done(function(res) {
        that.renderFooter(res.channels) //渲染底部数据
      })
      .fail(function() {
        console.log("error")
      })
  },
  renderFooter: function(channels) {
    console.log(channels)
    var html = ""
    channels.forEach(function(channel) {
      html +="<li data-channel-id=" +channel.channel_id +" data-channel-name=" + channel.name +">" 
           +'<div class="cover" style="background-image:url(' + channel.cover_small +')"></div>'
           +"<h2>" +channel.name +"</h2>"
           +"</li>"
    })
    this.$ul.html(html)
    this.setStyle()
  },
  setStyle: function() {
    var count = this.$footer.find("li").length
    var width = this.$footer.find("li").outerWidth(true)
    this.$ul.css({
      width: count * width + "px"
    })
  }
}


var app = {
    init:function(){
        this.$container = $('#page-music')
        this.clock = null
        this.audio = new Audio()
        this.audio.autoplay = true
        this.bind()
    },
    bind:function(){
        var that = this
        EventCenter.on('music-albumn',function(e,channel){
            that.channelId = channel.channelId
            that.channelName = channel.channelName
            that.loadMusic()
        })

        this.$container.find('.btn-play').on('click',function(){
            if ($(this).hasClass('icon-pause')){
                $(this).removeClass('icon-pause').addClass('icon-play')
                that.audio.pause()
            }else{
                $(this).removeClass('icon-play').addClass('icon-pause')
                that.audio.play()
            }
        })

        this.$container.find('.btn-next').on('click',function(){
            that.loadMusic(function(){
                that.setMusic()
            })
        })

        this.audio.addEventListener('play',function(){
            clearInterval(that.clock)
            that.clock = setInterval(function(){
                that.updateState()
            },1000)
        })

        this.audio.addEventListener('pause',function(){
            clearInterval(that.clock)
        })
    },
    loadMusic:function(){
        var that = this
        $.ajax({
            url:'https://jirenguapi.applinzi.com/fm/getSong.php',
            dataType:'json',
            data:{
                channel:this.channelId
            }
        }).done(function(res){
            that.song = res.song[0]
            that.setMusic()
            that.loadLyric()
        })
    },
    setMusic:function(){
        console.log(this.song)
        this.audio.src = this.song.url
        this.$container.find('.music-img').css('background-image','url('+this.song.picture +')')
        this.$container.find('.music-detail h2').text(this.song.title)
        this.$container.find('.music-detail .author').text(this.song.artist)
        this.$container.find('.tag').text(this.channelName)
    },
    updateState:function(){
        var min = Math.floor(this.audio.currentTime/60)
        var second = Math.floor(this.audio.currentTime%60) + ''
        second = second.length === 2 ? second : '0' + second
        this.$container.find('.current-time').text(min + ':' + second)
        this.$container.find('.bar-progress').css('width', this.audio.currentTime/this.audio.duration * 100 + '%')
        this.setLyric()
    },
    loadLyric:function(){
        var that = this
        $.ajax({
            url:'https://jirenguapi.applinzi.com/fm/getLyric.php',
            dataType:'json',
            data:{
                sid:this.song.sid
            }
        }).done(function(res){
            console.log(res)
            var lyricObj = {}
            res.lyric.split('\n').forEach(function(line){
                var timeArr = line.match(/\d{2}:\d{2}/g)
                if(timeArr){
                    timeArr.forEach(function(time){
                        lyricObj[time] = line.replace(/\[.+?\]/g, '')
                    })
                }
            })
            that.lyricObj = lyricObj
        })
    },
    setLyric:function(){
        // console.log(this.lyricObj)
        var min = Math.floor(this.audio.currentTime/60)
        var second = Math.floor(this.audio.currentTime%60) + ''
        second = second.length === 2 ? second : '0' + second
        var line = this.lyricObj['0'+min+':'+second]
        if (line){
            this.$container.find('.lyric').text(line)
        }
    }
}


footer.init()
app.init()


