//
// �p�Y���ŗL�X�N���v�g�� �ڂ񂳂�/�ւ�ڂ�� bonsan.js v3.2.0
//
Puzzles.bonsan = function(){ };
Puzzles.bonsan.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum","cellqsub","borderques","borderline"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("�ڂ񂳂�/�ւ�ڂ�","Bonsan/Heya-Bon");
		base.setExpression("�@���h���b�O�Ő����A�}�X�̃N���b�N�ŃZ���̔w�i�F�����͂ł��܂��B",
						   " Left Button Drag to input lines, Click the cell to input background color of the cell.");
		base.setFloatbgcolor("rgb(127,96,64)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){ this.inputborder(x,y);}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				//else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if     (k.mode==1 && this.notInputted()){
				if(!kp.enabled()){this.inputqnum(x,y,Math.max(k.qcols,k.qrows)-1);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3 && this.notInputted()){ this.inputlight(x,y);}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){ this.inputborder(x,y);}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				//else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.inputlight = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1){ return;}

			if     (bd.QsC(cc)==0){ bd.sQsC(cc, (this.btn.Left?1:2));}
			else if(bd.QsC(cc)==1){ bd.sQsC(cc, (this.btn.Left?2:0));}
			else if(bd.QsC(cc)==2){ bd.sQsC(cc, (this.btn.Left?0:1));}
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca, Math.max(k.qcols,k.qrows)-1);
		};

		if(k.callmode == "pmake"){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knum0','0','0');
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum.','-','��');
				this.inputcol('num','knum_',' ',' ');
				this.insertrow();
				this.inputcol('num','knum2','2','2');
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.inputcol('num','knum5','5','5');
				this.insertrow();
				this.inputcol('num','knum6','6','6');
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.inputcol('num','knum9','9','9');
				this.insertrow();
			};
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,4);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
//		pc.errcolor1 = "rgb(192, 0, 0)";
		pc.qsubcolor1 = "rgb(224, 224, 255)";
		pc.qsubcolor2 = "rgb(255, 255, 144)";
		pc.fontsizeratio = 0.9;	// �����̔{��

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawQSubCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);
			this.drawTip(x1,y1,x2,y2);

			//this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawNumCells(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawTip = function(x1,y1,x2,y2){
			var tsize = k.cwidth*0.30;
			var tplus = k.cwidth*0.05;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				this.vhide(["c"+c+"_tp1_","c"+c+"_tp2_","c"+c+"_tp3_","c"+c+"_tp4_"]);
				if(ans.lcntCell(c)==1 && bd.QnC(c)==-1){
					var dir=0, id=-1;
					if     (bd.LiB(bd.ub(c))==1){ dir=2; id=bd.ub(c);}
					else if(bd.LiB(bd.db(c))==1){ dir=1; id=bd.db(c);}
					else if(bd.LiB(bd.lb(c))==1){ dir=4; id=bd.lb(c);}
					else if(bd.LiB(bd.rb(c))==1){ dir=3; id=bd.rb(c);}

					g.lineWidth = (mf(k.cwidth/12)>=3?mf(k.cwidth/12):3); //LineWidth
					if     (bd.ErB(id)==1){ g.strokeStyle = this.errlinecolor1; g.lineWidth=g.lineWidth+1;}
					else if(bd.ErB(id)==2){ g.strokeStyle = this.errlinecolor2;}
					else                  { g.strokeStyle = this.linecolor;}

					if(this.vnop("c"+c+"_tp"+dir+"_",0)){
						var px=bd.cell[c].px()+k.cwidth/2+1, py=bd.cell[c].py()+k.cheight/2+1;
						if     (dir==1){ this.inputPath([px,py ,-tsize, tsize ,0,-tplus , tsize, tsize], false);}
						else if(dir==2){ this.inputPath([px,py ,-tsize,-tsize ,0, tplus , tsize,-tsize], false);}
						else if(dir==3){ this.inputPath([px,py , tsize,-tsize ,-tplus,0 , tsize, tsize], false);}
						else if(dir==4){ this.inputPath([px,py ,-tsize,-tsize , tplus,0 ,-tsize, tsize], false);}
						g.stroke();
					}
				}
			}
			this.vinc();
		};

		pc.drawNumCells = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.40;
			var rsize2 = k.cwidth*0.35;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
					if(bd.ErC(c)==1){ g.fillStyle = this.errcolor1;}
					else{ g.fillStyle = this.Cellcolor;}
					g.beginPath();
					g.arc(bd.cell[c].px()+mf(k.cwidth/2), bd.cell[c].py()+mf(k.cheight/2), rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cira_",1)){ g.fill();}

					g.fillStyle = "white";
					g.beginPath();
					g.arc(bd.cell[c].px()+mf(k.cwidth/2), bd.cell[c].py()+mf(k.cheight/2), rsize2, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cirb_",1)){ g.fill();}
				}
				else{ this.vhide("c"+c+"_cira_"); this.vhide("c"+c+"_cirb_");}

				this.dispnumCell_General(c);
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBorder(bstr);
				bstr = this.decodeNumber16(bstr);
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder()+this.encodeNumber16();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){
			this.performAsLine = true;

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}
			if( !this.checkLcntCell(4) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			this.performAsLine = false;
			var larea = this.searchLarea();
			if( !this.checkQnumsInArea(larea, function(a){ return (a>=2);}) ){
				this.setAlert('�����q�����Ă��܂��B','There are connected circles.'); return false;
			}
			if( !this.checkLineOverLetter() ){
				this.setAlert('���̏������ʉ߂��Ă��܂��B','A line goes through a circle.'); return false;
			}

			if( !this.checkAllArea(larea, f_true, function(w,h,a){ return (w==1||h==1);} ) ){
				this.setAlert('�Ȃ����Ă����������܂��B','A line has curve.'); return false;
			}
			if( !this.checkOneNumber(larea, function(num, a){ return (num>=0 && num!=a-1);}, f_true) ){
				this.setAlert('�����Ɛ��̒������Ⴂ�܂��B','The length of a line is wrong.'); return false;
			}

			var rarea = this.searchRarea();
			this.movedPosition(larea);
			if( !this.checkFractal(rarea) ){
				this.setAlert('�����̒��́����_�Ώ̂ɔz�u����Ă��܂���B', 'Position of circles in the room is not point symmetric.'); return false;
			}
			if( !this.checkNoObjectInRoom(rarea, this.getMoved.bind(this)) ){
				this.setAlert('���̂Ȃ�����������܂��B','A room has no circle.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QnC(c)>=1 && this.lcntCell(c)==0);}.bind(this) ) ){
				this.setAlert('����������o�Ă��܂���B','A circle doesn\'t start any line.'); return false;
			}

			this.performAsLine = true;
			if( !this.checkDisconnectLine(larea) ){
				this.setAlert('���ɂȂ����Ă��Ȃ���������܂��B','A line doesn\'t connect any circle.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkLineOverLetter = function(func){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)>=2 && bd.QnC(c)!=-1){
					bd.sErB(bd.borders,2);
					ans.setCellLineError(c,true);
					return false;
				}
			}
			return true;
		};

		ans.checkFractal = function(area){
			for(var id=1;id<=area.max;id++){
				var d = ans.getSizeOfArea(area,id,f_true);
				var sx=d.x1+d.x2+1, sy=d.y1+d.y2+1;
				var movex=0, movey=0;
				for(var i=0;i<area.room[id].length;i++){
					var c=area.room[id][i];
					if(this.getMoved(c)!=-1 ^ this.getMoved(bd.cnum(sx-bd.cell[c].cx-1, sy-bd.cell[c].cy-1))!=-1){
						for(var a=0;a<area.room[id].length;a++){ if(this.getMoved(area.room[id][a])!=-1){ bd.sErC([area.room[id][a]],1);} }
						return false;
					}
				}
			}
			return true;
		};

		ans.movedPosition = function(larea){
			this.before = new AreaInfo();
			for(var c=0;c<bd.cell.length;c++){
				if(ans.lcntCell(c)==0 && bd.QnC(c)!=-1){ this.before.check[c]=c;}
				else{ this.before.check[c]=-1;}
			}
			for(var r=1;r<=larea.max;r++){
				var before=-1, after=-1;
				if(larea.room[r].length>1){
					for(var i=0;i<larea.room[r].length;i++){
						var c=larea.room[r][i];
						if(ans.lcntCell(c)==1){
							if(bd.QnC(c)!=-1){ before=c;} else{ after=c;}
						}
					}
				}
				this.before.check[after]=before;
			}
		};
		ans.getMoved = function(cc){ return bd.QnC(this.before.check[cc]);};
		ans.getBeforeCell = function(cc){ return this.before.check[cc];};
	}
};