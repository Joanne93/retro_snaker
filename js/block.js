/*
	Author: Joanne
	Date: 2018-04-23
	Description: 描述障碍类
	属性：
		arr:一个一位数组，每一项是个对象，是每个障碍块的位置
		img:是每个障碍物的背景图
*/
define(function(require, exports, module) {
	function Block(img) {
		this.arr = [
			{"row":6,"col":9},
			{"row":7,"col":9},
			{"row":8,"col":9},
			{"row":9,"col":9},
			{"row":10,"col":9},
			{"row":11,"col":9},
			{"row":12,"col":9},
			{"row":13,"col":9},
			{"row":13,"col":8},
			{"row":13,"col":7},
			{"row":13,"col":6},
			{"row":13,"col":5},
			{"row":13,"col":4},
			{"row":12,"col":4},
			{"row":11,"col":4},
			{"row":10,"col":4},
			{"row":13,"col":10},
			{"row":13,"col":11},
			{"row":13,"col":12},
			{"row":13,"col":13},
			{"row":13,"col":14},
			{"row":12,"col":14},
			{"row":11,"col":14},
			{"row":10,"col":14},
		];
		this.img = img;
	}

	module.exports = Block;
})