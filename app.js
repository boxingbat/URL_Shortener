const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

//檢查 NODE_ENV 是否為非 production 環境，若是則載入 .env 檔案中的環境變數
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }  
 
const app = express()
const PORT = process.env.PORT || 3000

//連線到 MongoDB 資料庫
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

  const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//home
app.get('/', (req, res)=>
res.render('index')
)  
  app.get('shortened_url/:shortened_url', (req, res) => {
    const shortened_url = req.params.shortened_url
  
    URL.findOne({ shortened_url })
        .lean()
        .then(url => {
          res.redirect(url.origin_url)
        })
        .catch(error => console.log(error))
  })
    //建立隨機表格
  const buildTable = () => {
    const randomTable = []
    for (let i = 0; i < 10; i++) {
      randomTable.push(i.toString())
    }
    for (let i = 0; i < 26; i++) {
      randomTable.push(String.fromCharCode(65 + i))
      randomTable.push(String.fromCharCode(97 + i))
    }
    return randomTable
  }
  //生成一個長度為 5 的隨機縮短 URL
  const url_shortener = () => {
    const randomTable = buildTable()
    let shortened_url = ""
    for (let i = 0; i < 5; i++) {
      shortened_url += randomTable[Math.floor(Math.random() * 62)]
    }
    return shortened_url
  }
  
  app.post('/shortened_url', (req, res) => {
    const origin_url = req.body.url
    //如果 origin_url 是空白的，則設置 isEmpty 為 true，並渲染 index 
    if (!origin_url.trim()) {
      const isEmpty = true
      return res.render('index', { isEmpty })
    }
    //使用 URL.findOne 查詢資料庫，檢查是否已經存在具有相同 origin_url 的紀錄
    URL.findOne({ origin_url })
        .lean()
        .then(url => {
          if (!url) {
            //找不到相應的紀錄，則調用 url_shortener 函式生成一個縮短 URL
            const shortened_url = url_shortener()
            //創建一條新的資料庫紀錄
            return URL.create({ origin_url, shortened_url })
              .then((url) => res.render('shortened_url', { shortened_url, _id: url._id }))
              .catch(error => console.log(error))
          } else {
            //渲染 shortened_url
            return res.render('shortened_url', { shortened_url: url.shortened_url, _id: url._id })
          }
        })
  })

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended : true }))
app.use(methodOverride('_method'))
app.listen(PORT, () => console.log(`Express is listening on localhost:${PORT}`))