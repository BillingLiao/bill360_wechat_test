Page({
  data: {
    isauthorization: wx.getStorageSync('isauthorization'),
    nickName: '',
    avatarUrl: './../img/default.png',
    loginInfo: '点击登录',
    islogin: wx.getStorageSync('isLogin')
  },
  onLoad: function () {
    if (wx.getStorageSync('isLogin') != true) {
      this.setData({
        avatarUrl: './../img/default.png',
        loginInfo: '点击登录'
      })
    } else if (wx.getStorageSync('isLogin') == true) {
      this.setData({
        loginInfo: wx.getStorageSync('nickName'),
        avatarUrl: wx.getStorageSync('avatarUrl'),
      })
    }
  },
  onShow: function () {
    if (wx.getStorageSync('isLogin') != true) {
      this.setData({
        avatarUrl: './../img/default.png',
        loginInfo: '点击登录'
      })
    } else if (wx.getStorageSync('isLogin') == true) {
      this.setData({
        loginInfo: wx.getStorageSync('nickName'),
        avatarUrl: wx.getStorageSync('avatarUrl'),
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        isauthorization: true
      });
      console.log(e.detail.userInfo);
      wx.setStorageSync('isauthorization', this.data.isauthorization);
      wx.setStorageSync('nickName', e.detail.userInfo.nickName);
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
    }
  },
  login: function () {
    var _this = this;
    if (wx.getStorageSync('isLogin') == true) {
      return false
    }
    wx.showLoading({
      title: '登录中...',
      mask: true
    });
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        //console.log(res.code);
        wx.request({
          url: 'https://xcx.wenxikeji.com//bill360//user/openid',
          data: {
            code: code
          },
          method: 'POST',
          header: {//请求头
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res);
            wx.setStorageSync('openId', res.data.data);
            wx.request({
              url: 'https://xcx.wenxikeji.com//bill360//user/login',
              data: {
                openid: wx.getStorageSync('openId'),
                name: wx.getStorageSync('nickName'),
                head: wx.getStorageSync('avatarUrl')
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res.data);
                wx.setStorageSync('token', res.data.data.token);
                wx.setStorageSync('switchLogin', res.data.data.user);
                wx.setStorageSync('loginAccount', res.data.data.user.phone);
                wx.setStorageSync('cardLogin', res.data.data.user.card);
                wx.setStorageSync('isLogin', true);

                _this.setData({
                  loginInfo: wx.getStorageSync('nickName'),
                  avatarUrl: wx.getStorageSync('avatarUrl'),
                  isLogin: true,
                });
                wx.hideLoading();
                _this.toastStyle("登录成功");

                setTimeout(function () {
                  wx.navigateTo({
                    url: 'index'
                  });
                }, 2000);
                
              }
            })
          }
        })
      }
    });
  },
  toastStyle: function (msg) {   //弹框事件
    var _this = this;
    this.setData({
      msgToast: msg,
      msgToastFlag: true
    });
    setTimeout(function () {
      _this.setData({
        msgToastFlag: false
      })
    }, 1500)
  },
  /*
  jumpBindPhone: function () {
    if (wx.getStorageSync('isLogin') == true) {
      console.log(wx.getStorageSync('loginAccount'));
      if (wx.getStorageSync('loginAccount') == null || wx.getStorageSync('loginAccount') == '') {
        wx.navigateTo({
          url: 'login',
        })
      }else{
        this.toastStyle("已绑定");
      }

    }else {
      this.toastStyle("请先登录");
    }
  }
  */
})
