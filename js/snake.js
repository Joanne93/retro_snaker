/*
	Author: Joanne
	Date: 2018-04-23
	Description: 描述蛇类
	属性：
		arr:长度数组,一维数组，每一项是个对象，装着每一截的坐标
		direction：方向
		lock:在蛇转向并移动的时候防止还没转就进行下一步操作了。
		head_img：蛇头的图片数组
		body_img：蛇身图片
		tail_img：蛇尾图片数组
		head_idx：蛇头初始的图片。数组下标
		tail_idx：蛇尾初始的图片。数组下标
		img_obj: 这个形参是对象里面放数组，而arr属性是数组里面放对象，map里面的arr属性是个二维数组，也就是数组里面放数组

*/

define(function(require, exports, module) {
	
	function Snake(img_obj) {
		this.arr = [
			{row:5,col:5},
			{row:5,col:6},
			{row:5,col:7},
			{row:5,col:8},
			{row:5,col:9}
		];
		this.direction = 39; //37 38 39 40 对应每个键盘方向键 后面需要根据用户输入的重新设置
		this.lock = true;
		this.head_img = img_obj.head_img;
		this.body_img = img_obj.body_img;
		this.tail_img = img_obj.tail_img;
		this.head_idx = 2;//对应图片3，方向向右
		this.tail_idx = 0;//对应图片6，方向向左
	}

	Snake.prototype = {
		constructor: Snake,

		// 5、蛇移动的方法。移动的方法是，添加新的蛇头，去掉原来的蛇尾。蛇头是根据方向来决定下一步的位置
		move: function() {
			// console.log(this.arr);
			// var head = this.arr[this.arr.length-1];
			// 开始是这么写的，是不对的，因为改变新蛇头也会影响原来的蛇头。指向的是同一个对象
			var head = {
				row:this.arr[this.arr.length-1].row,
				col:this.arr[this.arr.length-1].col
			}
			if(this.direction == 37) {
				head.col--;
			} else if(this.direction == 38) {
				head.row--;
			} else if(this.direction == 39) {
				head.col++;
			} else if(this.direction == 40) {
				head.row++;
			}
			// 新的蛇头位置已经确定好了
			this.arr.push(head);
			this.arr.shift();//去掉蛇尾
			this.lock = true;//当一次转向并移动之后才能是true
			// console.log(this.arr);

			// 最后再移动完成后更换尾部图片
			var tail = this.arr[0];
			var butt = this.arr[1];//倒数第二项
			// 判断最后一项和倒数第二项的关系
			if(tail.row === butt.row) {
				// 在同一行，比较前后
				this.tail_idx = tail.col > butt.col ? 2:0;
			}else {
				// 在同一列，比较上下
				this.tail_idx = tail.row > butt.row ? 3:1;
			}
		},
		// 6、蛇转向的方法。判断需不需要转向
		turn: function(direction) {
			if(!this.lock) {
				return;//如果lock为false,就返回
			}
			
			// 判断方向是不是相同或向背，是就不用转向，反之则需要
			var value = Math.abs(this.direction - direction);
			if(value != 0 && value != 2) {
				this.direction = direction;
				// console.log(direction);
			}
			// 最后在转向开始前更换蛇头图片
			if(this.direction === 37) {
				this.head_idx = 0;//对应图片1
			}else if (this.direction === 38) {
				this.head_idx = 1;//对应图片2
			}else if (this.direction === 39) {
				this.head_idx = 2;//对应图片3
			}else if (this.direction === 40) {
				this.head_idx = 3;//对应图片4
			}
			this.lock = false;
		},
		// 8、食物变长的方法
		growUp: function(type) {
			// 尾巴后面多长一节
			// console.log(this.arr);
			switch(type){
				// 1代表删除一节身体
				case 1:
					this.arr.shift();
					break;
				// 2代表增加两节身体
				case 2:
					this.arr.unshift(this.arr.slice(0,1)[0]);
					this.arr.unshift(this.arr.slice(0,1)[0]);
					break;
				// 3代表增加一节身体
				case 3:
					this.arr.unshift(this.arr.slice(0,1)[0]);
					break;
				default:
					console.log("type传错了吧！");
			}
			// console.log(this.arr);
		},
		// 重置蛇的方法
		reset: function() {
			this.arr = [
				{row:5,col:5},
				{row:5,col:6},
				{row:5,col:7},
				{row:5,col:8},
				{row:5,col:9}
			];
			this.direction = 39; //37 38 39 40 对应每个键盘方向键 后面需要根据用户输入的重新设置
			this.lock = true;
			this.head_idx = 2;//对应图片3，方向向右
			this.tail_idx = 0;//对应图片6，方向向左
		}
	}

	module.exports = Snake;
})