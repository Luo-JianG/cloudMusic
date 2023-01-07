// pages/login/login.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  //表单内容发生改变的回调
  handleInput(event) {
    // let type = event.currentTarget.id  //用id传参
    let type = event.currentTarget.dataset.type
    this.setData({
      [type]: event.detail.value
    })
  },

  //前端验证账号
  async handletap() {
    let {
      phone,
      password
    } = this.data
    //手机是否为空
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      })
      return
    }
    //手机号格式是否正确
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'error'
      })
      return
    }
    //判断密码是否为空
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
      return
    }
    //前端验证通过
    // wx.showToast({
    //   title: '前端验证通过',
    //   icon: 'error'
    // })
    let result = await request("/login/cellphone", {
      phone,
      password,
      login: true
    })
    if (result.code === 200) {
      wx.showToast({
        title: '登入成功',
        icon: 'success',
      })
      //将用户信息储存到本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      //跳转只personal页面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })

    } else if (result.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'error'
      })
    } else if (result.code === 501 || result.code === 502) {
      wx.showToast({
        title: '账号或密码错误',
        icon: 'error'
      })
    } else {
      wx.showToast({
        title: '登入失败',
        icon: 'error'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})