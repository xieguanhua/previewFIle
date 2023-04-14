<template>
  <div class="main">
    <div class="item" v-for="(item,i) in list" :key="item" @click="preview(item,i)">
      <div class="item-image"><img :src="`/${item}`" alt=""></div>
      <div class="item-name" :title="item">{{ item }}</div>
    </div>

  </div>
  <div class="mask" v-if="show">
    <div class="close" @click="close">关闭</div>
    <swiper class="swiper" ref="mySwiper" :modules="modules" navigation @swiper="onSwiper">
      <swiper-slide class="slide" v-for="(item,i) in list" :key="i">
        <div class="slide-image"><img :src="`/${item}`" alt=""/></div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import {Navigation} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
const modules = ref([Navigation])
const imagesContext = import.meta.glob('@/public/**', {eager: true})

const regex = /\.(jpg|jpeg|png|gif)$/i;

const list = ref(Object.keys(imagesContext).map(v => v.replace('/public/', '')).filter(v => regex.test(v)))
const show = ref(false)

const mySwiper = ref()

const swiperInstance = ref()
function onSwiper(swiper) {
  swiperInstance.value = swiper
}
async function preview(item,position) {
  show.value = true
  await nextTick()
  swiperInstance.value?.slideTo(position)
}
function close(){
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
.close{
  position: fixed;
  right:10px;
  cursor: pointer;
  z-index: 10;
  color: #fff;
}
</style>
