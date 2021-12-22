<template>
  <div class="page-wrapper">
    <Preloader />
    <nuxt />
  </div>
</template>


<script>
  import Preloader from "~/components/Preloader.vue";
  export default {
    components: {
      Preloader
    },
    head(){
      return {
        title: "客研社 | 算法改变房地产未来"
      }
    }

  }
</script>
