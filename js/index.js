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
      html +=
        "<li data-channel-id=" +
        channel.channel_id +
        " data-channel-name=" +
        channel.name +
        ">" +
        '<div class="cover" style="background-image:url(' +
        channel.cover_small +
        ')"></div>' +
        "<h2>" +
        channel.name +
        "</h2>" +
        "</li>"
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

footer.init()

// EventCenter.on('music-albumn',function(e,data){
//     console.log(data)
// })
