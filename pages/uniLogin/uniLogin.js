let app = getApp(),
	pageParams = {
		data: {
			stuid: '',
      stupwd: '',
      universities: ["University of Bimringham", "University of Cambridge", "University of Oxford", "Imperial College London", "University of Nottingham", "University of Liverpool", "University College London", "University of Manchester", "Self Service"],
      universityIndex: 0,
      btn_disabled: true
		}
  };

pageParams.coming = function () {
		wx.showToast({
			title: 'Coming soon...',
			icon: 'none',
			duration: 700
		})
	
	};
pageParams.navLast = function (){

  wx.navigateBack({
    delta: 2
  });
    
    },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
pageParams.bindCountryChange = function(e) {
  /*
  this.setData({
      universityIndex: e.detail.value
  })
  */
 wx.showToast({
  title: 'Information Needed',
  icon: 'none',
  duration: 700
})
}

pageParams.bindAgreeChange = function (e) {
    this.setData({
        isAgree: !!e.detail.value.length
    });
}

pageParams.loginSuccess = function() {
  wx.switchTab({
    url: '/pages/index/index'
  });
  wx.showToast({
    title: 'Successful',
    icon: 'success',
    duration: 3000
})
};

pageParams.loginComplete = function() {
  this.setData({
    btn_loading: false
  });
  wx.navigateBack({
    delta: 2
  });
  
};

pageParams.inputInput = function(e) {
  if (e.target.id == 'stuid') {
    this.setData({
      stuid: e.detail.value
    });
  } else if (e.target.id == 'stupwd') {
    this.setData({
      stupwd: e.detail.value
    });
  }
  let btn = true;
  if (this.data.stuid.length >= 5 && this.data.stupwd.length >= 5) {
    btn = false;
  }
  this.setData({
    btn_disabled: btn
  });
};

pageParams.inputFocus = function(e) {
  if (e.target.id == 'stuid') {
    this.setData({
      stuid_focus: true
    });
  } else if (e.target.id == 'stupwd') {
    this.setData({
      stupwd_focus: true
    });
  }
};

pageParams.inputBlur = function(e) {
  if (e.target.id == 'stuid') {
    this.setData({
      stuid_focus: false
    });
  } else if (e.target.id == 'stupwd') {
    this.setData({
      stupwd_focus: false
    });
  }
};

pageParams.onLoad = function() {
  this.setData({
    navH: app.globalData.navHeight,
  })};
pageParams.getData = function() {
  this.setData({

  });
	app.bindingAccount(this.data.stuid, this.data.stupwd, this.data.universities[this.data.universityIndex]);	//绑定
};

Page(pageParams);