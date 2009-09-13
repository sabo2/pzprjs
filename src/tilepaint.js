//
// �p�Y���ŗL�X�N���v�g�� �^�C���y�C���g�� tilepaint.js v3.2.0
//
Puzzles.tilepaint = function(){ };
Puzzles.tilepaint.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 1;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
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

		k.fstruct = ["arearoom", "cellqnum51", "others"];

		//k.def_csize = 36;
		k.def_psize = 40;

		if(k.callmode=="pplay"){
			base.setExpression("�@���N���b�N�ō��^�C�����A�E�N���b�N�Ŕ��^�C���m��^�C�������͂ł��܂��B",
							   " Left Click to input black tile, Right Click to determined white tile.");
		}
		else{
			base.setExpression("�@���N���b�N�ŋ��E���␔���̃u���b�N���A�E�N���b�N�ŉ��G�����͂ł��܂��B��������͂���ꏊ��SHIFT�L�[�������Ɛ؂�ւ����܂��B",
							   " Left Click to input border lines or number block, Right Click to paint a design. Press SHIFT key to change the side of inputting numbers.");
		}
		base.setTitle("�^�C���y�C���g","TilePaint");
		base.setFloatbgcolor("rgb(96, 96, 96)");
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
				if     (this.btn.Left)  this.inputborder(x,y);
				else if(this.btn.Right) this.inputBGcolor1(x,y);
			}
			else if(k.mode==3) this.inputtile(x,y);
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted()){
				if(!kp.enabled()){ this.input51(x,y);}
				else{ kp.display(x,y);}
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){
				if     (this.btn.Left)  this.inputborder(x,y);
				else if(this.btn.Right) this.inputBGcolor1(x,y);
			}
			else if(k.mode==3) this.inputtile(x,y);
		};
		mv.set51cell = function(cc,val){
			if(val==true){
				bd.sQuC(cc,51);
				bd.sQnC(cc, 0);
				bd.sDiC(cc, 0);
				bd.sQaC(cc,-1);
				bd.sQsC(cc, 0);
				bd.sQuB(bd.ub(cc),((bd.up(cc)!=-1 && bd.QuC(bd.up(cc))!=51)?1:0));
				bd.sQuB(bd.db(cc),((bd.dn(cc)!=-1 && bd.QuC(bd.dn(cc))!=51)?1:0));
				bd.sQuB(bd.lb(cc),((bd.lt(cc)!=-1 && bd.QuC(bd.lt(cc))!=51)?1:0));
				bd.sQuB(bd.rb(cc),((bd.rt(cc)!=-1 && bd.QuC(bd.rt(cc))!=51)?1:0));
			}
			else{
				bd.sQuC(cc, 0);
				bd.sQnC(cc, 0);
				bd.sDiC(cc, 0);
				bd.sQaC(cc,-1);
				bd.sQsC(cc, 0);
			}
		};

		mv.inputBGcolor1 = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell || bd.QuC(cc)==51){ return;}
			if(this.inputData==-1){ this.inputData=(bd.QsC(cc)==0)?3:0;}
			bd.sQsC(cc, this.inputData);
			this.mouseCell = cc; 
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.inputnumber51(ca,{2:(k.qcols-tc.getTCX()-1), 4:(k.qrows-tc.getTCY()-1)});
		};

		if(k.callmode == "pmake"){
			kp.kpgenerate = function(mode){
				this.inputcol('image','knumq','-',[0,0]);
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.insertrow();
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.inputcol('num','knum5','5','5');
				this.inputcol('num','knum6','6','6');
				this.insertrow();
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.inputcol('num','knum9','9','9');
				this.inputcol('num','knum0','0','0');
				this.insertrow();
			};
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.imgCR = [1,1];
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}

		// �ꕔqsub�ŏ��������Ȃ����̂����邽�ߏ㏑��
		base.ASconfirm = function(){
			if(confirm("�⏕�L�����������܂����H")){
				um.chainflag=0;
				for(var i=0;i<k.qcols*k.qrows;i++){
					if(bd.QsC(i)==1){ um.addOpe('cell','qsub',i,bd.QsC(i),0);}
				}
				if(!g.vml){ pc.flushCanvasAll();}

				$.each(bd.cell,   function(i,cell){ cell.error=0; if(cell.qsub==1){ cell.qsub=0;} });
				$.each(bd.border, function(i,border){ border.error=0;});
				$.each(bd.excell, function(i,excell){ excell.error=0;});

				pc.paintAll();
			}
		};

		menu.ex.adjustSpecial  = menu.ex.adjustQues51_1;
		menu.ex.adjustSpecial2 = menu.ex.adjustQues51_2;

		tc.getTCX = function(){ return mf((tc.cursolx-1)/2);};
		tc.getTCY = function(){ return mf((tc.cursoly-1)/2);};
		tc.targetdir = 2;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.errcolor1 = "rgb(192, 0, 0)";
		pc.bcolor = "rgb(160, 255, 160)";
		pc.BBcolor = "rgb(127, 127, 127)";

		pc.qsubcolor3 = "rgb(192,192,192)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawWhiteCells(x1,y1,x2,y2);

			this.drawQSubCells(x1,y1,x2,y2);

			this.draw51(x1,y1,x2,y2,true);
			this.drawEXcell(x1,y1,x2,y2,true);
			this.drawTargetTriangle(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawBlackCells(x1,y1,x2,y2);

			this.drawChassis_ex1(x1-1,y1-1,x2,y2,true);

			this.drawNumbersOn51(x1,y1,x2,y2);
			this.drawNumbersOn51EX(x1,y1,x2,y2);

			this.drawBoxBorders(x1-1,y1-1,x2+1,y2+1,1);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBorder(bstr);
				bstr = this.decodeTilePaint(bstr);
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder()+this.encodeTilePaint();
		};

		enc.decodeTilePaint = function(bstr){
			// �Ֆʓ������̃f�R�[�h
			var cell=0, a=0;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if(ca>='g' && ca<='z'){ cell+=(parseInt(ca,36)-15);}
				else{
					bd.sQuC(cell,51);
					if     (ca=='-'){
						bd.sDiC(cell,(bstr.charAt(i+1)!="."?parseInt(bstr.charAt(i+1),16):-1));
						bd.sQnC(cell,parseInt(bstr.substring(i+2,i+4),16));
						cell++; i+=3;
					}
					else if(ca=='+'){
						bd.sDiC(cell,parseInt(bstr.substring(i+1,i+3),16));
						bd.sQnC(cell,(bstr.charAt(i+3)!="."?parseInt(bstr.charAt(i+3),16):-1));
						cell++; i+=3;
					}
					else if(ca=='='){
						bd.sDiC(cell,parseInt(bstr.substring(i+1,i+3),16));
						bd.sQnC(cell,parseInt(bstr.substring(i+3,i+5),16));
						cell++; i+=4;
					}
					else{
						bd.sDiC(cell,(bstr.charAt(i)!="."?parseInt(bstr.charAt(i),16):-1));
						bd.sQnC(cell,(bstr.charAt(i+1)!="."?parseInt(bstr.charAt(i+1),16):-1));
						cell++; i+=1;
					}
				}
				if(cell>=bd.cell.length){ a=i+1; break;}
			}

			// �ՖʊO�����̃f�R�[�h
			cell=0;
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca=='.'){ bd.sDiE(cell,-1); cell++;}
				else if(ca=='-'){ bd.sDiE(cell,parseInt(bstr.substring(i+1,i+3),16)); cell++; i+=2;}
				else            { bd.sDiE(cell,parseInt(ca,16)); cell++;}
				if(cell>=k.qcols){ a=i+1; break;}
			}
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca=='.'){ bd.sQnE(cell,-1); cell++;}
				else if(ca=='-'){ bd.sQnE(cell,parseInt(bstr.substring(i+1,i+3),16)); cell++; i+=2;}
				else            { bd.sQnE(cell,parseInt(ca,16)); cell++;}
				if(cell>=k.qcols+k.qrows){ a=i+1; break;}
			}

			return bstr.substring(a,bstr.length);
		};
		enc.encodeTilePaint = function(type){
			var cm="";

			// �Ֆʓ����̐��������̃G���R�[�h
			var count=0;
			for(var c=0;c<bd.cell.length;c++){
				var pstr = "";

				if(bd.QuC(c)==51){
					pstr+=bd.DiC(c).toString(16);
					pstr+=bd.QnC(c).toString(16);

					if     (bd.QnC(c) >=16 && bd.DiC(c)>=16){ pstr = ("="+pstr);}
					else if(bd.QnC(c) >=16){ pstr = ("-"+pstr);}
					else if(bd.DiC(c)>=16){ pstr = ("+"+pstr);}
				}
				else{ pstr=" "; count++;}

				if     (count== 0){ cm += pstr;}
				else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
				else if(count==20){ cm += "z"; count=0;}
			}
			if(count>0){ cm += (count+15).toString(36);}

			// �ՖʊO���̐��������̃G���R�[�h
			for(var c=0;c<k.qcols;c++){
				if     (bd.DiE(c)<  0){ cm += ".";}
				else if(bd.DiE(c)< 16){ cm += bd.DiE(c).toString(16);}
				else if(bd.DiE(c)<256){ cm += ("-"+bd.DiE(c).toString(16));}
			}
			for(var c=k.qcols;c<k.qcols+k.qrows;c++){
				if     (bd.QnE(c)<  0){ cm += ".";}
				else if(bd.QnE(c)< 16){ cm += bd.QnE(c).toString(16);}
				else if(bd.QnE(c)<256){ cm += ("-"+bd.QnE(c).toString(16));}
			}

			return cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<k.qrows){ return false;}
			this.decodeCell( function(c,ca){
				if     (ca == "#"){ bd.sQaC(c, 1);}
				else if(ca == "+"){ bd.sQsC(c, 1);}
				else if(ca == "-"){ bd.sQsC(c, 3);}
			},array.slice(0,k.qrows));
			return true;
		};
		fio.encodeOthers = function(){
			return ""+this.encodeCell( function(c){
				if     (bd.QaC(c)==1){ return "# ";}
				else if(bd.QsC(c)==1){ return "+ ";}
				else if(bd.QsC(c)==3){ return "- ";}
				else                 { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkSameObjectInRoom(this.searchRarea(), function(c){ return (bd.QaC(c)==1?1:2);}) ){
				this.setAlert('���}�X�ƍ��}�X�̍��݂����^�C��������܂��B','A tile includes both balck and white cells.'); return false;
			}

			if( !this.checkRowsCols() ){
				this.setAlert('�����̉����E�ɂ��鍕�}�X�̐����Ԉ���Ă��܂��B','The number of black cells underward or rightward is not correct.'); return false;
			}

			return true;
		};

		ans.checkRowsCols = function(){
			for(var cy=0;cy<k.qrows;cy++){
				var cnt = 0, clist = new Array(), num = bd.QnE(bd.exnum(-1,cy));
				bd.sErE([bd.exnum(-1,cy)],1);
				for(var cx=0;cx<=k.qcols;cx++){
					var cc = bd.cnum(cx,cy);
					if(cx==k.qcols || bd.QuC(cc)==51){
						if(clist.length>0 && num!=cnt){ bd.sErC(clist,1); return false;}

						bd.sErE([bd.exnum(-1,cy)],0);
						if(cx==k.qcols){ break;}
						cnt = 0; clist = new Array(), num = bd.QnC(cc);
					}
					else if(bd.QaC(cc)==1){ cnt++;}
					clist.push(cc);
				}
				bd.sErE([bd.exnum(-1,cy)],0);
			}
			for(var cx=0;cx<k.qcols;cx++){
				var cnt = 0, clist = new Array(), num = bd.DiE([bd.exnum(cx,-1)]);
				bd.sErE([bd.exnum(cx,-1)],1);
				for(var cy=0;cy<k.qrows;cy++){
					var cc = bd.cnum(cx,cy);
					if(cy==k.qrows || bd.QuC(cc)==51){
						if(clist.length>0 && num!=cnt){ bd.sErC(clist,1); return false;}

						bd.sErE([bd.exnum(cx,-1)],0);
						if(cy==k.qrows){ break;}
						cnt = 0; clist = new Array(), num = bd.DiC(cc);
					}
					else if(bd.QaC(cc)==1){ cnt++;}
					clist.push(cc);
				}
				bd.sErE([bd.exnum(cx,-1)],0);
			}

			return true;
		};
	}
};