import request from "../../utils/request"
let isSend = false //搜索框函数节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: "", //placeholder的内容
    hotList: [], //热搜榜的数据
    searchContent: "", //搜索框的内容
    searchList: [], //模糊搜索获取的数据
    historyList: [], //搜索历史记录数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取初始化数据
    this.getInitData()
    //获取历史记录
    this.getHistoryList()
  },

  //获取初始化数据的函数
  async getInitData() {
    let placeholderContent = await request("/search/default")
    let hotListData = await request("/search/hot/detail")
    this.setData({
      placeholderContent: placeholderContent.data.showKeyword,
      hotList: hotListData.data
    })
  },

  //获取本地历史搜索记录
  getHistoryList() {
    let historyList = wx.getStorageSync('historyListData')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  //发送请求关键字获取模糊匹配数据
  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    if (isSend) {
      return
    }
    isSend = true
    //获取模糊匹配的数据
    this.getSearchList()
    setTimeout(async () => {
      isSend = false
    }, 300);
  },

  //获取模糊匹配的数据的功能函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    let {
      searchContent,
      historyList
    } = this.data
    let searchListData = await request("/search", {
      keywords: searchContent,
      limit: 10
    })
    this.setData({
      searchList: searchListData.result.songs,
    })
    //判断搜索记录是否相同
    if (historyList.indexOf(searchContent)) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('historyListData', historyList)

  },

  //清空搜索框的回调
  handleClear() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  //清除历史记录的回调
  clearSearchHistory() {
    wx.showModal({
      title: '是否清除搜索历史记录',
      complete: (res) => {
        //点击取消
        if (res.cancel) {

        }
        //点击确认
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('historyListData')
        }
      }
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