<template>
  <div class="mask">
    <swiper class="swiper" :modules="modules" navigation>
      <swiper-slide class="slide" v-for="(item,i) in list" :key="i">
        <div class="slide-image"><img :src="item" alt=""/></div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
import {Navigation} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
// const {data: fileList} = await useFetch(`/api/readFile?path=`+path.value)
//
// const deep = (list => {
//   return list.filter(v=>!v.isDir)
// })
const imagesContext = import.meta.glob('@/public/*', {eager: true})
const list = ref(Object.keys(imagesContext).map(v => v.replace('/public', '')))
const modules = ref([Navigation])
</script>
<style>
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
</style>
