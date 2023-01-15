// pages/songDetail/songDetail.js
import PubSub from "pubsub-js"
import moment from "moment"
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
    songId: '',
    songLink: '', //歌曲的播放链接
    currentTime: '00:00', //进度条目前进度时间
    durationTime: '00:00', //歌曲总时间
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

    //监听音乐播放进度的事件
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log(this.backgroundAudioManager.duration);
      // console.log(this.backgroundAudioManager.currentTime);
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss")
      this.setData({
        currentTime
      })
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
    let durationTime = moment(songData.songs[0].dt).format("mm:ss")
    this.setData({
      song: songData.songs[0],
      durationTime
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
      songId,
      songLink
    } = this.data
    // this.setData({
    //   isPlay
    // })
    this.musicControl(isPlay, songId, songLink)
  },
  //歌曲播放/暂停的功能
  async musicControl(isPlay, songId, songLink) {
    if (!songLink) {
      //获取音乐的播放链接
      let songUrlData = await request("/song/url", {
        id: songId
      })
      songLink = songUrlData.data[0].url
      this.setData({
        songLink
      })
    }
    if (isPlay) {
      this.backgroundAudioManager.src = songLink
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause()
    }
  },
  //点击切歌的回调
  handleSwitch(event) {
    //先停止音乐的播放在进行切歌
    this.backgroundAudioManager.stop()
    let type = event.currentTarget.id
    //订阅来自recommendSong页面的回调
    PubSub.subscribe("musicId", (msg, data) => {

      //获取音乐详情信息
      this.getSongDetail(data)
      //切歌后自动播放当前音乐
      this.musicControl(true, data)

      PubSub.unsubscribe("musicId")
    })
    //发布消息给recommendSong页面
    PubSub.publish("switchType", type)
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