const http = require('http')
const fs = require('fs')
const WebSocketServer = require('websocket').server

// ポート番号
const PORT = 3000

// リクエスト・レスポンスの対応内容を記述
const server = http.createServer((request, response) => {
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
})

// リスナーを起動
server.listen(PORT, () => {
  console.log(`${new Date()} サーバ起動 http://localhost:${PORT}`)
})

// WebSocketサーバの設定
const wsServer = new WebSocketServer({
  httpServer: server,
  // autoAcceptConnections は本番環境で使っちゃだめ
  autoAcceptConnections: false
})

const originIsAllowed = (origin) => {
  // アクセス元が信頼できるかを検証する用の関数。今回はlocalなので常にtrue
  return true
}

wsServer.on('request', (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject()
    console.log(`${new Date()} ${request.origin} からのアクセスが拒否されました`)
  }

  const connection = request.accept('ws-sample', request.origin)
  console.log(`${new Date()} 接続が許可されました`)

  connection.on('message', message => {
    switch (message.type) {
      case 'utf8':
        console.log(`メッセージ: ${message.utf8Data}`)
        // connection.sendUTF(message.utf8Data) コメントアウト
        wsServer.broadcast(message.utf8Data) // 追記
        break
      case 'binary':
        console.log(`バイナリデータ: ${message.binaryData.length}byte`)
        connection.sendBytes(message.binaryData)
        break
    }
  })

  connection.on('close', (reasonCode, description) => {
    console.log(`${new Date()} ${connection.remoteAddress} が切断されました`)
  })
})
