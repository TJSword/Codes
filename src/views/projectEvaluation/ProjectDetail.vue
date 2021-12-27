<template>
    <div class="detail_wrap" :style="{'height':height + 'px'}">
       <div class="detail_box">
            <div class="nav_header">
                <div class="jumpbox">
                    <div 
                     @click="choose(item.path)"
                    :data-text="item.name" 
                    v-for="(item,index) in jump_box" 
                    :key='index' 
                    :class="['btn','btn-primary','btn-ghost', 'btn-border-stroke','btn-text-float-up',choosePath === item.path?'active':'']" 
                   >
                    <div class="btn-borders">
                            <div class="border-top"></div>
                            <div class="border-right"></div>
                            <div class="border-bottom"></div>
                            <div class="border-left"></div>
                        </div>
                        <span class="btn-text">{{item.name}}</span>
                    </div>
                </div>
                <div class="zan_shoucang">
                    <i class="iconfont icon-dianzan"></i>
                    <i class="iconfont icon-shoucang"></i>
                    <i class="icon icon-pink icon-bubbles"></i>
                    <i class="icon1 icon1-pink icon1-bubbles"></i>
                </div>
            </div>
            <router-view></router-view>
       </div>
    </div>
</template>
<script>
export default {
    name:'projectDetail',
    data(){
        return{
            height:window.innerHeight - 51,
            pro_id:'',
            jump_box:[{
                path:'/projectDetail/basics',
                name:'基础概况'
            },
            {
                path:'/projectDetail/land',
                name:'土地信息'
            },
            {
                path:'/projectDetail/planning',
                name:'项目规划'
            },
            {
                path:'/projectDetail/product',
                name:'产品分析'
            }
            ,{
                path:'/projectDetail/marketing',
                name:'营销展示'
            }
            ,{
                path:'/projectDetail/sale',
                name:'销售动态'
            }]
        }
        
    },
    methods:{
        choose(path){
            this.choosePath = path;
            console.log(this.choosePath)
            this.$router.push({
                path:path + '?id=' + this.pro_id
            })
        }
    },
    created(){
        //刷新页面 active样式保留
        let path = this.$route.path;
        let arr = path.split("/")
        if(arr.length>3){
            arr.pop();
           this.choosePath = arr.join("/")
        }else{
            this.choosePath = this.$route.path
        }
        console.log(this.$route.query.id)
        this.pro_id = this.$route.query.id
        
    }

}
</script>
<style lang="scss" scoped>
    *{
        margin:0;
        padding:0
    }
    .detail_wrap{
        // background: #F6F6F6;
        overflow-y:scroll;
     .detail_box{
           height:100%;
            width:70%;
            margin-left:15%;
            background:white;
            border:1px solid white;
             .nav_header{
                height:60px;
                display: flex;
                margin-top:10px;
                align-items: center;
                justify-content: space-between;
                .jumpbox{
                    display: flex;
                }
                .zan_shoucang{
                    height:40px;
                    width:120px;
                    position: relative;
                    margin-right:20px;
                    .icon-dianzan{
                        font-size:28px;
                        position: absolute;
                        left:0px;
                        bottom:2px;
                    }
                    .icon-shoucang{
                        font-size:30px;
                        font-weight: 700;
                        position: absolute;
                        right:0px;
                        bottom:1.5px;
                    }
                    @function sample($list) {
                        @return nth($list, random(length($list)));
                        }

                        @function bubbles($color, $count: 16) {
                        $bubbles: ();
                        // define your own bubbles here!
                        $bubble-types: (
                            radial-gradient(circle, $color 20%, transparent 20%),
                            radial-gradient(circle, transparent 20%, $color 20%, transparent 30%)
                        );
                        @for $i from 1 through $count {
                            $bubbles: append($bubbles, sample($bubble-types), comma);
                        }
                        @return $bubbles;
                        }

                        @function random_range($min, $max) {
                        $rand: random();
                        $random_range: $min + floor($rand * (($max - $min) + 1));
                        @return $random_range;
                        }

                        @function random_sizes($count: 16) {
                        $sizes: ();
                        @for $i from 1 through $count {
                            $sizes: append(
                            $sizes,
                            (random_range(10, 20) * 1%) (random_range(10, 20) * 1%),
                            comma
                            );
                        }
                        @return $sizes;
                        }

                        .icon {
                        --hue: 190;
                        --icon-bg-color: hsl(var(--hue), 100%, 50%);
                        --icon-bg-color-darker: hsl(var(--hue), 100%, 45%);
                        font-size:28px;
                        position: absolute;
                        left:0px;
                        bottom:2px;
                        font-size: 1rem;
                        font-family: Lato, sans-serif;
                        line-height: 1.5;
                        color: white;
                        text-decoration: none;
                        // border: 1px solid var(--icon-bg-color);
                        border-radius: 4px;
                        // box-shadow:
                        // 0 0.1px 0.7px rgba(233, 30, 99, 0.141),
                        // 0 0.1px 1.7px rgba(233, 30, 99, 0.202),
                        // 0 0.3px 3.1px rgba(233, 30, 99, 0.25),
                        // 0 0.4px 5.6px rgba(233, 30, 99, 0.298),
                        // 0 0.8px 10.4px rgba(233, 30, 99, 0.359),
                        // 0 2px 25px rgba(233, 30, 99, 0.5)
                        // ;
                        outline: transparent;
                        overflow: hidden;
                        cursor: pointer;
                        user-select: none;
                        white-space: nowrap;
                        transition: 0.25s;
                        height:35px;
                        width:35px;
                        background: transparent;
                        &-pink {
                            --hue: 330;
                        }

                        &-bubbles {
                            overflow: visible;
                            transition: transform ease-in 0.1s, background-color ease-in 0.1s,
                            box-shadow ease-in 0.25s;

                            &::before {
                            position: absolute;
                            content: "";
                            left: -2em;
                            right: -2em;
                            top: -2em;
                            bottom: -2em;
                            transition: ease-in-out 0.5s;
                            background-repeat: no-repeat;
                            background-image: bubbles(#0084ff);
                            background-size: random_sizes();
                            background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%,
                                65% 30%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%,
                                64% 70%, 80% 71%;
                            animation: bubbles ease-in-out 0.75s forwards;
                            }

                            &:active {
                            transform: scale(0.95);
                            // background: var(--icon-bg-color-darker);

                            &::before {
                                // when the clicked mouse is up, trigger the animation.
                                animation: none;
                                background-size: 0;
                            }
                            }
                        }
                        }
                        .icon1 {
                        --hue: 190;
                        --icon1-bg-color: hsl(var(--hue), 100%, 50%);
                        --icon1-bg-color-darker: hsl(var(--hue), 100%, 45%);
                        font-size:28px;
                        position: absolute;
                        right:0px;
                        bottom:2px;
                        font-size: 1rem;
                        font-family: Lato, sans-serif;
                        line-height: 1.5;
                        color: white;
                        text-decoration: none;
                        // border: 1px solid var(--icon1-bg-color);
                        border-radius: 4px;
                        // box-shadow:
                        // 0 0.1px 0.7px rgba(233, 30, 99, 0.141),
                        // 0 0.1px 1.7px rgba(233, 30, 99, 0.202),
                        // 0 0.3px 3.1px rgba(233, 30, 99, 0.25),
                        // 0 0.4px 5.6px rgba(233, 30, 99, 0.298),
                        // 0 0.8px 10.4px rgba(233, 30, 99, 0.359),
                        // 0 2px 25px rgba(233, 30, 99, 0.5)
                        // ;
                        outline: transparent;
                        overflow: hidden;
                        cursor: pointer;
                        user-select: none;
                        white-space: nowrap;
                        transition: 0.25s;
                        height:35px;
                        width:35px;
                        background: transparent;
                        &-pink {
                            --hue: 330;
                        }

                        &-bubbles {
                            overflow: visible;
                            transition: transform ease-in 0.1s, background-color ease-in 0.1s,
                            box-shadow ease-in 0.25s;

                            &::before {
                            position: absolute;
                            content: "";
                            left: -2em;
                            right: -2em;
                            top: -2em;
                            bottom: -2em;
                            transition: ease-in-out 0.5s;
                            background-repeat: no-repeat;
                            background-image: bubbles(#0084ff);
                            background-size: random_sizes();
                            background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%,
                                65% 30%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%,
                                64% 70%, 80% 71%;
                            animation: bubbles ease-in-out 0.75s forwards;
                            }

                            &:active {
                            transform: scale(0.95);
                            // background: var(--icon1-bg-color-darker);

                            &::before {
                                // when the clicked mouse is up, trigger the animation.
                                animation: none;
                                background-size: 0;
                            }
                            }
                        }
                        }
                        @keyframes bubbles {
                        0% {
                            background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%,
                            65% 30%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%,
                            64% 70%, 80% 71%;
                        }

                        50% {
                            background-position: 10% 44%, 0% 20%, 15% 5%, 30% 0%, 42% 0%, 62% -2%,
                            75% 0%, 95% -2%, 0% 80%, 95% 55%, 7% 100%, 24% 100%, 41% 100%, 55% 95%,
                            68% 96%, 95% 100%;
                        }

                        100% {
                            background-position: 5% 44%, -5% 20%, 7% 5%, 23% 0%, 37% 0, 58% -2%, 80% 0%,
                            100% -2%, -5% 80%, 100% 55%, 2% 100%, 23% 100%, 42% 100%, 60% 95%, 70% 96%,
                            100% 100%;
                            background-size: 0% 0%;
                        }
                    }

                }

            }
         }


        //导航按钮样式
    .btn {
        --hue: 190;
        --ease-in-duration: 0.25s;
        --ease-in-exponential: cubic-bezier(0.95, 0.05, 0.795, 0.035);
        --ease-out-duration: 0.65s;
        --ease-out-delay: var(--ease-in-duration);
        --ease-out-exponential: cubic-bezier(0.19, 1, 0.22, 1);
        position: relative;
        padding:0px 20px;
        height:40px;
        font-size: 1rem;
        line-height: 1.5;
        color: #303133;
        text-decoration: none;
        background-color: rgba(0,0,0,0.17);
        border: 1px solid rgba(0,0,0,0.17);
        outline: transparent;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        transition: 0.25s;
        margin-right:5px;
        display: flex;
        align-items: center;
        &:hover {
            background:#0084ff;
        }

        &-primary {
            --hue: 171;
        }

        &-ghost {
            color: #303133;
            background-color: transparent;
            border-color: #0084ff;

            &:hover {
            color: white;
            }
        }

        &-border-stroke {
            border-color:rgba(0,0,0,0.17);

            .btn-borders {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            .border-top {
                position: absolute;
                top: 0;
                width: 100%;
                height: 1px;
                background: #0084ff;
                transform: scaleX(0);
                transform-origin: left;
            }

            .border-right {
                position: absolute;
                right: 0;
                width: 1px;
                height: 100%;
                background: #0084ff;
                transform: scaleY(0);
                transform-origin: bottom;
            }

            .border-bottom {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 1px;
                background: #0084ff;
                transform: scaleX(0);
                transform-origin: left;
            }

            .border-left {
                position: absolute;
                left: 0;
                width: 1px;
                height: 100%;
                background: #0084ff;
                transform: scaleY(0);
                transform-origin: bottom;
            }

            // when unhover, ease-out left, bottom; ease-in right, top

            .border-left {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                var(--ease-out-exponential);
            }
            .border-bottom {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                var(--ease-out-exponential);
            }

            .border-right {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }
            .border-top {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }
            }

            &:hover {
            color: #0084ff;
            background: transparent;

            .border-top,
            .border-bottom {
                transform: scaleX(1);
            }
            .border-left,
            .border-right {
                transform: scaleY(1);
            }

            // when hover, ease-in left, bottom; ease-out right, top

            .border-left {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }
            .border-bottom {
                transition: var(--ease-in-duration) var(--ease-in-exponential);
            }

            .border-right {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                var(--ease-out-exponential);
            }
            .border-top {
                transition: var(--ease-out-duration) var(--ease-out-delay)
                var(--ease-out-exponential);
            }
            }
        }

        &-text-float-up {
            &::after {
            position: absolute;
            content: attr(data-text);
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transform: translateY(35%);
            transition: 0.25s ease-out;
            }

            // when hover, ease-in top-text; ease-out bottom-text

            .btn-text {
            display: block;
            transition: 0.75s 0.1s var(--ease-out-exponential);
            }

            &:hover {
            // when hover, ease-in bottom-text; ease-out top-text

            .btn-text {
                opacity: 0;
                transform: translateY(-25%);
                transition: 0.25s ease-out;
            }

            &::after {
                opacity: 1;
                transform: translateY(0);
                transition: 0.75s 0.1s var(--ease-out-exponential);
            }
            }
        }
        }
         .active{
            color:#0084ff;
            border:1px solid #0084ff;
            transition: all 0.3s;
        }

    }
   
</style>