//index.js
const app = getApp()

Page({
  data: {
    runData: 0,
    title: "",
    cover_url: ""
  },
  // 获取微信步数
  btnTap() {
    wx.getWeRunData({
      success: (result) => {
        wx.cloud.callFunction({
          name: 'getwerun',
          data: {
            werundata: wx.cloud.CloudID(result.cloudID)
          },
          success: res => {
            const runData = res.result.data.stepInfoList[30].step
            this.setData({
              runData
            })
          }
        })
      },
    })
  },
  // 扫码识别图书
  btnScan() {
    wx.scanCode({
      success: res1 => {
        // res.result是版号ISBN
        wx.cloud.callFunction({
          name: 'getbook',
          data: {
            isbn: res1.result
          },
          success: async res2 => {
            const booksData = res2.result.booksData;
            const isbn = res1.result
            // 重复上传则提示
            const isRepeat = booksData.every(item => item.isbn !== isbn)
            if (!isRepeat) {
              wx.showToast({
                title: '数据库中已存在',
                icon: "error"
              })
            } else {
              this.setData({
                title: res2.result.title,
                cover_url: res2.result.cover_url
              })
            }
          }
        })
      }
    })
  },
  onLoad: function () {},
  // 生成海报
  btnGoToPoster() {
    wx.navigateTo({
      url: '/pages/poster/index'
    })
  },
})