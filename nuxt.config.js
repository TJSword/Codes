
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'keywords', content: '客研社,青岛客研社,客研社官网,青岛客研社数据信息技术服务有限公司,房地产定位,客户咨询,客户调研,客研云,D2D' },
      { name: 'description', content: '客研社是房地产全链条数据提供商，同时也是房地产开发解决方案服务商。我们致力于把数字化普及到房地产相关的每一个角落，构建城市、建筑与人互联的数据世界。让房地产开发者可以通过数据观测到城市；让房地产开发者通过算法快速获取分析结论；房地产的开发者们，因强大的数字平台而变得创新、高效、生机勃勃；通过AI重新定义开发模式，让房地产开发者获得优质的数字化解决方案和数据可视化体验。' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/assets/images/favicons/favicon.ico' },
      { rel: 'apple-touch-icon', sizes:'180x180', href: '/assets/images/favicons/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes:'32x32', href: '/assets/images/favicons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes:'16x16', href: '/assets/images/favicons/favicon-16x16.png' },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Rubik:300,400,500,700,900&display=swap"
      },
      { rel: "stylesheet", href: "/assets/css/bootstrap.min.css" },
      { rel: "stylesheet", href: "/assets/css/animate.min.css" },
      { rel: "stylesheet", href: "/assets/css/owl.carousel.min.css" },
      { rel: "stylesheet", href: "/assets/css/owl.theme.default.min.css" },
      { rel: "stylesheet", href: "/assets/css/magnific-popup.css" },
      { rel: "stylesheet", href: "/assets/css/font-awesome.min.css" },
      { rel: "stylesheet", href: "/assets/css/swiper.min.css" },
      { rel: "stylesheet", href: "/assets/plugins/dimon-icons/style.css" },
      { rel: "stylesheet", href: "/assets/css/style.css" },
      { rel: "stylesheet", href: "/assets/css/responsive.css" },
    ],

    script: [
      { src: "/assets/js/jquery.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/bootstrap.bundle.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/owl.carousel.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/waypoints.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/jquery.counterup.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/TweenMax.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/wow.js", type: "text/javascript", body: true },
      { src: "/assets/js/jquery.magnific-popup.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/jquery.ajaxchimp.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/swiper.min.js", type: "text/javascript", body: true },
      { src: "/assets/js/jquery.easing.min.js", type: "text/javascript", body: true },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: "@/plugins/element-ui",
      ssr: false  // 关闭ssr
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** optimizedImages
  */
  optimizedImages: {
    optimizeImages: true
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    babel: {
      "plugins": [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    },
    extend (config, ctx) {
    }
  }
}
