<template>
    <div class="reveal" @click="animationSet">{{text}}</div>
</template>
<script>
export default {
    data(){
        return{}
    },
    props:{
        text:{ //动画文本
            type:String,
            default:'暂无文本'
        }
    },
    watch:{
      
    },
    mounted(){
      this.animationSet()
    },
    methods:{
        //动画设置
        animationSet(){
            //let duration = 0.8;
            if(this.text == null){
              return
            }
            let delay = 0.3;
            let revealText = document.querySelector(".reveal");
            let letters = this.text.split("");
            revealText.textContent = "";
            let middle = letters.filter(e => e !== " ").length / 2;
            letters.forEach((letter, i) => {
                let span = document.createElement("span");
                span.textContent = letter;
                span.style.animationDelay = `${delay + Math.abs(i - middle) * 0.1}s`;
                revealText.append(span);
            });
        },
    }
}
</script>
<style lang="scss" scope>
    /*文字展开效果*/
  .reveal {
    position: relative;
    display: flex;
    color: #8590a5;
    font-size: 20px;
    font-weight: bold;
    font-family: Raleway, sans-serif;
    letter-spacing: 3px;
    text-transform: uppercase;
    white-space: pre;
    user-select: none;
    padding-left: 10px;
    cursor: pointer;
    span {
      opacity: 0;
      transform: scale(0);
      animation: fadeIn 2.4s forwards;
    }
  
    &::before{
      position: absolute;
      content: "";
      top: 10%;
      bottom: 0;
      width: 4px;
      height: 80%;
      background: #8590a5;
      opacity: 0;
      transform: scale(0);
    }
  
    &::before {
      left: 50%;
      animation: slideLeft 1.5s cubic-bezier(0.7, -0.6, 0.3, 1.5) forwards;
    }
  
  }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slideLeft {
    to {
      left: -6%;
      opacity: 1;
      transform: scale(0.9);
    }
  }
  
  @keyframes slideRight {
    to {
      right: -6%;
      opacity: 1;
      transform: scale(0.9);
    }
  }
</style>