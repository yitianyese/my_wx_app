const baseURL = 'ws://localhost:3000/message/'

// 注意：id在后面需要删除的
export function createWs (url:string):WebSocket {
  // 需要两个参数，一个是发送人的id，一个是接收人的id
  const ws = new WebSocket(`${baseURL}${url}`)
  ws.onmessage = function (res) {
    console.log(res)
  }
  return ws
}
