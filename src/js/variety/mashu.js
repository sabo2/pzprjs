//
// パズル固有スクリプト部 ましゅ版 mashu.js v3.4.1
//
pzpr.classmgr.makeCustom(['mashu'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.owner.playmode){
			if(this.btn.Left){
				if(this.mousestart || this.mousemove){ this.inputLine();}
				else if(this.mouseend && this.notInputted()){ this.inputpeke();}
			}
			else if(this.btn.Right){
				if(this.mousestart || this.mousemove){ this.inputpeke();}
			}
		}
		else if(this.owner.editmode){
			if(this.mousestart){ this.inputqnum();}
		}
	},
	inputRed : function(){ this.dispRedLine();}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberAsObject : true,

	maxnum : 2,

	setErrorPearl : function(){
		this.setCellLineError(1);
		var adc = this.adjacent, adb = this.adjborder;
		if(adb.top.isLine()   ){ adc.top.setCellLineError(0);   }
		if(adb.bottom.isLine()){ adc.bottom.setCellLineError(0);}
		if(adb.left.isLine()  ){ adc.left.setCellLineError(0);  }
		if(adb.right.isLine() ){ adc.right.setCellLineError(0); }
	}
},

Board:{
	hasborder : 1,

	uramashu : false,

	revCircle : function(){
		if(!this.uramashu){ return;}
		this.revCircleMain();
	},
	revCircleMain : function(){
		for(var c=0;c<this.cellmax;c++){
			var cell = this.cell[c];
			if     (cell.qnum===1){ cell.setQnum(2);}
			else if(cell.qnum===2){ cell.setQnum(1);}
		}
	}
},

LineManager:{
	isCenterLine : true
},

Flags:{
	redline : true,
	irowake : 1
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "LIGHT",

	circlefillcolor_func   : "qnum2",
	circlestrokecolor_func : "qnum2",

	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();

		this.drawCircles();
		this.drawHatenas();

		this.drawPekes();
		this.drawLines();

		this.drawChassis();

		this.drawTarget();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeCircle();
		this.owner.board.revCircle();
	},
	encodePzpr : function(type){
		this.owner.board.revCircle();
		this.encodeCircle();
		this.owner.board.revCircle();
	},

	decodeKanpen : function(){
		this.owner.fio.decodeCellQnum_kanpen();
		this.owner.board.revCircle();
	},
	encodeKanpen : function(){
		this.owner.board.revCircle();
		this.owner.fio.encodeCellQnum_kanpen();
		this.owner.board.revCircle();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeBorderLine();
		this.owner.board.revCircle();
	},
	encodeData : function(){
		this.owner.board.revCircle();
		this.encodeCellQnum();
		this.encodeBorderLine();
		this.owner.board.revCircle();
	},

	kanpenOpen : function(){
		this.decodeCellQnum_kanpen();
		this.decodeBorderLine();
		this.owner.board.revCircle();
	},
	kanpenSave : function(){
		this.owner.board.revCircle();
		this.encodeCellQnum_kanpen();
		this.encodeBorderLine();
		this.owner.board.revCircle();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkBranchLine",
		"checkCrossLine",
		"checkWhitePearl1",
		"checkBlackPearl1",
		"checkBlackPearl2",
		"checkWhitePearl2",
		"checkNoLinePearl",
		"checkDeadendLine+",
		"checkOneLoop"
	],

	checkNoLinePearl : function(){
		this.checkAllCell(function(cell){ return (cell.isNum() && cell.lcnt===0);}, "mashuOnLine");
	},

	checkWhitePearl1 : function(){
		var result = true, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c];
			if(cell.qnum!==1 || cell.lcnt!==2 || cell.isLineStraight()){ continue;}
			
			result = false;
			if(this.checkOnly){ break;}
			cell.setCellLineError(1);
		}
		if(!result){
			this.failcode.add("mashuWCurve");
			bd.border.setnoerr();
		}
	},
	checkBlackPearl1 : function(){
		var result = true, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c];
			if(cell.qnum!==2 || cell.lcnt!==2 || !cell.isLineStraight()){ continue;}
			
			result = false;
			if(this.checkOnly){ break;}
			cell.setCellLineError(1);
		}
		if(!result){
			this.failcode.add("mashuBStrig");
			bd.border.setnoerr();
		}
	},

	checkWhitePearl2 : function(){
		var result = true, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c];
			if(cell.qnum!==1 || cell.lcnt!==2){ continue;}
			var adc = cell.adjacent, adb = cell.adjborder, stcnt = 0;
			if(adb.top.isLine()    && adc.top.lcnt   ===2 && adc.top.isLineStraight()   ){ stcnt++;}
			if(adb.bottom.isLine() && adc.bottom.lcnt===2 && adc.bottom.isLineStraight()){ stcnt++;}
			if(adb.left.isLine()   && adc.left.lcnt  ===2 && adc.left.isLineStraight()  ){ stcnt++;}
			if(adb.right.isLine()  && adc.right.lcnt ===2 && adc.right.isLineStraight() ){ stcnt++;}
			if(stcnt<2){ continue;}
			
			result = false;
			if(this.checkOnly){ break;}
			cell.setErrorPearl();
		}
		if(!result){
			this.failcode.add("mashuWStNbr");
			bd.border.setnoerr();
		}
	},
	checkBlackPearl2 : function(){
		var result = true, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c], adc = cell.adjacent, adb = cell.adjborder;
			if(cell.qnum!==2 || cell.lcnt!==2){ continue;}
			if((!adb.top.isLine()    || adc.top.lcnt   !==2 || adc.top.isLineStraight()   ) &&
			   (!adb.bottom.isLine() || adc.bottom.lcnt!==2 || adc.bottom.isLineStraight()) &&
			   (!adb.left.isLine()   || adc.left.lcnt  !==2 || adc.left.isLineStraight()  ) &&
			   (!adb.right.isLine()  || adc.right.lcnt !==2 || adc.right.isLineStraight() ) )
			{ continue;}
			
			result = false;
			if(this.checkOnly){ break;}
			cell.setErrorPearl();
		}
		if(!result){
			this.failcode.add("mashuBCvNbr");
			bd.border.setnoerr();
		}
	}
},

FailCode:{
	mashuOnLine : ["線が上を通っていない丸があります。","Lines don't pass some pearls."],
	mashuWCurve : ["白丸の上で線が曲がっています。","Lines curve on white pearl."],
	mashuWStNbr : ["白丸の隣で線が曲がっていません。","Lines go straight next to white pearl on each side."],
	mashuBStrig : ["黒丸の上で線が直進しています。","Lines go straight on black pearl."],
	mashuBCvNbr : ["黒丸の隣で線が曲がっています。","Lines curve next to black pearl."]
}
});
