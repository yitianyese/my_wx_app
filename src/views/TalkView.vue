<template>
  <div id="talk">
    <div class="body">
      body
    </div>
    <div class="input">
      <textarea @keyup="pushMessage" v-model="message"></textarea>
      <input type="button" class="push" value="发送">
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue'
import { createWs } from '../assets/api/index'

export default {
  setup ():object {
    // 创建WebSocket1进行发送数据,id是发送人
    const sendMessageWs = createWs('/sendMessage/1')
    // 创建WebSocket1进行发送数据
    const getMessageWs = createWs('/getMessage/1')
    // 使用message去获取到输入框的内容
    const message:Ref<string> = ref('')
    function pushMessage (e:any): void {
      if (e.keyCode === 13) {
        // 当按下enter的时候，获取到message的值，如果是非空就将其发送到服务器
        // pushMessageToServer(message)
        const params = {
          message: message.value,
          getId: 2,
          sendId: 1
        }
        sendMessageWs.send(JSON.stringify(params))
        message.value = ''
      }
    }
    return { message, pushMessage }
  }
}
</script>

<style lang="less">
#talk {
  display: flex;
  width: 520px;
  height: 620px;
  background-color: #f5f5f5;
  flex-direction: column;
  .body {
    flex: 7;
  }
  .input {
    flex: 3;
    border-top: 1px solid #d6d6d6;
    padding: 10px 30px;
    textarea {
      width: 100%;
      height: 70%;
      border: 0;
      background-color: #f5f5f5;
      resize: none;
      font-size: 16px;
    }
    .push {
      padding: 5px 20px;
      color: #228b22;
      font-size: 16px;
      background-color: #e8e6e6;
      border: none;
      border-radius: 4px;
      float: right;
    }
    .push:hover {
      background-color: #ccc;
    }
    .push:active {
      background-color: #aaa;
    }
  }
}
</style>
