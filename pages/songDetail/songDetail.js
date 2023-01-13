// pages/songDetail/songDetail.js
import request from "../../utils/request"
//获取小程序全局唯一的app实例
let appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    songId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //options用于接路由跳转的query参数,qurey传参有限制
    // console.log(options.song);
    // console.log(JSON.parse(options.song));
    this.getSongDetail(options.songId)
    this.setData({
      songId: options.songId
    })
    this.handleMusicPlay()

    if (appInstance.globalData.musicId === options.songId) {
      this.setData({
        isPlay: true
      })
    }

    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changeMusicState(true)
      appInstance.globalData.musicId = options.songId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changeMusicState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changeMusicState(false)
    })
  },
  //修改音乐状态的功能函数
  changeMusicState(isPlay) {
    appInstance.globalData.isMusicPlay = isPlay
    this.setData({
      isPlay
    })
  },
  //获取歌曲详情
  async getSongDetail(songId) {
    let songData = await request("/song/detail", {
      ids: songId
    })
    this.setData({
      song: songData.songs[0]
    })
    //动态设置页面的标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  //点击播放开始/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    let {
      songId
    } = this.data
    // this.setData({
    //   isPlay
    // })
    this.musicControl(isPlay, songId)
  },
  //歌曲播放/暂停的功能
  async musicControl(isPlay, songId) {
    let songUrlData = await request("/song/url", {
      id: songId
    })
    let songLink = songUrlData.data[0].url
    if (isPlay) {
      this.backgroundAudioManager.src = songLink
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause()
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