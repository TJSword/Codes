<template>
  <section class="blog-one blog-one__home thm-gray-bg" id="news">
    <div class="container">
      <div class="block-title text-center">
        <h2 class="block-title__title">客研社 <span>最新的</span> <br> 消息 & 文章</h2><!-- /.block-title__title -->
      </div><!-- /.block-title -->
      <div class="row">
        <div class="col-lg-4 col-md-12 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
          <div class="blog-one__single">
            <div class="blog-one__image">
              <img src="/assets/images/blog/blog-1-1.jpg" alt="">
              <a class="blog-one__more-link" href="news-details.html"><i class="fa fa-link"></i>
                <!-- /.fa fa-link --></a>
            </div><!-- /.blog-one__image -->
            <div class="blog-one__content">
              <ul class="list-unstyled blog-one__meta">
                <li><a href="#">2020-10-12</a></li>
                <li><a href="#">2 评论</a></li>
              </ul><!-- /.list-unstyled -->
              <h3 class="blog-one__title">
                <nuxt-link to="/blog-details">前言：数字化时代的客研</nuxt-link>
              </h3><!-- /.blog-one__title -->
              <nuxt-link to="/blog-details" class="blog-one__link">阅读更多</nuxt-link><!-- /.blog-one__link -->
            </div><!-- /.blog-one__content -->
          </div><!-- /.blog-one__single -->
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4 col-md-12 col-sm-12 wow fadeInDown" data-wow-duration="1500ms">
          <div class="blog-one__single">
            <div class="blog-one__image">
              <img src="/assets/images/blog/blog-1-2.jpg" alt="">
              <a class="blog-one__more-link" href="news-details.html"><i class="fa fa-link"></i>
                <!-- /.fa fa-link --></a>
            </div><!-- /.blog-one__image -->
            <div class="blog-one__content">
              <ul class="list-unstyled blog-one__meta">
                <li><a href="#">2020-10-12</a></li>
                <li><a href="#">2 评论</a></li>
              </ul><!-- /.list-unstyled -->
              <h3 class="blog-one__title">
                <nuxt-link to="/blog-details">为什么说客研的核心能力是创造奇迹</nuxt-link>
              </h3><!-- /.blog-one__title -->
              <nuxt-link to="/blog-details" class="blog-one__link">阅读更多</nuxt-link><!-- /.blog-one__link -->
            </div><!-- /.blog-one__content -->
          </div><!-- /.blog-one__single -->
        </div><!-- /.col-lg-4 -->
        <div class="col-lg-4 col-md-12 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
          <div class="blog-one__single">
            <div class="blog-one__image">
              <img src="/assets/images/blog/blog-1-3.jpg" alt="">
              <a class="blog-one__more-link" href="news-details.html"><i class="fa fa-link"></i>
                <!-- /.fa fa-link --></a>
            </div><!-- /.blog-one__image -->
            <div class="blog-one__content">
              <ul class="list-unstyled blog-one__meta">
                <li><a href="#">2020-10-12</a></li>
                <li><a href="#">2 评论</a></li>
              </ul><!-- /.list-unstyled -->
              <h3 class="blog-one__title">
                <nuxt-link to="/blog-details">如何判断板块市场风险高低？</nuxt-link>
              </h3><!-- /.blog-one__title -->
              <nuxt-link to="/blog-details" class="blog-one__link">阅读更多</nuxt-link><!-- /.blog-one__link -->
            </div><!-- /.blog-one__content -->
          </div><!-- /.blog-one__single -->
        </div><!-- /.col-lg-4 -->
      </div><!-- /.row -->
    </div><!-- /.container -->
  </section>
</template>

<script>
    export default {
      name: "BlogHome"
    }
</script>

<style scoped>

</style>
