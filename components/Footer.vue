<template>
  <div>
    <footer class="site-footer" id="contact_us">
      <div class="site-footer__upper">
        <div class="container">
          <div class="row">
            <div class="footer-wrap col-lg-12">
              <div class="footer-widget footer-widget__about col-lg-4">
                <img src="/assets/images/resources/logo-dark.png" width="119" alt="" class="footer-widget__logo">
                <p class="footer-widget__contact"><a href="tel:888-666-0000">0532-66018805</a></p>
                <!-- /.footer-widget__contact -->
                <p class="footer-widget__contact"><a href="mailto:needhelp@example.com">needhelp@example.com</a>
                <p class="footer-widget__contact">山东省青岛市李沧区文昌路<br> 155号 百度创新中心C区 甲-9</p><!-- /.footer-widget__contact -->
              </div><!-- /.footer-widget -->
              <div class="footer-concat col-lg-6">
                <form action="#" class="reply-form">
                  <div class="row">
                    <div class="col-lg-6">
                      <input type="text" v-model="concat.name" placeholder="您的姓名" class="reply-form__field">
                    </div><!-- /.col-lg-6 -->
                    <div class="col-lg-6">
                      <input type="text" v-model="concat.phone" placeholder="您的联系方式" class="reply-form__field">
                    </div><!-- /.col-lg-6 -->
                    <div class="col-lg-12">
                      <textarea placeholder="留言内容" class="reply-form__field" v-model="concat.lesmessage"></textarea>
                      <button class="reply-form__btn thm-btn" type="submit"><span>联系我们</span></button>
                    </div><!-- /.col-lg-12 -->
                  </div><!-- /.row -->
                </form><!-- /.reply-form -->
              </div>
            </div><!-- /.col-lg-2 -->
          </div><!-- /.row -->
        </div><!-- /.container -->
      </div><!-- /.site-footer__upper -->
      <div class="site-footer__bottom">
        <div class="container">
          <div class="inner-container text-center">
            <p class="site-footer__copy">&copy; copyright 2021 by <a href="#">wwww.keyanshe.ltd</a> <a style="color:#74727a" href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备19064613号-1</a></p>
            <!-- /.site-footer__copy -->
          </div><!-- /.inner-container -->
        </div><!-- /.container -->
      </div><!-- /.site-footer__bottom -->
    </footer>

      <a href="#" data-target="html" class="scroll-to-target scroll-to-top"><i class="fa fa-angle-up"></i></a>

  </div>
</template>

<script>
    export default {
      name: "Footer",
      data(){
        return{
          concat:{
            name:'',
            phone:'',
            lesmessage:''
          }
        }
      },
      mounted() {

        $(window).on('scroll', function () {
          if ($('.scroll-to-top').length) {
            var strickyScrollPos = 100;
            if ($(window).scrollTop() > strickyScrollPos) {
              $('.scroll-to-top').fadeIn(500);
            } else if ($(this).scrollTop() <= strickyScrollPos) {
              $('.scroll-to-top').fadeOut(500);
            }
          }
        })
      }
    }
</script>

<style scoped>
.footer-wrap{
  display: flex;
  justify-content: space-between;
}
.reply-form input{
  height: 50px;
}
.reply-form textarea{
  height: 100px;
}
</style>
