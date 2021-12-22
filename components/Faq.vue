<template>
  <section class="faq-one">
    <img src="/assets/images/background/faq-one-bg.png" alt="Awesome Image" class="faq-one__bg" />
    <div class="container">
      <div class="block-title text-center">
        <h2 class="block-title__title">想问我们 <span>专业</span> <br> 问题</h2><!-- /.block-title__title -->
      </div><!-- /.block-title -->
      <div class="accrodion-grp" data-grp-name="faq-accrodion">
        <div class="accrodion active wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="0ms">
          <div class="accrodion-inner">
            <div class="accrodion-title">
              <h4>为什么说客研工作的定位是领袖？</h4>
            </div>
            <div class="accrodion-content">
              <div class="inner">
                <p>房地产开发的本质为“城市、建筑、人”建立生态关系，客研工作的本质以大数据为驱动，带领企业做好这件事。</p>
              </div><!-- /.inner -->
            </div>
          </div><!-- /.accrodion-inner -->
        </div>
        <div class="accrodion  wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="100ms">
          <div class="accrodion-inner">
            <div class="accrodion-title">
              <h4>为什么说客研的核心能力是创造奇迹？</h4>
            </div>
            <div class="accrodion-content">
              <div class="inner">
                <p>2020年开始，房地产进入了内忧外患严重的“渡劫期”，其他岗位只能帮助企业实现存活和延续，只有客研岗位才能创造奇迹，帮助企业从优秀蝶变卓越，实现基业长青。</p>
              </div><!-- /.inner -->
            </div>
          </div><!-- /.accrodion-inner -->
        </div>
        <div class="accrodion wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="200ms">
          <div class="accrodion-inner">
            <div class="accrodion-title">
              <h4>为什么说客研人的目标是构建体系？</h4>
            </div>
            <div class="accrodion-content">
              <div class="inner">
                <p>体系可以把投发、市场、销售、设计、客研、成本等部门，4-5种专业语境，20多个沟通节点，消耗数千个小时的工作压缩到一个黑箱里。</p>
              </div><!-- /.inner -->
            </div>
          </div><!-- /.accrodion-inner -->
        </div>
        <div class="accrodion wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="300ms">
          <div class="accrodion-inner">
            <div class="accrodion-title">
              <h4>L.P.S对客研人的意义?</h4>
            </div>
            <div class="accrodion-content">
              <div class="inner">
                <p>“L.P.S”对于客研人最重要的意义是提升生产力，它体现于“有效沟通”和“解决方案”。</p>
              </div><!-- /.inner -->
            </div>
          </div><!-- /.accrodion-inner -->
        </div>
      </div>
    </div><!-- /.container -->
  </section>
</template>

<script>
    export default {
      name: "Faq",
      mounted() {
        if ($('.accrodion-grp').length) {
          var accrodionGrp = $('.accrodion-grp');
          accrodionGrp.each(function() {
            var accrodionName = $(this).data('grp-name');
            var Self = $(this);
            var accordion = Self.find('.accrodion');
            Self.addClass(accrodionName);
            Self.find('.accrodion .accrodion-content').hide();
            Self.find('.accrodion.active').find('.accrodion-content').show();
            accordion.each(function() {
              $(this).find('.accrodion-title').on('click', function() {
                if ($(this).parent().parent().hasClass('active') === false) {
                  $('.accrodion-grp.' + accrodionName).find('.accrodion').removeClass('active');
                  $('.accrodion-grp.' + accrodionName).find('.accrodion').find('.accrodion-content').slideUp();
                  $(this).parent().parent().addClass('active');
                  $(this).parent().parent().find('.accrodion-content').slideDown();
                };


              });
            });
          });

        }
      }
    }
</script>

<style scoped>

</style>
