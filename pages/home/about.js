let app = getApp(),
    pageParams = {
        data: {
            version: 'v0.1.0',
            bg_display: true,
            i: 0
        }
    };

pageParams.onLoad = function() {
    this.setData({
        version: app.VERSION,
        navH: app.globalData.navHeight
    });
};
pageParams.logOut = function() {
    wx.clearStorage()
};
pageParams.onPullDownRefresh = function() {
    let i = this.data.i;
    console.log(i)
    this.setData({
        i: ++i
    });
    if (i == 3) {
        this.setData({
            bg_display: true
        });
    }
    setTimeout(function() {
        wx.stopPullDownRefresh();
    }, 1000);
};

pageParams.onShareAppMessage= function () {
    return {
            title: '「 TimeScope 时界 」',
            path: '/pages/index/index',
            imageUrl: 'https://timescope.jovel.net/upload/2020/3/share-9038e4fc492c4ed7ab1aa8fbfc47dfeb.png',
    }
},
pageParams.navLast = function (){

    wx.navigateBack({
      delta: 2
    });
      
      },


Page(pageParams);


