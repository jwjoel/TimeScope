// pages/fortest/fortest.js
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}




let app = getApp(),
	pageParams = {
		data: {
			stuid: '',
			stupwd: '',
			stuid_focus: false,
			stupwd_focus: false,
			btn_disabled: true,
			btn_loading: false,
			updateTime: wx.getStorageSync('updateTime'),
			showDialog: false,
			fbistrue: false,
			userInfo: {},
			logged: false,
			istrue: false
		}
	};

	pageParams.syncTable = function (options) {
		var that = this;
		wx.request({
			url: 'https://wechat.jovel.net/getTable',
			data: {
				openid: wx.getStorageSync('openid'),
				time: 0,
			},
			headers: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				console.log(res.data)
				if(res.data.Status != "Fail")
				{
				app.globalData.list = res.data
				wx.setStorageSync('timetable', res.data);
				var time = formatTime(new Date());
				console.log(time)
				wx.setStorageSync('updateTime', time);
				that.setData({	
					updateTime: time,
				})
				wx.showToast({
					title: 'Successful',
					icon: 'success',
					duration: 1200
				})
				}
				 else {
					
				}
				
			},
			fail: function (error) {
				wx.showModal({
					title: 'Notice',
					content: 'Sync: Connection Error',
					showCancel: false,
					confirmText: "Confirm"
				});
			}
		})
			
		};
		pageParams.about = function (options) {
        wx.navigateTo({
          url: '/pages/home/about' 
        });
      }

	pageParams.bindStuNum = function (options) {
	
		if (wx.getStorageSync("openid") == "") {
			wx.showLoading({
				title: 'Loading',
			});
			this.wxLogin();
		} else {
			wx.navigateTo({
				url: '/pages/uniLogin/uniLogin' 
			});
		}
		
	};
	pageParams.wxLogin = function (e) {
		wx.showLoading({
			title: 'Loading',
		})
		var that = this;
		wx.login({
			success: function (res) {
				wx.getUserInfo({
					success: function (res) {
						wx.cloud.callFunction({
							name: 'login',
							data: {},
							success: res => {
								console.log('[云函数] [login] user openid: ', res.result.openid)
				
								wx.setStorageSync('openid', res.result.openid)
							},
							fail: err => { 
								console.error('[云函数] [login] 调用失败', err)
					}})
						var userNick = res.userInfo.nickName; 
						var avatarUrl = res.userInfo.avatarUrl; 
						var gender = res.userInfo.gender; 
						wx.setStorageSync('nick', userNick)
						wx.setStorageSync('avatarUrl', avatarUrl)
						that.setData({
							nick: userNick,
							avatarUrl: avatarUrl
						})
						
							wx.request({
								url: 'https://wechat.jovel.net/wxLogin',
								data: {
									openid: wx.getStorageSync('openid'),
								},
								header: {
									'content-type': 'application/json'
								},
								success: function (res) {
									console.log(res.data);
									var username = res.data.uniUser
									var pass = res.data.uniPass
									that.setData({
										stuName: res.data.uniUser,
									});
									wx.setStorageSync('stuName', res.data.uniUser);
									wx.setStorageSync('stuPass', res.data.uniPass);
									if(res.data.Status == "uniRequired") {
										wx.hideLoading();
										wx.navigateTo({
											url: '/pages/uniLogin/uniLogin'
										});
									}
	
									if(res.data.Status == "Pass") {
										wx.request({
											url: 'https://wechat.jovel.net/getTable',
											data: {
												time: 0,
												openid: wx.getStorageSync('openid'),
											},
											headers: {
												'Content-Type': 'application/json'
											},
											success: function (res) {
												app.globalData.list = res.data
												wx.setStorageSync('timetable', res.data);
											}
										})
									}
								},
								fail : function (res) {
									wx.hideLoading();
									wx.showModal({
										title: 'Notice',
										content: 'Timeout',
										showCancel: false
									})
								}							
							})

						wx.hideLoading();
					},
					fail: function (e) {
						wx.hideLoading();
						wx.hideTabBar()
						that.setData({
								istrue: true
						})
					},
					complete: function (res) {
	
					},
				})
			},
			fail: function (error) {
				console.log('login failed ' + error);
			}
		})
	};
	/**
	 * 生命周期函数--监听页面加载
	 */
	pageParams.onLoad = function (options) {
		this.setData({	//加载页面时显示昵称和头像
			nick: wx.getStorageSync('nick'),
			avatarUrl: wx.getStorageSync('avatarUrl'),
			stuName: wx.getStorageSync('stuName'),
			navH: app.globalData.navHeight
		})
	};
	pageParams.openMap = function () {
		wx.showToast({
			title: 'Coming soon...',
			icon: 'none',
			duration: 700
		})
	
	};
	pageParams.navLast = function (){
	
		wx.switchTab({
			url: '../index/index'})},
	
	pageParams.onShow = function () {
		this.setData({
			stuName: wx.getStorageSync('stuName'),
			updateTime: wx.getStorageSync('updateTime'),
		})
	};
	
	pageParams.onHide = function () {
	
	},
	
	pageParams.onUnload = function () {
	
	};
	
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	pageParams.onPullDownRefresh = function () {
	
	};
	
	/**
	 * 页面上拉触底事件的处理函数
	 */
	pageParams.onReachBottom = function () {
	
	};
	
	/**
	 * 用户点击右上角分享
	 */
	pageParams.onShareAppMessage = function () {
	
	}
	pageParams.feedback = function () {
					wx.hideTabBar()
					var that=this
					that.setData({
							fbistrue: true
					})
			},

	

	pageParams.closeDialog = function () {
				var self = this
				wx.showTabBar()

				self.setData({
						istrue: false
				})
		}

	pageParams.closeDialogfb = function () {
				wx.showTabBar()
				this.setData({
						fbistrue: false
				})
		}
/*
		wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
				
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
						
            success: res => {
							console.log(res.userInfo),
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
								userInfo: res.userInfo,
								
							})
							
            }
          })
        }
      }
    })
*/
		pageParams.onGetUserInfo= function(e) {
			console.log(e.detail.userInfo)
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
				userInfo: e.detail.userInfo,
				nick: e.detail.userInfo.nickName,
			})
			this.wxLogin()
			wx.showTabBar()
			this.setData({
					istrue: false
			})
			wx.setStorageSync('nick', e.detail.userInfo.nickName)
			wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl)

	},
	

	pageParams.onGetOpenid= function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)

				wx.setStorageSync('openid', res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
	}})},
	pageParams.onShareAppMessage= function () {
    return {
            title: '「 TimeScope 时界 」',
            path: '/pages/index/index',
            imageUrl: 'https://timescope.jovel.net/upload/2020/3/share-9038e4fc492c4ed7ab1aa8fbfc47dfeb.png',
    }
},
Page(pageParams);