<template>
  <section class="fact-one" id="case">
    <div class="container">
      <div class="block-title text-center">
        <h2 class="block-title__title">超过 160+ <span>项目</span> <br> 服务</h2><!-- /.block-title__title -->
      </div><!-- /.block-title -->
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
          <div class="fact-one__single">
            <div class="fact-one__inner">
              <h3 class="fact-one__count counter">16</h3><!-- /.fact-one__count counter -->
              <p class="fact-one__text">合作企业</p><!-- /.fact-one__text -->
            </div><!-- /.fact-one__inner -->
          </div><!-- /.fact-one__single -->
        </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
        <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
          <div class="fact-one__single">
            <div class="fact-one__inner">
              <h3 class="fact-one__count counter">356</h3><!-- /.fact-one__count counter -->
              <p class="fact-one__text">客户资源</p><!-- /.fact-one__text -->
            </div><!-- /.fact-one__inner -->
          </div><!-- /.fact-one__single -->
        </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
        <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
          <div class="fact-one__single">
            <div class="fact-one__inner">
              <h3 class="fact-one__count counter">32</h3><!-- /.fact-one__count counter -->
              <p class="fact-one__text">产品专利</p><!-- /.fact-one__text -->
            </div><!-- /.fact-one__inner -->
          </div><!-- /.fact-one__single -->
        </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
        <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="1500ms">
          <div class="fact-one__single">
            <div class="fact-one__inner">
              <h3 class="fact-one__count counter">6</h3><!-- /.fact-one__count counter -->
              <p class="fact-one__text">系统平台</p><!-- /.fact-one__text -->
            </div><!-- /.fact-one__inner -->
          </div><!-- /.fact-one__single -->
        </div><!-- /.col-lg-3 col-md-6 col-sm-12 -->
      </div><!-- /.row -->
    </div><!-- /.container -->
    <div class="case-list">
      <div class="col-lg-8 wow fadeInUp" data-wow-duration="1500ms">
        <el-carousel :interval="6000" type="card" height="340px">
          <el-carousel-item v-for="item in caseList" :key="item.name">
            <div class="list-wrap">
              <div class="list-name">{{item.name}}</div>
              <el-image :src="item.src"></el-image>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </section>
</template>

<script>
    export default {
      name: "Counter",
      data(){
        return {
          caseList:[
            {
              name:'研究数字化系列',
              src:'/assets/images/cases/case1.jpg'
            },{
              name:'决策咨询系列',
              src:'/assets/images/cases/case2.jpg'
            },{
              name:'学科专题系列',
              src:'/assets/images/cases/case3.jpg'
            },{
              name:'研究数字化系列',
              src:'/assets/images/cases/case1.jpg'
            },{
              name:'决策咨询系列',
              src:'/assets/images/cases/case2.jpg'
            },{
              name:'学科专题系列',
              src:'/assets/images/cases/case3.jpg'
            }
          ]
        }
      },
      mounted() {
        if ($('.counter').length) {
          $('.counter').counterUp({
            delay: 10,
            time: 3000
          });
        }
      }
    }
</script>

<style scoped>
.case-list{
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.el-carousel__item--card{
  border: #ffa065 3px solid;
}
.list-wrap{
  height: 100%;
  width: 100%;
  position: relative;
}
.list-name{
  color: #fff;
  font-size: 16px;
  background: rgba(0,0,0,0.8);
  padding: 5px 10px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 2;
}

</style>
