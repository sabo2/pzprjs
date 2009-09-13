//
// �p�Y���ŗL�X�N���v�g�� �A�C�X�o�[���� icebarn.js v3.2.0p2
//
Puzzles.icebarn = function(){ };
Puzzles.icebarn.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 1;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
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

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others"];

		//k.def_csize = 36;
		k.def_psize = 36;

		if(k.callmode=="pplay"){
			base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Right Click to input a cross.");
		}
		else{
			base.setExpression("�@���h���b�O�Ŗ�󂪁A�E�N���b�N�ŕX�����͂ł��܂��B",
							   " Left Button Drag to input arrows, Right Click to input ice.");
		}
		base.setTitle("�A�C�X�o�[��","Icebarn");
		base.setFloatbgcolor("rgb(0, 0, 127)");
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
			if(k.mode==1){
				if(this.btn.Left) this.inputarrow(x,y);
				else if(this.btn.Right) this.inputIcebarn(x,y);
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1){
				if(this.btn.Left) this.inputarrow(x,y);
				else if(this.btn.Right) this.inputIcebarn(x,y);
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.inputIcebarn = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){ this.inputData = (bd.QuC(cc)==6?0:6);}

			bd.sQuC(cc, this.inputData);
			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
		};
		mv.inputarrow = function(x,y){
			var pos = this.cellpos(new Pos(x,y));
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = -1;
			if     (pos.y-this.mouseCell.y==-1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2  ); if(this.inputData!=0){ this.inputData=1;} }
			else if(pos.y-this.mouseCell.y== 1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2+2); if(this.inputData!=0){ this.inputData=2;} }
			else if(pos.x-this.mouseCell.x==-1){ id=bd.bnum(this.mouseCell.x*2  ,this.mouseCell.y*2+1); if(this.inputData!=0){ this.inputData=1;} }
			else if(pos.x-this.mouseCell.x== 1){ id=bd.bnum(this.mouseCell.x*2+2,this.mouseCell.y*2+1); if(this.inputData!=0){ this.inputData=2;} }

			this.mouseCell = pos;

			if(id==-1){ return;}
			else if(id<bd.bdinside){
				if(this.inputData==bd.QuB(id)){ this.inputData=0;}
				bd.sQuB(id,this.inputData);
			}
			else{
				if(bd.border[id].cx==0 || bd.border[id].cy==0){
					if     (this.inputData==1){ bd.inputarrowout(id);}
					else if(this.inputData==2){ bd.inputarrowin (id);}
				}
				else{
					if     (this.inputData==1){ bd.inputarrowin (id);}
					else if(this.inputData==2){ bd.inputarrowout(id);}
				}
			}
			pc.paintBorder(id);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ if(ca=='z' && !this.keyPressed){ this.isZ=true;}};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(!bd.arrowin) { bd.arrowin  = -1;}
		if(!bd.arrowout){ bd.arrowout = -1;}
		bd.ainobj  = pc.CreateElementAndSetNop();
		bd.aoutobj = pc.CreateElementAndSetNop();
		bd.inputarrowin = function(id){
			var dir=((this.border[id].cx==0||this.border[id].cy==0)?1:2);
			this.sQuB(this.arrowin,0);
			pc.paintBorder(this.arrowin);
			if(this.arrowout==id){
				this.arrowout = this.arrowin;
				this.sQuB(this.arrowout, ((dir+1)%2)+1);
				pc.paintBorder(this.arrowout);
			}
			this.arrowin = id;
			this.sQuB(this.arrowin, (dir%2)+1);
		};
		bd.inputarrowout = function(id){
			var dir=((this.border[id].cx==0||this.border[id].cy==0)?1:2);
			this.sQuB(this.arrowout,0);
			pc.paintBorder(this.arrowout);
			if(this.arrowin==id){
				this.arrowin = this.arrowout;
				this.sQuB(this.arrowin, (dir%2)+1);
				pc.paintBorder(this.arrowin);
			}
			this.arrowout = id;
			this.sQuB(this.arrowout, ((dir+1)%2)+1);
		};

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			var ibx=bd.border[bd.arrowin ].cx, iby=bd.border[bd.arrowin ].cy;
			var obx=bd.border[bd.arrowout].cx, oby=bd.border[bd.arrowout].cy;
			switch(type){
			case 1: // �㉺���]
				bd.arrowin  = bd.bnum(ibx,2*k.qrows-iby);
				bd.arrowout = bd.bnum(obx,2*k.qrows-oby);
				for(var id=0;id<bd.border.length;id++){
					if(bd.border[id].cx%2==1&&bd.QuB(id)!=0){ bd.border[id].ques={1:2,2:1}[bd.QuB(id)]; }
				}
				break;
			case 2: // ���E���]
				bd.arrowin  = bd.bnum(2*k.qcols-ibx,iby);
				bd.arrowout = bd.bnum(2*k.qcols-obx,oby);
				for(var id=0;id<bd.border.length;id++){
					if(bd.border[id].cx%2==0&&bd.QuB(id)!=0){ bd.border[id].ques={1:2,2:1}[bd.QuB(id)]; }
				}
				break;
			case 3: // �E90�����]
				bd.arrowin  = bd.bnum2(2*k.qrows-iby,ibx,k.qrows,k.qcols);
				bd.arrowout = bd.bnum2(2*k.qrows-oby,obx,k.qrows,k.qcols);
				for(var id=0;id<bd.border.length;id++){
					if(bd.border[id].cx%2==1&&bd.QuB(id)!=0){ bd.border[id].ques={1:2,2:1}[bd.QuB(id)]; }
				}
				break;
			case 4: // ��90�����]
				bd.arrowin  = bd.bnum2(iby,2*k.qcols-ibx,k.qrows,k.qcols);
				bd.arrowout = bd.bnum2(oby,2*k.qcols-obx,k.qrows,k.qcols);
				for(var id=0;id<bd.border.length;id++){
					if(bd.border[id].cx%2==0&&bd.QuB(id)!=0){ bd.border[id].ques={1:2,2:1}[bd.QuB(id)]; }
				}
				break;
			case 5: // �Ֆʊg��
				bd.arrowin  += (key=='up'||key=='dn'?2*k.qcols-1:2*k.qrows-1);
				bd.arrowout += (key=='up'||key=='dn'?2*k.qcols-1:2*k.qrows-1);
				break;
			case 6: // �Ֆʏk��
				bd.arrowin  -= (key=='up'||key=='dn'?2*k.qcols-1:2*k.qrows-1);
				bd.arrowout -= (key=='up'||key=='dn'?2*k.qcols-1:2*k.qrows-1);
				break;
			}

			um.enableRecord();
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.linecolor = "rgb(0, 192, 0)";
		pc.errcolor1 = "rgb(255, 0, 0)";
		pc.errbcolor1 = "rgb(255, 160, 160)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawIcebarns(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);

			this.drawIceBorders(x1,y1,x2,y2);

			this.drawLines(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,1);

			this.drawArrows(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawInOut();
		};
		pc.drawArrows = function(x1,y1,x2,y2){
			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+4,y2*2+4,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];
				if(bd.QuB(id)==0){ this.vhide(["b"+id+"_ar_","b"+id+"_dt1_","b"+id+"_dt2_"]);}
				else{ this.drawArrow1(id);}
			}
			this.vinc();
		};
		pc.drawArrow1 = function(id){
			if(bd.ErB(id)==3){ g.fillStyle = this.errcolor1;}
			else{ g.fillStyle = this.Cellcolor;}

			var ll = mf(k.cwidth*0.35); //LineLength
			var lw = (mf(k.cwidth/24)>=1?mf(k.cwidth/24):1); //LineWidth
			var lm = mf((lw-1)/2); //LineMargin
			var px=bd.border[id].px(); var py=bd.border[id].py();

			if(bd.border[id].cx%2==1){
				if(this.vnop("b"+id+"_ar_",1)){ g.fillRect(px-lm, py-ll, lw, ll*2);}
				if     (bd.QuB(id)==1){ if(this.vnop("b"+id+"_dt1_",1)){ this.inputPath([px,py ,0,-ll ,-ll/2,-ll*0.4 ,ll/2,-ll*0.4], true); g.fill();} }
				else if(bd.QuB(id)==2){ if(this.vnop("b"+id+"_dt2_",1)){ this.inputPath([px,py ,0,+ll ,-ll/2, ll*0.4 ,ll/2, ll*0.4], true); g.fill();} }
			}
			else if(bd.border[id].cy%2==1){
				if(this.vnop("b"+id+"_ar_",1)){ g.fillRect(px-ll, py-lm, ll*2, lw);}
				if     (bd.QuB(id)==1){ if(this.vnop("b"+id+"_dt1_",1)){ this.inputPath([px,py ,-ll,0 ,-ll*0.4,-ll/2 ,-ll*0.4,ll/2], true); g.fill();} }
				else if(bd.QuB(id)==2){ if(this.vnop("b"+id+"_dt2_",1)){ this.inputPath([px,py , ll,0 , ll*0.4,-ll/2 , ll*0.4,ll/2], true); g.fill();} }
			}
		};
		pc.drawInOut = function(){
			if(bd.arrowin==-1){ return;}

			if(bd.ErB(bd.arrowin)==3){ g.fillStyle = this.errcolor1;}
			else{ g.fillStyle = this.Cellcolor;}
			var bx = bd.border[bd.arrowin].cx, by = bd.border[bd.arrowin].cy;
			if     (by==0)        { this.dispString(bd.ainobj, "IN", ((bx+1.3)/2)*k.cwidth+3 , ((by+0.5)/2)*k.cheight-5);}
			else if(by==2*k.qrows){ this.dispString(bd.ainobj, "IN", ((bx+1.3)/2)*k.cwidth+3 , ((by+2.0)/2)*k.cheight+12);}
			else if(bx==0)        { this.dispString(bd.ainobj, "IN", ((bx+1.0)/2)*k.cwidth-12, ((by+1.0)/2)*k.cheight-7);}
			else if(bx==2*k.qcols){ this.dispString(bd.ainobj, "IN", ((bx+2.0)/2)*k.cwidth+6 , ((by+1.0)/2)*k.cheight-7);}

			if(bd.ErB(bd.arrowout)==3){ g.fillStyle = this.errcolor1;}
			else{ g.fillStyle = this.Cellcolor;}
			var bx = bd.border[bd.arrowout].cx, by = bd.border[bd.arrowout].cy;
			if     (by==0)        { this.dispString(bd.aoutobj, "OUT", ((bx+1.0)/2)*k.cwidth-2 , ((by+0.5)/2)*k.cheight-5);}
			else if(by==2*k.qrows){ this.dispString(bd.aoutobj, "OUT", ((bx+1.0)/2)*k.cwidth-2 , ((by+2.0)/2)*k.cheight+12);}
			else if(bx==0)        { this.dispString(bd.aoutobj, "OUT", ((bx+0.5)/2)*k.cwidth-19, ((by+1.0)/2)*k.cheight-7);}
			else if(bx==2*k.qcols){ this.dispString(bd.aoutobj, "OUT", ((bx+2.0)/2)*k.cwidth+5 , ((by+1.0)/2)*k.cheight-7);}
		};
		pc.dispString = function(obj, text, px, py){
			var el = obj.get(0);
			el.style.fontSize = (k.cwidth*0.55)+'px';
			el.style.left     = k.cv_oft.x + px+(!k.br.IE?2:4);
			el.style.top      = k.cv_oft.y + py+(!k.br.IE?1:5);
			el.style.color    = g.fillStyle;
			el.style.display = 'inline';
			el.innerHTML = text;
		};

		col.repaintParts = function(id){
			if(bd.QuB(id)!=0){ pc.drawArrow1(id);}
		};
		col.maxYdeg = 0.70;
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==1){
				if(this.checkpflag("c")){ bstr = this.decodeIcebarn_old2(bstr);}
				else{ bstr = this.decodeIcebarn_old1(bstr);}
			}
			else if(type==0){ bstr = this.decodeIcebarn(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/q.html?"+k.qcols+"/"+k.qrows+"/"+this.encodeIcebarn_old1();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){ return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeIcebarn();};

		enc.decodeIcebarn = function(bstr){
			var barray = bstr.split("/");

			var a=0;
			for(var i=0;i<barray[0].length;i++){
				var num = parseInt(barray[0].charAt(i),32);
				for(var w=0;w<5;w++){ if((i*5+w)<bd.cell.length){ bd.sQuC(i*5+w,(num&Math.pow(2,4-w)?6:0));} }
				if((i*5+5)>=k.qcols*k.qrows){ a=i+1; break;}
			}

			var id=0;
			for(var i=a;i<barray[0].length;i++){
				var ca = barray[0].charAt(i);
				if(ca=='z'){ id+=35;}else{ id += parseInt(ca,36); if(id<bd.bdinside){ bd.sQuB(id,1);} id++;}
				if(id>=bd.bdinside){ a=i+1; break;}
			}

			id=0;
			for(var i=a;i<barray[0].length;i++){
				var ca = barray[0].charAt(i);
				if(ca=='z'){ id+=35;}else{ id += parseInt(ca,36); if(id<bd.bdinside){ bd.sQuB(id,2);} id++;}
				if(id>=bd.bdinside){ break;}
			}

			bd.sQuB(bd.arrowin,0); bd.sQuB(bd.arrowout,0);
			bd.arrowin = bd.arrowout = -1;
			bd.inputarrowin (parseInt(barray[1])+bd.bdinside);
			bd.inputarrowout(parseInt(barray[2])+bd.bdinside);

			return "";
		};
		enc.encodeIcebarn = function(){
			var cm = "";
			var num=0, pass=0;
			for(i=0;i<k.qcols*k.qrows;i++){
				if(bd.QuC(i)==6){ pass+=Math.pow(2,4-num);}
				num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(32);}

			num=0;
			for(var id=0;id<bd.bdinside;id++){
				if(bd.QuB(id)==1){ cm+=num.toString(36); num=0;}else{ num++;} if(num>=35){ cm+="z"; num=0;}
			}
			if(num>0){ cm+=num.toString(36);}

			num=0;
			for(var id=0;id<bd.bdinside;id++){
				if(bd.QuB(id)==2){ cm+=num.toString(36); num=0;}else{ num++;} if(num>=35){ cm+="z"; num=0;}
			}
			if(num>0){ cm+=num.toString(36);}

			cm += ("/"+(bd.arrowin-bd.bdinside)+"/"+(bd.arrowout-bd.bdinside));

			return cm;
		};

		enc.decodeIcebarn_old2 = function(bstr){
			var barray = bstr.split("/");

			var a;
			for(var i=0;i<barray[2].length;i++){
				var num = parseInt(barray[2].charAt(i),32);
				for(var w=0;w<5;w++){ if((i*5+w)<k.qcols*k.qrows){ bd.sQuC(i*5+w,(num&Math.pow(2,4-w)?6:0));} }
				if((i*5+5)>=k.qcols*k.qrows){ a=i+1; break;}
			}
			var id=0;
			for(var i=a;i<barray[2].length;i++){
				var ca = barray[2].charAt(i);
				if     (ca>='0' && ca<='9'){ var num=parseInt(ca); bd.sQuB(id, num%2+1); id+=(mf(num/2)+1);}
				else if(ca>='a' && ca<='z'){ var num=parseInt(ca,36); id+=(num-9);}
				else{ id++;}
				if(id>=(k.qcols-1)*k.qrows){ a=i+1; break;}
			}
			id=(k.qcols-1)*k.qrows;
			for(var i=a;i<barray[2].length;i++){
				var ca = barray[2].charAt(i);
				if     (ca>='0' && ca<='9'){ var num=parseInt(ca); bd.sQuB(id, num%2+1); id+=(mf(num/2)+1);}
				else if(ca>='a' && ca<='z'){ var num=parseInt(ca,36); id+=(num-9);}
				else{ id++;}
				if(id>=bd.bdinside){ break;}
			}

			bd.sQuB(bd.arrowin,0); bd.sQuB(bd.arrowout,0);
			bd.arrowin = bd.arrowout = -1;
			bd.inputarrowin (parseInt(barray[0])+bd.bdinside);
			bd.inputarrowout(parseInt(barray[1])+bd.bdinside);

			return "";
		};
		enc.decodeIcebarn_old1 = function(bstr){
			var barray = bstr.split("/");

			var c=0;
			for(var i=0;i<barray[0].length;i++){
				var ca = parseInt(barray[0].charAt(i),16);
				for(var w=0;w<4;w++){ if((i*4+w)<bd.cell.length){ bd.sQuC(i*4+w,(ca&Math.pow(2,3-w)?6:0));} }
				if((i*4+4)>=k.qcols*k.qrows){ break;}
			}

			if(barray[1]!=""){
				var array = barray[1].split("+");
				for(var i=0;i<array.length;i++){ bd.sQuB(bd.db(array[i]),1);}
			}
			if(barray[2]!=""){
				var array = barray[2].split("+");
				for(var i=0;i<array.length;i++){ bd.sQuB(bd.db(array[i]),2);}
			}
			if(barray[3]!=""){
				var array = barray[3].split("+");
				for(var i=0;i<array.length;i++){ bd.sQuB(bd.rb(array[i]),1);}
			}
			if(barray[4]!=""){
				var array = barray[4].split("+");
				for(var i=0;i<array.length;i++){ bd.sQuB(bd.rb(array[i]),2);}
			}

			bd.sQuB(bd.arrowin,0); bd.sQuB(bd.arrowout,0);
			bd.arrowin = bd.arrowout = -1;
			bd.inputarrowin (parseInt(barray[5])+bd.bdinside);
			bd.inputarrowout(parseInt(barray[6])+bd.bdinside);

			return "";
		};
		enc.encodeIcebarn_old1 = function(){
			var cm = "";
			var num=0, pass=0;
			for(i=0;i<k.qcols*k.qrows;i++){
				if(bd.QuC(i)==6){ pass+=Math.pow(2,3-num);}
				num++; if(num==4){ cm += pass.toString(16); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(16);}
			cm += "/";

			var array = new Array();
			for(var c=0;c<k.qcols*k.qrows;c++){ if(bd.cell[c].cy<k.qrows-1 && bd.QuB(bd.db(c))==1){ array.push(c);} }
			cm += (array.join("+") + "/");
			array = new Array();
			for(var c=0;c<k.qcols*k.qrows;c++){ if(bd.cell[c].cy<k.qrows-1 && bd.QuB(bd.db(c))==2){ array.push(c);} }
			cm += (array.join("+") + "/");
			array = new Array();
			for(var c=0;c<k.qcols*k.qrows;c++){ if(bd.cell[c].cx<k.qcols-1 && bd.QuB(bd.rb(c))==1){ array.push(c);} }
			cm += (array.join("+") + "/");
			array = new Array();
			for(var c=0;c<k.qcols*k.qrows;c++){ if(bd.cell[c].cx<k.qcols-1 && bd.QuB(bd.rb(c))==2){ array.push(c);} }
			cm += (array.join("+") + "/");

			cm += ((bd.arrowin-bd.bdinside)+"/"+(bd.arrowout-bd.bdinside));

			return cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<5*k.qrows+4){ return false;}

			bd.inputarrowin (parseInt(array[0]));
			bd.inputarrowout(parseInt(array[1]));

			this.decodeCell( function(c,ca){ if(ca=="1"){ bd.sQuC(c, 6);} },array.slice(2,k.qrows+2));
			this.decodeBorder2( function(c,ca){
				if     (ca == "1"){ bd.sQuB(c, 1);}
				else if(ca == "2"){ bd.sQuB(c, 2);}
			},array.slice(k.qrows+2,3*k.qrows+3));
			this.decodeBorder2( function(c,ca){
				if     (ca == "1" ){ bd.sLiB(c, 1);}
				else if(ca == "-1"){ bd.sQsB(c, 2);}
			},array.slice(3*k.qrows+3,5*k.qrows+4));
			return true;
		};
		fio.encodeOthers = function(){
			return ""+bd.arrowin+"/"+bd.arrowout+"/"+
				this.encodeCell( function(c){ return ""+(bd.QuC(c)==6?"1":"0")+" "; })+
				this.encodeBorder2( function(c){
					if     (bd.QuB(c)==1){ return "1 ";}
					else if(bd.QuB(c)==2){ return "2 ";}
					else                 { return "0 ";}
				})+
				this.encodeBorder2( function(c){
					if     (bd.LiB(c)==1){ return "1 ";}
					else if(bd.QsB(c)==2){ return "-1 ";}
					else                 { return "0 ";}
				});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}

			if( !this.checkLineCross() ){
				this.setAlert('�X�̕����ȊO�Ő����������Ă��܂��B', 'A Line is crossed outside of ice.'); return false;
			}
			if( !this.checkLineCurve() ){
				this.setAlert('�X�̕����Ő����Ȃ����Ă��܂��B', 'A Line curve on ice.'); return false;
			}

			var flag = this.checkLine();
			if( flag==-1 ){
				this.setAlert('�X�^�[�g�ʒu�����ł��܂���ł����B', 'The system can\'t detect start position.'); return false;
			}
			if( flag==1 ){
				this.setAlert('IN�ɐ����ʂ��Ă��܂���B', 'The line doesn\'t go through the \'IN\' arrow.'); return false;
			}
			if( flag==2 ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}
			if( flag==3 ){
				this.setAlert('�Ֆʂ̊O�ɏo�Ă��܂�����������܂��B', 'A line is not reached out the \'OUT\' arrow.'); return false;
			}
			if( flag==4 ){
				this.setAlert('�����t�ɒʂ��Ă��܂��B', 'A line goes through an arrow reverse.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�����ЂƂȂ���ł͂���܂���B', 'Lines are not countinuous.'); return false;
			}

			var iarea = this.searchBWarea(function(id){ return (id!=-1 && bd.QuC(id)==6); });
			if( !this.checkOneNumber(iarea, function(top,lcnt){ return (lcnt==0);}, function(cc){ return this.lcnts.cell[cc]>0;}.bind(this)) ){
				this.setAlert('���ׂẴA�C�X�o�[����ʂ��Ă��܂���B', 'A icebarn is not gone through.'); return false;
			}

			if( !this.checkAllArrow() ){
				this.setAlert('�����ʂ��Ă��Ȃ���󂪂���܂��B', 'A line doesn\'t go through some arrows.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}

			return true;
		};

		ans.checkLineCross = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)==4 && bd.QuC(c)!=6 && bd.QuC(c)!=101){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
		ans.checkLineCurve = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(this.lcntCell(c)==2 && bd.QuC(c)==6 && !ans.isLineStraight(c)){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};

		ans.checkAllArrow = function(){
			for(var id=0;id<bd.border.length;id++){
				if(bd.QuB(id)>0 && bd.LiB(id)==0){
					bd.sErB([id],3);
					return false;
				}
			}
			return true;
		};

		ans.checkLine = function(){
			var bx=bd.border[bd.arrowin].cx, by=bd.border[bd.arrowin].cy;
			var dir=0;
			if     (by==0){ dir=2;}else if(by==2*k.qrows){ dir=1;}
			else if(bx==0){ dir=4;}else if(bx==2*k.qcols){ dir=3;}
			if(dir==0){ return -1;}
			if(bd.LiB(bd.arrowin)!=1){ bd.sErB([bd.arrowin],3); return 1;}

			bd.sErB(bd.borders,2);
			bd.sErB([bd.arrowin],1);

			while(1){
				switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
				if((bx+by)%2==0){
					var cc = bd.cnum(mf(bx/2),mf(by/2));
					if(bd.QuC(cc)!=6){
						if     (ans.lcntCell(cc)!=2){ dir=dir;}
						else if(dir!=1 && bd.LiB(bd.bnum(bx,by+1))==1){ dir=2;}
						else if(dir!=2 && bd.LiB(bd.bnum(bx,by-1))==1){ dir=1;}
						else if(dir!=3 && bd.LiB(bd.bnum(bx+1,by))==1){ dir=4;}
						else if(dir!=4 && bd.LiB(bd.bnum(bx-1,by))==1){ dir=3;}
					}
				}
				else{
					var id = bd.bnum(bx,by);
					bd.sErB([id],1);
					if(bd.LiB(id)!=1){ return 2;}
					if(bd.arrowout==id){ break;}
					else if(id==-1 || id>=bd.bdinside){ return 3;}

					if(((dir==1||dir==3) && bd.QuB(id)==2) || ((dir==2||dir==4) && bd.QuB(id)==1)){ return 4;}
				}
			}

			bd.sErB(bd.borders,0);

			return 0;
		};
	}
};