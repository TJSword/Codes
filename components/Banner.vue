<template>
  <section class="banner-one" id="banner">
    <span class="banner-one__shape-1"></span>
    <span class="banner-one__shape-2"></span>
    <span class="banner-one__shape-3"></span>
    <span class="banner-one__shape-4"></span>
    <div class="container">
      <div class="banner-one__moc">
        <el-carousel class="banner__carousel" height="449px">
          <el-carousel-item v-for="(item,i) in carouselArr" :key="i">
            <el-image :src="item" fit="cover"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div><!-- /.banner-one__moc -->
      <div class="row">
        <div class="col-xl-6 col-lg-8">
          <div class="banner-one__content">

            <h3 class="banner-one__title">算法 改变<br> <span>房地产</span> 未来 <br> D2D.</h3><!-- /.banner-one__title -->
            <p class="banner-one__text">客研大数据与算法应用已然成熟，客户心理学研究也走上日程。<br>种一棵树最好的时间是在十年前，其次是现在。<br>客研新时代已然到来，你是否准备接受？</p>
            <!-- /.banner-one__text -->
            <div class="banner-one__btn thm-btn " @click="downloadSc()"><span>下载赋能手册</span></div><!-- /.thm-btn -->
            <p class="banner-one__tip">激活数字化客研体系 ↑</p>
          </div><!-- /.banner-one__content -->
        </div><!-- /.col-lg-6 -->
      </div><!-- /.row -->
    </div><!-- /.container -->
  </section>
</template>

<script>
    export default {
      name: "Banner",
      data(){
        return {
          carouselArr:[ //手册截图
            '/assets/images/manual/p1.jpg',
            '/assets/images/manual/p2.jpg',
            '/assets/images/manual/p3.jpg',
            '/assets/images/manual/p4.jpg',
            '/assets/images/manual/p5.jpg',
            '/assets/images/manual/p6.jpg',
            '/assets/images/manual/p7.jpg',
            '/assets/images/manual/p8.jpg',
            '/assets/images/manual/p9.jpg',
            '/assets/images/manual/p10.jpg'
          ],
        }
      },
      methods:{
        //下载客研社赋能手册
        downloadSc(){
          window.open('http://118.190.150.38:8281/dmc-web/sys/oss/download/13398201204900')
          alert('文件已开始下载，请查看浏览器下载进度')
        },
      }
    }
</script>

<style scoped>
.banner-one__btn{
  cursor: pointer;
}
.banner-one__tip{
  color: #4f4f4f;
  font-size: 22px;
  margin-top: 10px;
}
.banner__carousel{
  width: 800px;
  box-shadow: rgb(0, 0, 0, 0.23) 0px 6px 20px 4px;
  border-radius: 6px;
  overflow: hidden;
}
</style>
