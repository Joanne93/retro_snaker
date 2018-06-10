/*
	Author: Joanne
	Date: 2018-04-23
	Description: 描述食物类
	属性：
		row: 食物在地图的坐标
		col: 同上
		img: 食物的图片
		idx: 食物换成数组之后需要初始的图片索引
*/
define(function(require, exports, module) {
	function Food(img) {
		this.row = 4;
		this.col = 6; //这两个值后面重置的时候需要重新设置
		this.img = img;
		this.idx = parseInt(Math.random() * this.img.length-1) + 1;
	}

	Food.prototype = {
		constructor: Food,

		// 9、增加食物重置位置的方法
		reset: function(row,col,idx) {
			this.row = row;
			this.col = col;
			this.idx = idx;
		}
	}

	module.exports = Food;

})