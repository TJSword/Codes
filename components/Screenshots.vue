<template>
  <section class="app-shot-one" id="screenshots">
    <img src="/assets/images/background/app-shot-bg.png" alt="Awesome Image" class="app-shot-one__bg" />
    <div class="container-fluid">
      <div class="block-title text-center">
        <h2 class="block-title__title">我们的 <br> <span>系统应用</span> 截图</h2><!-- /.block-title__title -->
      </div><!-- /.block-title -->
      <div class="app-shot-one__carousel owl-theme owl-carousel">
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-1.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-2.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-3.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-4.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-5.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-1.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-2.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-3.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-4.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-5.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-1.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-2.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-3.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-4.jpg" alt="">
        </div><!-- /.item -->
        <div class="item">
          <img src="/assets/images/app-shots/app-shot-1-5.jpg" alt="">
        </div><!-- /.item -->
      </div><!-- /.app-shot-one__carousel owl-theme owl-carousel -->
    </div><!-- /.container-fluid -->
  </section>
</template>

<script>
    export default {
      name: "Screenshots",
      mounted() {

          if ($('.app-shot-one__carousel').length) {
            $('.app-shot-one__carousel').owlCarousel({
              loop: true,
              margin: 43,
              nav: false,
              dots: false,
              autoWidth: true,
              autoplay: true,
              smartSpeed: 1000,
              autoplayTimeout: 5000,
              autoplayHoverPause: true,
              slideBy: 1,
            });
          }
      }
    }
</script>

<style scoped>

</style>
