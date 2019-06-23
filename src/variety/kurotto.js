//
// パズル固有スクリプト部 クロット・ぬりみさき版 kurotto.js
//
(function(pidlist, classbase){
	if(typeof module==='object' && module.exports){module.exports = [pidlist, classbase];}
	else{ pzpr.classmgr.makeCustom(pidlist, classbase);}
}(
['kurotto','nurimisaki'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	use : true,
	inputModes : {edit:['number','clear'],play:['shade','unshade']},
	mouseinput_auto : function(){
		if(this.puzzle.playmode){
			if(this.mousestart || this.mousemove){ this.inputcell();}
			else if(this.mouseend && this.notInputted()){ this.inputqcmp();}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart){ this.inputqnum();}
		}
	},
	inputqcmp : function(){
		var cell = this.getcell();
		console.log(cell); /* eslint-disable-line no-console */
		if(cell.isnull || cell.noNum()){ return;}

		cell.setQcmp(+!cell.qcmp);
		cell.draw();

		this.mousereset();
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberRemainsUnshaded : true
},
"Cell@kurotto":{
	maxnum : function(){
		var max=this.board.cell.length-1;
		return (max<=999?max:999);
	},
	minnum : 0,

	checkComplete : function(){
		if(!this.isValidNum()){ return true;}
		
		var cnt = 0, arealist = [], list = this.getdir4clist();
		for(var i=0;i<list.length;i++){
			var area = list[i][0].sblk;
			if(area!==null){
				for(var j=0;j<arealist.length;j++){
					if(arealist[j]===area){ area=null; break;}
				}
				if(area!==null){
					cnt += area.clist.length;
					arealist.push(area);
				}
			}
		}
		return (this.qnum===cnt);
	}
},
"Cell@nurimisaki":{
	maxnum : function(){
		var bd=this.board, bx=this.bx, by=this.by;
		var col = (((bx<(bd.maxbx>>1))?(bd.maxbx-bx):bx)>>1)+1;
		var row = (((by<(bd.maxby>>1))?(bd.maxby-by):by)>>1)+1;
		return Math.max(col, row);
	},
	minnum : 2,

	checkComplete : function(){
		if(!this.isValidNum()){ return true;}
		
		var count = 0, list = this.getdir4clist(), adjcell = null;
		for(var n=0;n<list.length;n++){
			if(list[n][0].isUnshade()){ adjcell = list[n][0]; ++count;}
		}
		if(count!==1){ return false;}

		var dir = this.getdir(adjcell,2), pos = adjcell.getaddr(), length = 2;
		while(1){
			pos.movedir(dir,2);
			var cell = pos.getc();
			if(cell.isnull || cell.isShade()){ break;}
			++length;
		}
		return (this.getNum() === length);
	}
},

"AreaShadeGraph@kurotto":{
	enabled : true
},
"AreaUnshadeGraph@nurimisaki":{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
"Graphic@kurotto":{
	autocmp : "number"
},
Graphic:{
	hideHatena : true,

	qanscolor : "black",
	numbercolor_func : "qnum",

	circleratio : [0.45, 0.40],

	// オーバーライド
	setRange : function(x1,y1,x2,y2){
 		var puzzle = this.puzzle, bd = puzzle.board;
		if(puzzle.execConfig('autocmp')){
			x1 = bd.minbx-2;
			y1 = bd.minby-2;
			x2 = bd.maxbx+2;
			y2 = bd.maxby+2;
		}
		
		this.common.setRange.call(this,x1,y1,x2,y2);
	},

	paint : function(){
		this.drawBGCells();
		this.drawShadedCells();
		this.drawDotCells(false);
		if(this.pid==='kurotto'){ this.drawGrid();}
		else if(this.pid==='nurimisaki'){ this.drawDashedGrid();}

		this.drawCircledNumbers();

		this.drawChassis();

		this.drawTarget();
	},

	getCircleFillColor : function(cell){
		if(this.pid==='kurotto' && this.puzzle.execConfig('autocmp') && cell.isValidNum()){
			return (cell.checkComplete() ? this.qcmpcolor : this.circlebasecolor);
		}
		else if(this.pid==='nurimisaki' && cell.isNum()){
			return (cell.qcmp!==0 ? this.qcmpcolor : this.circlebasecolor);
		}
		return null;
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeNumber16();
	},
	encodePzpr : function(type){
		this.encodeNumber16();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeCellQanssubcmp_kurotto();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeCellQanssubcmp_kurotto();
	},

	decodeCellQanssubcmp_kurotto : function(){
		this.decodeCell( function(cell,ca){
			if     (ca==="+"){ cell.qsub = 1;}
			else if(ca==="-"){ cell.qcmp = 1;}
			else if(ca==="#"){ cell.qans = 1;}
		});
	},
	encodeCellQanssubcmp_kurotto : function(){
		this.encodeCell( function(cell){
			if     (cell.qans===1){ return "# ";}
			else if(cell.qsub===1){ return "+ ";}
			else if(cell.qcmp===1){ return "- ";}
			else                  { return ". ";}
		});
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkShadeCellExist",
		"checkConnectUnshade@nurimisaki",
		"check2x2ShadeCell+@nurimisaki",
		"checkCapeSingleUnshaded@nurimisaki",
		"checkNonCapePruralUnshaded@nurimisaki",
		"checkCellNumber_kurotto",
		"check2x2UnshadeCell++@nurimisaki"
	],

	checkCellNumber_kurotto : function(){
		var bd = this.board;
		for(var c=0;c<bd.cell.length;c++){
			var cell = bd.cell[c];
			if(cell.checkComplete()){ continue;}
			
			this.failcode.add("nmSumSizeNe");
			if(this.checkOnly){ break;}
			cell.seterr(1);
		}
	},

	checkCapeSingleUnshaded : function(){
		var bd = this.board;
		for(var c=0;c<bd.cell.length;c++){
			var cell = bd.cell[c];
			if(cell.noNum()){ continue;}
			
			var count = cell.countDir4Cell(function(cell){ return cell.isUnshade();});
			if(count===1){ continue;}

			this.failcode.add("nmUnshadeNe1");
			if(this.checkOnly){ break;}
			cell.seterr(1);
		}
	},
	checkNonCapePruralUnshaded : function(){
		var bd = this.board;
		for(var c=0;c<bd.cell.length;c++){
			var cell = bd.cell[c];
			if(cell.isNum() || cell.isShade()){ continue;}
			
			var count = cell.countDir4Cell(function(cell){ return cell.isUnshade();});
			if(count!==1){ continue;}
			
			this.failcode.add("nmUnshadeEq1");
			if(this.checkOnly){ break;}
			cell.seterr(1);
		}
	}
},

"FailCode@kurotto":{
	nmSumSizeNe : ["隣り合う黒マスの個数の合計が数字と違います。","The number is not equal to sum of adjacent masses of shaded cells."]
},
"FailCode@nurimisaki":{
	nmSumSizeNe : ["連続する白マスの長さが数字と違います。","The number is not equal to the length of unshaded cells from the circle."],
	nmUnshadeNe1 : ["〇の上下左右2マス以上が白マスになっています。","There are two or more unshaded cells around a circle."],
	nmUnshadeEq1 : ["〇でないセルが岬になっています。","There is an cape without circle."]
}
}));
