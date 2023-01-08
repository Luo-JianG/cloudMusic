// pages/video/video.js
import request from "../../utils/request";
let offset = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    videoId: [], //视频的vid
    videoUpdataTime: [],
    // videoUrlList: []
    isTriggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData()
  },
  //请求导航栏数据的回调
  async getVideoGroupListData() {
    let result = await request("/video/group/list")
    this.setData({
      videoGroupList: result.data.slice(0, 13),
      navId: result.data[0].id
    })

    this.getVideoListData(this.data.navId)
  },
  //获取视频列表数据的回调
  async getVideoListData(navId, offset = 0) {
    let result = await request("/video/group", {
      id: navId,
      offset
    })
    //通过id获取视频播放链接
    let videoUrlList = []
    for (let i = 0; i < result.datas.length; i++) {
      let urlData = await request("/video/url", {
        id: result.datas[i].data.vid
      })
      videoUrlList.push(urlData.urls[0])
    }
    //关闭正在加载提示
    wx.hideLoading()

    let index = 0
    let videoListData = result.datas.map(item => {
      item.data.urlInfo = videoUrlList[index].url
      return item
    })

    //上拉触底时执行else
    if (offset === 0) {
      this.setData({
        videoList: videoListData,
        isTriggered: false
        // videoUrlList
      })
    } else {
      let {
        videoList
      } = this.data
      videoList.push(...videoListData)
      this.setData({
        videoList
      })
    }
    index = 0
    let videoListDataId = this.data.videoList.map(item => {
      item.id = ++index
      return item
    })
    this.setData({
      videoList: videoListDataId
    })
    console.log();
  },
  //点击某个导航标签的回调
  changeNav(event) {
    this.setData({
      //切换时清除原本导航标签视频数据
      videoList: [],
      navId: event.currentTarget.id * 1 //通过id向event传参的时候如果传的是unber会自动转换成string
      //event.currentTarget.id * 1 或者 event.currentTarget.id >>> 0  右移运算符会将非nuber类型强制转换成nuber类型
      // navId: event.currentTarget.dataset.id //通过data-传参nuber不会自动转换为string
    })
    //显示正在加载
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    //获取相应导航栏的视频数据
    this.getVideoListData(this.data.navId)
  },
  //点击开始或继续播放视频的回调
  handlePlay(event) {
    let vid = event.currentTarget.id
    //当第二个点击的视频与第一个视频不同并且之前有正在播放的视频时暂停前一个视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    //查看是否有上一次的播放进度，如果有则跳转到相应时间
    let {
      videoUpdataTime
    } = this.data
    let videoItem = videoUpdataTime.find(item => {
      return item.vid === vid
    })
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()

  },
  //更新记录视频播放进度的回调
  handleTimeUpdata(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    let {
      videoUpdataTime
    } = this.data
    let videoItem = videoUpdataTime.find(item => {
      return item.vid === event.currentTarget.id
    })
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdataTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdataTime
    })
  },
  //视频播放结束时的回调
  handleEnded(event) {
    let {
      videoUpdataTime
    } = this.data
    videoUpdataTime.splice(videoUpdataTime.findIndex(item => item.vid === event.currentTarget.id), 1)
    this.setData({
      videoUpdataTime
    })
  },
  //下拉刷新的回调：scroll-view
  handleRefresher() {
    this.getVideoListData(this.data.navId)
  },
  //上拉触底时的回调
  handleToLower() {
    this.getVideoListData(this.data.navId, offset++)
    console.log(offset);
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