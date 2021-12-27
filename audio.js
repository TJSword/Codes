$(function() {
	 //实例化 滑块
	$(".js-range-slider").ionRangeSlider({
		hide_min_max: true, //隐藏最大最小
		hide_from_to: true, //隐藏当前数值
		min: 0,
		max: 100, //最大值最小值
		from: 50, //初始值
		onChange: function(e) {
			let val = e.from / 100; //audio原生的volume范围为 0 ~ 1
			e.input[0].parentNode.parentNode.childNodes[3].volume = val
		}
	})
	$('.audio').on('click', function(e) {
		if (e.target.localName !== 'i' && e.target.localName !== 'span') { //处理事件冒泡
			if (this.childNodes[1].childNodes[3].paused) {
				this.childNodes[1].childNodes[5].childNodes[3].setAttribute('class', 'irs irs--flat range_active')
				this.childNodes[1].childNodes[1].setAttribute('class', 'img_active')
				this.childNodes[1].childNodes[5].setAttribute('class', 'audio_item_title audio_item_title_active')
				this.childNodes[1].childNodes[3].volume = 0.5
				this.childNodes[1].childNodes[3].play()
			} else {
				this.childNodes[1].childNodes[5].childNodes[3].setAttribute('class', 'irs irs--flat')
				this.childNodes[1].childNodes[1].setAttribute('class', '')
				this.childNodes[1].childNodes[5].setAttribute('class', 'audio_item_title')
				this.childNodes[1].childNodes[3].currentTime = 0
				this.childNodes[1].childNodes[3].pause()
			}
		}
	})
	//监听加载状态改变
	document.onreadystatechange = completeLoading;
	//加载状态为complete时移除loading效果
	function completeLoading() {
		if (document.readyState == "complete") {
			$("#loading").animate({
				"opacity": "0"
			}, 500).hide(1000);
		}
	}
	//点击倒计时弹窗
	$('.timing').on('click',function(e){
		$('.timeout_mask').css('display','block')
		setTimeout(_=>{
			$('#alert')[0].setAttribute('class', 'alert_active')
		},20)
	})
	//点击取消
	$('#off').on('click',function(e){
		$('#alert')[0].setAttribute('class', '')
		setTimeout(_=>{
			$('.timeout_mask').css('display','none')
		},320)
	})
	//点击确定
	let timer //声明一个定时器
	$('#on').on('click',function(e){
		clearInterval(timer) //先清除定时器
		$('#alert')[0].setAttribute('class', '')
		setTimeout(_=>{
			$('.timeout_mask').css('display','none')
		},320) //隐藏样式
		let seconds = $('#hour')[0].value * 60  + ($('#minute')[0].value * 1) //计算总秒数
		let count = 0 //计数变量
		timer = setInterval(_=>{
			count++;
			let surplus =  seconds - count //剩余秒数
			let content = `${parseInt(surplus/60)}:${surplus%60<10?'0' + surplus%60 :surplus%60}` //行内内容
			$('#time').text(content) //设置内容
			if(surplus <= 0){ //定时器停止条件
				for(let i = 0 ; i < $('.audio_item').length;i++){
					$('.audio_item')[i].pause() //停止全部aduio播放
					$('.audio_item')[i].parentNode.childNodes[1].setAttribute('class', '')
					$('.audio_item')[i].parentNode.childNodes[5].setAttribute('class', 'audio_item_title')
					$('.audio_item')[i].parentNode.childNodes[5].childNodes[3].setAttribute('class', 'irs irs--flat')
				}
				clearInterval(timer)
			}
		},1000)
	})
})


