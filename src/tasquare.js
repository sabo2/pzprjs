//
// �p�Y���ŗL�X�N���v�g�� ������������ tasquare.js v3.2.0
//
Puzzles.tasquare = function(){ };
Puzzles.tasquare.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
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

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3����
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnumans"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("����������","Tasquare");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,99);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};

		if(k.callmode == "pmake"){
			kp.generate(3, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.fontsizeratio = 0.85;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBDline(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawCellSquare(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawCellSquare = function(x1,y1,x2,y2){
			var mgnw = mf(k.cwidth*0.1);
			var mgnh = mf(k.cheight*0.1);

			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
					g.fillStyle = "black";
					if(this.vnop("c"+c+"_sq1_",1)){ g.fillRect(bd.cell[c].px()+mgnw+1, bd.cell[c].py()+mgnh+1, k.cwidth-mgnw*2-1, k.cheight-mgnh*2-1);}
					g.fillStyle = "white";
					if(this.vnop("c"+c+"_sq2_",1)){ g.fillRect(bd.cell[c].px()+mgnw+2, bd.cell[c].py()+mgnh+2, k.cwidth-mgnw*2-3, k.cheight-mgnh*2-3);}
				}
				else{ this.vhide("c"+c+"_sq1_"); this.vhide("c"+c+"_sq2_");}
			}
			this.vinc();
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

			var barea = this.searchBarea();
			if( !this.checkAllArea(barea, function(id){ return (bd.QaC(id)==1);}, function(w,h,a){ return (w*h==a && w==h);} ) ){
				this.setAlert('�����`�łȂ����}�X�̃J�^�}��������܂��B','A mass of black cells is not regular rectangle.'); return false;
			}

			if( !this.linkBWarea( this.searchWarea() ) ){
				this.setAlert('���}�X�����f����Ă��܂��B','White cells are devided.'); return false;
			}

			if( !this.isNumberSquare(barea,0) ){
				this.setAlert('�����Ƃ���ɐڂ��鍕�}�X�̑傫���̍��v����v���܂���B','Sum of the adjacent masses of black cells is not equal to the number.'); return false;
			}

			if( !this.isNumberSquare(barea,1) ){
				this.setAlert('�����̂Ȃ����ɍ��}�X���ڂ��Ă��܂���B','No black cells are adjacent to square mark without numbers.'); return false;
			}

			return true;
		};

		ans.isNumberSquare = function(area, flag){
			for(var c=0;c<bd.cell.length;c++){
				if((flag==0?(bd.QnC(c)<0):(bd.QnC(c)!=-2))){ continue;}
				var cnt = 0;
				if(bd.QaC(bd.up(c))==1){ cnt += ans.getCntOfRoom(area, area.check[bd.up(c)]);}
				if(bd.QaC(bd.dn(c))==1){ cnt += ans.getCntOfRoom(area, area.check[bd.dn(c)]);}
				if(bd.QaC(bd.lt(c))==1){ cnt += ans.getCntOfRoom(area, area.check[bd.lt(c)]);}
				if(bd.QaC(bd.rt(c))==1){ cnt += ans.getCntOfRoom(area, area.check[bd.rt(c)]);}
				if(bd.QnC(c)>=0?(bd.QnC(c)!=cnt):(cnt==0)){
					if(bd.QaC(bd.up(c))==1){ bd.sErC(area.room[area.check[bd.up(c)]],1); }
					if(bd.QaC(bd.dn(c))==1){ bd.sErC(area.room[area.check[bd.dn(c)]],1); }
					if(bd.QaC(bd.lt(c))==1){ bd.sErC(area.room[area.check[bd.lt(c)]],1); }
					if(bd.QaC(bd.rt(c))==1){ bd.sErC(area.room[area.check[bd.rt(c)]],1); }
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
	}
};