const mongoose = require('mongoose')


//檢查 NODE_ENV 是否為非 production 環境，若是則載入 .env 檔案中的環境變數
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  } 

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

module.exports = db