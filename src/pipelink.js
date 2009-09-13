//
// �p�Y���ŗL�X�N���v�g�� �p�C�v�����N�� pipelink.js v3.2.0
//
Puzzles.pipelink = function(){ };
Puzzles.pipelink.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 1;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
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

		k.fstruct = ["others", "borderline"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		if(k.callmode=="pplay"){
			base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Right Click to input a cross.");
		}
		else{
			base.setExpression("�@���̋L����QWEASDF�̊e�L�[�œ��͂ł��܂��B<br>R�L�[��-�L�[�ŏ����ł��܂��B1�L�[�ŋL������͂ł��܂��B",
							   " Press each QWEASDF key to input question. <br> Press 'R' or '-' key to erase. '1' keys to input circles.");
		}
		base.setTitle("�p�C�v�����N","Pipelink");
		base.setFloatbgcolor("rgb(0, 191, 0)");
	},
	menufix : function(){
		if(k.callmode=="pmake"){ kp.defaultdisp = true;}
		$("#btnarea").append("<input type=\"button\" id=\"btncircle\" value=\"��\" onClick=\"javascript:pc.changedisp();\">");
		menu.addButtons($("#btncircle").unselectable(),"��","��");
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1){
				if(!kp.enabled()){ this.inputQues(x,y,[0,101,102,103,104,105,106,107,-2]);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			kc.key_inputLineParts(ca);
		};
		kc.key_inputLineParts = function(ca){
			if(k.mode!=1){ return false;}
			var cc = tc.getTCC();

			if     (ca=='q'){ bd.sQuC(cc,101); }
			else if(ca=='w'){ bd.sQuC(cc,102); }
			else if(ca=='e'){ bd.sQuC(cc,103); }
			else if(ca=='r'){ bd.sQuC(cc,  0); }
			else if(ca==' '){ bd.sQuC(cc,  0); }
			else if(ca=='a'){ bd.sQuC(cc,104); }
			else if(ca=='s'){ bd.sQuC(cc,105); }
			else if(ca=='d'){ bd.sQuC(cc,106); }
			else if(ca=='f'){ bd.sQuC(cc,107); }
			else if(ca=='-'){ bd.sQuC(cc, (bd.QuC(cc)!=-2?-2:0)); }
			else if(ca=='1'){ bd.sQuC(cc,  6); }
			else{ return false;}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
			return true;
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.callmode == "pmake"){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knumq','q','��');
				this.inputcol('num','knumw','w','��');
				this.inputcol('num','knume','e','��');
				this.inputcol('num','knumr','r',' ');
				this.insertrow();
				this.inputcol('num','knuma','a','��');
				this.inputcol('num','knums','s','��');
				this.inputcol('num','knumd','d','��');
				this.inputcol('num','knumf','f','��');
				this.insertrow();
				this.inputcol('num','knum_','-','?');
				this.inputcol('empty','knumx','','');
				this.inputcol('empty','knumy','','');
				this.inputcol('num','knum.','1','��');
				this.insertrow();
			};
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.kpinput = function(ca){ kc.key_inputLineParts(ca);};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.linecolor = "rgb(0, 192, 0)";
		pc.errcolor1 = "rgb(192, 0, 0)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			if(this.disp==1){ this.drawIcebarns(x1,y1,x2,y2);}

			this.drawBDline2(x1,y1,x2,y2);

			if(this.disp==1){ this.drawIceBorders(x1,y1,x2,y2);}
			if(this.disp==0){ this.drawCircle2(x1,y1,x2,y2);}

			this.drawNumbers(x1,y1,x2,y2); // �H�\���p

			this.drawLines(x1,y1,x2,y2);

			if(k.br.IE){ this.drawPekes(x1,y1,x2,y2,1);}
			else{ this.drawPekes(x1,y1,x2,y2,0);}

			this.drawLineParts(x1-2,y1-2,x2+2,y2+2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawCircle2 = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.40;
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QuC(c)==6){
					g.strokeStyle = this.Cellcolor;
					g.beginPath();
					g.arc(bd.cell[c].px()+mf(k.cwidth/2), bd.cell[c].py()+mf(k.cheight/2), rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cir_",0)){ g.stroke(); }
				}
				else{ this.vhide("c"+c+"_cir_");}
			}
			this.vinc();
		};

		pc.disp = 0;
		pc.changedisp = function(){
			if     (this.disp==1){ $("#btncircle").attr("value", "��"); this.disp=0;}
			else if(this.disp==0){ $("#btncircle").attr("value", "��"); this.disp=1;}
			this.paintAll();
		};

		col.repaintParts = function(id){
			if(bd.isLPMarked(id)){
				var bx = bd.border[id].cx; var by = bd.border[id].cy;
				pc.drawLineParts1( bd.cnum(mf((bx-by%2)/2), mf((by-bx%2)/2)) );
				pc.drawLineParts1( bd.cnum(mf((bx+by%2)/2), mf((by+bx%2)/2)) );
			}
		};
		col.minYdeg = 0.42;
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodePipelink(bstr);}
			if(this.checkpflag("i") && this.disp==0){ pc.changedisp();}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/q.html?"+this.pzldata2();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata  = function(){ return ""+(pc.disp==0?"/":"/i/")+k.qcols+"/"+k.qrows+"/"+this.encodePipelink(1);};
		enc.pzldata2 = function(){ return ""+(pc.disp==0?"/": "i/")+k.qcols+"/"+k.qrows+"/"+this.encodePipelink(2);};

		enc.decodePipelink = function(bstr){
			var c=0;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if     (ca=='.')             { bd.sQuC(c, -2); c++;}
				else if(ca>='0' && ca<='9'){
					var imax = parseInt(ca,10)+1; var icur;
					for(icur=0;icur<imax;icur++){ bd.sQuC(c, 6); c++;}
				}
				else if(ca>='a' && ca<='g'){ bd.sQuC(c, (parseInt(ca,36)+91)); c++;}
				else if(ca>='h' && ca<='z'){ c += (parseInt(ca,36)-16);}
				else{ c++;}

				if(c > bd.cell.length){ break;}
			}

			return bstr.substring(i,bstr.length);
		};
		enc.encodePipelink = function(type){
			var count, pass;
			var cm="";
			var pstr="";

			count=0;
			for(var i=0;i<bd.cell.length;i++){
				if     (bd.QuC(i) == -2){ pstr = ".";}
				else if(bd.QuC(i) ==  6 && type==1){
					var icur;
					for(icur=1;icur<10;icur++){ if(bd.QuC(i+icur)!=6){ break;}}
					pstr = (icur-1).toString(10); i+=(icur-1);
				}
				else if(bd.QuC(i)==6 && type==2){ pstr = "0";}
				else if(bd.QuC(i)>=101 && bd.QuC(i)<=107){ pstr = (bd.QuC(i)-91).toString(36);}
				else{ pstr = ""; count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==19){ cm+=((16+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(16+count).toString(36);}

			return cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<k.qrows+1){ return false;}
			if(array[0]=="circle"){pc.disp=0;}else if(array[0]=="ice"){pc.disp=1;}
			this.decodeCell( function(c,ca){
				if(ca == "o")     { bd.sQuC(c, 6); }
				else if(ca == "-"){ bd.sQuC(c, -2);}
				else if(ca != "."){ bd.sQuC(c, parseInt(ca,36)+91);}
			},array.slice(1,k.qrows+1));
			return true;
		};
		fio.encodeOthers = function(){
			return (""+(pc.disp==0?"circle":"ice")+"/"+this.encodeCell( function(c){
				if     (bd.QuC(c)==6) { return "o ";}
				else if(bd.QuC(c)>=101 && bd.QuC(c)<=107) { return ""+(bd.QuC(c)-91).toString(36)+" ";}
				else if(bd.QuC(c)==-2){ return "- ";}
				else                  { return ". ";}
			}) );
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkenableLineParts(1) ){
				this.setAlert('�ŏ����������Ă����������}�X�ɐ���������Ă��܂��B','Lines are added to the cell that the mark lie in by the question.'); return false;
			}

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}

			var rice = false;
			for(var i=0;i<bd.cell.length;i++){ if(bd.QuC(i)==6){ rice=true; break;}}
			if( rice && !this.checkLineCross() ){
				this.setAlert((pc.disp==0?'��':'�X')+'�̕����ȊO�Ő����������Ă��܂��B','There is a crossing line out of '+(pc.disp==0?'circles':'ices')+'.'); return false;
			}
			if( rice && !this.checkLineCurve() ){
				ans.setAlert((pc.disp==0?'��':'�X')+'�̕����Ő����Ȃ����Ă��܂��B','A line curves on '+(pc.disp==0?'circles':'ices')+'.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
			}

			if( !this.checkLPPlus() ){
				this.setAlert('���̃}�X�������4�{�o�Ă��܂���B','A cross-joint cell doesn\'t have four-way lines.'); return false;
			}

			if( !this.checkLcntCell(0) ){
				this.setAlert('����������Ă��Ȃ��}�X������܂��B','There is an empty cell.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			return true;
		};

		ans.checkLineCross = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)==4 && bd.QuC(c)!=6 && bd.QuC(c)!=101){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
		ans.checkLineCurve = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)==2 && bd.QuC(c)==6 && !ans.isLineStraight(c)){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
		ans.checkLPPlus = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)!=4 && bd.QuC(c)==101){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
	}
};