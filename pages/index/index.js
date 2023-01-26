// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    recommendList: [], //推荐歌单数据
    personalizedList: [], //热歌榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // wx.request({
    //   url: 'http://localhost:3000/banner',
    //   data: {
    //     type: 3
    //   },
    //   success: (res) => {
    //     console.log('请求成功',res);
    //   },
    //   fail: (err) => {
    //     console.log('请求失败', err);
    //   }
    // })
    let bannerListData = await request('/banner', {
      type: 2
    })
    this.setData({
      bannerList: bannerListData.banners
    })

    let recommendListData = await request('/personalized', {
      limit: 10
    })
    this.setData({
      recommendList: recommendListData.result,
    })
    //过期接口
    // let index = 0
    // let resultArry = []
    // while(index < 5) {
    //   let topListData = await request("/toplist/detail", {idx:index++})
    //   console.log(topListData);
    //   //splice会修改源数据，slice不会修改源数据
    //   let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0,3)}
    //   resultArry.push(topListItem)
    //   this.setData({
    //     topList: resultArry
    //   })
    // }
    // this.setData({
    //   topList: resultArry
    // })
    let result = await request("/personalized/newsong", {
      limit: 18
    })
    let resultArry = []
    for (let i = 0; i < 18; i += 3) {
      let recommendMusic = {
        personalized: result.result.slice(i, i + 3)
      }
      resultArry.push(recommendMusic)
    }
    let index = 1
    this.setData({
      personalizedList: resultArry.map(item => {
        item.id = index++
        return item
      })
    })




  },
  //点击导航区每日推荐跳转至每日推荐页
  toRecommendSong() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },

  //跳转至Other页面
  toOther() {
    wx.navigateTo({
      url: '/otherPackage/pages/other/other',
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