//
// �p�Y���ŗL�X�N���v�g�� �C�w���s�̖�� shugaku.js v3.2.0p1
//
Puzzles.shugaku = function(){ };
Puzzles.shugaku.prototype = {
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
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("�C�w���s�̖�","School Trip");
		base.setExpression("�@�}�E�X�̍��{�^���h���b�O�ŕz�c���A�E�{�^���ŒʘH����͂ł��܂��B",
						   " Left Button Drag to input Futon, Right Click to input aisle.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputFuton(x,y);
				else if(this.btn.Right) this.inputcell_shugaku(x,y);
			}
			else if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,4);}
				else{ kp.display(x,y);}
			}
		};
		mv.mouseup = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputFuton2(x,y);
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputFuton(x,y);
				else if(this.btn.Right) this.inputcell_shugaku(x,y);
			}
		};
		mv.inputFuton = function(x,y){
			var pos = new Pos(x,y);
			var cc = this.cellid(pos);

			if(this.firstPos.x==-1 && this.firstPos.y==-1){
				if(cc==-1 || bd.QnC(cc)!=-1){ return;}
				this.mouseCell = cc;
				this.inputData = 1;
				this.firstPos = pos;
				pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
			}
			else{
				var old = this.inputData;
				if(this.mouseCell==cc){ this.inputData = 1;}
				else{
					var mx=pos.x-this.firstPos.x, my=pos.y-this.firstPos.y;
					if     (cc==-1){ /* nop */ }
					else if(mx-my>0 && mx+my>0){ this.inputData = (bd.QnC(bd.rt(this.mouseCell))==-1?5:6);}
					else if(mx-my>0 && mx+my<0){ this.inputData = (bd.QnC(bd.up(this.mouseCell))==-1?2:6);}
					else if(mx-my<0 && mx+my>0){ this.inputData = (bd.QnC(bd.dn(this.mouseCell))==-1?3:6);}
					else if(mx-my<0 && mx+my<0){ this.inputData = (bd.QnC(bd.lt(this.mouseCell))==-1?4:6);}
				}
				if(old!=this.inputData){ pc.paint(bd.cell[this.mouseCell].cx-2, bd.cell[this.mouseCell].cy-2, bd.cell[this.mouseCell].cx+2, bd.cell[this.mouseCell].cy+2);}
			}
		};
		mv.inputFuton2 = function(x,y){
			if(this.mouseCell==-1 || (this.firstPos.x==-1 && this.firstPos.y==-1)){ return;}
			var cc=this.mouseCell

			this.changeHalf(cc);
			if(this.inputData!=1 && this.inputData!=6){ bd.sQaC(cc, 10+this.inputData); bd.sQsC(cc, 0);}
			else if(this.inputData==6){ bd.sQaC(cc, 11); bd.sQsC(cc, 0);}
			else{
				if     (bd.QaC(cc)==11){ bd.sQaC(cc, 16); bd.sQsC(cc, 0);}
				else if(bd.QaC(cc)==16){ bd.sQaC(cc, -1); bd.sQsC(cc, 1);}
//				else if(bd.QsC(cc)== 1){ bd.sQaC(cc, -1); bd.sQsC(cc, 0);}
				else                   { bd.sQaC(cc, 11); bd.sQsC(cc, 0);}
			}

			cc = this.getTargetADJ();
			if(cc!=-1){
				this.changeHalf(cc);
				bd.sQaC(cc, {2:18,3:17,4:20,5:19}[this.inputData]); bd.sQsC(cc, 0);
			}

			cc = this.mouseCell;
			this.mouseCell = -1;
			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
		};

		mv.inputcell_shugaku = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell || bd.QnC(cc)!=-1){ return;}
			if(this.inputData==-1){
				if     (bd.QaC(cc)==1){ this.inputData = 2;}
				else if(bd.QsC(cc)==1){ this.inputData = 3;}
				else{ this.inputData = 1;}
			}
			this.changeHalf(cc);
			this.mouseCell = cc; 

			bd.sQaC(cc, (this.inputData==1?1:-1));
			bd.sQsC(cc, (this.inputData==2?1:0));

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
		};

		mv.changeHalf = function(cc){
			var adj=-1;
			if     (bd.QaC(cc)==12 || bd.QaC(cc)==17){ adj=bd.up(cc);}
			else if(bd.QaC(cc)==13 || bd.QaC(cc)==18){ adj=bd.dn(cc);}
			else if(bd.QaC(cc)==14 || bd.QaC(cc)==19){ adj=bd.lt(cc);}
			else if(bd.QaC(cc)==15 || bd.QaC(cc)==20){ adj=bd.rt(cc);}

			if     (adj==-1){ /* nop */ }
			else if(bd.QaC(adj)>=12 && bd.QaC(adj)<=15){ bd.sQaC(adj,11);}
			else if(bd.QaC(adj)>=17 && bd.QaC(adj)<=20){ bd.sQaC(adj,16);}
		};
		mv.getTargetADJ = function(){
			if(this.mouseCell==-1){ return -1;}
			switch(this.inputData){
				case 2: return bd.up(this.mouseCell);
				case 3: return bd.dn(this.mouseCell);
				case 4: return bd.lt(this.mouseCell);
				case 5: return bd.rt(this.mouseCell);
			}
			return -1;
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,4);
		};

		if(k.callmode == "pmake"){
			kp.generate(4, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,4);
			};
		}

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			switch(type){
			case 1: // �㉺���]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {12:13,13:12,17:18,18:17}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 2: // ���E���]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {14:15,15:14,19:20,20:19}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 3: // �E90�����]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {12:15,15:13,13:14,14:12,17:20,20:18,18:19,19:17}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 4: // ��90�����]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {12:14,14:13,13:15,15:12,17:19,19:18,18:20,20:17}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 5: // �Ֆʊg��
				break;
			case 6: // �Ֆʏk��
				break;
			}
			um.enableRecord();
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.errbcolor1 = "rgb(255, 127, 127)";

		pc.paint = function(x1,y1,x2,y2){
			x1--; y1--; x2++; y2++;	// Undo���ɐՂ��c���Ă��܂���

			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);

			this.drawFutons(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);
			this.drawFutonBorders(x1,y1,x2,y2);

			this.drawBlackCells(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);

			this.drawNumCells(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawNumCells = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.45;
			var rsize2 = k.cwidth*0.40;

			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
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

				this.dispnumCell_General(c);
			}
			this.vinc();
		};

		pc.drawFutons = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QaC(c)>=11){
					g.fillStyle = (bd.ErC(c)==1?this.errbcolor1:"white");
					if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth+1, k.cheight+1);}
				}
				else{ this.vhide("c"+c+"_full_");}

				this.drawPillow1(c,0);
			}
			this.vinc();
		};
		pc.drawPillow1 = function(cc,flag){
			var mgnw = mf(k.cwidth*0.15);
			var mgnh = mf(k.cheight*0.15);

			if(flag==1 || (bd.QaC(cc)>=11 && bd.QaC(cc)<=15)){
				g.fillStyle = "black";
				if(this.vnop("c"+cc+"_sq1_",1)){ g.fillRect(bd.cell[cc].px()+mgnw+1, bd.cell[cc].py()+mgnh+1, k.cwidth-mgnw*2-1, k.cheight-mgnh*2-1);}
				g.fillStyle = (flag==1?"rgb(255,192,192)":(bd.ErC(cc)==1||flag==1?this.errbcolor1:"white"));
				if(this.vnop("c"+cc+"_sq2_",1)){ g.fillRect(bd.cell[cc].px()+mgnw+2, bd.cell[cc].py()+mgnh+2, k.cwidth-mgnw*2-3, k.cheight-mgnh*2-3);}
			}
			else{ this.vhide("c"+cc+"_sq1_"); this.vhide("c"+cc+"_sq2_");}
		};

		pc.drawFutonBorders = function(x1,y1,x2,y2){
			var lw = this.lw, lm = this.lm;
			var doma1 = {11:1,12:1,14:1,15:1,16:1,17:1,19:1,20:1};
			var domb1 = {11:1,13:1,14:1,15:1,16:1,18:1,19:1,20:1};
			var doma2 = {11:1,12:1,13:1,14:1,16:1,17:1,18:1,19:1};
			var domb2 = {11:1,12:1,13:1,15:1,16:1,17:1,18:1,20:1};

			for(var by=Math.min(1,y1*2-2);by<=Math.max(2*k.qrows-1,y2*2+2);by++){
				for(var bx=Math.min(1,x1*2-2);bx<=Math.max(2*k.qcols-1,x2*2+2);bx++){
					if((bx+by)%2==0){ continue;}
					var a = bd.QaC( bd.cnum(mf((bx-by%2)/2), mf((by-bx%2)/2)) );
					var b = bd.QaC( bd.cnum(mf((bx+by%2)/2), mf((by+bx%2)/2)) );

					if     (bx%2==1&&(!isNaN(doma1[a])||!isNaN(domb1[b]))){
						g.fillStyle = "black";
						if(this.vnop("b"+bx+"_"+by+"_bd_",1)){
							g.fillRect(k.p0.x+mf((bx-1)*k.cwidth/2)-lm, k.p0.x+mf(by*k.cheight/2)-lm, k.cwidth+lw, lw);
						}
					}
					else if(by%2==1&&(!isNaN(doma2[a])||!isNaN(domb2[b]))){
						g.fillStyle = "black";
						if(this.vnop("b"+bx+"_"+by+"_bd_",1)){
							g.fillRect(k.p0.x+mf(bx*k.cwidth/2)-lm, k.p0.x+mf((by-1)*k.cheight/2)-lm, lw, k.cheight+lw);
						}
					}
					else{ this.vhide("b"+bx+"_"+by+"_bd_");}
				}
			}
			this.vinc();
		};

		pc.drawTarget = function(x1,y1,x2,y2){
			this.vdel("t1_"); this.vdel("t2_"); this.vdel("t3_"); this.vdel("t4_");
			if(mv.firstPos.x==-1 && mv.firstPos.y==-1){ this.vinc(); this.vinc(); this.vinc(); return;}
			var cc=mv.mouseCell;
			if(cc==-1){ return;}
			var adj=mv.getTargetADJ();

			if(cc!=-1){
				g.fillStyle = "rgb(255,192,192)";
				if(this.vnop("c"+cc+"_full_",1)){ g.fillRect(bd.cell[cc].px(), bd.cell[cc].py(), k.cwidth+1, k.cheight+1);}
			}
			else{ this.vhide("c"+cc+"_full_");}

			if(adj!=-1){
				g.fillStyle = "rgb(255,192,192)";
				if(this.vnop("c"+adj+"_full_",1)){ g.fillRect(bd.cell[adj].px(), bd.cell[adj].py(), k.cwidth+1, k.cheight+1);}
			}
			else{ this.vhide("c"+adj+"_full_");}
			this.vinc();

			this.drawPillow1(cc,1);
			this.vinc();

			var lw = this.lw, lm = this.lm;
			var px = k.p0.x+(adj==-1?bd.cell[cc].cx:Math.min(bd.cell[cc].cx,bd.cell[adj].cx))*k.cwidth;
			var py = k.p0.y+(adj==-1?bd.cell[cc].cy:Math.min(bd.cell[cc].cy,bd.cell[adj].cy))*k.cheight;
			var wid = (mv.inputData==4||mv.inputData==5?2:1)*k.cwidth;
			var hgt = (mv.inputData==2||mv.inputData==3?2:1)*k.cheight;

			g.fillStyle = "black";
			if(this.vnop("t1_",1)){ g.fillRect(px-lm    , py-lm    , wid+lw, lw);}
			if(this.vnop("t2_",1)){ g.fillRect(px-lm    , py-lm    , lw, hgt+lw);}
			if(this.vnop("t3_",1)){ g.fillRect(px+wid-lm, py-lm    , lw, hgt+lw);}
			if(this.vnop("t4_",1)){ g.fillRect(px-lm    , py+hgt-lm, wid+lw, lw);}

			this.vinc();
		};

		pc.flushCanvas = function(x1,y1,x2,y2){	// �w�i�F���������̂ŏ㏑������
			if(!g.vml){
				x1=(x1>=0?x1:0); x2=(x2<=k.qcols-1?x2:k.qcols-1);
				y1=(y1>=0?y1:0); y2=(y2<=k.qrows-1?y2:k.qrows-1);
				g.fillStyle = "rgb(208, 208, 208)";
				g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth, (y2-y1+1)*k.cheight);
			}
			else{
				g.zidx=1;
				g.fillStyle = "rgb(208, 208, 208)";
				if(this.vnop("boardfull",1)){ g.fillRect(k.p0.x, k.p0.y, k.qcols*k.cwidth, k.qrows*k.cheight);}
				this.vinc();
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0||type==1){ bstr = this.decodeShugaku(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.pzldataShugaku();
		};

		enc.decodeShugaku = function(bstr){
			var c=0;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca>='0' && ca<='4'){ bd.sQnC(c, parseInt(ca,36)); c++;}
				else if(ca=='5')           { bd.sQnC(c, -2);              c++;}
				else{ c += (parseInt(ca,36)-5);}
				if(c>=bd.cell.length){ break;}
			}
			return bstr.substring(i,bstr.length);
		};
		enc.pzldataShugaku = function(){
			var cm="", count=0;
			for(var i=0;i<bd.cell.length;i++){
				var pstr = "";
				var val = bd.QnC(i);

				if     (val==-2){ pstr = "5";}
				else if(val!=-1){ pstr = val.toString(36);}
				else{ count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==30){ cm+=((5+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(5+count).toString(36);}
			return cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			fio.decodeCell( function(c,ca){
				if(ca == "5")     { bd.sQnC(c, -2);}
				else if(ca == "#"){ bd.sQaC(c, 1);}
				else if(ca == "-"){ bd.sQsC(c, 1);}
				else if(ca>="a" && ca<="j"){ bd.sQaC(c, parseInt(ca,20)+1);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},array.slice(0,k.qrows));
		};
		fio.encodeOthers = function(){
			return ""+fio.encodeCell( function(c){
				if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
				else if(bd.QnC(c)==-2){ return "5 ";}
				else if(bd.QaC(c)==1) { return "# ";}
				else if(bd.QaC(c)>=0) { return ((bd.QaC(c)-1).toString(20) + " ");}
				else if(bd.QsC(c)==1) { return "- ";}
				else                  { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkKitamakura() ){
				this.setAlert('�k���ɂȂ��Ă���z�c������܂��B', 'There is a \'Kita-makura\' futon.'); return false;
			}

			if( !this.check2x2Block( function(id){ return (bd.QaC(id)==1);} ) ){
				this.setAlert('2x2�̍��}�X�̂����܂肪����܂��B', 'There is a 2x2 block of black cells.'); return false;
			}

			if( !this.checkQnumPillows(function(cn,bcnt){ return (cn<bcnt);}) ){
				this.setAlert('���̂܂��ɂ��閍�̐����Ԉ���Ă��܂��B', 'The number of pillows around the number is wrong.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QaC(c)==11||bd.QaC(c)==16);}) ){
				this.setAlert('�z�c��2�}�X�ɂȂ��Ă��܂���B', 'There is a half-size futon.'); return false;
			}

			if( !this.checkFutonAisle() ){
				this.setAlert('�ʘH�ɐڂ��Ă��Ȃ��z�c������܂��B', 'There is a futon separated to aisle.'); return false;
			}

			if( !this.linkBWarea( ans.searchBarea() ) ){
				this.setAlert('���}�X�����f����Ă��܂��B', 'Aisle is divided.'); return false;
			}

			if( !this.checkQnumPillows(function(cn,bcnt){ return (cn>bcnt);}) ){
				this.setAlert('���̂܂��ɂ��閍�̐����Ԉ���Ă��܂��B', 'The number of pillows around the number is wrong.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QnC(c)==-1 && bd.QaC(c)==-1);}) ){
				this.setAlert('�z�c�ł����}�X�ł��Ȃ��}�X������܂��B', 'There is an empty cell.'); return false;
			}

			return true;
		};

		ans.checkQnumPillows = function(func){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)>=0 && func(bd.QnC(c),this.checkdir4Cell(c,function(a){ return (bd.QaC(a)>=11 && bd.QaC(a)<=15);}))){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};

		ans.checkKitamakura = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QaC(c)==13){
					bd.sErC([c,bd.dn(c)],1);
					return false;
				}
			}
			return true;
		};

		ans.checkFutonAisle = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1 && bd.QaC(c)>=12 && bd.QaC(c)<=15){
					var adj=-1;
					switch(bd.QaC(c)){
						case 12: adj = bd.up(c); break;
						case 13: adj = bd.dn(c); break;
						case 14: adj = bd.lt(c); break;
						case 15: adj = bd.rt(c); break;
					}
					if( this.checkdir4Cell(c  ,function(a){ return (bd.QaC(a)==1)})==0 &&
						this.checkdir4Cell(adj,function(a){ return (bd.QaC(a)==1)})==0 )
					{
						bd.sErC([c,adj],1);
						return false;
					}
				}
			}
			return true;
		};
	}
};