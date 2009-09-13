//
// �p�Y���ŗL�X�N���v�g�� �^�e�{�[���R�{�[�� tateyoko.js v3.2.0p2
//
Puzzles.tateyoko = function(){ };
Puzzles.tateyoko.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
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
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		if(k.callmode=="pplay"){
			base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Right Click to input a cross.");
		}
		else{
			base.setExpression("�@���}�X��Q�L�[�œ��͂ł��܂��B�����̓L�[�{�[�h�y�у}�E�X�œ��͂ł��܂��B",
							   " Press Q key to input black cells. It is available to input number by keybord or mouse.");
		}
		base.setTitle("�^�e�{�[���R�{�[","Tatebo-Yokobo");
		base.setFloatbgcolor("rgb(96, 255, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1 && !kp.enabled()){ this.inputqnum(x,y,99);}
			else if(k.mode==3){ this.inputTateyoko(x,y);}
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted() && kp.enabled()){ kp.display(x,y);}
			else if(k.mode==3 && this.notInputted()){ this.clickTateyoko(x,y);}
		};
		mv.mousemove = function(x,y){
			if(k.mode==3){ this.inputTateyoko(x,y);}
		};
		mv.inputTateyoko = function(x,y){
			var pos = this.crosspos(new Pos(x,y),0.30);
			var cc  = this.cellid(new Pos(x,y));
			if(cc==-1){ return;}
			if(this.mouseCell==-1 || bd.QuC(cc)==1){ this.firstPos = pos; this.mouseCell = cc; return;}
			if(pos.x==this.firstPos.x && pos.y==this.firstPos.y && cc==this.mouseCell){ return;}

			if(this.inputData==-1){
				if     (Math.abs(pos.y-this.firstPos.y)==1){ this.inputData=1;}
				else if(Math.abs(pos.x-this.firstPos.x)==1){ this.inputData=2;}
				if(bd.QaC(cc)==this.inputData){ this.inputData=0;}
			}
			else{
				if     (this.inputData!=1 && Math.abs(pos.y-this.firstPos.y)==1){ return;}
				else if(this.inputData!=2 && Math.abs(pos.x-this.firstPos.x)==1){ return;}
			}

			if(bd.QaC(cc)!=this.inputData){ bd.sQaC(cc,(this.inputData!=0?this.inputData:-1));}

			this.firstPos = pos;
			this.mouseCell = cc;
			pc.paintCell(cc);
		};
		mv.clickTateyoko = function(x,y){
			var cc  = this.cellid(new Pos(x,y));
			if(cc==-1 || bd.QuC(cc)==1){ return;}

			if(this.btn.Left){
				if     (bd.QaC(cc)==-1){ bd.sQaC(cc, 1);}
				else if(bd.QaC(cc)== 1){ bd.sQaC(cc, 2);}
				else                   { bd.sQaC(cc,-1);}
			}
			else if(this.btn.Right){
				if     (bd.QaC(cc)==-1){ bd.sQaC(cc, 2);}
				else if(bd.QaC(cc)== 1){ bd.sQaC(cc,-1);}
				else                   { bd.sQaC(cc, 1);}
			}
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			if(this.key_inputqnum_tateyoko(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.key_inputqnum_tateyoko = function(ca){
			var cc = tc.getTCC();
			if(ca=='q'||ca=='q1'||ca=='q2'){
				if(ca=='q'){ ca = (bd.QuC(cc)!=1?'q1':'q2');}
				if(ca=='q1'){
					bd.sQuC(cc, 1);
					bd.sQaC(cc,-1);
					if(bd.QnC(cc)>4){ bd.sQnC(cc,-1);}
				}
				else if(ca=='q2'){ bd.sQuC(cc, 0);}
			}
			else{ return false;}
			this.prev=cc;
			pc.paintCell(cc);
			return true;
		};

		if(k.callmode == "pmake"){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knumq1','q1','��');
				this.inputcol('num','knumq2','q2','��');
				this.inputcol('empty','knumx','','');
				this.inputcol('empty','knumy','','');
				this.insertrow();
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.insertrow();
				this.inputcol('num','knum5','5','5');
				this.inputcol('num','knum6','6','6');
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.insertrow();
				this.inputcol('num','knum9','9','9');
				this.inputcol('num','knum0','0','0');
				this.inputcol('num','knum_','-','?');
				this.inputcol('num','knum.',' ',' ');
				this.insertrow();
			};
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.kpinput = function(ca){
				kc.key_inputqnum_tateyoko(ca);
			};
		}

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			if(type>=3 && type<=4){ // ��]����
				for(var c=0;c<bd.cell.length;c++){ if(bd.QaC(c)!=-1){ bd.sQaC(c,{1:2,2:1}[bd.QaC(c)]); } }
			}
			um.enableRecord();
		};
		bd.roommaxfunc = function(cc,mode){ return (bd.QuC(cc)==1?4:Math.max(k.qcols,k.qrows));};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.linecolor = "rgb(0,191,0)";
		pc.errbcolor1 = "rgb(255,127,127)";
		pc.errbcolor2 = "white";

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);

			this.drawTateyokos(x1,y1,x2,y2)

			this.drawNumbers_tateyoko(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawTateyokos = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,function(c){ return (bd.QaC(c)!=0);});
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				var lw = (mf(k.cwidth/6)>=3?mf(k.cwidth/6):3); //LineWidth
				var lp = mf((k.cwidth-lw)/2); //LinePadding

				if     (bd.ErC(c)==1||bd.ErC(c)==4){ g.fillStyle = this.errlinecolor1; lw++;}
				else if(bd.ErC(c)==2){ g.fillStyle = this.errlinecolor2;}
				else{ g.fillStyle = this.linecolor;}

				if(bd.QaC(c)==1){
					if(this.vnop("c"+c+"_bar1_",1)){ g.fillRect(bd.cell[c].px()+lp, bd.cell[c].py(), lw, k.cheight+1);}
					this.vhide("c"+c+"_bar2_");
				}
				else if(bd.QaC(c)==2){
					if(this.vnop("c"+c+"_bar2_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py()+lp, k.cwidth+1, lw);}
					this.vhide("c"+c+"_bar1_");
				}
				else{ this.vhide(["c"+c+"_bar1_","c"+c+"_bar2_"]);}
			}
			this.vinc();
		};

		pc.drawNumbers_tateyoko = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QuC(c)==1){
					if(bd.ErC(c)==1){ g.fillStyle = this.errcolor1;}
					else{ g.fillStyle = this.Cellcolor;}

					if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth+1, k.cheight+1);}
				}
				else{ this.vhide("c"+c+"_full_");}

				var num = bd.QnC(c);
				if(num==-1){ if(bd.cell[c].numobj){ bd.cell[c].numobj.hide();} continue;}
				if(!bd.cell[c].numobj){ bd.cell[c].numobj = this.CreateDOMAndSetNop();}

				var color = this.fontcolor;
				if(bd.QuC(c)==1){ color = "white";}
				this.dispnumCell1(c, bd.cell[c].numobj, 1, (num!=-2?""+num:"?"), (num<10?0.8:0.75), color);
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeTateyoko(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeTateyoko();
		};

		enc.decodeTateyoko = function(bstr){
			var c=0, i=0;
			for(i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if     (ca=='o'){ bd.sQuC(c,1); bd.sQnC(c,0); c++;}
				else if(ca=='p'){ bd.sQuC(c,1); bd.sQnC(c,1); c++;}
				else if(ca=='q'){ bd.sQuC(c,1); bd.sQnC(c,2); c++;}
				else if(ca=='r'){ bd.sQuC(c,1); bd.sQnC(c,3); c++;}
				else if(ca=='s'){ bd.sQuC(c,1); bd.sQnC(c,4); c++;}
				else if(ca=='x'){ bd.sQuC(c,1); c++;}
				else if(this.include(ca,"0","9")||this.include(ca,"a","f")){ bd.sQnC(c,parseInt(ca,16)); c++;}
				else if(ca=="-"){ bd.sQnC(c,parseInt(bstr.substring(i+1,i+3),16)); c++; i+=2;}
				else if(ca=="i"){ c+=(parseInt(bstr.charAt(i+1),16)); i++;}
				else{ c++;}

				if(c>=bd.cell.length){ break;}
			}
			return bstr.substring(i,bstr.length);
		};
		enc.encodeTateyoko = function(type){
			var cm="", count=0;
			for(var c=0;c<bd.cell.length;c++){
				var pstr="";
				if(bd.QuC(c)==0){
					if     (bd.QnC(c)==-1){ count++;}
					else if(bd.QnC(c)==-2){ pstr=".";}
					else if(bd.QnC(c)< 16){ pstr="" +bd.QnC(c).toString(16);}
					else if(bd.QnC(c)<256){ pstr="-"+bd.QnC(c).toString(16);}
					else{ pstr=""; count++;}
				}
				else if(bd.QuC(c)==1){
					if(bd.QnC(c)==-1||bd.QnC(c)==-2){ pstr="x";}
					else if(bd.QnC(c)==0){ pstr="o";}
					else if(bd.QnC(c)==1){ pstr="p";}
					else if(bd.QnC(c)==2){ pstr="q";}
					else if(bd.QnC(c)==3){ pstr="r";}
					else if(bd.QnC(c)==4){ pstr="s";}
					else{ pstr="x";}
				}

				if(count==0){ cm+=pstr;}
				else if(pstr!=""){
					if(count==1){ cm+=("n"+pstr); count=0;}
					else{ cm+=("i"+count.toString(16)+pstr); count=0;}
				}
				else if(count==15){ cm+="if"; count=0;}
			}
			if(count==1){ cm+="n";}
			else if(count>1){ cm+=("i"+count.toString(16));}

			return cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<2*k.qrows){ return false;}
			this.decodeCell( function(c,ca){
				if     (ca=="?"){ bd.sQnC(c,-2);}
				else if(ca>="a"&&ca<='f'){ bd.sQuC(c,1); bd.sQnC(c,{a:1,b:2,c:3,d:4,e:0,f:-1}[ca]);}
				else if(ca!="."){ bd.sQnC(c, parseInt(ca));}
			},array.slice(0,k.qrows));
			this.decodeCell( function(c,ca){
				if     (ca=="0"){ bd.sQaC(c,-1);}
				else if(ca!="."){ bd.sQaC(c,parseInt(ca));}
			},array.slice(k.qrows,2*k.qrows));
			return true;
		};
		fio.encodeOthers = function(){
			return (""+this.encodeCell( function(c){
				if(bd.QuC(c)==1){
					if(bd.QnC(c)==-1||bd.QnC(c)==-2){ return "f ";}
					else{ return {0:"e ",1:"a ",2:"b ",3:"c ",4:"d "}[bd.QnC(c)];}
				}
				else if(bd.QnC(c)>= 0){ return ""+bd.QnC(c).toString()+" ";}
				else if(bd.QnC(c)==-2){ return "? ";}
				else{ return ". ";}
			}) + this.encodeCell( function(c){
				if     (bd.QuC(c)==1 ){ return ". ";}
				else if(bd.QaC(c)==-1){ return "0 ";}
				else{ return ""+bd.QaC(c).toString()+" ";}
			} ));
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkBCell(1) ){
				this.setAlert('���}�X�Ɍq������̐�������������܂���B','The number of lines connected to a black cell is wrong.'); return false;
			}

			bd.sErC(bd.cells,2);
			var barea = this.generateArea();
			if( !this.checkQnumsInArea(barea, function(a){ return (a>=2);}) ){
				this.setAlert('1�̖_��2�ȏ�̐����������Ă��܂��B','A line passes plural numbers.'); return false;
			}

			if( !this.checkNumberAndSize(barea) ){
				this.setAlert('�����Ɩ_�̒������Ⴂ�܂��B','The number is different from the length of line.'); return false;
			}
			bd.sErC(bd.cells,0);

			if( !this.checkBCell(2) ){
				this.setAlert('���}�X�Ɍq������̐�������������܂���B','The number of lines connected to a black cell is wrong.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)==0 && bd.QaC(c)==-1);}) ){
				this.setAlert('���������Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (bd.QuC(c)==0 && bd.QaC(c)==-1);});};

		ans.checkBCell = function(type){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QuC(c)==1 && bd.QnC(c)>=0){
					var cnt1=0, cnt2=0;
					if(bd.QaC(bd.up(c))==1){ cnt1++;} else if(bd.up(c)==-1 || bd.QaC(bd.up(c))==2){ cnt2++;}
					if(bd.QaC(bd.dn(c))==1){ cnt1++;} else if(bd.dn(c)==-1 || bd.QaC(bd.dn(c))==2){ cnt2++;}
					if(bd.QaC(bd.lt(c))==2){ cnt1++;} else if(bd.lt(c)==-1 || bd.QaC(bd.lt(c))==1){ cnt2++;}
					if(bd.QaC(bd.rt(c))==2){ cnt1++;} else if(bd.rt(c)==-1 || bd.QaC(bd.rt(c))==1){ cnt2++;}
					if((type==1 && (bd.QnC(c)>4-cnt2 || bd.QnC(c)<cnt1)) || (type==2 && bd.QnC(c)!=cnt1)){
						bd.sErC([c],1);
						return false;
					}
				}
			}
			return true;
		};
		ans.generateArea = function(){
			var area = new AreaInfo();
			for(var c=0;c<bd.cell.length;c++){ area.check[c]=(bd.QuC(c)==1 || bd.QaC(c)==-1?-1:0);}
			for(var c=0;c<bd.cell.length;c++){
				if(area.check[c]!=0){ continue;}
				var cx=bd.cell[c].cx, cy=bd.cell[c].cy, val=bd.QaC(c);

				area.max++;
				area.room[area.max] = new Array();
				while(bd.QaC(bd.cnum(cx,cy))==val){
					area.room[area.max].push(bd.cnum(cx,cy));
					area.check[bd.cnum(cx,cy)]=area.max;
					if(val==1){ cy++;}else{ cx++;}
				}
			}
			return area;
		};
	}
};