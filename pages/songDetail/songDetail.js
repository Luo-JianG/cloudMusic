// pages/songDetail/songDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //options用于接路由跳转的query参数,qurey传参有限制
    // console.log(options.song);
    // console.log(JSON.parse(options.song));
    console.log(options.songId);
  },
  //点击播放开始/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
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