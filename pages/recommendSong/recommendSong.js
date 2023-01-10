// pages/recommendSong/recommendSong.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",//日
    month: "",//月
    recommendMusicList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断用户是否登入
    let cookie = wx.getStorageSync('cookies')
    if(!cookie) {
      wx.showToast({
        title: "请先登入",
        icon: "error",
        success: () => {
          wx.reLaunch({
            url:"/pages/login/login"
          })
        }
      })
    }
    // 更新日期的状态数据
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    //获取每日推荐歌曲数据
    this.getRecommendListData()
  },
  //获取每日推荐歌曲数据的回调
  async getRecommendListData() {
    let result = await request("/recommend/songs")
    this.setData({
      recommendMusicList: result.data.dailySongs
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