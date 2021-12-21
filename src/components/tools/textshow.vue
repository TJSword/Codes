<template>
  <!-- 文字展示效果 -->
  <div class="text_box">
    <ul class="shinchou-menu">
      <li v-for="(item, i) in textArr" :key="i">
        <a href="#">{{ item }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    textArr: {
      //文字数组
      type: Array,
      default: ["D2D 房地产开发决策伙伴"],
    },
  },
  watch: {
    textArr: {
      handler(newVal) {
        this.$nextTick(()=>{
          this.animationSet();
        })
      },
      deep: true,
    },
  },
  mounted() {
    
  },
  methods: {
    //动画设置
    animationSet() {
      let shinchouMenuLinks = document.querySelectorAll(".shinchou-menu li a");
      shinchouMenuLinks.forEach((link) => {
        let letters = link.textContent.split("");
        link.textContent = "";
        letters.forEach((letter, i) => {
          let span = document.createElement("span");
          span.textContent = letter;
          if (i < 2) {
            span.className = "highlight";
          }
          span.style.transitionDelay = `${i / 10}s`;
          link.append(span);
        });
      });
    },
  },
};
</script>
<style lang="scss">
/*文字展开效果*/
.text_box {
  .shinchou-menu {
    --highlight-text-color: #00acf0;
    display: flex;
    flex-direction: column;
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      margin: 6px;

      a {
        position: relative;
        display: inline-flex;
        padding: 6px 2px 6px 2px;
        color: black;
        font-size: 1.4em;
        font-weight: 700;
        line-height: 1; // ensure span is a square
        text-decoration: none;
        overflow: hidden;

        &::before {
          position: absolute;
          content: "";
          top: 0;
          left: 0;
          z-index: -2;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
        }

        &:hover {
          span {
            color: white !important;
            text-shadow: 0 0 10px var(--highlight-text-color);
          }
        }

        span {
          position: relative;
          margin: 0 5px 0 4px;
          transition: 0.3s;

          &.highlight::before {
            position: absolute;
            content: "";
            top: -3px;
            left: -3px;
            bottom: -3px;
            right: -3px;
            z-index: -1;
            background: var(--highlight-text-color);
          }

          &:not(.highlight) {
            color: var(--highlight-text-color);
          }
        }
      }
    }
  }
}
</style>
