//
// �p�Y���ŗL�X�N���v�g�� ���t���N�g�����N�� reflect.js v3.2.0
//
Puzzles.reflect = function(){ };
Puzzles.reflect.prototype = {
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
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
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
			base.setExpression("�@���̋L����QWEAS�̊e�L�[�œ��́AT�L�[��-�L�[�ŏ����ł��܂��B",
							   " Press each QWEAS key to input question. Press 'T' or '-' key to erase.");
		}
		base.setTitle("���t���N�g�����N","Reflect Link");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){
		if(k.callmode=="pmake"){ kp.defaultdisp = true;}
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1){
				if(!kp.enabled()){ this.inputQues(x,y,[0,2,3,4,5,101]);}
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
			if(this.key_inputLineParts(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.key_inputLineParts = function(ca){
			if(k.mode!=1){ return false;}
			var cc = tc.getTCC();

			if     (ca=='q'){ bd.sQuC(cc,2); bd.sQnC(cc,-1);}
			else if(ca=='w'){ bd.sQuC(cc,3); bd.sQnC(cc,-1);}
			else if(ca=='e'){ bd.sQuC(cc,4); bd.sQnC(cc,-1);}
			else if(ca=='r'){ bd.sQuC(cc,5); bd.sQnC(cc,-1);}
			else if(ca=='t'){ bd.sQuC(cc,101); bd.sQnC(cc,-1);}
			else if(ca=='y'){ bd.sQuC(cc,0); bd.sQnC(cc,-1);}
			else{ return false;}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
			return true;
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.callmode == "pmake"){
			kp.kpgenerate = function(mode){
				this.inputcol('image','knumq','q',[0,0]);
				this.inputcol('image','knumw','w',[1,0]);
				this.inputcol('image','knume','e',[2,0]);
				this.inputcol('image','knumr','r',[3,0]);
				this.inputcol('num','knumt','t','��');
				this.inputcol('num','knumy','y',' ');
				this.insertrow();
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.inputcol('num','knum5','5','5');
				this.inputcol('num','knum6','6','6');
				this.insertrow();
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.inputcol('num','knum9','9','9');
				this.inputcol('num','knum0','0','0');
				this.inputcol('num','knum.','-','-');
				this.insertrow();
			};
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.imgCR = [4,1];
			kp.kpinput = function(ca){
				if(kc.key_inputLineParts(ca)){ return;}
				kc.key_inputqnum(ca,99);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.errcolor1 = "rgb(192, 0, 0)";

		pc.fontcolor = "white";
		pc.fontErrcolor = "white";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawTriangle(x1,y1,x2,y2);
			this.drawTriangleBorder(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.draw101(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawTriangleBorder = function(x1,y1,x2,y2){
			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+4,y2*2+4,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];
				var lflag = (bd.border[id].cx%2==0);
				var qs1 = bd.QuC(bd.cc1(id)), qs2 = bd.QuC(bd.cc2(id));

				g.fillStyle = this.BDlinecolor;

				if(lflag && (qs1==3||qs1==4)&&(qs2==2||qs2==5)){
					if(this.vnop("b"+id+"_tb_",1)){ g.fillRect(bd.border[id].px(), bd.border[id].py()-mf(k.cheight/2), 1, k.cheight);}
				}
				else if(!lflag && (qs1==2||qs1==3)&&(qs2==4||qs2==5)){
					if(this.vnop("b"+id+"_tb_",1)){ g.fillRect(bd.border[id].px()-mf(k.cwidth/2), bd.border[id].py(), k.cwidth, 1);}
				}
				else{ this.vhide("b"+id+"_tb_");}
			}
			this.vinc();
		};
		pc.draw101 = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){ this.draw101_1(clist[i]);}
			this.vinc();
		};
		pc.draw101_1 = function(id){
			var lw = this.lw, lm=this.lm;
			var mgn = mf(k.cwidth*0.12);

			g.fillStyle = this.BorderQuescolor;

			if(bd.QuC(id)==101){
				if(this.vnop("c"+id+"_lp1_",1)){ g.fillRect(bd.cell[id].px()+mf(k.cwidth/2)-lm, bd.cell[id].py()+mgn               , lw+2, k.cheight-2*mgn);}
				if(this.vnop("c"+id+"_lp2_",1)){ g.fillRect(bd.cell[id].px()+mgn              , bd.cell[id].py()+mf(k.cheight/2)-lm, k.cwidth-2*mgn, lw+2);}
			}
			else{ this.vhide("c"+id+"_lp1_"); this.vhide("c"+id+"_lp2_");}
		};

		col.repaintParts = function(id){
			if(bd.isLPMarked(id)){
				pc.draw101_1(bd.cc1(id));
				pc.draw101_1(bd.cc2(id));
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeReflectlink(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeReflectlink();
		};

		enc.decodeReflectlink = function(bstr){
			var c = 0;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if     (ca == '5'){ bd.sQuC(c, 101); c++;}
				else if(ca >= '1' && ca <= '4'){
					bd.sQuC(c, parseInt(ca)+1);
					bd.sQnC(c, parseInt(bstr.substring(i+1,i+2),16));
					c++; i++;
				}
				else if(ca >= '6' && ca <= '9'){
					bd.sQuC(c, parseInt(ca)-4);
					bd.sQnC(c, parseInt(bstr.substring(i+1,i+3),16));
					c++; i+=2;
				}
				else if(ca >= 'a' && ca <= 'z'){ c += (parseInt(ca,36)-9);}
				else{ c++;}

				if(c > bd.cell.length){ break;}
			}

			return bstr.substring(i,bstr.length);
		};
		enc.encodeReflectlink = function(type){
			var cm="", pstr="";
			var count=0;
			for(var i=0;i<bd.cell.length;i++){
				if     (bd.QuC(i)==101){ pstr = "5";}
				else if(bd.QuC(i)>=2 && bd.QuC(i)<=5){
					var val = bd.QnC(i);
					if     (val<= 0){ pstr = ""+(bd.QuC(i)-1)+"0";}
					else if(val>= 1 && val< 16){ pstr = ""+(bd.QuC(i)-1)+val.toString(16);}
					else if(val>=16 && val<256){ pstr = ""+(bd.QuC(i)+4)+val.toString(16);}
				}
				else{ pstr = ""; count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==26){ cm+=((9+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(9+count).toString(36);}

			return cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<k.qrows){ return false;}
			this.decodeCell( function(c,ca){
				if(ca == "+"){ bd.sQuC(c, 101);}
				else if(ca != "."){
					bd.sQuC(c, parseInt(ca.charAt(0))+1);
					if(ca.length>1){ bd.sQnC(c, parseInt(ca.substring(1,ca.length)));}
				}
			},array.slice(0,k.qrows));
			return true;
		};
		fio.encodeOthers = function(){
			return (""+this.encodeCell( function(c){
				if     (bd.QuC(c)==101) { return "+ ";}
				else if(bd.QuC(c)>=2 && bd.QuC(c)<=5) {
					if(bd.QnC(c)==-1){ return ""+(bd.QuC(c)-1).toString()+" ";}
					else{ return ""+(bd.QuC(c)-1).toString()+(bd.QnC(c)).toString()+" ";}
				}
				else{ return ". ";}
			}) );
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
			if( !this.checkLineCross() ){
				this.setAlert('�\���ȊO�̏ꏊ�Ő����������Ă��܂��B','There is a crossing line out of cross mark.'); return false;
			}

			if( !this.checkTriNumber(1) ){
				this.setAlert('�O�p�`�̐����Ƃ������牄�т���̒�������v���Ă��܂���B','A number on triangle is not equal to sum of the length of lines from it.'); return false;
			}
			if( !this.checkTriangle() ){
				this.setAlert('�����O�p�`��ʉ߂��Ă��܂���B','A line doesn\'t goes through a triangle.'); return false;
			}
			if( !this.checkTriNumber(2) ){
				this.setAlert('�O�p�`�̐����Ƃ������牄�т���̒�������v���Ă��܂���B','A number on triangle is not equal to sum of the length of lines from it.'); return false;
			}

			if( !this.checkLineCross2() ){
				this.setAlert('�\���̏ꏊ�Ő����������Ă��܂���B','There isn\'t a crossing line on a cross mark.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are two or more loops.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkLcntCell(1);};

		ans.checkLineCross = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)==4 && bd.QuC(c)!=101){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
		ans.checkLineCross2 = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)!=4 && bd.QuC(c)==101){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
		ans.checkTriangle = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)==0 && (bd.QuC(c)>=2 && bd.QuC(c)<=5)){
					bd.sErC([c],4);
					return false;
				}
			}
			return true;
		};

		ans.checkTriNumber = function(type){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QuC(c)<2 || bd.QuC(c)>5 || bd.QnC(c)<=0){ continue;}

				var list = new Array();
				var cnt=1;
				var tx, ty;

				bx = bd.cell[c].cx*2;   by = bd.cell[c].cy*2+1;
				while(bx>0)        { var id=bd.bnum(bx,by); if(bd.LiB(id)==1){ cnt++; list.push(id); bx-=2;} else{ break;} }
				bx = bd.cell[c].cx*2+2; by = bd.cell[c].cy*2+1;
				while(bx<k.qcols*2){ var id=bd.bnum(bx,by); if(bd.LiB(id)==1){ cnt++; list.push(id); bx+=2;} else{ break;} }
				bx = bd.cell[c].cx*2+1; by = bd.cell[c].cy*2;
				while(by>0)        { var id=bd.bnum(bx,by); if(bd.LiB(id)==1){ cnt++; list.push(id); by-=2;} else{ break;} }
				bx = bd.cell[c].cx*2+1; by = bd.cell[c].cy*2+2;
				while(by<k.qrows*2){ var id=bd.bnum(bx,by); if(bd.LiB(id)==1){ cnt++; list.push(id); by+=2;} else{ break;} }

				if(type==1?bd.QnC(c)<cnt:bd.QnC(c)>cnt){
					bd.sErC([c],4);
					bd.sErB(bd.borders,2);
					bd.sErB(list,1);
					return false;
				}
			}
			return true;
		};
	}
};