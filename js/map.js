/*
	Author: Joanne
	Date: 2018-04-23
	Description: 描述地图类
	属性：
		row：行
		col：列
		width:总宽
		height:总高
		box: 指的是map的最外层的大盒子
		arr:用来放每个单元格，是一个二维数组，为了方便其他内容(食物，蛇，障碍)在地图的指定位置显示
*/

define(function(require, exports, module) {
	function Map(row,col,width,height) {
		this.row = row;
		this.col = col;
		this.width = width;
		this.height = height;
		this.box = document.createElement("div");
		this.arr = [];
	}
	// 给Map的原型添加方法
	Map.prototype = {
		constructor: Map,
		// 1、创建一个多行多列的表格的填充方法。
		fill: function() {
			for(var i=0; i<this.row; i++) {
				var row_Ele = document.createElement("div");
				row_Ele.className = "row";
				var row_arr = [];
				for(var j=0; j<this.col; j++) {
					var col_Ele = document.createElement("p");
					col_Ele.className = "grid";
					row_Ele.appendChild(col_Ele);
					row_arr.push(col_Ele);
				}
				this.box.appendChild(row_Ele);
				this.arr.push(row_arr);
			}
			// console.log(this.arr);
			this.box.className = "box";
			this.box.style.position = "relative";
			document.body.appendChild(this.box);
		},
		// 5、清屏方法：由于每次蛇移动后，原来的蛇没有清除
		clear: function() {
			// 遍历自己的每个格子，把背景色背景图都清除掉
			for(var i=0; i<this.row; i++) {
				for(var j =0; j<this.col; j++) {
					this.arr[i][j].style.backgroundColor = "#88D18A";
					this.arr[i][j].style.backgroundImage = null;
				}
			}
		}

	}

	module.exports = Map;
})