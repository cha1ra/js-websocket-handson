const http = require('http')

// ポート番号
const PORT = 3000

// リクエスト・レスポンスの対応内容を記述
const server = http.createServer((request, response) => {
  response.writeHead(200)
  response.write('Hello!')
  response.end()
})

// リスナーを起動
server.listen(PORT, () => {
  console.log(`${new Date()} サーバ起動 http://localhost:${PORT}`)
})
