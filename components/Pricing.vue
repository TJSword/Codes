<template>
  <section class="pricing-one" id="pricing">
    <div class="container">
      <div class="block-title text-center">
        <h2 class="block-title__title">根据 <span>需求</span> 选择 <br> 产品模块</h2><!-- /.block-title__title -->
      </div><!-- /.block-title -->
      <ul class="list-inline text-center switch-toggler-list" role="tablist" id="switch-toggle-tab">
        <li class="month active"><a href="#">月度</a></li>
        <li>
          <!-- Rounded switch -->
          <label class="switch on">
            <span class="slider round"></span>
          </label>
        </li>
        <li class="year"><a href="#">年度</a></li>
      </ul><!-- /.list-inline -->
      <div class="tabed-content">
        <div id="month">
          <div class="row pricing-one__price-row">
            <div class="col-lg-4 wow fadeInUp" data-wow-duration="1500ms">
              <div class="pricing-one__single text-center">
                <h3>¥ 200</h3>
                <p>初级版</p>
                <ul class="list-unstyled">
                  <li>基础分析模块</li>
                </ul><!-- /.list-unstyled -->
                <a href="#" class="thm-btn pricing-one__btn"><span>选择该套餐</span></a>
                <span class="tag-line">No hidden charges!</span>
              </div><!-- /.pricing-one__single -->
            </div><!-- /.col-lg-4 -->
            <div class="col-lg-4 wow fadeInDown" data-wow-duration="1500ms">
              <div class="pricing-one__single text-center">
                <h3>¥ 300</h3>
                <p>中级版</p>
                <ul class="list-unstyled">
                  <li>基础分析模块</li>
                  <li>高级分析模块</li>
                </ul><!-- /.list-unstyled -->
                <a href="#" class="thm-btn pricing-one__btn"><span>选择该套餐</span></a>
                <span class="tag-line">No hidden charges!</span>
              </div><!-- /.pricing-one__single -->
            </div><!-- /.col-lg-4 -->
            <div class="col-lg-4 wow fadeInUp" data-wow-duration="1500ms">
              <div class="pricing-one__single text-center">
                <h3>¥ 4000</h3>
                <p>高级版</p>
                <ul class="list-unstyled">
                  <li>基础分析模块</li>
                  <li>高级分析模块</li>
                  <li>定制化模块</li>
                  <li>一小时定位</li>
                </ul><!-- /.list-unstyled -->
                <a href="#" class="thm-btn pricing-one__btn"><span>选择该套餐</span></a>
                <span class="tag-line">No hidden charges!</span>
              </div><!-- /.pricing-one__single -->
            </div><!-- /.col-lg-4 -->
          </div><!-- /.row -->
        </div><!-- /#month -->
        <div id="year">
          <div class="row pricing-one__price-row">
            <div class="col-lg-4 wow fadeInUp" data-wow-duration="1500ms">
              <div class="pricing-one__single text-center">
                <h3>¥ 2000</h3>
                <p>初级版</p>
                <ul class="list-unstyled">
                  <li>基础分析模块</li>
                </ul><!-- /.list-unstyled -->
                <a href="#" class="thm-btn pricing-one__btn"><span>选择该套餐</span></a>
                <span class="tag-line">No hidden charges!</span>
              </div><!-- /.pricing-one__single -->
            </div><!-- /.col-lg-4 -->
            <div class="col-lg-4 wow fadeInDown" data-wow-duration="1500ms">
              <div class="pricing-one__single text-center">
                <h3>¥ 3000</h3>
                <p>中级版</p>
                <ul class="list-unstyled">
                  <li>基础分析模块</li>
                  <li>高级分析模块</li>
                </ul><!-- /.list-unstyled -->
                <a href="#" class="thm-btn pricing-one__btn"><span>选择该套餐</span></a>
                <span class="tag-line">No hidden charges!</span>
              </div><!-- /.pricing-one__single -->
            </div><!-- /.col-lg-4 -->
            <div class="col-lg-4 wow fadeInUp" data-wow-duration="1500ms">
              <div class="pricing-one__single text-center">
                <h3>¥ 4000</h3>
                <p>高级版</p>
                <ul class="list-unstyled">
                  <li>基础分析模块</li>
                  <li>高级分析模块</li>
                  <li>定制化模块</li>
                  <li>一小时定位</li>
                </ul><!-- /.list-unstyled -->
                <a href="#" class="thm-btn pricing-one__btn"><span>选择该套餐</span></a>
                <span class="tag-line">No hidden charges!</span>
              </div><!-- /.pricing-one__single -->
            </div><!-- /.col-lg-4 -->
          </div><!-- /.row -->
        </div><!-- /#year -->
      </div><!-- /.tabed-content -->
    </div><!-- /.container -->
  </section>
</template>

<script>
    export default {
      name: "Pricing",
      mounted() {

        function toggleTabWithSwitch() {
          var toggleSwitch = $('#switch-toggle-tab label.switch');
          var monthTabTitle = $('#switch-toggle-tab li.month');
          var yearTabTitle = $('#switch-toggle-tab li.year');
          var monthTabContent = $('#month');
          var yearTabContent = $('#year');
          // hidden show deafult;
          monthTabContent.fadeIn();
          yearTabContent.fadeOut();

          function toggleHandle() {
            if (toggleSwitch.hasClass('on')) {
              yearTabContent.fadeOut();
              monthTabContent.fadeIn();
              monthTabTitle.addClass('active');
              yearTabTitle.removeClass('active');
            } else {
              monthTabContent.fadeOut();
              yearTabContent.fadeIn();
              yearTabTitle.addClass('active');
              monthTabTitle.removeClass('active');
            }
          };
          monthTabTitle.on('click', function() {
            toggleSwitch.addClass('on').removeClass('off');
            toggleHandle();
            return false;
          });
          yearTabTitle.on('click', function() {
            toggleSwitch.addClass('off').removeClass('on');
            toggleHandle();
            return false;
          });
          toggleSwitch.on('click', function() {
            toggleSwitch.toggleClass('on off');
            toggleHandle();
          });

        }
        toggleTabWithSwitch();
      }

    }
</script>

<style scoped>

</style>
