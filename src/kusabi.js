//
// �p�Y���ŗL�X�N���v�g�� �N�T�r�����N�� kusabi.js v3.2.0
//
Puzzles.kusabi = function(){ };
Puzzles.kusabi.prototype = {
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
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum", "borderline"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("�N�T�r�����N","Kusabi");
		base.setExpression("�@���h���b�O�Ő����A�E�h���b�O�Ł~�󂪓��͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,3);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,3);
		};

		if(k.callmode == "pmake"){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knum1','1','��');
				this.inputcol('num','knum2','2','�Z');
				this.inputcol('num','knum3','3','��');
				this.insertrow();
				this.inputcol('num','knum.','-','��');
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('empty','knumx','','');
				this.insertrow();
			};
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,3);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.errcolor1 = "rgb(192, 0, 0)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawNumCells_kusabi(x1,y1,x2,y2);
			this.drawNumbers_kusabi(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawNumCells_kusabi = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.42;
			var rsize2 = k.cwidth*0.36;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
					var px=bd.cell[c].px()+mf(k.cwidth/2), py=bd.cell[c].py()+mf(k.cheight/2);

					g.fillStyle = this.Cellcolor;
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cira_",1)){ g.fill(); }

					if(bd.ErC(c)==1){ g.fillStyle = this.errbcolor1;}
					else{ g.fillStyle = "white";}
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cirb_",1)){ g.fill(); }
				}
				else{ this.vhide(["c"+c+"_cira_", "c"+c+"_cirb_"]);}
			}
			this.vinc();
		};
		pc.drawNumbers_kusabi = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				var num = bd.QnC(c);
				if(num>=1 && num<=3){ text = ({1:"��",2:"�Z",3:"��"})[num];}
				else if(!bd.cell[c].numobj)   { continue;}
				else{ bd.cell[c].numobj.hide(); continue;}

				if(!bd.cell[c].numobj){ bd.cell[c].numobj = this.CreateDOMAndSetNop();}
				this.dispnumCell1(c, bd.cell[c].numobj, 1, text, 0.65, this.getNumberColor(c));
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeNumber10(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeNumber10();
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

			var larea = this.searchLarea();
			if( !this.checkQnumsInArea(larea, function(a){ return (a>=3);}) ){
				this.setAlert('3�ȏ�̊ۂ��Ȃ����Ă��܂��B','Three or more objects are connected.'); return false;
			}
			if( !this.check2Line() ){
				this.setAlert('�ۂ̏������ʉ߂��Ă��܂��B','A line goes through a circle.'); return false;
			}

			var saved = this.checkConnectedLine();
			if( !this.checkErrorFlag(saved,7) ){
				this.setAlert('�ۂ��R�̎��^�Ɍq�����Ă��܂���B','The shape of a line is not correct.'); return false;
			}
			if( !this.checkErrorFlag(saved,6) ){
				this.setAlert('�q����ۂ�����������܂���B','The type of connected circle is wrong.'); return false;
			}
			if( !this.checkErrorFlag(saved,5) ){
				this.setAlert('����2��ȏ�Ȃ����Ă��܂��B','A line turns twice or more.'); return false;
			}
			if( !this.checkErrorFlag(saved,4) ){
				this.setAlert('����2��Ȃ����Ă��܂���B','A line turns only once or lower.'); return false;
			}
			if( !this.checkErrorFlag(saved,3) ){
				this.setAlert('���̒����������ł͂���܂���B','The length of lines is differnet.'); return false;
			}
			if( !this.checkErrorFlag(saved,2) ){
				this.setAlert('���̒��Z�̎w���ɔ����Ă܂��B','The length of lines is not suit for the label of object.'); return false;
			}
			if( !this.checkErrorFlag(saved,1) ){
				this.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkDisconnectLine(larea) ){
				this.setAlert('�ۂɂȂ����Ă��Ȃ���������܂��B','A line doesn\'t connect any circle.'); return false;
			}

			if( !this.checkNumber() ){
				this.setAlert('�ǂ��ɂ��Ȃ����Ă��Ȃ��ۂ�����܂��B','A circle is not connected another object.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkNumber();};

		ans.check2Line = function(){ return this.checkLine(function(i){ return (this.lcntCell(i)>=2 && bd.QnC(i)!=-1);}.bind(this)); };
		ans.checkLine = function(func){
			for(var c=0;c<bd.cell.length;c++){
				if(func(c)){
					bd.sErB(bd.borders,2);
					ans.setCellLineError(c,true);
					return false;
				}
			}
			return true;
		};
		ans.checkNumber = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)==0 && bd.QnC(c)!=-1){
					bd.sErC(c,1);
					return false;
				}
			}
			return true;
		};

		ans.checkConnectedLine = function(){
			var saved = {errflag:0,cells:new Array(),idlist:new Array()};
			var visited = new AreaInfo();
			for(var id=0;id<bd.border.length;id++){ visited[id]=0;}

			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1 || this.lcntCell(c)==0){ continue;}

				var cc      = -1;	// ���[�v���甲�����Ƃ��ɓ��B�n�_��ID������
				var ccnt    =  0;	// �Ȃ�������
				var dir     =  0;	// ���݌������Ă������/�Ō�Ɍ�����������
				var dir1    =  0;	// �ŏ��Ɍ�����������
				var length1 =  0;	// ���Ȃ���O�̐��̒���
				var length2 =  0;	// ���Ȃ�������̐��̒���
				var idlist  = new Array();	// �ʉ߂���line�̃��X�g(�G���[�\���p)
				var bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;	// ���ݒn
				while(1){
					switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
					if((bx+by)%2==0){
						cc = bd.cnum(mf(bx/2),mf(by/2));
						if(dir!=0 && bd.QnC(cc)!=-1){ break;}
						else if(dir!=1 && bd.LiB(bd.bnum(bx,by+1))>0){ if(dir!=0&&dir!=2){ ccnt++;} dir=2;}
						else if(dir!=2 && bd.LiB(bd.bnum(bx,by-1))>0){ if(dir!=0&&dir!=1){ ccnt++;} dir=1;}
						else if(dir!=3 && bd.LiB(bd.bnum(bx+1,by))>0){ if(dir!=0&&dir!=4){ ccnt++;} dir=4;}
						else if(dir!=4 && bd.LiB(bd.bnum(bx-1,by))>0){ if(dir!=0&&dir!=3){ ccnt++;} dir=3;}
					}
					else{
						cc=-1;
						var id = bd.bnum(bx,by);
						if(id==-1||visited[id]!=0||bd.LiB(id)<=0){ break;}
						idlist.push(id);
						visited[id]=1;
						if(dir1==0){ dir1=dir;}
						if     (ccnt==0){ length1++;}
						else if(ccnt==2){ length2++;}
					}
				}

				if(idlist.length<=0){ continue;}
				else if((cc==-1 || bd.QnC(cc)==-1) && saved.errflag==0){
					saved = {errflag:1,cells:[c],idlist:idlist};
				}
				else if((((bd.QnC(c)==2 || bd.QnC(cc)==3) && length1>=length2) ||
						 ((bd.QnC(c)==3 || bd.QnC(cc)==2) && length1<=length2)) && ccnt==2 && cc!=-1 && saved.errflag<=1)
				{
					saved = {errflag:2,cells:[c,cc],idlist:idlist};
				}
				else if((bd.QnC(c)==1 || bd.QnC(cc)==1) && ccnt==2 && cc!=-1 && length1!=length2 && saved.errflag<=2){
					saved = {errflag:3,cells:[c,cc],idlist:idlist};
				}
				else if(ccnt<2 && cc!=-1 && saved.errflag<=3){
					saved = {errflag:4,cells:[c,cc],idlist:idlist};
					return saved;
				}
				else if(ccnt>2 && saved.errflag<=3){
					saved = {errflag:5,cells:[c,cc],idlist:idlist};
					return saved;
				}
				else if(!((bd.QnC(c)==1 && bd.QnC(cc)==1) || (bd.QnC(c)==2 && bd.QnC(cc)==3) ||
						  (bd.QnC(c)==3 && bd.QnC(cc)==2) || bd.QnC(c)==-2 || bd.QnC(cc)==-2) &&
						   cc!=-1 && ccnt==2 && saved.errflag<=3)
				{
					saved = {errflag:6,cells:[c,cc],idlist:idlist};
					return saved;
				}
				else if(!((dir1==1&&dir==2)||(dir1==2&&dir==1)||(dir1==3&&dir==4)||(dir1==4&&dir==3)) && ccnt==2 && saved.errflag<=3){
					saved = {errflag:7,cells:[c,cc],idlist:idlist};
					return saved;
				}
			}
			return saved;
		};
		ans.checkErrorFlag = function(saved, val){
			if(saved.errflag==val){
				bd.sErC(saved.cells,1);
				bd.sErB(bd.borders,2);
				bd.sErB(saved.idlist,1);
				return false;
			}
			return true;
		};
	}
};