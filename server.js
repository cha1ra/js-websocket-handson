const http = require('http')
const fs = require('fs') // 追加: ファイルを読み取るモジュール

// ポート番号
const PORT = 3000

// リクエスト・レスポンスの対応内容を記述
const server = http.createServer((request, response) => {
  // !!---ここから書き換え---!!
  const url = request.url
  switch (url) {
    case '/':
      fs.readFile('./public/index.html', 'utf-8', (error, data) => {
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.write(data)
        response.end()
      })
      break
    default:
      response.writeHead(404)
      response.end()
  }
  // !!---ここまで---!!
})

// リスナーを起動
server.listen(PORT, () => {
  console.log(`${new Date()} サーバ起動 http://localhost:${PORT}`)
})
