// pages/personal/personal.jsi
import request from "../../utils/request";
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0)",
    coverTransition: "",
    userInfo: "",
    userRecentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }
    this.getRecentData(this.data.userInfo.userId)
  },
  //获取最近播放记
  async getRecentData(userId) {
    console.log();
    let result = await request("/user/record", {
      uid: userId,
      type: 1
    })
    //截取10条
    let index = 1
    let userRecentPlayList = result.weekData.slice(0, 10).map(item => {
      item.id = index++
      return item
    })
    this.setData({
      userRecentPlayList
    })
  },
  handletouchstart(event) {
    this.setData({
      coverTransition: ""
    })
    startY = event.touches[0].clientY
  },
  handletouchmove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if (moveDistance < 0) {
      return
    }
    if (moveDistance > 80) {
      moveDistance = 80
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handletouchend() {
    this.setData({
      coverTransform: "translateY(0)",
      coverTransition: "transform 1s linear"
    })

  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
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
Info: JSON.parse(userInfo)
      })
    }
生命周期函数--监听页面隐藏
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