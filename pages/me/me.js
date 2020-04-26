let app = getApp();

Page({
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
		},

	bindStuNum: function (options) {
	
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
		
	},

	wxLogin: function (e) {
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
											url: '/pages/login/login'
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
	},

	onLoad: function (options) {
		this.setData({
			nick: wx.getStorageSync('nick'),
			avatarUrl: wx.getStorageSync('avatarUrl'),
			stuName: wx.getStorageSync('stuName'),
			navH: app.globalData.navHeight
		})
	},

	comingSoon: function () {
		wx.showToast({
			title: 'Coming soon...',
			icon: 'none',
			duration: 700
		})
	
	},

	navLastL:function (){
	
		wx.switchTab({
			url: '../index/index'})},

	onShow: function () {
		this.setData({
			stuName: wx.getStorageSync('stuName'),
		})
	},
	
	feedback: function () {
					wx.hideTabBar()
					var that=this
					that.setData({
							fbistrue: true
					})
			},

	closeDialog: function () {
				var self = this
				wx.showTabBar()

				self.setData({
						istrue: false
				})
		},

	closeDialogfb: function () {
				wx.showTabBar()
				this.setData({
						fbistrue: false
				})
		},

		onGetUserInfo: function(e) {
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

	onGetOpenid: function() {
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
})