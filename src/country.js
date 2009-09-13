//
// �p�Y���ŗL�X�N���v�g�� �J���g���[���[�h�� country.js v3.2.0
//
Puzzles.country = function(){ };
Puzzles.country.prototype = {
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
		k.isOneNumber   = 1;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["arearoom","cellqnum","borderline","cellqsub"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("�J���g���[���[�h","Country Road");
		base.setExpression("�@�h���b�O�Ő����A�}�X�̃N���b�N�Ł��~(�⏕�L��)�����͂ł��܂��B",
						   " Left Button Drag to input lines, Click to input auxiliary marks.");
		base.setFloatbgcolor("rgb(191, 0, 0)");
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
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted() && !(kc.isZ ^ menu.getVal('dispred'))){
				if(k.mode==1){
					if(!kp.enabled()){ this.inputqnum(x,y,99);}
					else{ kp.display(x,y);}
				}
				else if(k.mode==3) this.inputMB(x,y);
			}
		};
		mv.mousemove = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.callmode == "pmake"){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(191, 191, 191)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

		//	this.drawPekes(x1,y1,x2,y2,0);
			this.drawMBs(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBorder(bstr);
				bstr = this.decodeRoomNumber16(bstr);
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder()+this.encodeRoomNumber16();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}
			if( !this.checkLcntCell(4) ){
				this.setAlert('�������Ă����������܂��B','There is a crossing line.'); return false;
			}

			var rarea = this.searchRarea();
			if( !this.checkRoom2( rarea ) ){
				this.setAlert('�����P�̍����Q��ȏ�ʂ��Ă��܂��B','A line passes a country twice or more.'); return false;
			}

			if( !this.checkOneNumber(rarea, function(top,lcnt){ return (top>0 && top!=lcnt);}, function(cc){ return ans.lcnts.cell[cc]>0;}) ){
				this.setAlert('�����̂��鍑�Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B','The number of the cells that is passed any line in the country and the number written in the country is diffrerent.'); return false;
			}
			if( !this.checkOneNumber(rarea, function(top,lcnt){ return lcnt==0;}, function(cc){ return ans.lcnts.cell[cc]>0;}) ){
				this.setAlert('���̒ʂ��Ă��Ȃ���������܂��B','There is a country that is not passed any line.'); return false;
			}

			if( !this.checkSideAreaCell(rarea, function(area,c1,c2){ return (ans.lcnts.cell[c1]==0 && ans.lcnts.cell[c2]==0);}, false) ){
				this.setAlert('�����ʂ�Ȃ��}�X���A�������͂���Ń^�e���R�ɂƂȂ肠���Ă��܂��B','The cells that is not passed any line are adjacent over border line.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are two or more loops.'); return false;
			}

			return true;
		};

		ans.checkRoom2 = function(area){
			if(area.max<=1){ return true;}
			for(var r=1;r<=area.max;r++){
				var cnt=0;
				for(var i=0;i<area.room[r].length;i++){
					var c=area.room[r][i];
					var ub=bd.ub(c); if(bd.up(c)!=-1 && bd.QuB(ub)==1 && bd.LiB(ub)==1){ cnt++;}
					var db=bd.db(c); if(bd.dn(c)!=-1 && bd.QuB(db)==1 && bd.LiB(db)==1){ cnt++;}
					var lb=bd.lb(c); if(bd.lt(c)!=-1 && bd.QuB(lb)==1 && bd.LiB(lb)==1){ cnt++;}
					var rb=bd.rb(c); if(bd.rt(c)!=-1 && bd.QuB(rb)==1 && bd.LiB(rb)==1){ cnt++;}
				}
				if(cnt>2){ bd.sErC(area.room[r],1); return false;}
			}
			return true;
		};
	}
};