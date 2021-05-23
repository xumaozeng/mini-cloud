// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const doubanbook = require('doubanbook')

cloud.init()

async function getBookInfo(isbn) {
  const url = 'https://search.douban.com/book/subject_search?search_text=' + isbn;
  const res = await axios.get(url)

  const reg = /window\.__DATA__ = "(.*)"/
  if (reg.test(res.data)) {
    const bookData = RegExp.$1
    const decryptedData = doubanbook(bookData)
    console.log(decryptedData);
    return decryptedData[0]
  }

  return res
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取图书的ISBN
  const {
    isbn
  } = event
  // 云函数数据库
  const db = cloud.database()
  const res = await getBookInfo(isbn)
  db.collection('books').add({
    data: {
      isbn,
      title: res.title,
      cover_url: res.cover_url
    }
  })
  // 获取数据库的全部图书
  const booksData = await db.collection('books').get()
  return {
    booksData: booksData.data,
    title: res.title,
    cover_url: res.cover_url
  }
}