<template>
  <div class="main">
    <div class="item" v-for="(item,i) in list" :key="item" @click="preview(item)">
      <div class="item-image">
        <img :src="`${item.file}`" alt="">
      </div>
      <div class="item-name" :title="item">{{ item.name }}</div>
    </div>

  </div>
  <div class="mask" v-if="show">
    <div class="close" @click="close">关闭</div>
    <swiper class="swiper" ref="mySwiper" :modules="modules" navigation @swiper="onSwiper">
      <swiper-slide class="slide" v-for="(item,i) in previewList" :key="i">
        <div class="slide-image"><img :src="`${item.file}`" alt=""/></div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import {Navigation} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import directoryFile from '@/assets/image/directory.png'

const router = useRouter()
const route = useRoute()
const modules = ref([Navigation])

const imagesContext = import.meta.glob('@/public/**/*.{jpg,jpeg,png,gif}', {eager: true})

const fileList = Object.keys(imagesContext).map(v => v.replace('/public/', ''))

function buildFileTree(fileList) {
  const tree = [];
  for (const file of fileList) {
    const parts = file.split('/');
    let currentNode = tree;
    for (let i = 0; i < parts.length; i++) {
      const isDirectory = i < parts.length - 1;
      const name = parts[i];
      let node = currentNode.find(node => node.name === name && node.type === (isDirectory ? 'directory' : 'file'));
      if (!node) {
        node = {
          path:parts.slice(0,parts.length-1).join('/'),
          name,
          file: isDirectory ? directoryFile : file,
          type: isDirectory ? 'directory' : 'file',
          children: []
        };
        currentNode.push(node);
      }
      currentNode = node.children || node;
    }
  }
  return tree;
}

const fileTree = buildFileTree(fileList);
function flattern(array) {
  return [].concat(array.map(item => [].concat(item, ...flattern(item.children))))
}
const list = computed(()=>{
  if(route.query.path){
    const flattenedArray = flattern(fileTree).flat()
    return flattenedArray.filter(v=>{

      if(v.path === route.query.path && v.type === 'directory'){
        return false
      }
      return v.path===route.query.path || v.path.indexOf(route.query.path)===0 && v.type=== 'directory'
    })
  }
  return fileTree
})


const previewList = computed(()=>{
  return list.value.filter(v=>v.type==='file')
})

const show = ref(false)
const mySwiper = ref()

const swiperInstance = ref()

function onSwiper(swiper) {
  swiperInstance.value = swiper
}

async function preview(item) {
  if (item.type === 'file') {
    const index = previewList.value.findIndex(v=>v.file === item.file)
    show.value = true
    await nextTick()
    swiperInstance.value?.slideTo(index)
  } else {
    router.push({
      query:{
        path:item.path
      }
    })
  }
}

function close() {
  show.value = false
}
</script>
<style>
.main {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  width: 100px;
  cursor: pointer;
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
</style>
