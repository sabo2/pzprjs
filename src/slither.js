//
// �p�Y���ŗL�X�N���v�g�� �X���U�[�����N�� slither.js v3.2.0p1
//
Puzzles.slither = function(){ };
Puzzles.slither.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 1;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 1;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum","borderans2"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("�X���U�[�����N","Slitherlink");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
	},
	menufix : function(){
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,3);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.inputBGcolor = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){
				if     (bd.QsC(cc)==0){ this.inputData=1;}
				else if(bd.QsC(cc)==1){ this.inputData=2;}
				else                  { this.inputData=0;}
			}
			bd.sQsC(cc, this.inputData);

			this.mouseCell = cc; 

			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,3);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.callmode == "pmake"){
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,3);
			};
			kp.kpgenerate = function(mode){
				this.inputcol('num','knum0','0','0');
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.insertrow();
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('num','knum.','-','?');
				this.insertrow();
			};
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BorderQanscolor = "rgb(0, 160, 0)";
		pc.fontErrcolor = "red";

		pc.crosssize = 0.05;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

		//	this.drawBDline2(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawBaseMarks(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			if(k.br.IE){ this.drawPekes(x1,y1,x2,y2,1);}
			else{ this.drawPekes(x1,y1,x2,y2,0);}

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawBaseMarks = function(x1,y1,x2,y2){
			for(var i=0;i<(k.qcols+1)*(k.qrows+1);i++){
				var cx = i%(k.qcols+1); var cy = mf(i/(k.qcols+1));
				if(cx < x1-1 || x2+1 < cx){ continue;}
				if(cy < y1-1 || y2+1 < cy){ continue;}

				this.drawBaseMark1(i);
			}
			this.vinc();
		};
		pc.drawBaseMark1 = function(i){
			var lw = (mf(k.cwidth/12)>=3?mf(k.cwidth/12):3); //LineWidth
			var csize = mf((lw+1)/2);

			var cx = i%(k.qcols+1), cy = mf(i/(k.qcols+1));

			g.fillStyle = this.crossnumcolor;
			g.beginPath();
			g.arc(k.p0.x+cx*k.cwidth, k.p0.x+cy*k.cheight, csize, 0, Math.PI*2, false);
			if(this.vnop("x"+i+"_cm_",1)){ g.fill();}
		};

		col.repaintParts = function(id){
			pc.drawBaseMark1( bd.xnum(mf((bd.border[id].cx-(bd.border[id].cx%2))/2), mf((bd.border[id].cy-(bd.border[id].cy%2))/2) ) );
			pc.drawBaseMark1( bd.xnum(mf((bd.border[id].cx+(bd.border[id].cx%2))/2), mf((bd.border[id].cy+(bd.border[id].cy%2))/2) ) );
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0||type==1){ bstr = this.decode4(bstr, bd.sQnC.bind(bd), k.qcols*k.qrows);}
			else if(type==2)    { bstr = this.decodeKanpen(bstr); }
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"slitherlink.html?problem="+this.pzldataKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encode4(bd.QnC.bind(bd), k.qcols*k.qrows);
		};

		enc.decodeKanpen = function(bstr){
			bstr = (bstr.split("_")).join(" ");
			fio.decodeCell( function(c,ca){
				if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},bstr.split("/"));
			return "";
		};
		enc.pzldataKanpen = function(){
			return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
				if(bd.QnC(c)>=0){ return (bd.QnC(c).toString() + "_");}
				else            { return "._";}
			});
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			this.decodeCellQnum(array.slice(0,k.qrows));
			var func = function(c,ca){ if(ca == "1"){ bd.sQaB(c, 1);} else if(ca == "-1"){ bd.sQsB(c, 2);} }
			this.decodeObj(func, array.slice(k.qrows    ,2*k.qrows+1), k.qcols  , function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
			this.decodeObj(func, array.slice(2*k.qrows+1,3*k.qrows+1), k.qcols+1, function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);});
		};
		fio.kanpenSave = function(){
			var func = function(c,ca){ if(bd.QaB(c)==1){ return "1 ";} else if(bd.QsB(c)==2){ return "-1 ";} else{ return "0 ";} }

			return ""+this.encodeCell( function(c){ if(bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");} else{ return ". ";} })
			+this.encodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.bnum(2*cx+1,2*cy  );})
			+this.encodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCross(3,0) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}
			if( !this.checkLcntCross(4,0) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			if( !this.checkdir4Border() ){
				this.setAlert('�����̎���ɂ��鋫�E���̖{�����Ⴂ�܂��B','The number is not equal to the number of border lines around it.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
			}

			if( !this.checkLcntCross(1,0) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			return true;
		};
	}
};