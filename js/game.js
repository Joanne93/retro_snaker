/*
	Author: Joanne
	Date: 2018-04-23
	Description: 描述游戏类
	属性：
		map：map实例
		snake: snake实例
		food: food实例
		block：block实例
		timer: 定时器。让蛇移动
		flag: 为true的时候定时器里才会执行渲染蛇，相当于游戏开关
		count，step：用来加快蛇运动的时间的
		lock: 用于节流，阻止不停点击开始按钮和继续按钮
		shadow: 阴影
		gameoverImg: 游戏结束图片
		scoreImg: 分数渲染
		score: 得分情况
		startImg: 游戏开始图片

*/
define(function(require, exports, module) {

	function Game(map,snake,food,block) {
		this.map = map;
		this.snake = snake;
		this.food = food;
		this.block = block;
		this.timer = null;
		this.flag = true;
		this.count = 0;
		this.step = 20;
		this.lock = true;
		this.shadow = document.createElement("div");
		this.gameoverImg = document.createElement("img");
		this.scoreImg = document.createElement("div");
		this.score = 0;
		this.startImg = document.createElement("img");
	}
	
	Game.prototype = {
		constructor: Game,
	
		// 0、初始化
		init: function() {
			this.renderMap();
			this.renderFood();
			this.renderBlock();
			this.renderSnake();
			this.getDirection();//一开始就需要监听这个事件
			this.renderStart();
		},
		// 开始页面
		renderStart: function() {
			this.renderShadow();
			this.startImg.src = "images/snake/start.png";
			this.startImg.id = "startImg";
			this.startImg.style.position = "absolute";
			this.startImg.style.width = "200px";
			this.startImg.style.height = "200px";
			this.startImg.style.left = "200px";
			this.startImg.style.top = "200px";
			this.map.box.appendChild(this.startImg);
			this.bindEvent();
		},
		// 点击开始事件
		bindEvent: function() {
			var that = this;
			document.getElementById("startImg").onclick = function() {
				that.map.box.removeChild(that.startImg);
				that.map.box.removeChild(that.shadow);
				that.start();
			}
		},
		// 1、渲染map，调用map的fill方法。
		renderMap: function() {
			this.map.fill();
		},
		// 2、渲染食物，根据食物的row和col属性在地图上显示
		renderFood: function() {
			var f_row = this.food.row;
			var f_col = this.food.col;
			// 开始把随机获取食物图片放这里，这里定时器一直在调用了，会一直变，应该放到食物被吃了之后
			// this.map.arr[f_row][f_col].style.backgroundColor = "orange";
			// var img_idx = parseInt(Math.random()*this.food.img.length);
			this.map.arr[f_row][f_col].style.backgroundImage = "url("+ this.food.img[this.food.idx] +")";
			this.map.arr[f_row][f_col].style.backgroundSize = "cover";
		},
		// 3、渲染障碍，障碍在地图上显示
		renderBlock: function() {
			// 障碍不同食物只有一个单元格，是好几个单元格组成的，需要遍历设置
			for(var i=0; i<this.block.arr.length; i++) {
				var b_row = this.block.arr[i].row;
				var b_col = this.block.arr[i].col;
				// this.map.arr[b_row][b_col].style.backgroundColor = "violet";
				this.map.arr[b_row][b_col].style.backgroundImage = "url("+this.block.img+")";
				this.map.arr[b_row][b_col].style.backgroundSize = "cover";
			}
		},
		// 4、渲染蛇类 同上面
		renderSnake: function() {
			// 蛇头图片
			var s_head = this.snake.arr[this.snake.arr.length-1];
			this.map.arr[s_head.row][s_head.col].style.backgroundImage = "url("+this.snake.head_img[this.snake.head_idx]+")";
			// 蛇身图片
			for(var i=this.snake.arr.length-2; i>0; i--) {
				var s_row = this.snake.arr[i].row;
				var s_col = this.snake.arr[i].col;
				// this.map.arr[s_row][s_col].style.backgroundColor = "green";
				// this.map.arr[s_row][s_col].style.borderRadius = "50%";
				this.map.arr[s_row][s_col].style.backgroundImage = "url("+this.snake.body_img[0]+")";
	
			}
			// 蛇尾图片
			var s_tail = this.snake.arr[0];
			this.map.arr[s_tail.row][s_tail.col].style.backgroundImage = "url("+this.snake.tail_img[this.snake.tail_idx]+")";
		},
		// 5、蛇头的移动方法已经添加好了，但是需要这里调用上面渲染的方法才会显示在页面，那就弄个start方法来加载移动后的蛇吧
		// 而且蛇是一直移动的，并不是只移动一次，用定时器。是在移动了，但是每次渲染新的蛇，原来的蛇并没有去掉，在map中加一个清屏方法
		start: function() {
			if(! this.lock) {
				return;
			}
			this.lock = false;
			this.flag = true;
			var that = this;
			timer = setInterval(function() {
				// that.isOver = false;
				console.log("现在的step："+that.step);
				// console.log("现在的count："+that.count);
				that.count++;
				// 这个用来每次吃完食物速度变快，由于没法改定时器的时间，所以设置一个变量step。count从0开始增加，直到加到除以step余数为0,也就是50的整数
				// step越大，定时器里的代码执行的越晚，所以想改变蛇运动的时间，每次吃完食物就减小step的值
				if(that.count % that.step == 0){
				that.snake.move();
				that.checkMap();//移动后校验 是否撞墙
				that.checkFood();//是否吃到食物
				that.checkBlock();//是否撞到障碍物
				that.checkSnake();//是否撞到自己的身体
				if(that.flag) {
					that.map.clear();
					that.renderFood();
					that.renderSnake();//移动后再渲染
					that.renderBlock();
				}
			}
			},20);
		},
		// 6、获取用户输入的键盘方向键，从而改变蛇类的这两个属性
		getDirection: function() {
			var that = this;
			document.onkeydown = function(e) {
				var key = e.keyCode;
				if(key === 37 || key === 38 || key === 39 || key === 40) {
					// 把对的值传递给snake
					that.snake.turn(key);
				}else {
					console.log("请输入正确的方向键");
				}
			}
		},
		// 7、判断蛇是不是撞到墙了。蛇和map的关系
		checkMap: function() {
			// 只需要判断蛇头
			var s_head = this.snake.arr[this.snake.arr.length-1];
			// console.log(s_head);
			if(s_head.row < 0 || s_head.row>= this.map.row || s_head.col < 0 || s_head.col >= this.map.col) {
				console.log("撞死啦撞死啦！");
				this.gameOver();
				/* clearInterval(timer);
				// 关闭定时器，再把游戏开关关了，也就是马上结束游戏，不要执行定时器中渲染页面的操作了
				this.flag = false;
				this.isOver = true; */
			}
		},
		// 8、判断食物是不是被蛇吃掉了。蛇和食物的关系
		checkFood: function() {
			var s_head = this.snake.arr[this.snake.arr.length-1];
			if(s_head.row === this.food.row && s_head.col === this.food.col) {
				console.log("食物被蛇吃掉了");
				// 调用蛇变长的方法
				if(this.food.idx == 0) {
					this.snake.growUp(1);
					this.score --;
				}else if(this.food.idx == this.food.img.length-1) {
					this.snake.growUp(2);
					this.score += 2;
				}else {
					this.snake.growUp(3);
					this.score ++;
				}
				console.log("当前分数是："+this.score);
				// 如果分数小于0就直接结束
				if(this.score < 0 ) {
					console.log("运气太差了吧，分数都小于0了。。。");
					this.gameOver();
				}
				// 重置食物的位置和图片
				this.resetFood();
				// 让蛇的速度变快
				this.step -= 1;
				if(this.step <= 5 ) {
					this.step = 5;
				}
				
			}
		},
		// 9、重置食物的位置
		resetFood: function() {
			// 随机获取食物位置的坐标
			f_row = parseInt(Math.random()*this.map.row);
			f_col = parseInt(Math.random()*this.map.col);
			// 该坐标不能与蛇的身体重合
			for(var i=0; i<this.snake.arr.length; i++) {
				if(f_row === this.snake.arr[i].row && f_col === this.snake.arr[i].col) {
					console.log("食物和蛇重合了");
					this.resetFood();
					return;
				}
			}
			// 该坐标不能与障碍物重合
			for(var i=0; i<this.block.arr.length; i++) {
				if(f_row === this.block.arr[i].row && f_col === this.block.arr[i].col) {
					console.log("食物和障碍物重合了");
					this.resetFood();
					return;
				}
			}
			// 随机获取食物的图标
			f_imgidx = parseInt(Math.random()*this.food.img.length);
			// console.log("食物图标的索引值："+f_imgidx);
			// 调用食物类的重置位置方法
			this.food.reset(f_row,f_col,f_imgidx);
			
		},
		// 10、判断蛇是否撞到障碍物。蛇和障碍物的关系
		checkBlock: function() {
			// 把蛇头和障碍物的每一块对比，类似7
			var s_head = this.snake.arr[this.snake.arr.length-1];
			for(var i=0; i<this.block.arr.length; i++) {
				if(s_head.row === this.block.arr[i].row && s_head.col === this.block.arr[i].col) {
					console.log("撞到障碍物了！");
					this.gameOver();
					/* clearInterval(timer);
					// 关闭定时器，再把游戏开关关了，也就是马上结束游戏，不要执行定时器中渲染页面的操作了
					this.flag = false; */
				}
			}
		},
		// 11、判断蛇是否撞到自己
		checkSnake: function() {
			// 把蛇头和蛇身进行对比
			var s_head = this.snake.arr[this.snake.arr.length-1];
			for(var i=0; i<this.snake.arr.length-1; i++) {
				if(s_head.row === this.snake.arr[i].row && s_head.col === this.snake.arr[i].col) {
					console.log("撞到自己了！");
					this.gameOver();
					/* clearInterval(timer);
					// 关闭定时器，再把游戏开关关了，也就是马上结束游戏，不要执行定时器中渲染页面的操作了
					this.flag = false; */
				}
			}
		},
		// 12、渲染阴影
		renderShadow: function() {
			// var shadow = document.createElement("div");
			this.shadow.style.width = "600px";
			this.shadow.style.height = "600px";
			this.shadow.style.position = "absolute";
			this.shadow.style.top = 0;
			this.shadow.style.left = 0;
			this.shadow.style.backgroundColor = "rgba(0,0,0,.4)";
			this.map.box.appendChild(this.shadow);
		},
		// 13、渲染结束页面
		renderOver: function() {
			// var gameOver = document.createElement("img");
			this.gameoverImg.src = "images/snake/gameover.png";
			this.gameoverImg.style.position = "absolute";
			this.gameoverImg.style.zIndex = "1";
			this.gameoverImg.style.left = "85px";
			this.gameoverImg.style.top = "50px";
			this.map.box.appendChild(this.gameoverImg);
		},
		// 14、渲染分数
		renderScore: function() {
			this.scoreImg.style.position = "absolute";
			this.scoreImg.style.zIndex = "2";
			this.scoreImg.style.left = "135px";
			this.scoreImg.style.top = "460px";
			this.scoreImg.style.width = "400px";
			this.scoreImg.style.height = "50px";
			this.scoreImg.style.font = "46px/46px 宋体";
			this.scoreImg.style.fontWeight = "400";
			this.scoreImg.style.color = "#05D503";
			this.scoreImg.style.textShadow = "10px 10px 6px rgba(0,0,0,.4)";
			this.scoreImg.innerHTML = "您的成绩是：" + this.score + "分";
			this.map.box.appendChild(this.scoreImg); 
		},
		// 15、游戏结束
		gameOver: function() {
			clearInterval(timer);
			// 关闭定时器，再把游戏开关关了，也就是马上结束游戏，不要执行定时器中渲染页面的操作了
			this.flag = false;
			this.lock = true;
			this.renderShadow();
			this.renderOver();
			this.renderScore();
		},
		// 暂停按钮
		pause: function() {
			clearInterval(timer);
			this.lock = true;
			this.renderShadow();
		},
		// 继续按钮
		continue: function() {
			this.map.box.removeChild(this.shadow);
			this.start();
		},
		// 重新开始按钮
		restart: function() {
			// 重置蛇的状态和食物的位置
			this.map.clear();
			this.map.box.removeChild(this.scoreImg);
			this.map.box.removeChild(this.gameoverImg);
			this.map.box.removeChild(this.shadow);
			this.flag = true;
			this.count = 0;
			this.step = 30;
			this.lock = true;
			this.score = 0;
			this.resetFood();
			this.snake.reset();
			this.start();
		},
	
	}

	module.exports = Game;
})
