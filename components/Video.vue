<template>
  <section class="video-one" id="video">
    <img src="/assets/images/background/video-one-bg.png" alt="Awesome Image" class="video-one__bg" />
    <div class="container wow fadeInUp" data-wow-duration="1500ms">
      <div class="video-one__box ">
        <img src="/assets/images/resources/video-1-1.jpg" alt="">
        <div class="video-one__content">
          <video class="video-box" src="/assets/video/kys0119.mp4" controls="controls" poster="/assets/images/resources/video-1-1.jpg"></video>
          <!-- <a href="http://zk.keyanshe.ltd/video.html" class="video-popup video-one__btn"><i class="fa fa-play"></i></a>
          <h2 class="video-one__title">观看 我们的 <span>产品</span> <br> 视频.</h2> -->
        </div><!-- /.video-one__content -->
      </div><!-- /.video-one__box -->
    </div><!-- /.container -->
  </section>
</template>

<script>
    export default {
      name: "Video",
      mounted() {
        if ($('.video-popup').length) {
          $('.video-popup').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: true,

            fixedContentPos: false
          });
        }
      }
    }
</script>

<style scoped>
.video-box{
  width: 100%;
  height: 100%;
}
</style>
