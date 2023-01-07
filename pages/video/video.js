// pages/video/video.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    // videoUrlList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData()
  },
  //请求导航栏数据
  async getVideoGroupListData() {
    let result = await request("/video/group/list")
    this.setData({
      videoGroupList: result.data.slice(0, 13),
      navId: result.data[0].id
    })

    this.getVideoListData(this.data.navId)
  },
  //获取视频列表数据
  async getVideoListData(navId) {
    let result = await request("/video/group", {id: navId})
    //通过id获取视频播放链接
    let videoUrlList = []
    for (let i = 0; i < result.datas.length; i ++) {
      let urlData = await request("/video/url", {id: result.datas[i].data.vid})
      videoUrlList.push(urlData.urls[0])
    }
    let index = 0
    let videoList = result.datas.map( item => {
      item.data.urlInfo = videoUrlList[index].url,
      item.id = ++index
      return item
    })

    this.setData({
      videoList,
      // videoUrlList
    })
  },
  //点击某个导航栏
  changeNav(event) {
    this.setData({
      navId: event.currentTarget.id * 1 //通过id向event传参的时候如果传的是unber会自动转换成string
      //event.currentTarget.id * 1 或者 event.currentTarget.id >>> 0  右移运算符会将非nuber类型强制转换成nuber类型
      // navId: event.currentTarget.dataset.id //通过data-传参nuber不会自动转换为string
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