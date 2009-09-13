// MouseInput.js v3.2.0p4

//---------------------------------------------------------------------------
// ��MouseEvent�N���X �}�E�X���͂Ɋւ�����̕ێ��ƃC�x���g����������
//---------------------------------------------------------------------------
// �p�Y������ �}�E�X���͕�
// MouseEvent�N���X���`
var MouseEvent = function(){
	this.mousePressed;
	this.mouseCell;
	this.inputData;
	this.clickBtn;
	this.currentOpeCount;
	this.firstPos;
	this.btn;
	this.isButton={};
	this.mousereset();

	this.isButton = function(){ };
	if(k.br.IE){
		this.isButton = function(event,code){ return event.button == {0:1,1:4,2:2}[code];};
	}
	else if (k.br.WebKit) {
		this.isButton = function(event, code) {
			if     (code==0){ return event.which == 1 && !event.metaKey;}
			else if(code==1){ return event.which == 1 && event.metaKey; }
			return false;
		};
	}
	else {
		this.isButton = function(event, code){
			return event.which?(event.which === code + 1):(event.button === code);
		};
	}
};
MouseEvent.prototype = {
	//---------------------------------------------------------------------------
	// mv.mousereset() �}�E�X���͂Ɋւ����������������
	//---------------------------------------------------------------------------
	mousereset : function(){
		this.mousePressed = 0;
		this.mouseCell = -1;
		this.inputData = -1;
		this.clickBtn = -1;
		this.currentOpeCount = 0;
		this.firstPos = new Pos(-1, -1);
		this.btn = { Left: false, Middle: false, Right: false };
	},

	//---------------------------------------------------------------------------
	// mv.e_mousedown() Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g���ʏ���
	// mv.e_mouseup()   Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g���ʏ���
	// mv.e_mousemove() Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g���ʏ���
	// mv.e_mouseout()  �}�E�X�J�[�\�����E�B���h�E���痣�ꂽ�ۂ̃C�x���g���ʏ���
	// mv.modeflip()    ���{�^���Ń��[�h��ύX����Ƃ��̏���
	//---------------------------------------------------------------------------
	//�C�x���g�n���h������Ăяo�����
	// ����3�̃}�E�X�C�x���g��Canvas����Ăяo�����(mv��bind���Ă���)
	e_mousedown : function(e){
		if(!k.enableMouse){ return;}
		this.btn = { Left: this.isLeft(e), Middle: this.isMiddle(e), Right: this.isRight(e) };
		if(this.btn.Middle){ this.modeflip(); return;} //���{�^��
		bd.errclear();
		um.newOperation(true);
		this.currentOpeCount = um.ope.length;
		this.mousePressed = 1;
		this.mousedown(this.pointerX(e)-k.cv_oft.x-k.IEMargin.x, this.pointerY(e)-k.cv_oft.y-k.IEMargin.y);
		return false;
	},
	e_mouseup   : function(e){
		if(!k.enableMouse || this.btn.Middle || this.mousePressed!=1){ return;}
		um.newOperation(false);
		this.mouseup  (this.pointerX(e)-k.cv_oft.x-k.IEMargin.x, this.pointerY(e)-k.cv_oft.y-k.IEMargin.y);
		this.mousereset();
		return false;
	},
	e_mousemove : function(e){
		if(!k.enableMouse || this.btn.Middle || this.mousePressed!=1){ return;}
		um.newOperation(false);
		this.mousemove(this.pointerX(e)-k.cv_oft.x-k.IEMargin.x, this.pointerY(e)-k.cv_oft.y-k.IEMargin.y);
	},
	e_mouseout : function(e) {
//		if (k.br.IE){ var e=window.event;}
//		this.mousereset();
		um.newOperation(false);
	},
	modeflip : function(input){
		if(k.callmode!="pmake"){ return;}
		menu.setVal('mode', (k.mode==3?1:3));
	},

	//---------------------------------------------------------------------------
	// mv.mousedown() Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// mv.mouseup()   Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// mv.mousemove() Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//---------------------------------------------------------------------------
	//�I�[�o�[���C�h�p
	mousedown : function(x,y){ },
	mouseup   : function(x,y){ },
	mousemove : function(x,y){ },

	// ���ʊ֐�
	//---------------------------------------------------------------------------
	// mv.cellid()   Pos(x,y)���ǂ̃Z����ID�ɊY�����邩��Ԃ�
	// mv.crossid()  Pos(x,y)���ǂ̌����_��ID�ɊY�����邩��Ԃ�
	// mv.cellpos()  Pos(x,y)�����z�Z����łǂ���(X,Y)�ɊY�����邩��Ԃ�
	// mv.crosspos() Pos(x,y)�����z�Z����łǂ���(X*2,Y*2)�ɊY�����邩��Ԃ��B
	//               �O�g�̍��オ(0,0)�ŉE����(k.qcols*2,k.qrows*2)�Brc��0�`0.5�̃p�����[�^�B
	// mv.borderid() Pos(x,y)���ǂ̋��E���ELine��ID�ɊY�����邩��Ԃ�(�N���b�N�p)
	//---------------------------------------------------------------------------
	cellid : function(p){
		var pos = this.cellpos(p);
		if((p.x-k.p0.x)%k.cwidth==0 || (p.y-k.p0.y)%k.cheight==0){ return -1;} // �҂�����͖���
		if(pos.x<0 || pos.x>k.qcols-1 || pos.y<0 || pos.y>k.qrows-1){ return -1;}
		return pos.x+pos.y*k.qcols;
	},
	crossid : function(p){
		var pos = this.crosspos(p,0.5);
		if(pos.x<0 || pos.x>2*k.qcols || pos.y<0 || pos.y>2*k.qrows){ return -1;}
		return mf((pos.x/2)+(pos.y/2)*(k.qcols+1));
	},
	cellpos : function(p){	// crosspos(p,0)�ł���ւ͂ł���
		return new Pos(mf((p.x-k.p0.x)/k.cwidth), mf((p.y-k.p0.y)/k.cheight));
	},
	crosspos : function(p,rc){
		var pm = rc*k.cwidth;
		var cx = mf((p.x-k.p0.x+pm)/k.cwidth), cy = mf((p.y-k.p0.y+pm)/k.cheight);
		var dx = (p.x-k.p0.x+pm)%k.cwidth,     dy = (p.y-k.p0.y+pm)%k.cheight;

		return new Pos(cx*2+(dx<2*pm?0:1), cy*2+(dy<2*pm?0:1));
	},

	borderid : function(p,centerflag){
		var cx = mf((p.x-k.p0.x)/k.cwidth), cy = mf((p.y-k.p0.y)/k.cheight);
		var dx = (p.x-k.p0.x)%k.cwidth,     dy = (p.y-k.p0.y)%k.cheight;
		if(centerflag){
			if(!k.isborderAsLine){
				var m1=0.15*k.cwidth, m2=0.85*k.cwidth;
				if((dx<m1||m2<dx) && (dy<m1||m2<dy)){ return -1;}
			}
			else{
				var m1=0.35*k.cwidth, m2=0.65*k.cwidth;
				if(m1<dx && dx<m2 && m1<dy && dy<m2){ return -1;}
			}
		}

		if(dx<k.cwidth-dy){	//����
			if(dx>dy){ return bd.bnum(2*cx+1,2*cy  );}	//�E��
			else     { return bd.bnum(2*cx  ,2*cy+1);}	//����
		}
		else{	//�E��
			if(dx>dy){ return bd.bnum(2*cx+2,2*cy+1);}	//�E��
			else     { return bd.bnum(2*cx+1,2*cy+2);}	//����
		}
		return -1;
	},

	//---------------------------------------------------------------------------
	// mv.isLeft()      ���N���b�N���ꂽ���ǂ�����Ԃ��BShift�L�[�������͍��E�t�ɂȂ��Ă���B
	// mv.isMiddle()    ���{�^���N���b�N���ꂽ���ǂ�����Ԃ��B
	// mv.isRight()     �E�N���b�N���ꂽ���ǂ�����Ԃ��BShift�L�[�������͍��E�t�ɂȂ��Ă���B
	// mv.isWinWebKit() isLeft�œ��ꏈ�����s�����̓����֐�
	//---------------------------------------------------------------------------
	isLeft : function(e){
		if(!((kc.isSHIFT) ^ menu.getVal('lrcheck'))){
			if(!this.isWinWebKit()){ return this.isLeftClick(e);}
			else if(e.button == 0){ return true;}
		}
		else{
			if(!this.isWinWebKit()){ return this.isRightClick(e);}
			else if(e.button == 2){ return true;}
		}
		return false;
	},
	isMiddle : function(e){
		if(!this.isWinWebKit()){ return this.isMiddleClick(e);}
		else if(e.button == 1){ return true;}
		return false;
	},
	isRight : function(e){
		if(!((kc.isSHIFT) ^ menu.getVal('lrcheck'))){
			if(!this.isWinWebKit()){ return this.isRightClick(e);}
			else if(e.button == 2){ return true;}
		}
		else{
			if(!this.isWinWebKit()){ return this.isLeftClick(e);}
			else if(e.button == 0){ return true;}
		}
		return false;
	},
	isWinWebKit : function(){
		return (navigator.userAgent.indexOf('Win')!=-1 && k.br.WebKit);
	},

	//---------------------------------------------------------------------------
	// mv.pointerX()      �C�x���g���N������X���W���擾����
	// mv.pointerY()      �C�x���g���N������Y���W���擾����
	// mv.isLeftClick()   ���N���b�N����
	// mv.isMiddleClick() ���N���b�N����
	// mv.isRightClick()  �E�N���b�N����
	// mv.notInputted()   �Ֆʂւ̓��͂��s��ꂽ���ǂ������肷��
	//---------------------------------------------------------------------------
	pointerX : function(event) {
		if(this.isWinWebKit()){ return event.pageX - 1;}
		return event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	},
	pointerY : function(event) {
		if(this.isWinWebKit()){ return event.pageY - 1;}
		return event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	},
	isLeftClick  : function(event) { return this.isButton(event, 0); },
	isMiddleClick: function(event) { return this.isButton(event, 1); },
	isRightClick : function(event) { return this.isButton(event, 2); },

	//notInputted : function(){ return (this.currentOpeCount==um.ope.length);},
	notInputted : function(){ return !um.changeflag;},

	//---------------------------------------------------------------------------
	// mv.inputcell() Cell��qans(�񓚃f�[�^)��0/1/2�̂����ꂩ����͂���B
	// mv.decIC()     0/1/2�ǂ����͂��ׂ��������肷��B
	//---------------------------------------------------------------------------
	inputcell : function(x,y){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 

		if(k.NumberIsWhite==1 && bd.QnC(cc)!=-1 && (this.inputData==1||(this.inputData==2 && pc.bcolor=="white"))){ return;}
		if(k.RBBlackCell==1 && this.inputData==1){
			if(this.firstPos.x == -1 && this.firstPos.y == -1){ this.firstPos = new Pos(bd.cell[cc].cx, bd.cell[cc].cy);}
			if((this.firstPos.x+this.firstPos.y) % 2 != (bd.cell[cc].cx+bd.cell[cc].cy) % 2){ return;}
		}

		bd.sQaC(cc, (this.inputData==1?1:-1));
		bd.sQsC(cc, (this.inputData==2?1:0));

		pc.paintCell(cc);
	},
	decIC : function(cc){
		if(menu.getVal('use')==1){
			if(this.btn.Left){ this.inputData=((bd.QaC(cc)!=1) ? 1 : 0); }
			else if(this.btn.Right){ this.inputData=((bd.QsC(cc)!=1) ? 2 : 0); }
		}
		else if(menu.getVal('use')==2){
			if(this.btn.Left){
				if(bd.QaC(cc) == 1) this.inputData=2;
				else if(bd.QsC(cc) == 1) this.inputData=0;
				else this.inputData=1;
			}
			else if(this.btn.Right){
				if(bd.QaC(cc) == 1) this.inputData=0;
				else if(bd.QsC(cc) == 1) this.inputData=1;
				else this.inputData=2;
			}
		}
	},
	//---------------------------------------------------------------------------
	// mv.inputqnum()  Cell��qnum(��萔���f�[�^)�ɐ�������͂���B
	// mv.inputqnum1() Cell��qnum(��萔���f�[�^)�ɐ�������͂���B
	// mv.inputqnum3() Cell��qans(��萔���f�[�^)�ɐ�������͂���B
	//---------------------------------------------------------------------------
	inputqnum : function(x,y,max){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell){ return;}

		if(cc==tc.getTCC()){
			cc = (k.mode==3 ? this.inputqnum3(cc,max) : this.inputqnum1(cc,max));
		}
		else{
			var cc0 = tc.getTCC();
			tc.setTCC(cc);

			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
		}
		this.mouseCell = cc;

		pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	inputqnum1 : function(cc,max){
		var qflag = (k.isDispHatena||k.puzzleid=="lightup"||k.puzzleid=="shakashaka"||k.puzzleid=="snakes"||k.puzzleid=="shugaku");
		if(k.isOneNumber){
			cc = room.getTopOfRoomByCell(cc);
			if(room.getCntOfRoomByCell(cc)<max){ max = room.getCntOfRoomByCell(cc);}
		}
		if(bd.roommaxfunc){ max = bd.roommaxfunc(cc,1);}

		if(this.btn.Left){
			if(bd.QnC(cc)==max){ bd.sQnC(cc,-1);}
			else if(bd.QnC(cc)==-1){ bd.sQnC(cc,(qflag?-2:(k.dispzero?0:1)));}
			else if(bd.QnC(cc)==-2){ bd.sQnC(cc,(k.dispzero?0:1));}
			else{ bd.sQnC(cc,bd.QnC(cc)+1);}
		}
		else if(this.btn.Right){
			if(bd.QnC(cc)==-1){ bd.sQnC(cc,max);}
			else if(bd.QnC(cc)==-2){ bd.sQnC(cc,-1);}
			else if(bd.QnC(cc)==(k.dispzero?0:1)){ bd.sQnC(cc,(qflag?-2:-1));}
			else{ bd.sQnC(cc,bd.QnC(cc)-1);}
		}
		if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
		if(k.isAnsNumber){ bd.sQaC(cc,-1); bd.sQsC(cc,0);}

		return cc;
	},
	inputqnum3 : function(cc,max){
		if(bd.QnC(cc)!=-1){ return cc;}
		if(bd.roommaxfunc){ max = bd.roommaxfunc(cc,3);}
		bd.sDiC(cc,0);

		if(this.btn.Left){
			if(k.NumberWithMB){
				if     (bd.QaC(cc)==max){ bd.sQaC(cc,-1); bd.sQsC(cc,1); return cc;}
				else if(bd.QsC(cc)==1)  { bd.sQaC(cc,-1); bd.sQsC(cc,2); return cc;}
				else if(bd.QsC(cc)==2)  { bd.sQaC(cc,-1); bd.sQsC(cc,0); return cc;}
			}
			if     (bd.QaC(cc)==max){ bd.sQaC(cc,-1);              }
			else if(bd.QaC(cc)==-1) { bd.sQaC(cc,(k.dispzero?0:1));}
			else                    { bd.sQaC(cc,bd.QaC(cc)+1);    }
		}
		else if(this.btn.Right){
			if(k.NumberWithMB){
				if     (bd.QsC(cc)==1) { bd.sQaC(cc,max); bd.sQsC(cc,0); return cc;}
				else if(bd.QsC(cc)==2) { bd.sQaC(cc,-1);  bd.sQsC(cc,1); return cc;}
				else if(bd.QaC(cc)==-1){ bd.sQaC(cc,-1);  bd.sQsC(cc,2); return cc;}
			}
			if     (bd.QaC(cc)==-1)              { bd.sQaC(cc,max);}
			else if(bd.QaC(cc)==(k.dispzero?0:1)){ bd.sQaC(cc,-1); }
			else                                 { bd.sQaC(cc,bd.QaC(cc)-1);}
		}
		return cc;
	},

	//---------------------------------------------------------------------------
	// mv.inputQues() Cell��ques�f�[�^��array�̂Ƃ���ɓ��͂���
	//---------------------------------------------------------------------------
	inputQues : function(x,y,array){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1){ return;}

		var flag=false;
		if(cc!=tc.getTCC() && k.puzzleid!="kramma" && k.puzzleid!="shwolf" && k.puzzleid!="mashu"){
			var cc0 = tc.getTCC();
			tc.setTCC(cc);
			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			flag = true;
		}
		else{
			if(this.btn.Left){
				for(var i=0;i<array.length-1;i++){
					if(!flag && bd.QuC(cc)==array[i]){ bd.sQuC(cc,array[i+1]); flag=true;}
				}
				if(!flag && bd.QuC(cc)==array[array.length-1]){ bd.sQuC(cc,array[0]); flag=true;}
			}
			else if(this.btn.Right){
				for(var i=array.length;i>0;i--){
					if(!flag && bd.QuC(cc)==array[i]){ bd.sQuC(cc,array[i-1]); flag=true;}
				}
				if(!flag && bd.QuC(cc)==array[0]){ bd.sQuC(cc,array[array.length-1]); flag=true;}
			}
		}

		if(flag){ pc.paintCell(cc);}
	},

	//---------------------------------------------------------------------------
	// mv.inputMB()   Cell��qsub(�⏕�L��)�́�, �~�f�[�^����͂���
	//---------------------------------------------------------------------------
	inputMB : function(x,y){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1){ return;}

		if(this.btn.Left){
			if     (bd.QsC(cc)==0){ bd.sQsC(cc, 1);}
			else if(bd.QsC(cc)==1){ bd.sQsC(cc, 2);}
			else{ bd.sQsC(cc, 0);}
		}
		else if(this.btn.Right){
			if     (bd.QsC(cc)==0){ bd.sQsC(cc, 2);}
			else if(bd.QsC(cc)==2){ bd.sQsC(cc, 1);}
			else{ bd.sQsC(cc, 0);}
		}
		pc.paintCell(cc);
	},

	//---------------------------------------------------------------------------
	// mv.inputdirec() Cell��direc(����)�̃f�[�^����͂���
	//---------------------------------------------------------------------------
	inputdirec : function(x,y){
		var pos = this.cellpos(new Pos(x,y));
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var inp = 0;
		var cc = bd.cnum(this.mouseCell.x, this.mouseCell.y);
		if(cc!=-1 && bd.QnC(cc)!=-1){
			if     (pos.y-this.mouseCell.y==-1){ inp=1;}
			else if(pos.y-this.mouseCell.y== 1){ inp=2;}
			else if(pos.x-this.mouseCell.x==-1){ inp=3;}
			else if(pos.x-this.mouseCell.x== 1){ inp=4;}
			else{ return;}

			bd.sDiC(cc, (bd.DiC(cc)!=inp?inp:0));

			pc.paintCell(cc);
		}
		this.mouseCell = pos;
	},

	//---------------------------------------------------------------------------
	// mv.inputtile()  ���^�C���A���^�C������͂���
	//---------------------------------------------------------------------------
	inputtile : function(x,y){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell || bd.QuC(cc)==51){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 
		var area = ans.searchRarea();
		var areaid = area.check[cc];

		for(var c=0;c<k.qcols*k.qrows;c++){
			if(area.check[c] == areaid && (this.inputData==1 || bd.QsC(c)!=3)){
				bd.sQaC(c, (this.inputData==1?1:-1));
				bd.sQsC(c, (this.inputData==2?1:0));
			}
		}

		var d = ans.getSizeOfArea(area,areaid,function(a){ return true;});

		pc.paint(d.x1, d.y1, d.x2, d.y2);
	},

	//---------------------------------------------------------------------------
	// mv.input51()   [�_]���������������肷��
	// mv.set51cell() [�_]���쐬�E��������Ƃ��̋��ʏ����֐�(�J�b�N���ȊO�̓I�[�o�[���C�h�����)
	//---------------------------------------------------------------------------
	input51 : function(x,y){
		var pos = this.cellpos(new Pos(x,y));
		var cc = bd.cnum(pos.x, pos.y);

		if((pos.x==-1 && pos.y>=-1 && pos.y<=k.qrows-1) || (pos.y==-1 && pos.x>=-1 && pos.x<=k.qcols-1)){
			var tcx=tc.getTCX(), tcy=tc.getTCY();
			tc.setTCP(new Pos(2*pos.x+1,2*pos.y+1));
			pc.paint(tcx-1,tcy-1,tcx,tcy);
			pc.paint(tc.getTCX()-1,tc.getTCY()-1,tc.getTCX(),tc.getTCY());
			return;
		}
		else if(cc!=-1 && cc!=tc.getTCC()){
			var tcx=tc.getTCX(), tcy=tc.getTCY();
			tc.setTCC(cc);
			pc.paint(tcx-1,tcy-1,tcx,tcy);
		}
		else if(cc!=-1){
			if(this.btn.Left){
				if(bd.QuC(cc)!=51){ this.set51cell(cc,true);}
				else{ kc.chtarget('shift');}
			}
			else if(this.btn.Right){ this.set51cell(cc,false);}
		}
		else{ return;}

		pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
	},
	// ���Ƃ肠�����J�b�N���p
	set51cell : function(cc,val){
		if(val==true){
			bd.sQuC(cc,51);
			bd.sQnC(cc,0);
			bd.sDiC(cc,0);
			bd.sQaC(cc,-1);
		}
		else{
			bd.sQuC(cc,0);
			bd.sQnC(cc,0);
			bd.sDiC(cc,0);
			bd.sQaC(cc,-1);
		}
	},

	//---------------------------------------------------------------------------
	// mv.inputcross()     Cross��ques(���f�[�^)��0�`4����͂���B
	// mv.inputcrossMark() Cross�̍��_����͂���B
	//---------------------------------------------------------------------------
	inputcross : function(x,y){
		var cc = this.crossid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell){ return;}

		if(cc==tc.getTXC()){
			if(this.btn.Left){
				if(bd.QnX(cc)==4){ bd.sQnX(cc,-2);}
				else{ bd.sQnX(cc,bd.QnX(cc)+1);}
			}
			else if(this.btn.Right){
				if(bd.QnX(cc)==-2){ bd.sQnX(cc,4);}
				else{ bd.sQnX(cc,bd.QnX(cc)-1);}
			}
		}
		else{
			var cc0 = tc.getTXC();
			tc.setTXC(cc);

			pc.paint(bd.cross[cc0].cx-1, bd.cross[cc0].cy-1, bd.cross[cc0].cx, bd.cross[cc0].cy);
		}
		this.mouseCell = cc;

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	inputcrossMark : function(x,y){
		var pos = this.crosspos(new Pos(x,y), 0.24);
		if(pos.x%2!=0 || pos.y%2!=0){ return;}
		if(pos.x<(k.isoutsidecross==1?0:2) || pos.x>(k.isoutsidecross==1?2*k.qcols:2*k.qcols-2)){ return;}
		if(pos.y<(k.isoutsidecross==1?0:2) || pos.y>(k.isoutsidecross==1?2*k.qrows:2*k.qrows-2)){ return;}

		var cc = bd.xnum(mf(pos.x/2),mf(pos.y/2));

		um.disCombine = 1;
		bd.sQnX(cc,(bd.QnX(cc)==1)?-1:1);
		um.disCombine = 0;

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//---------------------------------------------------------------------------
	// mv.inputborder() �Ֆʋ��E���̖��f�[�^����͂���
	// mv.inputborder() �Ֆʋ��E���̉񓚃f�[�^����͂���
	// mv.inputBD()     ��L��̋��ʏ����֐�
	//---------------------------------------------------------------------------
	inputborder : function(x,y){ this.inputBD(x,y,0);},
	inputborderans : function(x,y){ this.inputBD(x,y,1);},
	inputBD : function(x,y,flag){
		var pos = this.crosspos(new Pos(x,y), 0.35);
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = bd.bnum(pos.x, pos.y);
		if(id==-1 && this.mouseCell.x){ id = bd.bnum(this.mouseCell.x, this.mouseCell.y);}

		if(this.mouseCell!=-1 && id!=-1){
			if((pos.x%2==0 && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
			   (pos.y%2==0 && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
			{
				this.mouseCell=-1;

				if(this.inputData==-1){
					if     (flag==0){ this.inputData=(bd.QuB(id)==0?1:0);}
					else if(flag==1){ this.inputData=(bd.QaB(id)==0?1:0);}
				}

				if(flag==0){
					if(this.inputData!=-1){ bd.sQuB(id, this.inputData); bd.sQaB(id, 0);}
				}
				else if(flag==1 && bd.QuB(id)==0){
					if     (this.inputData==1){ bd.sQaB(id, 1); if(k.isborderAsLine){ bd.sQsB(id, 0);} }
					else if(this.inputData==0){ bd.sQaB(id, 0);}
				}
				pc.paintBorder(id);
			}
		}
		this.mouseCell = pos;
	},

	//---------------------------------------------------------------------------
	// mv.inputLine()     �Ֆʂ̐�����͂���
	// mv.inputQsubLine() �Ֆʂ̋��E���p�⏕�L������͂���
	// mv.inputLine1()    ��L��̋��ʏ����֐�
	// mv.inputLine2()    �Ֆʂ̐�����͗p�����֐�
	// mv.inputqsub2()    �E���p�⏕�L���̓��͗p�����֐�
	//---------------------------------------------------------------------------
	inputLine : function(x,y){ this.inputLine1(x,y,0);},
	inputQsubLine : function(x,y){ this.inputLine1(x,y,1);},
	inputLine1 : function(x,y,flag){
		var pos = this.cellpos(new Pos(x,y));
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = -1;
		if     (pos.y-this.mouseCell.y==-1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2  );}
		else if(pos.y-this.mouseCell.y== 1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2+2);}
		else if(pos.x-this.mouseCell.x==-1){ id=bd.bnum(this.mouseCell.x*2  ,this.mouseCell.y*2+1);}
		else if(pos.x-this.mouseCell.x== 1){ id=bd.bnum(this.mouseCell.x*2+2,this.mouseCell.y*2+1);}

		this.mouseCell = pos;
		if(this.inputData==2 || this.inputData==3){ this.inputpeke2(id);}
		else if(this.mouseCell!=-1 && id!=-1){
			if     (flag==0) this.inputLine2(id);
			else if(flag==1) this.inputqsub2(id);
		}
	},
	inputLine2 : function(id){
		if(this.inputData==-1){ this.inputData=(bd.LiB(id)==0?1:0);}
		if     (this.inputData==1){ bd.sLiB(id, 1); bd.sQsB(id, 0);}
		else if(this.inputData==0){ bd.sLiB(id, 0); bd.sQsB(id, 0);}
		pc.paintLine(id);
	},
	inputqsub2 : function(id){
		if(this.inputData==-1){ this.inputData=(bd.QsB(id)==0?1:0);}
		if     (this.inputData==1){ bd.sQsB(id, 1);}
		else if(this.inputData==0){ bd.sQsB(id, 0);}
		pc.paintLine(id);
	},

	//---------------------------------------------------------------------------
	// mv.inputpeke()   �Ֆʂ̐����ʂ�Ȃ����Ƃ������~����͂���
	// mv.inputpeke2()  �Ֆʂ̐����ʂ�Ȃ����Ƃ������~����͂���(inputLine1������Ă΂��)
	//---------------------------------------------------------------------------
	inputpeke : function(x,y){
		var pos = this.crosspos(new Pos(x,y), 0.22);
		var id = bd.bnum(pos.x, pos.y);
		if(id==-1 || (pos.x==this.mouseCell.x && pos.y==this.mouseCell.y)){ return;}

		this.mouseCell = pos;
		this.inputpeke2(id);
	},
	inputpeke2 : function(id){
		if(this.inputData==-1){ if(bd.QsB(id)==0){ this.inputData=2;}else{ this.inputData=3;} }
		if     (this.inputData==2){ if(k.isborderAsLine==0){ bd.sLiB(id, 0);}else{ bd.sQaB(id, 0);} bd.sQsB(id, 2);}
		else if(this.inputData==3){ if(k.isborderAsLine==0){ bd.sLiB(id, 0);}else{ bd.sQaB(id, 0);} bd.sQsB(id, 0);}
		pc.paintLine(id);
	},

	//---------------------------------------------------------------------------
	// mv.dispRed() �ЂƂȂ���̍��}�X��Ԃ��\������
	// mv.dr0()     �ЂƂȂ���̍��}�X��Ԃ��\������(�ċN�Ăяo���p�֐�)
	// mv.dispRedLine()      �ЂƂȂ���̐���Ԃ��\������
	// mv.LineListNotCross() �ЂƂȂ���̐����擾(�����Ȃ��o�[�W����)
	// mv.lc0()              �ЂƂȂ���̐����擾(���������E�ċA�Ăяo���p�֐�)
	//---------------------------------------------------------------------------
	dispRed : function(x,y){
		var cc = this.cellid(new Pos(x,y));
		this.mousereset();
		if(cc==-1 || cc==this.mouseCell || bd.QaC(cc)!=1){ return;}
		mv.dr0(function(c){ return (c!=-1 && bd.QaC(c)==1 && bd.ErC(c)==0);},cc,1);
		ans.errDisp = true;
		pc.paintAll();
	},
	dr0 : function(func, cc, num){
		if(bd.ErC(cc)!=0){ return;}
		bd.sErC([cc],num);
		if( func(bd.up(cc)) ){ this.dr0(func, bd.up(cc), num);}
		if( func(bd.dn(cc)) ){ this.dr0(func, bd.dn(cc), num);}
		if( func(bd.lt(cc)) ){ this.dr0(func, bd.lt(cc), num);}
		if( func(bd.rt(cc)) ){ this.dr0(func, bd.rt(cc), num);}
		return;
	},

	dispRedLine : function(x,y){
		var id = this.borderid(new Pos(x,y),!!k.isborderCross);
		if(id==this.mouseCell||id==-1){ return;}
		this.mouseCell = id;

		if(((k.isborderAsLine==0?bd.LiB:bd.QaB).bind(bd))(id)<=0){ return;}
		this.mousereset();

		var idlist = (k.isborderCross?ans.LineList:this.LineListNotCross.bind(this))(id);
		bd.sErB(bd.borders,2); bd.sErB(idlist,1);
		ans.errDisp = true;
		pc.paintAll();
	},
	LineListNotCross : function(id){
		var idlist = [id];
		var bx=bd.border[id].cx, by=bd.border[id].cy;
		if((k.isborderAsLine)^(bx%2==0)){ this.lc0(idlist,bx,by,3); this.lc0(idlist,bx,by,4);}
		else                            { this.lc0(idlist,bx,by,1); this.lc0(idlist,bx,by,2);}
		return idlist;
	},
	lc0 : function(idlist,bx,by,dir){
		var include  = function(array,val){ for(var i=0;i<array.length;i++){ if(array[i]==val) return true;} return false;};
		var func     = (k.isborderAsLine==0?bd.LiB:bd.QaB).bind(bd);
		var lcntfunc = (k.isborderAsLine==0?function(bx,by){ return ans.lcntCell(bd.cnum(mf(bx/2),mf(by/2)));}
										   :function(bx,by){ return bd.lcntCross(mf(bx/2),mf(by/2));});
		while(1){
			switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
			if((bx+by)%2==0){
				if(lcntfunc(bx,by)>=3){
					if(func(bd.bnum(bx,by-1))>0){ this.lc0(idlist,bx,by,1);}
					if(func(bd.bnum(bx,by+1))>0){ this.lc0(idlist,bx,by,2);}
					if(func(bd.bnum(bx-1,by))>0){ this.lc0(idlist,bx,by,3);}
					if(func(bd.bnum(bx+1,by))>0){ this.lc0(idlist,bx,by,4);}
					break;
				}
				else if(dir!=1 && func(bd.bnum(bx,by+1))>0){ dir=2;}
				else if(dir!=2 && func(bd.bnum(bx,by-1))>0){ dir=1;}
				else if(dir!=3 && func(bd.bnum(bx+1,by))>0){ dir=4;}
				else if(dir!=4 && func(bd.bnum(bx-1,by))>0){ dir=3;}
			}
			else{
				var id = bd.bnum(bx,by);
				if(include(idlist,id) || func(id)<=0){ break;}
				idlist.push(id);
			}
		}
	}
};