//
// �p�Y���ŗL�X�N���v�g�� �{�T�m���� bosanowa.js v3.2.0p1
//
Puzzles.bosanowa = function(){ };
Puzzles.bosanowa.prototype = {
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
		k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others"];

		//k.def_csize = 36;
		k.def_psize = 36;

		if(k.callmode=="pplay"){
			base.setExpression("�@�L�[�{�[�h��}�E�X�Ő��������͂ł��܂��B",
							   " It is available to input number by keybord or mouse.");
		}
		else{
			base.setExpression("�@�L�[�{�[�h�Ő�������сAW�L�[�Ő�������͂���}�X/���Ȃ��}�X�̐؂�ւ������o�܂��B",
							   " It is able to input number of question by keyboard, and 'W' key toggles cell that is able to be inputted number or not.");
		}
		base.setTitle("�{�T�m��","Bosanowa");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){
		pp.addUseToFlags('disptype','setting',1,[1,2,3]);
		pp.addUseChildrenToFlags('disptype','disptype');
		pp.setMenuStr('disptype', '�\���`��', 'Display');
		pp.setLabel  ('disptype', '�\���`��', 'Display');
		pp.setMenuStr('disptype_1', '�j�R�����ʌ`��', 'Original Type');
		pp.setMenuStr('disptype_2', '�q�ɔԌ`��', 'Sokoban Type');
		pp.setMenuStr('disptype_3', '�����^�C�`��', 'Waritai type');
		pp.funcs['disptype'] = function(){ pc.paintAll();};
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if     (k.mode==1) this.inputqnum_bosanowa(x,y);
			else if(k.mode==3) this.inputqnum_bosanowa(x,y);
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){ };

		mv.inputqnum_bosanowa = function(x,y){
			var pos = this.crosspos(new Pos(x,y),0.31);
			if(pos.x<tc.minx||pos.x>tc.maxx||pos.y<tc.miny||pos.y>tc.maxy){ return;}
			var tcp = tc.getTCP();

			if(pos.x==tcp.x&&pos.y==tcp.y){
				var max = 255;
				if(pos.x%2==1&&pos.y%2==1){
					var cc = bd.cnum(mf((pos.x-1)/2),mf((pos.y-1)/2));
					if(k.mode==1){
						if(this.btn.Left){
							if     (bd.QuC(cc)==0)       { this.setval(cc,-1); bd.sQuC(cc,7);}
							else if(this.getval(cc)==max){ this.setval(cc,-1); bd.sQuC(cc,0);}
							else if(this.getval(cc)==-1) { this.setval(cc, 1); bd.sQuC(cc,7);}
							else{ this.setval(cc,this.getval(cc)+1);}
						}
						else if(this.btn.Right){
							if     (bd.QuC(cc)==0)       { this.setval(cc,max); bd.sQuC(cc,7);}
							else if(this.getval(cc)== 1) { this.setval(cc, -1); bd.sQuC(cc,7);}
							else if(this.getval(cc)==-1) { this.setval(cc, -1); bd.sQuC(cc,0);}
							else{ this.setval(cc,this.getval(cc)-1);}
						}
					}
					if(k.mode==3 && bd.QuC(cc)==7){
						if(this.btn.Left){
							if     (this.getval(cc)==max){ this.setval(cc,-1);}
							else if(this.getval(cc)==-1) { this.setval(cc, 1);}
							else{ this.setval(cc,this.getval(cc)+1);}
						}
						else if(this.btn.Right){
							if     (this.getval(cc)==-1) { this.setval(cc,max);}
							else if(this.getval(cc)== 1) { this.setval(cc, -1);}
							else{ this.setval(cc,this.getval(cc)-1);}
						}
					}
				}
			}
			else{
				tc.setTCP(pos);
				pc.paint(mf(tcp.x/2)-1,mf(tcp.y/2)-1,mf(tcp.x/2)+1,mf(tcp.y/2)+1);
			}
			pc.paint(mf(pos.x/2)-1,mf(pos.y/2)-1,mf(pos.x/2)+1,mf(pos.y/2)+1);
		};
		mv.setval = function(cc,val){
			if     (k.mode==1){ bd.sQnC(cc,val);}
			else if(k.mode==3){ bd.sQaC(cc,val);}
		};
		mv.getval = function(cc){
			if     (k.mode==1){ return bd.QnC(cc);}
			else if(k.mode==3){ return bd.QaC(cc);}
			return -1;
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTBorder(ca)){ return;}
			this.key_inputqnum_bosanowa(ca);
		};
		kc.key_inputqnum_bosanowa = function(ca){
			var tcp = tc.getTCP();
			if(tcp.x%2==1&&tcp.y%2==1){
				var cc = tc.getTCC();
				if(k.mode==1 && ca=='w'){ bd.sQuC(cc,(bd.QuC(cc)!=7?7:0)); bd.sQnC(cc,-1); bd.sQaC(cc,-1);}
				else if(bd.QuC(cc)==7 && (k.mode==3 || '0'<=ca && ca<='9')){ this.key_inputqnum(ca,255);}
				else if(k.mode==1 && '0'<=ca && ca<='9'){ bd.sQuC(cc,7); bd.sQnC(cc,-1); this.key_inputqnum(ca,255);}
				else if(k.mode==1 && (ca=='-'||ca==' ')){ bd.sQuC(cc,7); bd.sQnC(cc,-1);}
				else{ return false;}
			}
			else if((tcp.x+tcp.y)%2==1){
				var id = tc.getTBC();
				var cc1=bd.cc1(id), cc2=bd.cc2(id);
				if((cc1==-1||bd.QuC(cc1)!=7)||(cc2==-1||bd.QuC(cc2)!=7)){ return false;}
				if('0'<=ca && ca<='9'){
					var num = parseInt(ca);
					var max = 99;

					if(bd.QsB(id)<=0 || this.prev!=id){ if(num<=max){ bd.sQsB(id,num);}}
					else{
						if(bd.QsB(id)*10+num<=max){ bd.sQsB(id,bd.QsB(id)*10+num);}
						else if(num<=max){ bd.sQsB(id,num);}
					}
					this.prev=id;
				}
				else if(ca=='-'||ca==' '){ bd.sQsB(id,-1);}
				else{ return false;}
			}
			else{ return false;}

			pc.paint(mf(tcp.x/2)-1,mf(tcp.y/2)-1,mf(tcp.x/2)+1,mf(tcp.y/2)+1);
			return true;
		};

		tc.cursolx = k.qcols-1-k.qcols%2;
		tc.cursoly = k.qrows-1-k.qrows%2;
		if(k.callmode=="pmake"){ bd.sQuC(tc.getTCC(),7);}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(64, 64, 64)";
		pc.errbcolor1 = "rgb(255, 192, 192)";

		pc.borderfontcolor = "blue";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			if(menu.getVal('disptype')==2){ this.drawChassis_souko(x1,y1,x2,y2);}
			if(menu.getVal('disptype')==3){ this.drawChassis_waritai(x1,y1,x2,y2);}
			if(menu.getVal('disptype')!=1){ this.drawBorders_bosanowa(x1,y1,x2,y2);}

			if(menu.getVal('disptype')==1){
				this.drawErrorCells(x1,y1,x2,y2);
				this.drawCircles(x1,y1,x2,y2);
				this.drawBDnumbase(x1,y1,x2,y2);
			}
			else{
				this.drawBDnumbase(x1,y1,x2,y2);
				this.drawErrorCells(x1,y1,x2,y2);
			}

			this.drawNumbers(x1,y1,x2,y2);
			this.drawNumbersBD(x1,y1,x2,y2);

			if(k.callmode=="pmake"){ this.drawChassis_bosanowa(x1,y1,x2,y2);}

			if(tc.cursolx%2==0||tc.cursoly%2==0){ this.drawTBorder(x1-1,y1-1,x2+1,y2+1);}else{ this.hideTBorder();}
			if(tc.cursolx%2==1&&tc.cursoly%2==1){ this.drawTCell(x1-1,y1-1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawBorders_bosanowa = function(x1,y1,x2,y2){
			var idlist = this.borderinside(x1*2-4,y1*2-4,x2*2+4,y2*2+4,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i], cc1=bd.cc1(id), cc2=bd.cc2(id);

				this.vhide(["b"+id+"_bd_", "b"+id+"_bds_"]);
				if(menu.getVal('disptype')==3){
					if((cc1!=-1&&bd.QuC(cc1)==7) ^(cc2!=-1&&bd.QuC(cc2)==7)){ this.drawBorder1(id,true);}
					else if((cc1!=-1&&bd.QuC(cc1)==7)&&(cc2!=-1&&bd.QuC(cc2)==7)){
						g.fillStyle=this.BDlinecolor;
						if(this.vnop("b"+id+"_bds_",1)){
							if     (bd.border[id].cy%2==1){ g.fillRect(bd.border[id].px()               , bd.border[id].py()-mf(k.cheight/2), 1         , k.cheight+1);}
							else if(bd.border[id].cx%2==1){ g.fillRect(bd.border[id].px()-mf(k.cwidth/2), bd.border[id].py()                , k.cwidth+1, 1          );}
						}
					}
				}
				else if(menu.getVal('disptype')==2){
					if((cc1!=-1&&bd.QuC(cc1)==7)&&(cc2!=-1&&bd.QuC(cc2)==7)){
						g.fillStyle="rgb(127,127,127)";
						if(g.vml){
							if(this.vnop("b"+id+"_bds_",1)){
								if     (bd.border[id].cy%2==1){ g.fillRect(bd.border[id].px()               , bd.border[id].py()-mf(k.cheight/2), 1         , k.cheight+1);}
								else if(bd.border[id].cx%2==1){ g.fillRect(bd.border[id].px()-mf(k.cwidth/2), bd.border[id].py()                , k.cwidth+1, 1          );}
							}
						}
						else{
							var dotmax = mf(k.cwidth/10)+3;
							var dotCount = (mf(k.cwidth/dotmax)>=1?mf(k.cwidth/dotmax):1);
							var dotSize  = k.cwidth/(dotCount*2);
							if     (bd.border[id].cy%2==1){ 
								for(var j=0;j<k.cheight+1;j+=(2*dotSize)){ g.fillRect(bd.border[id].px(), mf(bd.border[id].py()-k.cheight/2+j), 1, mf(dotSize));}
							}
							else if(bd.border[id].cx%2==1){ 
								for(var j=0;j<k.cwidth+1 ;j+=(2*dotSize)){ g.fillRect(mf(bd.border[id].px()-k.cwidth/2+j), bd.border[id].py(), mf(dotSize), 1);}
							}
						}
					}
				}
			}
			this.vinc();
		};
		pc.drawCircles = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.45;
			var rsize2 = k.cwidth*0.42;

			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QuC(c)==7 && bd.QnC(c)==-1 && bd.QaC(c)==-1){
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
			}
			this.vinc();
		};

		pc.drawBDnumbase = function(x1,y1,x2,y2){
			var csize = k.cwidth*0.20;
			var idlist = this.borderinside(x1*2-4,y1*2-4,x2*2+6,y2*2+6,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i], cc1=bd.cc1(id), cc2=bd.cc2(id);

				if((menu.getVal('disptype')==3 || bd.QsB(id)>=0)&&((cc1!=-1&&bd.QuC(cc1)==7)&&(cc2!=-1&&bd.QuC(cc2)==7))){
					g.fillStyle = "white";
					if(this.vnop("b"+id+"_bbse_",1)){ g.fillRect(bd.border[id].px()-csize, bd.border[id].py()-csize, 2*csize+1, 2*csize+1);}
				}
				else{ this.vhide("b"+id+"_bbse_");}
			}
		};

		pc.getNumberColor = function(cc){	//�I�[�o�[���C�h
			if(bd.ErC(cc)==1 || bd.ErC(cc)==4){ return this.fontErrcolor;   }
			else if(bd.QnC(cc)!=-1){ return this.fontcolor;      }
			else if(bd.QaC(cc)!=-1){ return this.fontAnscolor;   }
			return this.fontcolor;
		};
		pc.drawNumbersBD = function(x1,y1,x2,y2){
			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
			for(var i=0;i<idlist.length;i++){
				var id=idlist[i];
				if(bd.QsB(id)>=0){
					if(!bd.border[id].numobj){ bd.border[id].numobj = this.CreateDOMAndSetNop();}
					this.dispnumBorder1(id, bd.border[id].numobj, 101, ""+bd.QsB(id), 0.35 ,this.borderfontcolor);
				}
				else if(bd.border[id].numobj){ bd.border[id].numobj.get(0).style.display = 'none';}
			}
			this.vinc();
		};

		pc.drawChassis_waritai = function(x1,y1,x2,y2){
			g.fillStyle = pc.Cellcolor;
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QuC(c)!=7){ continue;}
				this.drawBorder1x(0                , 2*bd.cell[c].cy+1,(bd.cell[c].cx==0)        );
				this.drawBorder1x(2*k.qcols        , 2*bd.cell[c].cy+1,(bd.cell[c].cx==k.qcols-1));
				this.drawBorder1x(2*bd.cell[c].cx+1, 0                ,(bd.cell[c].cy==0)        );
				this.drawBorder1x(2*bd.cell[c].cx+1, 2*k.qrows        ,(bd.cell[c].cy==k.qrows-1));
			}
			this.vinc();
		};
		pc.drawChassis_souko = function(x1,y1,x2,y2){
			for(var cx=x1-1;cx<=x2+1;cx++){
				for(var cy=y1-1;cy<=y2+1;cy++){
					var c=bd.cnum(cx,cy);
					if( (c==-1 || bd.QuC(c)!=7) && (
						bd.QuC(bd.cnum(cx-1,cy  ))==7 || bd.QuC(bd.cnum(cx+1,  cy))==7 || 
						bd.QuC(bd.cnum(cx  ,cy-1))==7 || bd.QuC(bd.cnum(cx  ,cy+1))==7 || 
						bd.QuC(bd.cnum(cx-1,cy-1))==7 || bd.QuC(bd.cnum(cx+1,cy-1))==7 || 
						bd.QuC(bd.cnum(cx-1,cy+1))==7 || bd.QuC(bd.cnum(cx+1,cy+1))==7 ) )
					{
						g.fillStyle = "rgb(127,127,127)";
						if(this.vnop("bx"+cx+"y"+cy+"_full_",1)){ g.fillRect(k.p0.x+k.cwidth*cx, k.p0.y+k.cheight*cy, k.cwidth, k.cheight);}
					}
					else{ this.vhide(["bx"+cx+"y"+cy+"_full_"]);}
				}
			}
			this.vinc();
		};
		pc.drawChassis_bosanowa = function(x1,y1,x2,y2){
			x1--; y1--; x2++; y2++;
			if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
			if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

			g.fillStyle = "black";
			if(x1<1)         { if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+y1*k.cheight    , 1, (y2-y1+1)*k.cheight+1);} }
			if(y1<1)         { if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+y1*k.cheight    , (x2-x1+1)*k.cwidth+1, 1); } }
			if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+(y2+1)*k.cheight, (x2-x1+1)*k.cwidth+1, 1); } }
			if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth, k.p0.y+y1*k.cheight    , 1, (y2-y1+1)*k.cheight+1);} }
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBoard(bstr);
				bstr = this.decodeNumber16(bstr);

				if     (this.checkpflag("h")){ menu.setVal('disptype',2);}
				else if(this.checkpflag("t")){ menu.setVal('disptype',3);}
			}
		};

		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata(0);}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata(1);}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata(0);}
		};
		enc.pzldata = function(type){
			return this.encodeBosanowa();
		};

		//---------------------------------------------------------
		enc.decodeBoard = function(bstr,type){
			for(var i=0;i<bstr.length;i++){
				var num = parseInt(bstr.charAt(i),32);
				for(var w=0;w<5;w++){ if((i*5+w)<bd.cell.length){ bd.sQuC(i*5+w,(num&Math.pow(2,4-w)?0:7));} }
				if((i*5+5)>=k.qcols*k.qrows){ break;}
			}
			return bstr.substring(i+1,bstr.length);
		};
		enc.encodeBosanowa = function(type){
			var x1=9999, x2=-1, y1=9999, y2=-1;
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QuC(c)!=7){ continue;}
				if(x1>bd.cell[c].cx){ x1=bd.cell[c].cx;}
				if(x2<bd.cell[c].cx){ x2=bd.cell[c].cx;}
				if(y1>bd.cell[c].cy){ y1=bd.cell[c].cy;}
				if(y2<bd.cell[c].cy){ y2=bd.cell[c].cy;}
			}

			var cm="", count=0, pass=0;
			for(var cy=y1;cy<=y2;cy++){
				for(var cx=x1;cx<=x2;cx++){
					var c=bd.cnum(cx,cy);
					if(bd.QuC(c)==0){ pass+=Math.pow(2,4-count);}
					count++; if(count==5){ cm += pass.toString(32); count=0; pass=0;}
				}
			}
			if(count>0){ cm += pass.toString(32);}

			count=0;
			for(var cy=y1;cy<=y2;cy++){
				for(var cx=x1;cx<=x2;cx++){
					var pstr = "";
					var val = bd.QnC(bd.cnum(cx,cy));

					if     (val==-2         ){ pstr = ".";}
					else if(val>= 0&&val< 16){ pstr =       val.toString(16);}
					else if(val>=16&&val<256){ pstr = "-" + val.toString(16);}
					else{ count++;}

					if(count==0){ cm += pstr;}
					else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
				}
			}
			if(count>0){ cm+=(15+count).toString(36);}

			var pzlflag="";
			if     (menu.getVal('disptype')==2){ pzlflag="/h";}
			else if(menu.getVal('disptype')==3){ pzlflag="/t";}

			return ""+pzlflag+"/"+(x2-x1+1)+"/"+(y2-y1+1)+"/"+cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<4*k.qrows-1){ return false;}
			this.decodeCell( function(c,ca){
				if(ca!="."){ bd.sQuC(c, 7);}
				if(ca!="0"&&ca!="."){ bd.sQnC(c, parseInt(ca));}
			},array.slice(0,k.qrows));
			this.decodeCell( function(c,ca){
				if(ca!="0"&&ca!="."){ bd.sQaC(c, parseInt(ca));}
			},array.slice(k.qrows,2*k.qrows));
			this.decodeBorder( function(id,ca){
				if(ca!="."){ bd.sQsB(id, parseInt(ca));}
			},array.slice(2*k.qrows,4*k.qrows-1));
			return true;
		};
		fio.encodeOthers = function(){
			return this.encodeCell(function(c){
				if(bd.QuC(c)!=7){ return ". ";}
				if(bd.QnC(c)< 0){ return "0 ";}
				else{ return ""+bd.QnC(c).toString()+" ";}
			})+this.encodeCell( function(c){
				if(bd.QuC(c)!=7 || bd.QnC(c)!=-1){ return ". ";}
				if(bd.QaC(c)< 0){ return "0 ";}
				else{ return ""+bd.QaC(c).toString()+" ";}
			})+this.encodeBorder( function(id){
				var cc1=bd.cc1(id), cc2=bd.cc2(id);
				if((cc1==-1||bd.QuC(cc1)!=7)||(cc2==-1||bd.QuC(cc2)!=7)){ return ". ";}
				if(bd.QsB(id)==-1){ return ". ";}
				else{ return ""+bd.QsB(id).toString()+" ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkNumbers() ){
				this.setAlert('�����Ƃ��ׂ̗̐����̍��̍��v�������Ă��܂���B', 'Sum of the differences between the number and adjacent numbers is not equal to the number.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)==7 && bd.QnC(c)==-1 && bd.QaC(c)==-1);}) ){
				this.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (bd.QuC(c)==7 && bd.QnC(c)==-1 && bd.QaC(c)==-1);});};

		ans.getNum = function(cc){
			if(cc<0||cc>=bd.cell.length){ return -1;}
			if(bd.QnC(cc)!=-1){ return bd.QnC(cc);}
			return bd.QaC(cc);
		};
		ans.checkNumbers = function(){
			for(var c=0;c<bd.cells.length;c++){
				if(bd.QuC(c)!=7||this.getNum(c)==-1){ continue;}
				var sum=0, cc=-1;
				var cc=bd.up(c); if(cc!=-1&&bd.QuC(cc)==7){ if(this.getNum(cc)!=-1){ sum+=Math.abs(this.getNum(c)-this.getNum(cc)); }else{ continue;} }
				var cc=bd.dn(c); if(cc!=-1&&bd.QuC(cc)==7){ if(this.getNum(cc)!=-1){ sum+=Math.abs(this.getNum(c)-this.getNum(cc)); }else{ continue;} }
				var cc=bd.lt(c); if(cc!=-1&&bd.QuC(cc)==7){ if(this.getNum(cc)!=-1){ sum+=Math.abs(this.getNum(c)-this.getNum(cc)); }else{ continue;} }
				var cc=bd.rt(c); if(cc!=-1&&bd.QuC(cc)==7){ if(this.getNum(cc)!=-1){ sum+=Math.abs(this.getNum(c)-this.getNum(cc)); }else{ continue;} }

				if(this.getNum(c)!=sum){ bd.sErC([c],1); return false;}
			}
			return true;
		};
	}
};