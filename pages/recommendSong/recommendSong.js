// pages/recommendSong/recommendSong.js
import PubSub from "pubsub-js"
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "", //日
    month: "", //月
    recommendMusicList: [],
    index: 0 //歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断用户是否登入
    let cookie = wx.getStorageSync('cookies')
    if (!cookie) {
      wx.showToast({
        title: "请先登入",
        icon: "error",
        success: () => {
          wx.reLaunch({
            url: "/pages/login/login"
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
    //订阅来自songdetail页面的消息
    PubSub.subscribe("switchType",(msg, data) => {
      let {index, recommendMusicList} = this.data
      if(data === 'pre') { //上一首
        index === 0 && (index = recommendMusicList.length)
        index -= 1
      }else { //下一首
        index === recommendMusicList.length - 1 && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let musicId = recommendMusicList[index].id
      //发布消息给songDetail页面
      PubSub.publish("musicId", musicId)
    })

  },
  //获取每日推荐歌曲数据的回调
  async getRecommendListData() {
    let result = await request("/recommend/songs")
    this.setData({
      recommendMusicList: result.data.dailySongs
    })
  },

  //点击歌曲，跳转至songDetail页面
  toSongDetail(event) {
    let {song, index} = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' + song.id
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