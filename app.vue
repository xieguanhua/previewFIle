<template>

  <client-only>
    <photo-provider>
      <photo-consumer v-for="item in previewList" :key="item.file" :src="item.file">
        <div class="item">
          <div class="item-image">
            <img src="@/assets/image/image.png" alt="">
          </div>
          <div class="item-name" :title="item">{{ item.name }}</div>
        </div>
      </photo-consumer>
    </photo-provider>
    <div class="item" v-for="(item,i) in directoryList" :key="item" @click="preview(item)">
      <div class="item-image">
        <img src="@/assets/image/directory.png" alt="">
      </div>
      <div class="item-name" :title="item">{{ item.name }}</div>
    </div>
  </client-only>
</template>
<script setup>

const {data: fileTree} = await useFetch(`/api/readFile`)

const router = useRouter()
const route = useRoute()
function flattern(array) {
  return [].concat(array.map(item => [].concat(item, ...flattern(item.child))))
}
const list = computed(() => {
  if (route.query.path) {
    const flattenedArray = flattern(fileTree.value).flat()
    return flattenedArray.filter(v=>{
      if(v.file === route.query.path && v.isDir){
        return false
      }
      return v.path===route.query.path || v.file.indexOf(route.query.path)===0 && v.isDir
    })
  }
  return fileTree.value
})

const previewList = computed(() => {
  return list.value.filter(v => !v.isDir)
})
const directoryList = computed(() => {
  return list.value.filter(v => v.isDir)
})


async function preview(item) {
  router.push({
    query: {
      path: item.file
    }
  })
}

// function close() {
//   show.value = false
// }
</script>
<style>
* {
  margin: 0;
}

.main {
  display: flex;
  flex-wrap: wrap;
}

.item {
  display: inline-block;
  width: 100px;
  cursor: pointer;
  margin-right: 20px;
}

.item-name {
  /* 文本不换行强制文本在一样显示 */
  white-space: nowrap;
  /* 内容溢出隐藏 */
  overflow: hidden;
  /* 文字溢出部分变成省略号... */
  text-overflow: ellipsis;
  cursor: pointer;
  text-align: center;
}

.item-image {
  width: 100px;
  height: 100px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
}


.slide-image {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;


  align-content: center
}

img {
  max-width: 100%;
  max-height: 100%;
}

.close {
  position: fixed;
  right: 10px;
  cursor: pointer;
  z-index: 10;
  color: #fff;
}

.PhotoView__PhotoWrap .PhotoView__PhotoBox {
  height: 100%;
}
</style>
