//
// �p�Y���ŗL�X�N���v�g�� ���B�E�� view.js v3.2.0
//
Puzzles.view = function(){ };
Puzzles.view.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 1;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum", "cellqanssub"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("���B�E","View");
		base.setExpression("�@�}�X�̃N���b�N��L�[�{�[�h�Ő�������͂ł��܂��BQAZ�L�[�Ł��AWSX�L�[�Ł~����͂ł��܂��B",
					   " It is available to input number by keybord or mouse. Each QAZ key to input auxiliary circle, each WSX key to input auxiliary cross.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(!kp.enabled()){ this.inputqnum(x,y,Math.min(k.qcols+k.qrows-2,99));}
			else{ kp.display(x,y);}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			//this.inputqnum(x,y,Math.min(k.qcols+k.qrows-2,99));
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			if(kc.key_view(ca)){ return;}
			this.key_inputqnum(ca,Math.min(k.qcols+k.qrows-2,99));
		};
		kc.key_view = function(ca){
			if(k.mode==1 || bd.QnC(tc.getTCC())!=-1){ return false;}

			var cc = tc.getTCC();
			var flag = false;

			if     ((ca=='q'||ca=='a'||ca=='z')){ bd.sQaC(cc,-1); bd.sQsC(cc,1); flag = true;}
			else if((ca=='w'||ca=='s'||ca=='x')){ bd.sQaC(cc,-1); bd.sQsC(cc,2); flag = true;}
			else if((ca=='e'||ca=='d'||ca=='c')){ bd.sQaC(cc,-1); bd.sQsC(cc,0); flag = true;}
			else if(ca=='1' && bd.QaC(cc)==1)   { bd.sQaC(cc,-1); bd.sQsC(cc,1); flag = true;}
			else if(ca=='2' && bd.QaC(cc)==2)   { bd.sQaC(cc,-1); bd.sQsC(cc,2); flag = true;}

			if(flag){ pc.paintCell(cc); return true;}
			return false;
		};

		kp.kpgenerate = function(mode){
			if(mode==3){
				this.tdcolor = pc.MBcolor;
				this.inputcol('num','knumq','q','��');
				this.inputcol('num','knumw','w','�~');
				this.tdcolor = "black";
				this.inputcol('empty','knumx','','');
				this.inputcol('empty','knumy','','');
				this.insertrow();
			}
			this.inputcol('num','knum0','0','0');
			this.inputcol('num','knum1','1','1');
			this.inputcol('num','knum2','2','2');
			this.inputcol('num','knum3','3','3');
			this.insertrow();
			this.inputcol('num','knum4','4','4');
			this.inputcol('num','knum5','5','5');
			this.inputcol('num','knum6','6','6');
			this.inputcol('num','knum7','7','7');
			this.insertrow();
			this.inputcol('num','knum8','8','8');
			this.inputcol('num','knum9','9','9');
			this.inputcol('num','knum_',' ',' ');
			((mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knumz','',''));
			this.insertrow();
		};
		kp.generate(99, true, true, kp.kpgenerate.bind(kp));
		kp.kpinput = function(ca){
			if(kc.key_view(ca)){ return;}
			kc.key_inputqnum(ca,Math.min(k.qcols+k.qrows-2,99));
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.errbcolor2 = "rgb(127, 255, 127)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);

			this.drawMBs(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeNumber16(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeNumber16();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkSideCell(function(c1,c2){ return (this.getNum(c1)>=0 && this.getNum(c1)==this.getNum(c2));}.bind(this)) ){
				this.setAlert('�����������^�e���R�ɘA�����Ă��܂��B','Same numbers are adjacent.'); return false;
			}

			if( !this.checkCellNumber() ){
				this.setAlert('�����ƁA���̃}�X�ɂ��ǂ蒅���܂ł̃}�X�̐��̍��v����v���Ă��܂���B','Sum of four-way gaps to another number is not equal to the number.'); return false;
			}

			if( !this.linkBWarea( ans.searchBWarea(function(id){ return (id!=-1 && this.getNum(id)!=-1 && this.getNum(id)!=-3); }.bind(this)) ) ){
				this.setAlert('�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B','Numbers are devided.'); return false;
			}

			if( !this.checkMB() ){
				this.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a cell that is not filled in number.'); return false;
			}

			return true;
		};

		ans.checkCellNumber = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.getNum(c)<0){ continue;}

				var list = new Array();
				var cnt=0;
				var tx, ty;

				tx = bd.cell[c].cx-1; ty = bd.cell[c].cy;
				while(tx>=0)     { var cc=bd.cnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); tx--;} else{ break;} }
				tx = bd.cell[c].cx+1; ty = bd.cell[c].cy;
				while(tx<k.qcols){ var cc=bd.cnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); tx++;} else{ break;} }
				tx = bd.cell[c].cx; ty = bd.cell[c].cy-1;
				while(ty>=0)     { var cc=bd.cnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); ty--;} else{ break;} }
				tx = bd.cell[c].cx; ty = bd.cell[c].cy+1;
				while(ty<k.qrows){ var cc=bd.cnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); ty++;} else{ break;} }

				if(this.getNum(c)!=cnt){
					bd.sErC([c],1);
					bd.sErC(list,2);
					return false;
				}
			}
			return true;
		};
		ans.getNum = function(cc){
			if(cc<0||cc>=bd.cell.length){ return -1;}
			if(bd.QnC(cc)!=-1){ return bd.QnC(cc);}
			if(bd.QsC(cc)==1) { return -3;}
			return bd.QaC(cc);
		};

		ans.checkMB = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QsC(c)==1){ bd.sErC([c],1); return false;}
			}
			return true;
		};
	}
};