<template>
  <div>
    <input type="file" @change="getFile" ref="file" name="file">
    <input type="button" @click="sendFile" value="发送">
    <!-- <img :src=url alt=""> -->
    <progress :value="info" ref="progress">0%</progress>
    <!-- 发送结束才能够显示a标签 -->
    <a :href=url>ddd</a>
    <div class="ting" @click="breakOff">&lt;</div>
  </div>
</template>

<script lang="ts">
import { ref, inject } from 'vue'
import axios from 'axios'

export default {
  setup () {
    // input元素的ref
    const file:any = ref(null)

    // 确定文件要切片的大小,64kb
    const chunkSize = 64 * 1024

    // 保存文件切片的数组
    const fileChunkArr:any = []

    // 当前切片切到的位置
    let curSize = 0

    // 保存选择的文件的大小
    const size = ref()

    // 进度条引用
    const progress = ref()

    // 选择文件，初步将文件进行切片
    function getFile () {
      // 获取到文件的相关内容
      const fileContent = file.value.files[0]
      size.value = fileContent.size
      progress.value.max = fileContent.size
      // 将文件切片
      while (curSize < size.value) {
        const fileChunk = fileContent.slice(curSize, curSize + chunkSize)
        // 切片进入数组
        fileChunkArr.push(fileChunk)
        curSize += chunkSize
      }
    }

    // 将文件转化为formData对象
    function createFormData (curSize:number, fileChunk:any):FormData {
      const formData = new FormData()
      const { name, type, size } = file.value.files[0]
      formData.append('name', name)
      formData.append('type', type)
      formData.append('size', size)
      formData.append('curSize', curSize as unknown as string)
      formData.append('file', fileChunk)
      return formData
    }
    // 传输文件切片下标
    let index = 0
    // 进度条显示
    const info = ref(0)

    // 获取到路径
    const url = ref('')
    // 获取到ws对象
    const sendMessageWs:any = inject('sendMessageWs')
    // 发送文件
    async function sendFile () {
      if (index < fileChunkArr.length) {
        const data = createFormData(curSize, fileChunkArr[index])
        // 将文件发送上去
        try {
          const result = await axios.post('http://localhost:3000/file/send', data)
          url.value = result.data
          // 如果发送成功，就继续发送下一个切片
          index++
          info.value = chunkSize * index
          if (flag) sendFile()
        } catch (e) {
          console.log('发送出错')
        }
      } else {
        console.log('发送成功')
        // 发送成功之后令index置为0
        index = 0
        // 并且将获取到的url发送到websocket中
        sendMessageWs.send(JSON.stringify({
          message: url.value,
          getId: 2,
          sendId: 1
        }))
      }
    }

    // 定义是否要中断发送
    let flag = true
    // 终止发送
    function breakOff () {
      // false的时候中断上传
      flag = !flag
      sendFile()
    }

    return { sendFile, file, getFile, breakOff, info, progress, url }
  }
}
</script>

<style lang="less">
.ting {
  cursor: pointer;
}
</style>
