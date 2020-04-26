var app = getApp();

Page({
	data: {
		weekTitle: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri&nbsp;&nbsp;'],
		weeks: "",
		istrue: false,
		refreshing: false, // 将refreshing设为true，可支持自动触发下拉刷新的场景。同样会触发refresh事件
		refreshed: false, 
		requestweek: 0,
		currentweek: 0,
		nav_title: "TimeScope",
		requestOthers: false,
		gapName: "",
    isPopping: false,//是否已经弹出
    animPlus: {},//旋转动画
    animCollect: {},//item位移,透明度
    animTranspond: {},//item位移,透明度
    animInput: {},//item位移,透明度
    drag_style: {
      x: "24px",
      y: "25px"
    },
    preX: "",
    preY: "",
    screen: {
      width: "",
      height: ""
    },
    w: 50,
    h:50,
    type: "",
    dragx: "",
		dragy: "",
		array: ['10 Weeks Before', '9 Weeks Before', '8 Weeks Before', '7 Weeks Before', '6 Weeks Before', '5 Weeks Before', '4 Weeks Before', '3 Weeks Before', '2 Weeks Before', '1 Week Before', 'Current Week', '1 Week After', '2 Weeks After', '3 Weeks After', '4 Weeks After', '5 Weeks After', '6 Weeks After', '7 Weeks After', '8 Weeks After', '9 Weeks After', '10 Weeks After', '11 Weeks After', '12 Weeks After', '13 Weeks After', '14 Weeks After', '15 Weeks After', '16 Weeks After', '17 Weeks After', '18 Weeks After', '19 Weeks After', '20 Weeks After'],
		index: 10,
	},

  onLoad: function (options) {
		var that = this
		this.pubMove = 0;
		this.setData({
			navH: app.globalData.navHeight,
			refreshing: true
		})

		that.requestOthers = false
		that.requestweek = 0
		that.currentweek = 0
	},
	refresh() {
		var that = this
    app.syncTable().then(res => {
			setTimeout(() => {
				that.setData({
					refreshed: true,
				})
			}, 1000)
    }).catch(e => {
      console.log("syncFailed")
    })

  },
	closeDialog: function () {
		wx.showTabBar()
		this.setData({
				istrue: false
		})

},
	showDialog: function (e) {
	var viewDataSet = e.target.dataset;
	wx.hideTabBar()

	this.setData({
			istrue: true,
			staff: viewDataSet.staff,
			date: viewDataSet.date,
			room: viewDataSet.room,
			start: viewDataSet.starttime,
			end: viewDataSet.endtime,
			type: viewDataSet.type,
			activity: viewDataSet.activity
	})
},
	swichMe: function () {
		wx.showTabBar()
		this.setData({
				bindistrue: false
		})
		setTimeout(() => {
			wx.switchTab({
				url: '../account/account'}
			)
		}, 300)},

  onShow: function () {
		var that = this
		if(that.requestOthers == true){
			that.requestweek = 0
			}
		if(wx.getStorageSync("stuName") == "") {
			wx.hideTabBar()
			that.setData({
					bindistrue: true
			})
			} else {
				console.log(wx.getStorageSync('timetable'))
			that.setData({
				list: wx.getStorageSync('timetable'),
				nav_title: "TimeScope",
				//res代表success函数的事件对，data是固定的，list是数组
			})

		}

	},
	openList: function () {
		//wxLogin()
		wx.navigateTo({
			url: '/pages/todo/todo'
		})
	
	},
	

	nextPage: function () {
		var that = this;
		that.requestweek = that.requestweek + 1
		console.log(that.requestweek)
		wx.request({
			url: 'https://wechat.jovel.net/getTable',
			data: {
				time: that.requestweek,
				openid: wx.getStorageSync('openid'),
			},
			headers: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				console.log(res.data)
				if(res.data.Status != "Fail")
				{
					if(res.data != ""){
						that.currentweek = res.data[0].currentweek
						wx.showToast({
							title: 'Successful',
							icon: 'success',
							duration: 1200
						})
						that.requestOthers = true
						var week = parseInt(res.data[0].currentweek) + that.requestweek
						if(that.requestweek > 0){that.gapName = " Week(s) After"} else {that.gapName = " Week(s) Before"}
						if(that.requestweek != 0){
							that.setData({
								list: res.data,
								nav_title: Math.abs(that.requestweek).toString() + that.gapName
							})
						}else{
							that.setData({
								list: res.data,
								nav_title: "Current Week"
							})
						}
					}
					else{
						if(that.requestweek > 0){that.gapName = " Week(s) After"} else {that.gapName = " Week(s) Before"}
						var week = parseInt(that.currentweek) + that.requestweek
						if(that.requestweek != 0){
							that.setData({
								list: '',
								nav_title: Math.abs(that.requestweek).toString() + that.gapName
							})
						}else{
							that.setData({
								list: '',
								nav_title: "Current Week"
							})
						}
					}
				}
				 else {
					that.requestweek = that.requestweek - 1
				}

			},
			fail: function (error) {
				wx.showToast({
					title: 'Connection error',
					icon: 'none',
					duration: 700
				});
			}
		})
			
	},
	lastPage: function () {
		var that = this;
		that.requestweek = that.requestweek - 1
		console.log(that.requestweek)
		wx.request({
			url: 'https://wechat.jovel.net/getTable',
			data: {
				time: that.requestweek,
				openid: wx.getStorageSync('openid'),
			},
			headers: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				console.log(res.data)
				if(res.data.Status != "Fail")
				{
					if(res.data != ""){
						that.currentweek = res.data[0].currentweek
						wx.showToast({
							title: 'Successful',
							icon: 'success',
							duration: 1200
						})
						that.requestOthers = true
						var week = parseInt(res.data[0].currentweek) + that.requestweek
						if(that.requestweek > 0){that.gapName = " Week(s) After"} else {that.gapName = " Week(s) Before"}
						if(that.requestweek != 0){
							that.setData({
								list: res.data,
								nav_title: Math.abs(that.requestweek).toString() + that.gapName
							})
						}else{
							that.setData({
								list:  res.data,
								nav_title: "Current Week"
							})
						}
					}
					else{
						var week = parseInt(that.currentweek) + that.requestweek
						if(that.requestweek != 0){
							if(that.requestweek > 0){that.gapName = " Week(s) After"} else {that.gapName = " Week(s) Before"}
							that.setData({
								list: '',
								nav_title: Math.abs(that.requestweek).toString() + that.gapName
							})
						}else{
							that.setData({
								list: '',
								nav_title:  "Current Week"
							})
						}

					}
				}
				 else {
					that.requestweek = that.requestweek - 1
				}

			},
			fail: function (error) {
				wx.showToast({
					title: 'Connection error',
					icon: 'none',
					duration: 700
				});
			}
		})
			
	},

  //弹出动画
  popp: function () {
    
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animTopOne = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var x = (typeof this.data.drag_style.x) == 'number' ? 0 :  this.data.drag_style.x.slice(0,-2);
	
		animationPlus.rotateZ(180).step();
		animTopOne.translate(30, -60).rotateZ(180).opacity(0.7).step();
		animationcollect.translate(-40, -40).rotateZ(180).opacity(0.7).step();
		animationTranspond.translate(-60, 30).rotateZ(180).opacity(0.7).step();
	
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
      animTopOne: animTopOne.export()
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animTopOne = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animTopOne.translate(0, 0).rotateZ(0).opacity(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
      animTopOne: animTopOne.export(),
    })
	},
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // console.log('height=' + res.windowHeight);
        // console.log('width=' + res.windowWidth);
        // Math.ceil()

        if (res.platform == "android") {
          res.windowHeight = res.screenHeight;
        }


        self.setData({
          screen: {
            width: res.windowWidth,
            height: res.windowHeight,
            pixelRatio: res.pixelRatio,
            ratio: res.windowWidth * res.pixelRatio / 750
          }
        })
      }
    })
  },
	onShareAppMessage: function () {
    return {
            title: '「 TimeScope 时界 」',
            path: '/pages/index/index',
            imageUrl: 'https://timescope.jovel.net/upload/2020/3/share-9038e4fc492c4ed7ab1aa8fbfc47dfeb.png',
    }
},
bindPickerChange: function(e) {
	console.log('picker发送选择改变，携带值为', e.detail.value)

		var that = this;
		that.requestweek = e.detail.value - 10
		console.log(that.requestweek)
		wx.request({
			url: 'https://wechat.jovel.net/getTable',
			data: {
				time: that.requestweek,
				openid: wx.getStorageSync('openid'),
			},
			headers: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				console.log(res.data)
				if(res.data.Status != "Fail")
				{
					if(res.data != ""){
						that.currentweek = res.data[0].currentweek
						wx.showToast({
							title: 'Successful',
							icon: 'success',
							duration: 1200
						})
						that.requestOthers = true
						var week = parseInt(res.data[0].currentweek) + that.requestweek
						if(that.requestweek > 0){that.gapName = " Week(s) After"} else {that.gapName = " Week(s) Before"}
						if(that.requestweek != 0){
							that.setData({
								list: res.data,
								nav_title: Math.abs(that.requestweek).toString() + that.gapName
							})
						}else{
							that.setData({
								list: res.data,
								nav_title: "Current Week"
							})
						}
					}
					else{
						if(that.requestweek > 0){that.gapName = " Week(s) After"} else {that.gapName = " Week(s) Before"}
						var week = parseInt(that.currentweek) + that.requestweek
						if(that.requestweek != 0){
							that.setData({
								list: '',
								nav_title: Math.abs(that.requestweek).toString() + that.gapName
							})
						}else{
							that.setData({
								list: '',
								nav_title: "Current Week"
							})
						}
					}
				}
				 else {
					that.requestweek = that.requestweek - 1
				}

			},
			fail: function (error) {
				wx.showToast({
					title: 'Connection error',
					icon: 'none',
					duration: 700
				});
			}
		})
			
	},
})
