export default {
  ui: {
    app: {
      //产品信息
      name: "人人开源",
      productName: "人人微服务平台",
      productNameMini: "人人",
      copyright: "renren.io"
    },
    setting: {
      // 右侧可视化设置窗口
      pageTitle: "主题设置",
      //
      sidebarThemeDark: "暗色侧边栏",
      sidebarThemeLight: "亮色侧边栏",
      topHeaderThemeDark: "暗色顶栏",
      topHeaderThemeLight: "亮色顶栏",
      topHeaderThemePrimary: "主题色顶栏",
      //
      colorTheme1: "拂晓蓝",
      colorTheme2: "青色",
      colorTheme3: "蓝色",
      colorTheme4: "绿色",
      colorTheme5: "蓝绿色",
      colorTheme6: "靛青色",
      colorTheme7: "棕色",
      colorTheme8: "紫色",
      colorTheme9: "灰色",
      colorTheme10: "橙色",
      colorTheme11: "混红色",
      colorTheme12: "黄色",
      colorTheme13: "红色",
      colorTheme14: "暗黑",
      //
      title2: "导航模式",
      sidebarLayoutLeft: "左侧菜单布局",
      sidebarLayoutTop: "顶部菜单布局",
      sidebarLayoutMix: "混合菜单布局",
      contentFull: "内容区域铺满",
      //
      title3: "其他配置",
      logoAuto: "Logo宽度自动",
      colorIcon: "侧栏彩色图标",
      sidebarUniOpened: "侧栏排他展开",
      openTabsPage: "是否开启标签页",
      tabStyles: "页签显示风格",
      tabStyles1: "默认",
      tabStyles2: "圆点",
      tabStyles3: "卡片",
      //
      settingTips:
        "该功能可实时预览各种布局效果, 更多完整配置在 src/constants/config.ts 中设置, 修改后会记住配置, 可用于生产环境中.",
      copyBtn: "拷贝设置",
      copySuccess: "拷贝成功"
    },
    router: {
      //路由
      pageWorkbench: "工作台",
      pageHome: "主页",
      pageLogin: "登录",
      pageError: "错误页面",
      moreMenus: "更多菜单",
      tabs: {
        //tab标签页
        closeThis: "关闭当前标签页",
        closeOther: "关闭其他标签页",
        closeAll: "关闭全部标签页",
        closeRight: "关闭右侧",
        closeLeft: "关闭左侧",
        closeOnlyOneTips: "只剩下一个标签页，不支持关闭"
      },
      error: {
        backBtn: "返回",
        homeBtn: "主页",
        404: {
          //404
          title: "404",
          des: "访问页面不存在"
        },
        error: {
          //error
          title: "错误",
          des: "访问出错了"
        }
      }
    },
    user: {
      //用户模块
      links: {
        userCenter: "个人中心",
        tenantSwitch: "当前租户",
        editPassword: "修改密码",
        logout: "退出登录"
      },
      message: {
        notice: "通知",
        upcoming: "待办"
      }
    },
    widget: {
      //通用小组件
      selectTips: "请选择"
    },
    login: {
      // 登录页
      loginOk: "登录成功",
      userNamePlaceholder: "用户名",
      passwordPlaceholder: "密码",
      captchaPlaceholder: "验证码",
      remember: "记住密码",
      loginBtn: "登录",
      rules: {
        userName: "必填项不能为空",
        password: "必填项不能为空",
        captcha: "必填项不能为空"
      }
    }
  }
};
