//app.js
// pages/fortest/fortest.js
  
App({
  onLaunch: function() {
      if (!wx.cloud) {
          console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      }
      else {
          wx.cloud.init({
              env: 'timescope',
              traceUser: true,
          }) 
      }

      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      wx.login({
          success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
          } 
      })
      wx.getSetting({
          success: res => { 
              if (res.authSetting['scope.userInfo']) {
                  wx.getUserInfo({
                      success: res => {
                          this.globalData.userInfo = res.userInfo
                          if (this.userInfoReadyCallback) {
                              this.userInfoReadyCallback(res)
                          }
                      }
                  })
              }
          }
      })
      wx.getSystemInfo({
          success: e => {
              this.globalData.StatusBar = e.statusBarHeight;
              let custom = wx.getMenuButtonBoundingClientRect();
              this.globalData.Custom = custom;
              this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight + 10;
              this.globalData.navHeight = e.statusBarHeight + 46;
          }
      })
      
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
          const updateManager = wx.getUpdateManager()
          updateManager.onCheckForUpdate(function (res) {
              // 请求完新版本信息的回调
              if (res.hasUpdate) {
                  updateManager.onUpdateReady(function () {
                      wx.showModal({
                          title: 'Update',
                          content: 'New version is released. Do you want to restart the application?',
                          success: function (res) {
                              if (res.confirm) {
                                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                  updateManager.applyUpdate()
                              }
                          }
                      })
                  })
                  updateManager.onUpdateFailed(function () {
                      // 新的版本下载失败
                      wx.showModal({
                          title: 'Update',
                          content: 'New version is available. Please delete the current applet and search for it again.',
                      })
                  })
              }
          })
      } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
      }

  },

	bindingAccount: function (id, pwd, uni) {
        var that = this
		wx.showLoading({
			title: 'Authorizing',
		});
		console.log("绑定账号"); 
 
		wx.request({
			url: 'https://wechat.jovel.net/wxLogin',
			data: {
                openid:wx.getStorageSync("openid"),
			},
			headers: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				console.log(res.data)
				if(res.data.Status!="Fail"){
				var time = formatTime(new Date());
				console.log(time)
				wx.setStorageSync('updateTime', time);
				wx.request({
					url: 'https://wechat.jovel.net/bind',
					data: {
						openid:wx.getStorageSync("openid"),
						user: id,
						pass: pwd,
						uni: wx.getStorageSync("uniname"),
					},
					method: 'get',
					success: (res) => {
						wx.setStorageSync('stuName', id);
						wx.setStorageSync('stuPass', pwd);
						wx.hideLoading();//隐藏loading
						console.log(pwd);
						if (res.data.States == 'Error') {

							wx.showModal({
								title: 'Error',
								content: 'Timeout',
								showCancel: false,
							});
						} else { //正确获取数据
                            console.log(wx.getStorageSync('openid'))
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

                                    if(res.data[0].Status != "Fail")
                                    {
                                    wx.setStorageSync('timetable', res.data);
                                    var time = formatTime(new Date());
                                    wx.setStorageSync('updateTime', time);
                                    if(that.requestOthers == true){
                                    that.requestweek = 0
                                    }
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
                                    wx.showToast({
                                        title: 'Connection error',
                                        icon: 'none',
                                        duration: 700
                                    });
                                }
                            }),
                            wx.navigateBack({
								delta: 2
							});

						}
					},
					fail: () => {
						wx.hideLoading();
                        wx.showToast({
                            title: 'Timeout',
                            icon: 'none',
                            duration: 700
                        })
					}
				});
			}
			else{
				wx.hideLoading();
				wx.showToast({
					title: 'Wrong Information',
					icon: 'none',
					duration: 700
				})
			}
			},
			fail: function (error) {
				wx.hideLoading();
				wx.showToast({
					title: 'Connection error',
					icon: 'none',
					duration: 700
				})},
			complete: () => {
					//this.event.emit('getCoursesComplete');
			}
			})
    },
    syncTable: function (options) {
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
		},
  globalData: { //全局变量
      userInfo: null,
      skin: null,
      roleFlag: false,
      url: "https://timescope.jovel.net",//http://localhost:8090
      BlogName: "TimeScope",
      token: "12321Wjwwjw",
      highlightStyle: "dracula", //代码高亮样式，可用值default,darcula,dracula,tomorrow
      adminOpenid: "o7z8_5SPKeb6CFPMyXhtVh-F4LZ0",
      HaloUser: "Jovel",
      HaloPassword: "12321Wjwwjw",
      navHeight: 0
  }
  
})