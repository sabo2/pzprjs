/* 
 * pzprBase.js
 * 
 * pzprBase.js is a base script for playing nikoli puzzles on Web
 * written in JavaScript.
 * 
 * @author  happa.
 * @version v3.2.0p5
 * @date    2009-09-14
 * 
 * This script uses following libraries.
 *  jquery.js (version 1.3.2)
 *  http://jquery.com/
 *  uuCanvas.js (version 1.0)
 *  http://code.google.com/p/uupaa-js-spinoff/	uupaa.js SpinOff Project Home(Google Code)
 * 
 * For improvement of canvas drawing time, I make some change on uupaa-excanvas.js.
 * Please see "//happa add.[20090608]" in uuCanvas.js.
 * 
 * This script is dual licensed under the MIT and Apache 2.0 licenses.
 * http://indi.s58.xrea.com/pzpr/v3/LICENCE.HTML
 * 
 */
var pzprversion="v3.2.0p5";
//----------------------------------------------------------------------------
// ���O���[�o���ϐ�
//---------------------------------------------------------------------------
// Pos�N���X
Pos = function(xx,yy){ this.x = xx; this.y = yy;};
Pos.prototype = {
	set : function(xx,yy){ this.x = xx; this.y = yy;}
};

// �e��p�����[�^�̒�`
var k = {
	// �e�p�Y����setting()�֐��Őݒ肳������
	qcols : 0, qrows : 0,	// �Ֆʂ̉����E�c��
	outside   :  0,			// 1:�Ֆʂ̊O����ID��p�ӂ��� (�폜�\��:�g�p���Ȃ��ł�������)
	irowake   :  0,			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������
	def_csize : 36,			// �f�t�H���g�̃Z���T�C�Y
	def_psize : 24,			// �f�t�H���g�̘g�Omargin�T�C�Y

	iscross      : 0,		// 1:Cross������\�ȃp�Y��
	isborder     : 0,		// 1:Border/Line������\�ȃp�Y��
	isextendcell : 0,		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	isoutsidecross  : 1,	// 1:�O�g���Cross�̔z�u������p�Y��
	isoutsideborder : 0,	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	isborderCross   : 1,	// 1:������������p�Y��
	isCenterLine    : 0,	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	isborderAsLine  : 0,	// 1:���E����line�Ƃ��Ĉ���

	dispzero      : 0,		// 1:0��\�����邩�ǂ���
	isDispHatena  : 1,		// 1:qnum��-2�̂Ƃ��ɁH��\������
	isAnsNumber   : 0,		// 1:�񓚂ɐ�������͂���p�Y��
	isArrowNumber : 0,		// 1:������������͂���p�Y��
	isOneNumber   : 0,		// 1:���̐����������̍����1��������p�Y��
	isDispNumUL   : 0,		// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	NumberWithMB  : 0,		// 1:�񓚂̐����Ɓ��~������p�Y��

	BlackCell     : 0,		// 1:���}�X����͂���p�Y��
	NumberIsWhite : 0,		// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	RBBlackCell   : 0,		// 1:�A�����f�ւ̃p�Y��

	ispzprv3ONLY  : 0,		// �ς��Ղ�v3�ɂ����Ȃ��p�Y��
	isKanpenExist : 0,		// pencilbox/�J���y���ɂ���p�Y��

	// �����Ŏ����I�ɐݒ肳���O���[�o���ϐ�
	puzzleid  : '',			// �p�Y����ID("creek"�Ȃ�)
	callmode  : 'pmake',	// 'pmake':�G�f�B�^ 'pplay':player
	mode      : 3,			// 1:���z�u���[�h 3:�񓚃��[�h
	use       : 1,			// ������@
	irowake   : 0,			// ���̐F���������邩���Ȃ���
	widthmode : 2,			// Canvas�̉������ǂ����邩

	enableKey   : true,		// �L�[���͂͗L����
	enableMouse : true,		// �}�E�X���͂͗L����
	autocheck   : true,		// �񓚓��͎��A�����I�ɓ������킹���邩

	fstruct  : new Array(),		// �t�@�C���̍\��

	cwidth   : this.def_csize,	// �Z���̉���
	cheight  : this.def_csize,	// �Z���̏c��

	p0       : new Pos(this.def_psize, this.def_psize),	// Canvas���ł̔Ֆʂ̍�����W
	cv_oft   : new Pos(0, 0),	// Canvas��window���ł̍�����W
	IEMargin : new Pos(4, 4),	// �}�E�X���͓��ł���錏��margin

	br:{
		IE    : !!(window.attachEvent && !window.opera),
		Opera : !!window.opera,
		WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Gecko : navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
	},
	scriptcheck : false	// �����p
};

var g;						// �O���t�B�b�N�R���e�L�X�g
var Puzzles = new Array();	// �p�Y���ʃN���X

//---------------------------------------------------------------------------
// �����ʃO���[�o���֐�
//---------------------------------------------------------------------------
	//---------------------------------------------------------------------------
	// newEL(tag)      �V����tag��HTML�G�������g��\��jQuery�I�u�W�F�N�g���쐬����
	// unselectable()  jQuery�I�u�W�F�N�g�𕶎���I��s�ɂ���(���\�b�h�`�F�[���L�q�p)
	// getSrcElement() �C�x���g���N�������G�������g��Ԃ�
	// mf()            �����_�ȉ���؎̂Ă�(��int())
	// f_true()        true��Ԃ��֐��I�u�W�F�N�g(�����ɋ�֐��������̂��߂�ǂ������̂�)
	//---------------------------------------------------------------------------
function newEL(tag){ return $(document.createElement(tag));}
$.fn.unselectable = function(){
	if     (k.br.Gecko) { this.css("-moz-user-select","none"  ).css("user-select","none");}
	else if(k.br.WebKit){ this.css("-khtml-user-select","none").css("user-select","none");}
	else{ this.attr("unselectable", "on");}
	return this;
};
function getSrcElement(event){ return event.target || event.srcElement;}

var mf = Math.floor;
function f_true(){ return true;}

	//---------------------------------------------------------------------------
	// toArray()         �z��ɂ���(bind�Ŏg��)
	// Function.bind()   this���֐��ɕR�t������
	// Function.ebind()  this���֐��ɕR�t������(�C�x���g�p)
	// Function.kcbind() this���֐��ɕR�t������(�L�[�{�[�h�C�x���g�p)
	//---------------------------------------------------------------------------
function toArray(inp){ var args=[]; for(var i=0;i<inp.length;i++){ args[i] = inp[i];} return args;}

Function.prototype.bind = function(){
	var args=toArray(arguments);
	var __method = this, obj = args.shift();
	return function(){ return __method.apply(obj, args.concat(toArray(arguments)));}
};
Function.prototype.ebind = function(){
	var args=toArray(arguments);
	var __method = this, obj = args.shift();
	return function(e){ return __method.apply(obj, [e||window.event].concat(args).concat(toArray(arguments)));}
};
Function.prototype.kcbind = function(){
	var args=toArray(arguments), __method = this;
	return function(e){
		ret = __method.apply(kc, [e||window.event].concat(args).concat(toArray(arguments)));
		if(kc.tcMoved){ if(k.br.Gecko||k.br.WebKit){ e.preventDefault();}else if(k.br.IE){ return false;}else{ e.returnValue = false;} }
		return ret;
	}
};

//---------------------------------------------------------------------------
// ��Timer�N���X
//---------------------------------------------------------------------------
Timer = function(){
	this.st = 0;	// �ŏ��̃^�C�}�[�擾�l
	this.TID;		// �^�C�}�[ID
	this.lastOpeCnt = 0;
	this.lastACTime = 0;
	this.worstACCost = 0;

	this.start();
};
Timer.prototype = {
	//---------------------------------------------------------------------------
	// tm.reset()      �^�C�}�[�̃J�E���g��0�ɂ���
	// tm.start()      update()�֐���100ms�Ԋu�ŌĂяo��
	// tm.update()     100ms�P�ʂŌĂяo�����֐�
	// tm.updatetime() �b���̕\�����s��
	// tm.label()      �o�ߎ��Ԃɕ\�����镶�����Ԃ�
	// tm.ACchek()     �������𔻒���Ăяo��
	//---------------------------------------------------------------------------
	reset : function(){
		this.st = 0;
		this.prev = clearInterval(this.TID);
		$("#timerpanel").html(this.label()+"00:00");
		this.worstACCost = 0;
		this.start();
	},
	start : function(){
		this.st = (new Date()).getTime();
		var self = this;
		this.TID = setInterval(this.update.bind(this),100);
	},
	update : function(){
		if(k.callmode!='pmake'){ this.updatetime();}

		if(!kc.isCTRL){ kc.inUNDO=false; kc.inREDO=false;}

		if     (kc.inUNDO)  { um.undo(); }
		else if(kc.inREDO)  { um.redo(); }
		else{ this.ACcheck();}
	},
	updatetime : function(){
		var nowtime = (new Date()).getTime();
		var seconds = mf((nowtime - this.st)/1000);
		var hours   = mf(seconds/3600);
		var minutes = mf(seconds/60) - hours*60;
		seconds = seconds - minutes*60 - hours*3600;

		if(minutes < 10) minutes = "0" + minutes;
		if(seconds < 10) seconds = "0" + seconds;

		if(hours) $("#timerpanel").html(this.label()+hours+":"+minutes+":"+seconds);
		else $("#timerpanel").html(this.label()+minutes+":"+seconds);
	},
	label : function(){
		return lang.isJP()?"�o�ߎ��ԁF":"Time: ";
	},

	ACcheck : function(){
		var nowms = (new Date()).getTime();
		if(nowms - this.lastACTime > 120+(this.worstACCost<250?this.worstACCost*4:this.worstACCost*2+500) && this.lastOpeCnt != um.anscount && !ans.inCheck){
			this.lastACTime = nowms;
			this.lastOpeCnt = um.anscount;
			if(k.autocheck){
				var comp = ans.autocheck();
				if(!comp){ this.worstACCost = Math.max(this.worstACCost, ((new Date()).getTime()-nowms));}
			}
		}
	}
};

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
Cell = function(){
	this.cx;	// �Z����X���W��ێ�����
	this.cy;	// �Z����Y���W��ێ�����
	this.ques;	// �Z���̖��f�[�^(�`��)��ێ�����
	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����
	this.direc;	// �㉺���E�̕���
	this.qans;	// �Z���̉񓚃f�[�^��ێ�����
	this.qsub;	// �Z���̕⏕�f�[�^��ێ�����(��qlight)
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g
	this.numobj2 = '';	// ������\�����邽�߂̃G�������g
};
Cell.prototype = {
	//---------------------------------------------------------------------------
	// cell.cellinit() �Z���̏�������������
	// cell.allclear() �Z����cx,cy,numobj���ȊO���N���A����
	// cell.ansclear() �Z����qans,qsub,error�����N���A����
	// cell.subclear() �Z����qsub,error�����N���A����
	//---------------------------------------------------------------------------
	cellinit : function(num){
		this.allclear(num);
		bd.setposCell(num);
	},
	allclear : function(num) {
		this.qans = -1;
		this.qsub = 0;
		this.ques = 0;
		this.qnum = -1;
		if(k.puzzleid=="tilepaint"||k.puzzleid=="kakuro"){ this.qnum = 0;}
		this.direc = 0;
		if(k.puzzleid=="triplace"){ this.direc = -1;}
		this.error = 0;
	},
	ansclear : function(num) {
		this.qans = -1;
		this.qsub = 0;
		this.error = 0;
	},
	subclear : function(num) {
		this.qsub = 0;
		this.error = 0;
	},
	//---------------------------------------------------------------------------
	// cell.px() cell.py() �Z���̍���A�E���Canvas�̍��W��Ԃ�
	//---------------------------------------------------------------------------
	px : function() { return k.p0.x+this.cx*k.cwidth;},
	py : function() { return k.p0.y+this.cy*k.cheight;}
};

//---------------------------------------------------------------------------
// ��Cross�N���X Board�N���X��Cross�̐������ێ�����(iscross==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(2)
// Cross�N���X�̒�`
Cross = function(){
	this.cx;	// �Z����X���W��ێ�����
	this.cy;	// �Z����Y���W��ێ�����
	this.ques;	// �Z���̖��f�[�^��ێ�����
	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g
};
Cross.prototype = {
	//---------------------------------------------------------------------------
	// cross.cellinit() �����_�̏�������������
	// cross.allclear() �����_��cx,cy,numobj���ȊO���N���A����
	// cross.ansclear() �����_��error�����N���A����
	// cross.subclear() �����_��error�����N���A����
	//---------------------------------------------------------------------------
	cellinit : function(num){
		this.allclear(num);
		bd.setposCross(num);
	},
	allclear : function(num) {
		this.ques = 0;
		this.qnum = -1;
		this.error = 0;
	},
	ansclear : function(num) {
		this.error = 0;
	},
	subclear : function(num) {
		this.error = 0;
	},
	//---------------------------------------------------------------------------
	// cross.px() cell.py() �����_�̒��S�̍��W��Ԃ�
	//---------------------------------------------------------------------------
	px : function() { return k.p0.x+this.cx*k.cwidth; },
	py : function() { return k.p0.y+this.cy*k.cheight;}
};

//---------------------------------------------------------------------------
// ��Border�N���X Board�N���X��Border�̐������ێ�����(isborder==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(3)
// Border�N���X�̒�`
Border = function(){
	this.cx;	// ���E����X���W��ێ�����
	this.cy;	// ���E����Y���W��ێ�����
	this.ques;	// ���E���̖��f�[�^(1:���E������)��ێ�����
	this.qnum;	// ���E���̖��f�[�^(����)��ێ�����
	this.qans;	// ���E���̉񓚃f�[�^(1:���E������)��ێ�����
	this.qsub;	// ���E���̕⏕�f�[�^(1:�⏕��/2:�~)��ێ�����
	this.line;	// ���̉񓚃f�[�^(1:�񓚂̐�����)��ێ�����
	this.color;	// ���̐F�����f�[�^��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g
};
Border.prototype = {
	//---------------------------------------------------------------------------
	// border.cellinit() �����_�̏�������������
	// border.allclear() ���E����cx,cy,numobj���ȊO���N���A����
	// border.ansclear() ���E����qans,qsub,line,color,error�����N���A����
	// border.subclear() ���E����qsub,error�����N���A����
	//---------------------------------------------------------------------------
	cellinit : function(num){
		this.allclear(num);
		bd.setposBorder(num);
	},
	allclear : function(num) {
		this.ques = 0;
		if(k.puzzleid=="mejilink" && num<k.qcols*(k.qrows-1)+(k.qcols-1)*k.qrows){ this.ques = 1;}
		this.qnum = -1;
		this.qans = 0;
		this.qsub = 0;
		if(k.puzzleid=="bosanowa"){ this.qsub = -1;}
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	ansclear : function(num) {
		this.qans = 0;
		this.qsub = 0;
		if(k.puzzleid=="bosanowa"){ this.qsub = -1;}
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	subclear : function(num) {
		this.qsub = 0;
		if(k.puzzleid=="bosanowa"){ this.qsub = -1;}
		this.error = 0;
	},
	//---------------------------------------------------------------------------
	// border.px() border.py() ���E���̒��S�̍��W��Ԃ�
	//---------------------------------------------------------------------------
	px : function() { return k.p0.x+mf(this.cx*k.cwidth/2);},
	py : function() { return k.p0.y+mf(this.cy*k.cheight/2);}
};

//---------------------------------------------------------------------------
// ��Board�N���X �Ֆʂ̏���ێ�����BCell, Cross, Border�̃I�u�W�F�N�g���ێ�����
//---------------------------------------------------------------------------
// Board�N���X�̒�`
Board = function(){
	this.bdinside = 0;		// �Ֆʂ̓���(�O�g��łȂ�)�ɑ��݂��鋫�E���̖{��
	this.initialize2();
};
Board.prototype = {
	//---------------------------------------------------------------------------
	// bd.initialize2()  �f�[�^�̏��������s��
	//---------------------------------------------------------------------------
	initialize2 : function(){
		// Cell�̏���������
		this.cell = new Array();
		this.cells = new Array();
		for(var i=0;i<k.qcols*k.qrows;i++){
			this.cell[i] = new Cell(i);
			this.cell[i].allclear(i);
			this.cells.push(i);
		}

		if(k.iscross){
			this.cross = new Array();	// Cross���`
			this.crosses = new Array();
			for(var i=0;i<(k.qcols+1)*(k.qrows+1);i++){
				this.cross[i] = new Cross(i);
				this.cross[i].allclear(i);
				this.crosses.push(i);
			}
		}

		if(k.isborder){
			this.border = new Array();	// Border/Line���`
			this.borders = new Array();
			this.bdinside = (k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);
			for(var i=0;i<this.bdinside+(k.isoutsideborder==0?0:2*(k.qcols+k.qrows));i++){
				this.border[i] = new Border(i);
				this.border[i].allclear(i);
				this.borders.push(i);
			}
		}

		if(k.isextendcell!=0){
			this.excell = new Array();
			for(var i=0;i<(k.isextendcell==1?k.qcols+k.qrows+1:2*k.qcols+2*k.qrows+4);i++){
				this.excell[i] = new Cell(i);
				this.excell[i].allclear(i);
			}
		}

		this.setposAll();
	},
	//---------------------------------------------------------------------------
	// bd.setposAll()    �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setposCell()�����Ăяo��
	//                   �Ֆʂ̐V�K�쐬��A�g��/�k��/��]/���]���ȂǂɌĂяo�����
	// bd.setposCell()   �Y������id�̃Z����cx,cy�v���p�e�B��ݒ肷��
	// bd.setposCross()  �Y������id�̌����_��cx,cy�v���p�e�B��ݒ肷��
	// bd.setposBorder() �Y������id�̋��E��/Line��cx,cy�v���p�e�B��ݒ肷��
	// bd.setposEXCell() �Y������id��Extend�Z����cx,cy�v���p�e�B��ݒ肷��
	// bd.resize()       ���T�C�Y����px,py������������
	//---------------------------------------------------------------------------
	// setpos�֘A�֐� <- �eCell���������Ă���ƃ������������������̂ł����ɒu������.
	setposAll : function(){
		for(var i=0;i<this.cell.length;i++){ this.setposCell(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.setposCross(i); } }
		if(k.isborder){
			this.bdinside = (k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);
			for(var i=0;i<this.border.length;i++){ this.setposBorder(i);}
		}
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.setposEXcell(i);} }
	},
	setposCell : function(id){
		this.cell[id].cx = id%k.qcols;
		this.cell[id].cy = mf(id/k.qcols);
	},
	setposCross : function(id){
		this.cross[id].cx = id%(k.qcols+1);
		this.cross[id].cy = mf(id/(k.qcols+1));
	},
	setposBorder : function(id){
		if(id>=0 && id<(k.qcols-1)*k.qrows){
			this.border[id].cx = (id%(k.qcols-1))*2+2;
			this.border[id].cy = mf(id/(k.qcols-1))*2+1;
		}
		else if(id>=(k.qcols-1)*k.qrows && id<this.bdinside){
			this.border[id].cx = (id-(k.qcols-1)*k.qrows)%k.qcols*2+1;
			this.border[id].cy = mf((id-(k.qcols-1)*k.qrows)/k.qcols)*2+2;
		}
		else if(id>=this.bdinside && id<this.bdinside+k.qcols){
			this.border[id].cx = (id-this.bdinside)*2+1;
			this.border[id].cy = 0;
		}
		else if(id>=this.bdinside+k.qcols && id<this.bdinside+2*k.qcols){
			this.border[id].cx = (id-this.bdinside-k.qcols)*2+1;
			this.border[id].cy = k.qrows*2;
		}
		else if(id>=this.bdinside+2*k.qcols && id<this.bdinside+2*k.qcols+k.qrows){
			this.border[id].cx = 0;
			this.border[id].cy = (id-this.bdinside-2*k.qcols)*2+1;
		}
		else if(id>=this.bdinside+2*k.qcols+k.qrows && id<this.bdinside+2*(k.qcols+k.qrows)){
			this.border[id].cx = k.qcols*2;
			this.border[id].cy = (id-this.bdinside-2*k.qcols-k.qrows)*2+1;
		}
	},
	setposEXcell : function(id){
		if(k.isextendcell==1){
			if     (id<k.qcols)        { this.excell[id].cx=id; this.excell[id].cy=-1;        }
			else if(id<k.qcols+k.qrows){ this.excell[id].cx=-1; this.excell[id].cy=id-k.qcols;}
			else                       { this.excell[id].cx=-1; this.excell[id].cy=-1;        }
		}
		else if(k.isextendcell==2){
			if     (id<  k.qcols)            { this.excell[id].cx=id;         this.excell[id].cy=-1;                  }
			else if(id<2*k.qcols)            { this.excell[id].cx=id-k.qcols; this.excell[id].cy=k.qrows;             }
			else if(id<2*k.qcols+  k.qrows)  { this.excell[id].cx=-1;         this.excell[id].cy=id-2*k.qcols;        }
			else if(id<2*k.qcols+2*k.qrows)  { this.excell[id].cx=k.qcols;    this.excell[id].cy=id-2*k.qcols-k.qrows;}
			else if(id<2*k.qcols+2*k.qrows+1){ this.excell[id].cx=-1;         this.excell[id].cy=-1;     }
			else if(id<2*k.qcols+2*k.qrows+2){ this.excell[id].cx=k.qcols;    this.excell[id].cy=-1;     }
			else if(id<2*k.qcols+2*k.qrows+3){ this.excell[id].cx=-1;         this.excell[id].cy=k.qrows;}
			else if(id<2*k.qcols+2*k.qrows+4){ this.excell[id].cx=k.qcols;    this.excell[id].cy=k.qrows;}
			else                             { this.excell[id].cx=-1;         this.excell[id].cy=-1;     }
		}
	},
	//---------------------------------------------------------------------------
	// bd.ansclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��ansclear()���Ăяo���ACanvas���ĕ`�悷��
	// bd.subclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��subclear()���Ăяo���ACanvas���ĕ`�悷��
	// bd.errclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��error�v���p�e�B��0�ɂ��āACanvas���ĕ`�悷��
	//---------------------------------------------------------------------------
	ansclear : function(){
		for(var i=0;i<this.cell.length;i++){ this.cell[i].ansclear(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.cross[i].ansclear(i); } }
		if(k.isborder){ for(var i=0;i<this.border.length;i++){ this.border[i].ansclear(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.excell[i].ansclear(i);} }

		pc.paintAll();

		ans.reset();
	},
	subclear : function(){
		for(var i=0;i<this.cell.length;i++){ this.cell[i].subclear(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.cross[i].subclear(i); } }
		if(k.isborder){ for(var i=0;i<this.border.length;i++){ this.border[i].subclear(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.excell[i].subclear(i);} }

		pc.paintAll();
	},
	errclear : function(){
		if(!ans.errDisp){ return;}

		for(var i=0;i<this.cell.length;i++){ this.cell[i].error=0;}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.cross[i].error=0; } }
		if(k.isborder){ for(var i=0;i<this.border.length;i++){ this.border[i].error=0;} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.excell[i].error=0;} }

		ans.errDisp = false;
		pc.paintAll();
	},
	//---------------------------------------------------------------------------
	// bd.isNullCell()   �w�肵��id��Cell��qans��ques���������l�Ɠ��������f����
	// bd.isNullCross()  �w�肵��id��Cross��ques���������l�Ɠ��������f����
	// bd.isNullBorder() �w�肵��id��Border��line��ques���������l�Ɠ��������f����
	//---------------------------------------------------------------------------
	isNullCell : function(id){
		if(id<0 || this.cell.length<=id){ return false;}
		return ((this.cell[id].qans==-1)&&(this.cell[id].qsub==0)&&(this.cell[id].ques==0)&&(this.cell[id].qnum==-1)&&(this.cell[id].direc==0));
	},
	isNullCross : function(id){
		if(id<0 || this.cross.length<=id){ return false;}
		return (this.cross[id].qnum==-1);
	},
	isNullBorder : function(id){
		if(id<0 || this.border.length<=id){ return false;}
		return ((this.border[id].qans==0)&&(this.border[id].qsub==0)&&(this.border[id].ques==0)&&(this.border[id].line==0));
	},

	//---------------------------------------------------------------------------
	// bd.cnum()   (X,Y)�̈ʒu�ɂ���Cell��ID��Ԃ�
	// bd.cnum2()  (X,Y)�̈ʒu�ɂ���Cell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.xnum()   (X,Y)�̈ʒu�ɂ���Cross��ID��Ԃ�
	// bd.xnum2()  (X,Y)�̈ʒu�ɂ���Cross��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.bnum()   (X*2,Y*2)�̈ʒu�ɂ���Border��ID��Ԃ�
	// bd.bnum2()  (X*2,Y*2)�̈ʒu�ɂ���Border��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.exnum()  (X,Y)�̈ʒu�ɂ���extendCell��ID��Ԃ�
	// bd.exnum2() (X,Y)�̈ʒu�ɂ���extendCell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	//---------------------------------------------------------------------------
	cnum : function(cx,cy){
		return (cx>=0&&cx<=k.qcols-1&&cy>=0&&cy<=k.qrows-1)?cx+cy*k.qcols:-1;
	},
	cnum2 : function(cx,cy,qc,qr){
		return (cx>=0&&cx<=qc-1&&cy>=0&&cy<=qr-1)?cx+cy*qc:-1;
	},
	xnum : function(cx,cy){
		return (cx>=0&&cx<=k.qcols&&cy>=0&&cy<=k.qrows)?cx+cy*(k.qcols+1):-1;
	},
	xnum2 : function(cx,cy,qc,qr){
		return (cx>=0&&cx<=qc&&cy>=0&&cy<=qr)?cx+cy*(qc+1):-1;
	},
	bnum : function(cx,cy){
		return this.bnum2(cx,cy,k.qcols,k.qrows);
	},
	bnum2 : function(cx,cy,qc,qr){
		if(cx>=1&&cx<=qc*2-1&&cy>=1&&cy<=qr*2-1){
			if(cx%2==0 && cy%2==1){ return mf((cx-1)/2)+mf((cy-1)/2)*(qc-1);}
			else if(cx%2==1 && cy%2==0){ return mf((cx-1)/2)+mf((cy-2)/2)*qc+(qc-1)*qr;}
		}
		else if(k.isoutsideborder==1){
			if     (cy==0   &&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+mf((cx-1)/2);}
			else if(cy==2*qr&&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+qc+mf((cx-1)/2);}
			else if(cx==0   &&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+mf((cy-1)/2);}
			else if(cx==2*qc&&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+qr+mf((cy-1)/2);}
		}
		return -1;
	},
	exnum : function(cx,cy){
		return this.exnum2(cx,cy,k.qcols,k.qrows);
	},
	exnum2 : function(cx,cy,qc,qr){
		if(k.isextendcell==1){
			if(cx==-1&&cy==-1){ return qc+qr;}
			else if(cy==-1&&cx>=0&&cx<qc){ return cx;}
			else if(cx==-1&&cy>=0&&cy<qr){ return qc+cy;}
		}
		else if(k.isextendcell==2){
			if     (cy==-1&&cx>=0&&cx<qc){ return cx;}
			else if(cy==qr&&cx>=0&&cx<qc){ return qc+cx;}
			else if(cx==-1&&cy>=0&&cy<qr){ return 2*qc+cy;}
			else if(cx==qc&&cy>=0&&cy<qr){ return 2*qc+qr+cy;}
			else if(cx==-1&&cy==-1){ return 2*qc+2*qr;}
			else if(cx==qc&&cy==-1){ return 2*qc+2*qr+1;}
			else if(cx==-1&&cy==qr){ return 2*qc+2*qr+2;}
			else if(cx==qc&&cy==qr){ return 2*qc+2*qr+3;}
		}
		return -1;
	},

	//---------------------------------------------------------------------------
	// bd.up() bd.dn() bd.lt() bd.rt()  �Z���̏㉺���E�ɐڂ���Z����ID��Ԃ�
	//---------------------------------------------------------------------------
	up : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx  ,this.cell[cc].cy-1):-1;},	//��̃Z����ID�����߂�
	dn : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx  ,this.cell[cc].cy+1):-1;},	//���̃Z����ID�����߂�
	lt : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx-1,this.cell[cc].cy  ):-1;},	//���̃Z����ID�����߂�
	rt : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx+1,this.cell[cc].cy  ):-1;},	//�E�̃Z����ID�����߂�
	//---------------------------------------------------------------------------
	// bd.ub() bd.db() bd.lb() bd.rb()  �Z���̏㉺���E�ɂ��鋫�E����ID��Ԃ�
	//---------------------------------------------------------------------------
	ub : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx+1,2*this.cell[cc].cy  ):-1;},	//�Z���̏�̋��E����ID�����߂�
	db : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx+1,2*this.cell[cc].cy+2):-1;},	//�Z���̉��̋��E����ID�����߂�
	lb : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx  ,2*this.cell[cc].cy+1):-1;},	//�Z���̍��̋��E����ID�����߂�
	rb : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx+2,2*this.cell[cc].cy+1):-1;},	//�Z���̉E�̋��E����ID�����߂�

	//---------------------------------------------------------------------------
	// bd.cc1()      ���E���̂����ォ�������ɂ���Z����ID��Ԃ�
	// bd.cc2()      ���E���̂������������E�ɂ���Z����ID��Ԃ�
	// bd.crosscc1() ���E���̂����ォ�������ɂ�������_��ID��Ԃ�
	// bd.crosscc2() ���E���̂������������E�ɂ�������_��ID��Ԃ�
	//---------------------------------------------------------------------------
	cc1 : function(id){
		return this.cnum(mf((bd.border[id].cx-(bd.border[id].cy%2))/2), mf((bd.border[id].cy-(bd.border[id].cx%2))/2) );
	},
	cc2 : function(id){
		return this.cnum(mf((bd.border[id].cx+(bd.border[id].cy%2))/2), mf((bd.border[id].cy+(bd.border[id].cx%2))/2) );
	},
	crosscc1 : function(id){
		return this.xnum(mf((bd.border[id].cx-(bd.border[id].cx%2))/2), mf((bd.border[id].cy-(bd.border[id].cy%2))/2) );
	},
	crosscc2 : function(id){
		return this.xnum(mf((bd.border[id].cx+(bd.border[id].cx%2))/2), mf((bd.border[id].cy+(bd.border[id].cy%2))/2) );
	},

	//---------------------------------------------------------------------------
	// bd.bcntCross() �w�肳�ꂽ�ʒu��Cross�̎���4�}�X�̂���qans==1�̃}�X�̐������߂�
	//---------------------------------------------------------------------------
	bcntCross : function(cx,cy) {
		var cnt = 0;
		if(this.QaC(this.cnum(cx-1, cy-1))==1){ cnt++;}
		if(this.QaC(this.cnum(cx  , cy-1))==1){ cnt++;}
		if(this.QaC(this.cnum(cx-1, cy  ))==1){ cnt++;}
		if(this.QaC(this.cnum(cx  , cy  ))==1){ cnt++;}
		return cnt;
	},

	//---------------------------------------------------------------------------
	// bd.lcntCell()  �w�肳�ꂽ�ʒu��Cell�̏㉺���E�̂�������������Ă���(line==1��)�������߂�
	// bd.lcntCross() �w�肳�ꂽ�ʒu��Cross�̏㉺���E�̂������E����������Ă���(ques==1 or qans==1��)�������߂�
	//---------------------------------------------------------------------------
	lcntCell : function(cx,cy){
		var cc = this.cnum(cx,cy);
		if(cc==-1){ return 0;}

		var cnt = 0;
		if(this.LiB(this.ub(cc))>0){ cnt++;}
		if(this.LiB(this.db(cc))>0){ cnt++;}
		if(this.LiB(this.lb(cc))>0){ cnt++;}
		if(this.LiB(this.rb(cc))>0){ cnt++;}
		return cnt;
	},
	lcntCross : function(cx,cy){
		var self = this;
		var func = function(id){ return (id!=-1&&((self.QuB(id)==1)||(self.QaB(id)==1)));};
		var cnt = 0;
		if(cy>0       && ( (k.isoutsideborder==0 && (cx==0 || cx==k.qcols)) || func(this.bnum(cx*2  ,cy*2-1)) ) ){ cnt++;}
		if(cy<k.qrows && ( (k.isoutsideborder==0 && (cx==0 || cx==k.qcols)) || func(this.bnum(cx*2  ,cy*2+1)) ) ){ cnt++;}
		if(cx>0       && ( (k.isoutsideborder==0 && (cy==0 || cy==k.qrows)) || func(this.bnum(cx*2-1,cy*2  )) ) ){ cnt++;}
		if(cx<k.qcols && ( (k.isoutsideborder==0 && (cy==0 || cy==k.qrows)) || func(this.bnum(cx*2+1,cy*2  )) ) ){ cnt++;}
		return cnt;
	},

	//---------------------------------------------------------------------------
	// bd.backLine()    �w�肳�ꂽID�̏㑤���������瑱������ID��Ԃ�(�����p)
	// bd.nextLine()    �w�肳�ꂽID�̉������E�����瑱������ID��Ԃ�(�����p)
	// bd.forwardLine() �w�肵��ID�̎��ɂ���ID���������ĕԂ�
	//---------------------------------------------------------------------------
	backLine : function(id){
		if(id==-1){ return -1;}
		var straight, curve1, curve2, func;
		if(k.isborderAsLine==0){
			func = this.LiB.bind(bd);
			straight = this.bnum(this.border[id].cx-(this.border[id].cy%2)*2  , this.border[id].cy-(this.border[id].cx%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.bnum(this.border[id].cx+(this.border[id].cx%2)*2-1, this.border[id].cy+(this.border[id].cy%2)*2-1);
		}
		else{
			func = this.QaB.bind(bd);
			straight = this.bnum(this.border[id].cx-(this.border[id].cx%2)*2  , this.border[id].cy-(this.border[id].cy%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.bnum(this.border[id].cx+(this.border[id].cy%2)*2-1, this.border[id].cy+(this.border[id].cx%2)*2-1);
		}

		if     (func(curve1)>0 && func(curve2)<=0){ return curve1;}
		else if(func(curve1)<=0 && func(curve2)>0){ return curve2;}
		else if(!k.isborderCross && func(curve1)>0 && func(curve2)>0){ return curve1;}
		return -1;
	},
	nextLine : function(id){
		if(id==-1){ return -1;}
		var straight, curve1, curve2, func;
		if(k.isborderAsLine==0){
			func = this.LiB.bind(bd);
			straight = this.bnum(this.border[id].cx+(this.border[id].cy%2)*2  , this.border[id].cy+(this.border[id].cx%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.bnum(this.border[id].cx-(this.border[id].cx%2)*2+1, this.border[id].cy-(this.border[id].cy%2)*2+1);
		}
		else{
			func = this.QaB.bind(bd);
			straight = this.bnum(this.border[id].cx+(this.border[id].cx%2)*2  , this.border[id].cy+(this.border[id].cy%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.bnum(this.border[id].cx-(this.border[id].cy%2)*2+1, this.border[id].cy-(this.border[id].cx%2)*2+1);
		}

		if     (func(curve1)>0 && func(curve2)<=0){ return curve1;}
		else if(func(curve1)<=0 && func(curve2)>0){ return curve2;}
		else if(!k.isborderCross && func(curve1)>0 && func(curve2)>0){ return curve1;}
		return -1;
	},
	forwardLine : function(id, backwardid){
		var retid = this.nextLine(id);
		if(retid==-1 || retid==backwardid){ retid = this.backLine(id);}
		if(retid!=backwardid){ return retid;}
		return -1;
	},

	//---------------------------------------------------------------------------
	// bd.isLPup(), bd.isLPdown(), bd.isLPleft(), bd.isLPright()
	//   �㉺���E��LineParts�����݂��Ă��邩���肷��
	// bd.isnoLPup(), bd.isnoLPdown(), bd.isnoLPleft(), bd.isnoLPright()
	//   �㉺���E�����������Ȃ������ɂȂ��Ă��邩���肷��
	//---------------------------------------------------------------------------
	isLPup    : function(cc){ var qs = this.QuC(cc); return (qs==101||qs==102||qs==104||qs==105);},
	isLPdown  : function(cc){ var qs = this.QuC(cc); return (qs==101||qs==102||qs==106||qs==107);},
	isLPleft  : function(cc){ var qs = this.QuC(cc); return (qs==101||qs==103||qs==105||qs==106);},
	isLPright : function(cc){ var qs = this.QuC(cc); return (qs==101||qs==103||qs==104||qs==107);},
	isnoLPup    : function(cc){ var qs = this.QuC(cc); return (qs==1||qs==4||qs==5||qs==21||qs==103||qs==106||qs==107);},
	isnoLPdown  : function(cc){ var qs = this.QuC(cc); return (qs==1||qs==2||qs==3||qs==21||qs==103||qs==104||qs==105);},
	isnoLPleft  : function(cc){ var qs = this.QuC(cc); return (qs==1||qs==2||qs==5||qs==22||qs==102||qs==104||qs==107);},
	isnoLPright : function(cc){ var qs = this.QuC(cc); return (qs==1||qs==3||qs==4||qs==22||qs==102||qs==105||qs==106);},
	//---------------------------------------------------------------------------
	// bd.isLPMarked()      Line�̂ǂ��炩����LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLPCombined()    Line��2�����Ƃ�LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLineNG()        Line�̂ǂ��炩���A���������Ȃ��悤�ɂȂ��Ă��邩���肷��
	// bd.isLP()            ���3�̋��ʊ֐�
	// bd.checkLPCombined() �����Ȃ����Ă��邩�ǂ������āALine==1��ݒ肷��
	//---------------------------------------------------------------------------
	isLPMarked : function(id){
		return  this.isLP(id, function(cc1,cc2){ return (bd.isLPdown(cc1)||bd.isLPup(cc2));}    , function(cc1,cc2){ return (bd.isLPright(cc1)||bd.isLPleft(cc2));}    );
	},
	isLPCombined : function(id){
		return  this.isLP(id, function(cc1,cc2){ return (bd.isLPdown(cc1)&&bd.isLPup(cc2));}    , function(cc1,cc2){ return (bd.isLPright(cc1)&&bd.isLPleft(cc2));}    );
	},
	isLineNG : function(id){
		return !this.isLP(id, function(cc1,cc2){ return (bd.isnoLPdown(cc1)||bd.isnoLPup(cc2));}, function(cc1,cc2){ return (bd.isnoLPright(cc1)||bd.isnoLPleft(cc2));});
	},
	isLP : function(id,funcUD,funcLR){
		var cc1 = this.cc1(id), cc2 = this.cc2(id);
		if(cc1==-1||cc2==-1){ return false;}

		var val1 = this.QuC(cc1);
		var val2 = this.QuC(cc2);
		if     (this.border[id].cx%2==1){ if(funcUD(cc1,cc2)){ return true;} } // �㉺�֌W
		else if(this.border[id].cy%2==1){ if(funcLR(cc1,cc2)){ return true;} } // ���E�֌W
		return false;
	},
	checkLPCombined : function(cc){
		var id;
		id = this.ub(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.db(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.lb(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.rb(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
	},

	//---------------------------------------------------------------------------
	// sQuC / QuC : bd.setQuesCell() / bd.getQuesCell()  �Y������Cell��ques��ݒ肷��/�Ԃ�
	// sQnC / QnC : bd.setQnumCell() / bd.getQnumCell()  �Y������Cell��qnum��ݒ肷��/�Ԃ�
	// sQsC / QsC : bd.setQsubCell() / bd.getQsubCell()  �Y������Cell��qsub��ݒ肷��/�Ԃ�
	// sQaC / QaC : bd.setQansCell() / bd.getQansCell()  �Y������Cell��qans��ݒ肷��/�Ԃ�
	// sDiC / DiC : bd.setDirecCell()/ bd.getDirecCell() �Y������Cell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cell�֘AGet/Set�֐� <- �eCell�������Ă���ƃ������������������̂ł����ɒu������.
	sQuC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'ques', id, this.QuC(id), num);
		this.cell[id].ques = num;

		if(k.puzzleid=="pipelink"||k.puzzleid=="loopsp"){ this.checkLPCombined(id);}
	},
	QuC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].ques;
	},
	sQnC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}
		if(k.dispzero==0 && num==0){ return;}

		var old = this.QnC(id);
		um.addOpe('cell', 'qnum', id, old, num);
		this.cell[id].qnum = num;

		if(k.puzzleid=="lightup" && mv.paintAkari && ((old==-1)^(num==-1))){ mv.paintAkari(id);}
	},
	QnC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qnum;
	},
	sQaC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		var old = this.QaC(id);
		um.addOpe('cell', 'qans', id, old, num);
		this.cell[id].qans = num;

		if(k.puzzleid=="lightup" && mv.paintAkari && ((old==1)^(num==1))){ mv.paintAkari(id);}
	},
	QaC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qans;
	},
	sQsC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'qsub', id, this.QsC(id), num);
		this.cell[id].qsub = num;
	},
	QsC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qsub;
	},
	sDiC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'direc', id, this.DiC(id), num);
		this.cell[id].direc = num;
	},
	DiC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].direc;
	},
	//---------------------------------------------------------------------------
	// sQnE / QnE : bd.setQnumEXcell() / bd.getQnumEXcell()  �Y������EXCell��qnum��ݒ肷��/�Ԃ�
	// sDiE / DiE : bd.setDirecEXcell()/ bd.getDirecEXcell() �Y������EXCell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// EXcell�֘AGet/Set�֐�
	sQnE : function(id, num) {
		if(id<0 || this.excell.length<=id){ return;}
		um.addOpe('excell', 'qnum', id, this.excell[id].qnum, num);
		this.excell[id].qnum = num;
	},
	QnE : function(id){
		if(id<0 || this.excell.length<=id){ return -1;}
		return this.excell[id].qnum;
	},
	sDiE : function(id, num) {
		if(id<0 || this.excell.length<=id){ return;}
		um.addOpe('excell', 'direc', id, this.excell[id].direc, num);
		this.excell[id].direc = num;
	},
	DiE : function(id){
		if(id<0 || this.excell.length<=id){ return -1;}
		return this.excell[id].direc;
	},

	//---------------------------------------------------------------------------
	// sQuX / QuX : bd.setQuesCross(id,num) / bd.getQuesCross() �Y������Cross��ques��ݒ肷��/�Ԃ�
	// sQnX / QnX : bd.setQnumCross(id,num) / bd.getQnumCross() �Y������Cross��qnum��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cross�֘AGet/Set�֐� <- �eCross�������Ă���ƃ������������������̂ł����ɒu������.
	sQuX : function(id, num) {
		if(id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'ques', id, this.QuX(id), num);
		this.cross[id].ques = num;
	},
	QuX : function(id){
		if(id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].ques;
	},
	sQnX : function(id, num) {
		if(id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'qnum', id, this.QnX(id), num);
		this.cross[id].qnum = num;
	},
	QnX : function(id){
		if(id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].qnum;
	},

	//---------------------------------------------------------------------------
	// sQuB / QuB : bd.setQuesBorder() / bd.getQuesBorder() �Y������Border��ques��ݒ肷��/�Ԃ�
	// sQnB / QnB : bd.setQnumBorder() / bd.getQnumBorder() �Y������Border��qnum��ݒ肷��/�Ԃ�
	// sQaB / QaB : bd.setQansBorder() / bd.getQansBorder() �Y������Border��qans��ݒ肷��/�Ԃ�
	// sQsB / QsB : bd.setQsubBorder() / bd.getQsubBorder() �Y������Border��qsub��ݒ肷��/�Ԃ�
	// sLiB / LiB : bd.setLineBorder() / bd.getLineBorder() �Y������Border��line��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Border�֘AGet/Set�֐� <- �eBorder�������Ă���ƃ������������������̂ł����ɒu������.
	sQuB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].ques == num){ return;}

		if(!k.isCenterLine && num!=1){ ans.setLcnts(id, num);}

		um.addOpe('border', 'ques', id, this.QuB(id), num);
		this.border[id].ques = num;

		if(!k.isCenterLine && num==1){ ans.setLcnts(id, num);}

		if(room.isEnable()){
			if(num==1){ room.setLineToRarea(id);}
			else{ room.removeLineFromRarea(id);}
		}
	},
	QuB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].ques;
	},
	sQnB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].qnum == num){ return;}

		um.addOpe('border', 'qnum', id, this.QnB(id), num);
		this.border[id].qnum = num;
	},
	QnB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qnum;
	},
	sQaB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].qans == num){ return;}
		var old = this.border[id].qans;

		if(k.irowake!=0 && k.isborderAsLine && old>0 && num<=0){ col.setLineColor(id, num);}
		if(!k.isCenterLine && num!=1){ ans.setLcnts(id, num);}

		um.addOpe('border', 'qans', id, old, num);
		this.border[id].qans = num;

		if(k.irowake!=0 && k.isborderAsLine && old<=0 && num>0){ col.setLineColor(id, num);}
		if(!k.isCenterLine && num==1){ ans.setLcnts(id, num);}
	},
	QaB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qans;
	},
	sQsB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].qsub == num){ return;}

		um.addOpe('border', 'qsub', id, this.QsB(id), num);
		this.border[id].qsub = num;
	},
	QsB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qsub;
	},
	sLiB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].line == num){ return;}
		if((num==1 && !bd.isLineNG(id))||(num!=1 && bd.isLPCombined(id))){ return;}
		if(num==1 && k.puzzleid=="barns" && this.QuB(id)==1){ return;}
		var old = this.LiB(id);

		if(k.irowake!=0 && old>0 && num<=0){ col.setLineColor(id, num);}
		if(k.isCenterLine && old>0 && num<=0){ ans.setLcnts(id, num);}

		um.addOpe('border', 'line', id, old, num);
		this.border[id].line = num;

		if(k.irowake!=0 && old<=0 && num>0){ col.setLineColor(id, num);}
		if(k.isCenterLine && old<=0 && num>0){ ans.setLcnts(id, num);}
	},
	LiB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].line;
	},

	//---------------------------------------------------------------------------
	// sErC / ErC : bd.setErrorCell()   / bd.getErrorCell()   �Y������Cell��line��ݒ肷��/�Ԃ�
	// sErX / ErX : bd.setErrorCross()  / bd.getErrorCross()  �Y������Cross��line��ݒ肷��/�Ԃ�
	// sErB / ErB : bd.setErrorBorder() / bd.getErrorBorder() �Y������Border��line��ݒ肷��/�Ԃ�
	// sErE / ErE : bd.setErrorEXcell() / bd.getErrorEXcell() �Y������EXcell��line��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Get/SetError�֐�(set�͔z��œ���)
	sErC : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.cell.length>idlist[i]){ this.cell[idlist[i]].error = num;} }
	},
	ErC : function(id){
		if(id<0 || this.cell.length<=id){ return 0;}
		return this.cell[id].error;
	},
	sErX : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.cross.length>idlist[i]){ this.cross[idlist[i]].error = num;} }
	},
	ErX : function(id){
		if(id<0 || this.cross.length<=id){ return 0;}
		return this.cross[id].error;
	},
	sErB : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.border.length>idlist[i]){ this.border[idlist[i]].error = num;} }
	},
	ErB : function(id){
		if(id<0 || this.border.length<=id){ return 0;}
		return this.border[id].error;
	},
	sErE : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.excell.length>idlist[i]){ this.excell[idlist[i]].error = num;} }
	},
	ErE : function(id){
		if(id<0 || this.excell.length<=id){ return 0;}
		return this.excell[id].error;
	}
};

//---------------------------------------------------------------------------
// ��Graphic�N���X Canvas�ɕ`�悷��
//---------------------------------------------------------------------------
// �p�Y������ Canvas/DOM���䕔
// Graphic�N���X�̒�`
Graphic = function(){
	// �Ֆʂ�Cell�𕪂���F
	this.BDlinecolor = "black";
	this.chassisflag = true;

	// �Z���̐F(���}�X)
	this.Cellcolor = "black";
	this.errcolor1 = "rgb(224, 0, 0)";
	this.errcolor2 = "rgb(64, 64, 255)";
	this.errcolor3 = "rgb(0, 191, 0)";

	// �Z���́��~�̐F(�⏕�L��)
	this.MBcolor = "rgb(255, 127, 64)";

	this.qsubcolor1 = "rgb(160,255,160)";
	this.qsubcolor2 = "rgb(255,255,127)";
	this.qsubcolor3 = "rgb(192,192,255)";

	// �t�H���g�̐F(���}�X/���}�X)
	this.fontcolor = "black";
	this.fontAnscolor = "rgb(0, 160, 0)";
	this.fontErrcolor = "rgb(191, 0, 0)";
	this.BCell_fontcolor = "white";

	this.fontsizeratio = 1.0;	// �����̔{��

	this.borderfontcolor = "black";

	// �Z���̔w�i�F(���}�X)
	this.bcolor = "white";
	this.dotcolor = "black";
	this.errbcolor1 = "rgb(255, 191, 191)";
	this.errbcolor2 = "rgb(64, 255, 64)";

	this.icecolor = "rgb(192, 224, 255)";

	// �t�H���g�̐F(��_�̐���)
	this.crossnumcolor = "black";

	this.crosssize = 0.4;

	// ques=51�̂Ƃ��A���͂ł���ꏊ�̔w�i�F
	this.TTcolor = "rgb(127,255,127)";

	// ���E���̐F
	this.BorderQuescolor = "black";
	this.BorderQanscolor = "rgb(0, 191, 0)";
	this.BorderQsubcolor = "rgb(255, 0, 255)";

	this.errBorderQanscolor2 = "rgb(160, 160, 160)";

	this.BBcolor = "rgb(96, 96, 96)"; // ���E���ƍ��}�X�𕪂���F

	// ���E�~�̐F
	this.linecolor = "rgb(0, 160, 0)";	// �F�����Ȃ��̏ꍇ
	this.pekecolor = "rgb(32, 32, 255)";

	this.errlinecolor1 = "rgb(255, 0, 0)";
	this.errlinecolor2 = "rgb(160, 160, 160)";

	this.zstable   = false;
	this.resizeflag= false;

	this.lw = 1;	// LineWidth ���E���ELine�̑���
	this.lm = 1;	// LineMargin

	this.textenable = false;
};
Graphic.prototype = {
	//---------------------------------------------------------------------------
	// pc.onresize_func() resize���ɃT�C�Y��ύX����
	// pc.already()       Canvas�����p�ł��邩(Safari3�΍��p)
	//---------------------------------------------------------------------------
	onresize_func : function(){
		this.lw = (mf(k.cwidth/12)>=3?mf(k.cwidth/12):3);
		this.lm = mf((this.lw-1)/2);

		//this.textenable = !!g.fillText;
	},
	already : function(){
		if(!k.br.IE){ return true;}
		return uuCanvas.already();
	},
	//---------------------------------------------------------------------------
	// pc.paint()       ���W(x1,y1)-(x2,y2)���ĕ`�悷��B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// pc.paintAll()    �S�̂��ĕ`�悷��
	// pc.paintBorder() �w�肳�ꂽBorder�̎�����ĕ`�悷��
	// pc.paintLine()   �w�肳�ꂽLine�̎�����ĕ`�悷��
	// pc.paintCell()   �w�肳�ꂽCell���ĕ`�悷��
	// pc.paintEXcell() �w�肳�ꂽEXCell���ĕ`�悷��
	//---------------------------------------------------------------------------
	paint : function(x1,y1,x2,y2){ }, //�I�[�o�[���C�h�p
	paintAll : function(){ if(this.already()){ this.paint(-1,-1,k.qcols,k.qrows);} },
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paint(mf((bd.border[id].cx-1)/2)-1, mf(bd.border[id].cy/2)-1,
					   mf((bd.border[id].cx-1)/2)+1, mf(bd.border[id].cy/2)   );
		}
		else{
			this.paint(mf(bd.border[id].cx/2)-1, mf((bd.border[id].cy-1)/2)-1,
					   mf(bd.border[id].cx/2)  , mf((bd.border[id].cy-1)/2)+1 );
		}
	},
	paintLine : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paint(mf((bd.border[id].cx-1)/2), mf(bd.border[id].cy/2)-1,
					   mf((bd.border[id].cx-1)/2), mf(bd.border[id].cy/2)   );
		}
		else{
			this.paint(mf(bd.border[id].cx/2)-1, mf((bd.border[id].cy-1)/2),
					   mf(bd.border[id].cx/2)  , mf((bd.border[id].cy-1)/2) );
		}
	},
	paintCell : function(cc){
		if(isNaN(cc) || !bd.cell[cc]){ return;}
		this.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	paintEXcell : function(ec){
		if(isNaN(ec) || !bd.excell[ec]){ return;}
		this.paint(bd.excell[ec].cx, bd.excell[ec].cy, bd.excell[ec].cx, bd.excell[ec].cy);
	},

	//---------------------------------------------------------------------------
	// pc.cellinside()   ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cell��ID���X�g���擾����
	// pc.crossinside()  ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cross��ID���X�g���擾����
	// pc.borderinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Border��ID���X�g���擾����
	//---------------------------------------------------------------------------
	cellinside : function(x1,y1,x2,y2,func){
		if(func==null){ func = f_true;}
		var clist = new Array();
		for(var cy=y1;cy<=y2;cy++){
			for(var cx=x1;cx<=x2;cx++){
				var c = bd.cnum(cx,cy);
				if(c!=-1 && func(c)){ clist.push(c);}
			}
		}
		return clist;
	},
	crossinside : function(x1,y1,x2,y2,func){
		if(func==null){ func = f_true;}
		var clist = new Array();
		for(var cy=y1;cy<=y2;cy++){
			for(var cx=x1;cx<=x2;cx++){
				var c = bd.xnum(cx,cy);
				if(c!=-1 && func(c)){ clist.push(c);}
			}
		}
		return clist;
	},
	borderinside : function(x1,y1,x2,y2,func){
		if(func==null){ func = f_true;}
		var idlist = new Array();
		for(var by=y1;by<=y2;by++){
			for(var bx=x1;bx<=x2;bx++){
				if((bx+by)%2==0){ continue;}
				var id = bd.bnum(bx,by);
				if(id!=-1 && func(id)){ idlist.push(id);}
			}
		}
		return idlist;
	},

	//---------------------------------------------------------------------------
	// pc.inputPath()  ���X�g����g.lineTo()���̊֐����Ăяo��
	//---------------------------------------------------------------------------
	inputPath : function(parray, isClose){
		g.beginPath();
		g.moveTo(mf(parray[0]+parray[2]), mf(parray[1]+parray[3]));
		for(var i=4;i<parray.length;i+=2){ g.lineTo(mf(parray[0]+parray[i+0]), mf(parray[1]+parray[i+1]));}
		if(isClose==1){ g.closePath();}
	},

	//---------------------------------------------------------------------------
	// pc.drawBlackCells() Cell�́���Canvas�ɏ�������
	// pc.drawWhiteCells() �w�i�F/�E(pc.bcolor=="white"�̏ꍇ)��Canvas�ɏ�������
	// pc.drawQsubCells()  Cell��Qsub�̔w�i�F��Canvas�ɏ�������
	// pc.drawErrorCells() Error����Cell�̔w�i�F��Canvas�ɏ�������
	// pc.drawErrorCell1() Error����Cell�̔w�i�F��Canvas�ɏ�������(1�}�X�̂�)
	// pc.drawIcebarns()   �A�C�X�o�[���̔w�i�F��Canvas�ɏ�������
	// pc.drawBCells()     Cell�̍��}�X�{���}�X��̐�����Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawBlackCells : function(x1,y1,x2,y2){
		var dsize = k.cwidth*0.06;
		var clist = this.cellinside(x1,y1,x2,y2,function(c){ return (bd.QaC(c)==1);});
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if     (bd.ErC(c)==0){ g.fillStyle = this.Cellcolor;}
			else if(bd.ErC(c)==1){ g.fillStyle = this.errcolor1;}
			else if(bd.ErC(c)==2){ g.fillStyle = this.errcolor2;}
			else if(bd.ErC(c)==3){ g.fillStyle = this.errcolor3;}
			if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth+1, k.cheight+1);}
			this.vhide("c"+c+"_dot_");
		}
		this.vinc();
	},
	drawWhiteCells : function(x1,y1,x2,y2){
		var dsize = mf(k.cwidth*0.06);
		var clist = this.cellinside(x1,y1,x2,y2,function(c){ return (bd.QaC(c)!=1);});
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			this.drawErrorCell1(c);

			if(bd.QsC(c)==1){
				if(this.bcolor=="white"){
					g.fillStyle = this.dotcolor;
					if(this.vnop("c"+c+"_dot_",1)){
						g.beginPath();
						g.arc(mf(bd.cell[c].px()+k.cwidth/2), mf(bd.cell[c].py()+k.cheight/2), dsize, 0, Math.PI*2, false);
						g.fill();
					}
					if(bd.ErC(c)==0){ this.vhide("c"+c+"_full_");}
				}
				else if(bd.ErC(c)==0){
					g.fillStyle = this.bcolor;
					if(this.vnop("c"+c+"_full_",1)){
						g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth+1, k.cheight+1);
					}
				}
			}
			else{ if(bd.ErC(c)==0){ this.vhide("c"+c+"_full_");} this.vhide("c"+c+"_dot_");}
		}
		this.vinc();
	},
	drawQSubCells : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if     (bd.ErC(c)==1){ g.fillStyle = this.errbcolor1;}
			else if(bd.ErC(c)==2){ g.fillStyle = this.errbcolor2;}
			else if(bd.QsC(c)==1){ g.fillStyle = this.qsubcolor1;}
			else if(bd.QsC(c)==2){ g.fillStyle = this.qsubcolor2;}
			else if(bd.QsC(c)==3){ g.fillStyle = this.qsubcolor3;}
			else{ this.vhide("c"+c+"_full_"); continue;}
			if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth, k.cheight);}
		}
		this.vinc();
	},
	drawErrorCells : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){ this.drawErrorCell1(clist[i]);}
		this.vinc();
	},
	drawErrorCell1 : function(cc){
		if(bd.ErC(cc)==1||bd.ErC(cc)==2){
			if     (bd.ErC(cc)==1){ g.fillStyle = this.errbcolor1;}
			else if(bd.ErC(cc)==2){ g.fillStyle = this.errbcolor2;}
			if(this.vnop("c"+cc+"_full_",1)){ g.fillRect(bd.cell[cc].px(), bd.cell[cc].py(), k.cwidth, k.cheight);}
		}
		else{ this.vhide("c"+cc+"_full_");}
	},
	drawIcebarns : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.QuC(c)==6){
				g.fillStyle = (bd.ErC(c)==1?this.errbcolor1:this.icecolor);
				if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth, k.cheight);}
			}
			else{ this.vhide("c"+c+"_full_");}
		}
		this.vinc();
	},
	drawBCells : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.QnC(c)!=-1){
				if(bd.ErC(c)==1){ g.fillStyle = this.errcolor1;}
				else{ g.fillStyle = this.Cellcolor;}
				if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth+1, k.cheight+1);}
			}
			else if(bd.ErC(c)==0 && !(k.puzzleid=="lightup" && ans.isShined && ans.isShined(c))){ this.vhide("c"+c+"_full_");}
			this.dispnumCell_General(c);
		}
		this.vinc();
	},
	drawDots : function(x1,y1,x2,y2){
		var ksize = k.cwidth*0.15;

		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.QsC(c)==1){
				g.fillStyle = this.dotcolor;
				if(this.vnop("c"+c+"_dot_",1)){ g.fillRect(bd.cell[c].px()+mf(k.cwidth/2)-mf(ksize/2), bd.cell[c].py()+mf(k.cheight/2)-mf(ksize/2), ksize, ksize);}
			}
			else{ this.vhide("c"+c+"_dot_");}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbers()      Cell�̐�����Canvas�ɏ�������
	// pc.drawArrowNumbers() Cell�̐����Ɩ���Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawNumbers : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){ this.dispnumCell_General(clist[i]);}
		this.vinc();
	},
	drawArrowNumbers : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if     (bd.QaC(c)==1){ g.fillStyle = this.BCell_fontcolor;}
			else if(bd.ErC(c)==1){ g.fillStyle = this.fontErrcolor;}
			else{ g.fillStyle = this.fontcolor;}

			var dir = bd.DiC(c);
			if(bd.QnC(c)!=-1 && (bd.QnC(c)!=-2||k.isDispHatena) && dir!=0){
				var ll = mf(k.cwidth*0.7); 	//LineLength
				var ls = mf((k.cwidth-ll)/2);	//LineStart
				var lw = (mf(k.cwidth/24)>=1?mf(k.cwidth/24):1); //LineWidth
				var lm = mf((lw-1)/2); //LineMargin
				var px=bd.cell[c].px(), py=bd.cell[c].py();

				if((dir==1||dir==2) && this.vnop("c"+c+"_ar1_",1)){
					px=px+k.cwidth-mf(ls*1.5)-lm; py=py+ls+1;
					g.fillRect(px, py+(dir==1?ls:0), lw, ll-ls);
					px+=lw/2;
				}
				if((dir==3||dir==4) && this.vnop("c"+c+"_ar3_",1)){
					px=px+ls+1; py=py+mf(ls*1.5)-lm;
					g.fillRect(px+(dir==3?ls:0), py, ll-ls, lw);
					py+=lw/2;
				}

				if(dir==1){ if(this.vnop("c"+c+"_dt1_",1)){ this.inputPath([px   ,py     ,0,0  ,-ll/6   ,ll/3  , ll/6  , ll/3], true); g.fill();} }else{ this.vhide("c"+c+"_dt1_");}
				if(dir==2){ if(this.vnop("c"+c+"_dt2_",1)){ this.inputPath([px   ,py+ll  ,0,0  ,-ll/6  ,-ll/3  , ll/6  ,-ll/3], true); g.fill();} }else{ this.vhide("c"+c+"_dt2_");}
				if(dir==3){ if(this.vnop("c"+c+"_dt3_",1)){ this.inputPath([px   ,py     ,0,0  , ll*0.3,-ll/6  , ll*0.3, ll/6], true); g.fill();} }else{ this.vhide("c"+c+"_dt3_");}
				if(dir==4){ if(this.vnop("c"+c+"_dt4_",1)){ this.inputPath([px+ll,py     ,0,0  ,-ll*0.3,-ll/6  ,-ll*0.3, ll/6], true); g.fill();} }else{ this.vhide("c"+c+"_dt4_");}
			}
			else{ this.vhide(["c"+c+"_ar1_","c"+c+"_ar3_","c"+c+"_dt1_","c"+c+"_dt2_","c"+c+"_dt3_","c"+c+"_dt4_"]);}

			this.dispnumCell_General(c);
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawCrosses()    Cross�̊ې�����Canvas�ɏ�������
	// pc.drawCrossMarks() Cross��̍��_��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawCrosses : function(x1,y1,x2,y2){
		var csize = mf(k.cwidth*this.crosssize+1);
		var clist = this.crossinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.QnX(c)!=-1){
				if(bd.ErX(c)==1){ g.fillStyle = this.errcolor1;}
				else{ g.fillStyle = "white";}
				if(this.vnop("x"+c+"_cp1_",1)){
					g.beginPath();
					g.arc(bd.cross[c].px(), bd.cross[c].py(), csize, 0, Math.PI*2, false);
					g.fill();
				}

				g.lineWidth = 1;
				g.strokeStyle = "black";
				if(this.vnop("x"+c+"_cp2_",0)){
					if(k.br.IE){
						g.beginPath();
						g.arc(bd.cross[c].px(), bd.cross[c].py(), csize, 0, Math.PI*2, false);
					}
					g.stroke();
				}
			}
			else{ this.vhide(["x"+c+"_cp1_", "x"+c+"_cp2_"]);}
			this.dispnumCross(c);
		}
		this.vinc();
	},
	drawCrossMarks : function(x1,y1,x2,y2){
		var csize = k.cwidth*this.crosssize;
		var clist = this.crossinside(x1-1,y1-1,x2+1,y2+1,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.QnX(c)==1){
				if(bd.ErX(c)==1){ g.fillStyle = this.errcolor1;}
				else{ g.fillStyle = this.crossnumcolor;}

				if(this.vnop("x"+c+"_cm_",1)){
					g.beginPath();
					g.arc(bd.cross[c].px(), bd.cross[c].py(), csize, 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide("x"+c+"_cm_");}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawBorders()     ���E����Canvas�ɏ�������
	// pc.drawIceBorders()  �A�C�X�o�[���̋��E����Canvas�ɏ�������
	// pc.drawBorder1()     id���w�肵��1�J���̋��E����Canvas�ɏ�������
	// pc.drawBorder1x()    x,y���w�肵��1�J���̋��E����Canvas�ɏ�������
	// pc.drawBorderQsubs() ���E���p�̕⏕�L����Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawBorders : function(x1,y1,x2,y2){
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			this.drawBorder1(id, (bd.QuB(id)==1 || bd.QaB(id)==1));
		}
		this.vinc();
	},
	drawIceBorders : function(x1,y1,x2,y2){
		g.fillStyle = pc.Cellcolor;
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i], cc1 = bd.cc1(id), cc2 = bd.cc2(id);
			this.drawBorder1x(bd.border[id].cx,bd.border[id].cy,(cc1!=-1&&cc2!=-1&&(bd.QuC(cc1)==6^bd.QuC(cc2)==6)));
		}
		this.vinc();
	},
	drawBorder1 : function(id, flag){
		var addlw=0;
		if(bd.QaB(id)!=1){ g.fillStyle = this.BorderQuescolor;}
		else if(bd.QaB(id)==1){
			if     (k.isborderAsLine==0 && bd.ErB(id)==1){ g.fillStyle = this.errcolor1;}
			else if(k.isborderAsLine==0 && bd.ErB(id)==2){ g.fillStyle = this.errBorderQanscolor2;}
			else if(k.isborderAsLine==1 && bd.ErB(id)==1){ g.fillStyle = this.errlinecolor1; this.lw++; addlw++;}
			else if(k.isborderAsLine==1 && bd.ErB(id)==2){ g.fillStyle = this.errlinecolor2;}
			else if(k.isborderAsLine==0 || k.irowake==0 || !menu.getVal('irowake') || !bd.border[id].color){ g.fillStyle = this.BorderQanscolor;}
			else{ g.fillStyle = bd.border[id].color;}
		}
		this.drawBorder1x(bd.border[id].cx,bd.border[id].cy,flag);
		this.lw -= addlw;
	},
	drawBorder1x : function(bx,by,flag){
		//var lw = this.lw, lm = this.lm, pid = "b"+bx+"_"+by+"_bd_";
		var pid = "b"+bx+"_"+by+"_bd_";
		if(!flag){ this.vhide(pid);}
		else if(by%2==1){ if(this.vnop(pid,1)){ g.fillRect(k.p0.x+mf(bx*k.cwidth/2)-this.lm, k.p0.x+mf((by-1)*k.cheight/2)-this.lm, this.lw, k.cheight+this.lw);} }
		else if(bx%2==1){ if(this.vnop(pid,1)){ g.fillRect(k.p0.x+mf((bx-1)*k.cwidth/2)-this.lm, k.p0.x+mf(by*k.cheight/2)-this.lm, k.cwidth+this.lw,  this.lw);} }
	},

	drawBorderQsubs : function(x1,y1,x2,y2){
		var m = mf(k.cwidth*0.15); //Margin
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.QsB(id)==1){ g.fillStyle = this.BorderQsubcolor;}
			else{ this.vhide("b"+id+"_qsub1_"); continue;}

			if     (bd.border[id].cx%2==1){ if(this.vnop("b"+id+"_qsub1_",1)){ g.fillRect(bd.border[id].px(),                  bd.border[id].py()-mf(k.cheight/2)+m, 1,            k.cheight-2*m);} }
			else if(bd.border[id].cy%2==1){ if(this.vnop("b"+id+"_qsub1_",1)){ g.fillRect(bd.border[id].px()-mf(k.cwidth/2)+m, bd.border[id].py(),                   k.cwidth-2*m, 1            );} }
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawBoxBorders() ���E���ƍ��}�X�̊Ԃ̐���`�悷��
	//---------------------------------------------------------------------------
	// �O�g���Ȃ��ꍇ�͍l�����Ă��܂���
	drawBoxBorders  : function(x1,y1,x2,y2,tileflag){
		var lw = this.lw, lm = this.lm+1;
		var cw = k.cwidth;
		var ch = k.cheight;

		g.fillStyle = this.BBcolor;

		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.QaC(c)!=1){ for(var n=1;n<=12;n++){ this.vhide("c"+c+"_bb"+n+"_");} continue;}

			var bx = 2*bd.cell[c].cx+1;
			var by = 2*bd.cell[c].cy+1;

			var px = bd.cell[c].px();
			var py = bd.cell[c].py();

			var isUP = ((bd.QuB(bd.ub(c))!=1) && !(!k.isoutsideborder&&by<=1));
			var isLT = ((bd.QuB(bd.lb(c))!=1) && !(!k.isoutsideborder&&bx<=1));
			var isRT = ((bd.QuB(bd.rb(c))!=1) && !(!k.isoutsideborder&&bx>=2*k.qcols-1));
			var isDN = ((bd.QuB(bd.db(c))!=1) && !(!k.isoutsideborder&&by>=2*k.qrows-1));

			var isUL = (bd.QuB(bd.bnum(bx-2,by-1))!=1 && bd.QuB(bd.bnum(bx-1,by-2))!=1);
			var isUR = (bd.QuB(bd.bnum(bx+2,by-1))!=1 && bd.QuB(bd.bnum(bx+1,by-2))!=1);
			var isDL = (bd.QuB(bd.bnum(bx-2,by+1))!=1 && bd.QuB(bd.bnum(bx-1,by+2))!=1);
			var isDR = (bd.QuB(bd.bnum(bx+2,by+1))!=1 && bd.QuB(bd.bnum(bx+1,by+2))!=1);

			if(!isLT){ if(this.vnop("c"+c+"_bb1_",1)){ g.fillRect(px   +lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide("c"+c+"_bb1_");}
			if(!isRT){ if(this.vnop("c"+c+"_bb2_",1)){ g.fillRect(px+cw-lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide("c"+c+"_bb2_");}
			if(!isUP){ if(this.vnop("c"+c+"_bb3_",1)){ g.fillRect(px   +lm, py   +lm, cw-lw,1    );} }else{ this.vhide("c"+c+"_bb3_");}
			if(!isDN){ if(this.vnop("c"+c+"_bb4_",1)){ g.fillRect(px   +lm, py+ch-lm, cw-lw,1    );} }else{ this.vhide("c"+c+"_bb4_");}

			if(tileflag){
				if(isLT&&!(isUL&&isUP)){ if(this.vnop("c"+c+"_bb5_",1)){ g.fillRect(px   -lm, py   +lm, lw+1,1   );} }else{ this.vhide("c"+c+"_bb5_");}
				if(isLT&&!(isDL&&isDN)){ if(this.vnop("c"+c+"_bb6_",1)){ g.fillRect(px   -lm, py+ch-lm, lw+1,1   );} }else{ this.vhide("c"+c+"_bb6_");}
				if(isUP&&!(isUL&&isLT)){ if(this.vnop("c"+c+"_bb7_",1)){ g.fillRect(px   +lm, py   -lm, 1   ,lw+1);} }else{ this.vhide("c"+c+"_bb7_");}
				if(isUP&&!(isUR&&isRT)){ if(this.vnop("c"+c+"_bb8_",1)){ g.fillRect(px+cw-lm, py   -lm, 1   ,lw+1);} }else{ this.vhide("c"+c+"_bb8_");}
			}
			else{
				if(isLT&&!(isUL&&isUP)){ if(this.vnop("c"+c+"_bb5_" ,1)){ g.fillRect(px      , py   +lm, lm+1,1   );} }else{ this.vhide("c"+c+"_bb5_"); }
				if(isLT&&!(isDL&&isDN)){ if(this.vnop("c"+c+"_bb6_" ,1)){ g.fillRect(px      , py+ch-lm, lm+1,1   );} }else{ this.vhide("c"+c+"_bb6_"); }
				if(isUP&&!(isUL&&isLT)){ if(this.vnop("c"+c+"_bb7_" ,1)){ g.fillRect(px   +lm, py      , 1   ,lm+1);} }else{ this.vhide("c"+c+"_bb7_"); }
				if(isUP&&!(isUR&&isRT)){ if(this.vnop("c"+c+"_bb8_" ,1)){ g.fillRect(px+cw-lm, py      , 1   ,lm+1);} }else{ this.vhide("c"+c+"_bb8_"); }
				if(isRT&&!(isUR&&isUP)){ if(this.vnop("c"+c+"_bb9_" ,1)){ g.fillRect(px+cw-lm, py   +lm, lm+1,1   );} }else{ this.vhide("c"+c+"_bb9_"); }
				if(isRT&&!(isDR&&isDN)){ if(this.vnop("c"+c+"_bb10_",1)){ g.fillRect(px+cw-lm, py+ch-lm, lm+1,1   );} }else{ this.vhide("c"+c+"_bb10_");}
				if(isDN&&!(isDL&&isLT)){ if(this.vnop("c"+c+"_bb11_",1)){ g.fillRect(px   +lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide("c"+c+"_bb11_");}
				if(isDN&&!(isDR&&isRT)){ if(this.vnop("c"+c+"_bb12_",1)){ g.fillRect(px+cw-lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide("c"+c+"_bb12_");}
			}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawLines()   �񓚂̐���Canvas�ɏ�������
	// pc.drawLine1()   �񓚂̐���Canvas�ɏ�������(1�J���̂�)
	// pc.drawPekes()   ���E����́~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawLines : function(x1,y1,x2,y2){
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
		for(var i=0;i<idlist.length;i++){ this.drawLine1(idlist[i], (bd.LiB(idlist[i])==1));}
		this.vinc();
	},
	drawLine1 : function(id, flag){
		var lw = this.lw, lm = this.lm, pid = "b"+id+"_line_";

		if     (bd.ErB(id)==1){ g.fillStyle = this.errlinecolor1; lw++;}
		else if(bd.ErB(id)==2){ g.fillStyle = this.errlinecolor2;}
		else if(k.irowake==0 || !menu.getVal('irowake') || !bd.border[id].color){ g.fillStyle = this.linecolor;}
		else{ g.fillStyle = bd.border[id].color;}

		if(!flag){ this.vhide(pid);}
		else if(bd.border[id].cx%2==1 && this.vnop(pid,1)){
			g.fillRect(bd.border[id].px()-lm, bd.border[id].py()-mf(k.cheight/2)-lm, lw, k.cheight+lw);
		}
		else if(bd.border[id].cy%2==1 && this.vnop(pid,1)){
			g.fillRect(bd.border[id].px()-mf(k.cwidth/2)-lm, bd.border[id].py()-lm, k.cwidth+lw, lw);
		}
	},
	drawPekes : function(x1,y1,x2,y2,flag){
		var size = mf(k.cwidth*0.15);
		if(size<3){ size=3;}

		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.QsB(id)==2){ g.strokeStyle = this.pekecolor;}
			else{ this.vhide(["b"+id+"_peke0_","b"+id+"_peke1_","b"+id+"_peke2_"]); continue;}

			g.fillStyle = "white";
			if((flag==0 || flag==2)){ if(this.vnop("b"+id+"_peke0_",1)){
				g.fillRect(bd.border[id].px()-size, bd.border[id].py()-size, 2*size+1, 2*size+1);
			}}
			else{ this.vhide("b"+id+"_peke0_");}

			if(flag==0 || flag==1){
				g.lineWidth = 1;
				if(this.vnop("b"+id+"_peke1_",0)){
					this.inputPath([bd.border[id].px(),bd.border[id].py() ,-size+1,-size+1 ,size,size],false);
					g.stroke();
				}
				if(this.vnop("b"+id+"_peke2_",0)){
					this.inputPath([bd.border[id].px(),bd.border[id].py() ,-size+1,size ,size,-size+1],false);
					g.stroke();
				}
			}
			else{ this.vhide(["b"+id+"_peke1_","b"+id+"_peke2_"]);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawTriangle()   �O�p�`��Canvas�ɏ�������
	// pc.drawTriangle1()  �O�p�`��Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawTriangle : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			var num = (bd.QuC(c)!=0?bd.QuC(c):bd.QaC(c));
			if(k.puzzleid=="kinkonkan"){ num=bd.ErC(c); }

			if(k.puzzleid=="kinkonkan"){ g.fillStyle=this.errbcolor2; }
			else if((bd.ErC(c)==1||bd.ErC(c)==4) && k.puzzleid!="shakashaka"){ g.fillStyle = this.errcolor1;}
			else{ g.fillStyle = this.Cellcolor;}

			this.drawTriangle1(bd.cell[c].px(),bd.cell[c].py(),num,bd.cell[c].cx,bd.cell[c].cy);
		}
		this.vinc();
	},
	drawTriangle1 : function(px,py,num,cx,cy){
		var mgn = (k.puzzleid=="reflect"?1:0);
		var header = "c"+cx+"_"+cy;

		if(num>=2 && num<=5){
			if(num==2){ if(this.vnop(header+"_tri2_",1)){
				this.inputPath([px,py ,mgn,mgn ,mgn,k.cheight+1 ,k.cwidth+1,k.cheight+1],true); g.fill();
			}}
			else{ this.vhide(header+"_tri2_");}

			if(num==3){ if(this.vnop(header+"_tri3_",1)){
				this.inputPath([px,py ,k.cwidth+1,mgn ,mgn,k.cheight+1 ,k.cwidth+1,k.cheight+1],true); g.fill();
			}}
			else{ this.vhide(header+"_tri3_");}

			if(num==4){ if(this.vnop(header+"_tri4_",1)){
				this.inputPath([px,py ,mgn,mgn ,k.cwidth+1,mgn ,k.cwidth+1,k.cheight+1],true); g.fill();
			}}
			else{ this.vhide(header+"_tri4_");}

			if(num==5){ if(this.vnop(header+"_tri5_",1)){
				this.inputPath([px,py ,mgn,mgn ,k.cwidth+1,mgn ,mgn,k.cheight+1],true); g.fill();
			}}
			else{ this.vhide(header+"_tri5_");}
		}
		else{ this.vhide([header+"_tri2_",header+"_tri3_",header+"_tri4_",header+"_tri5_"]);}
	},

	//---------------------------------------------------------------------------
	// pc.drawMBs()    Cell��́�,�~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawMBs : function(x1,y1,x2,y2){
		g.strokeStyle = this.MBcolor;
		g.lineWidth = 1;

		var rsize = k.cwidth*0.35;

		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.QsC(c)==1){
				if(this.vnop("c"+c+"_MB1_",0)){
					g.beginPath();
					g.arc(bd.cell[c].px()+mf(k.cwidth/2), bd.cell[c].py()+mf(k.cheight/2), rsize, 0, Math.PI*2, false);
					g.stroke();
				}
			}
			else{ this.vhide("c"+c+"_MB1_");}

			if(bd.QsC(c)==2){
				if(this.vnop("c"+c+"_MB2a_",0)){
					this.inputPath([bd.cell[c].px()+mf(k.cwidth/2),bd.cell[c].py()+mf(k.cheight/2) ,-rsize,-rsize ,rsize,rsize],true);
					g.stroke();
				}
				if(this.vnop("c"+c+"_MB2b_",0)){
					this.inputPath([bd.cell[c].px()+mf(k.cwidth/2),bd.cell[c].py()+mf(k.cheight/2) ,-rsize,rsize ,rsize,-rsize],true);
					g.stroke();
				}
			}
			else{ this.vhide(["c"+c+"_MB2a_", "c"+c+"_MB2b_"]);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawQueses41_42()  Cell��̍��ۂƔ��ۂ�Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawQueses41_42 : function(x1,y1,x2,y2){
		var rsize  = mf(k.cwidth*0.40);
		var rsize2 = mf(k.cwidth*0.34);

		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.QuC(c)==41 || bd.QuC(c)==42){
				g.fillStyle = this.Cellcolor;
				if(this.vnop("c"+c+"_cir41a_",1)){
					g.beginPath();
					g.arc(mf(bd.cell[c].px()+mf(k.cwidth/2)), mf(bd.cell[c].py()+mf(k.cheight/2)), rsize , 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide("c"+c+"_cir41a_");}

			if(bd.QuC(c)==41){
				g.fillStyle = "white";
				if(this.vnop("c"+c+"_cir41b_",1)){
					g.beginPath();
					g.arc(mf(bd.cell[c].px()+mf(k.cwidth/2)), mf(bd.cell[c].py()+mf(k.cheight/2)), rsize2, 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide("c"+c+"_cir41b_");}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawLineParts()   ���Ȃǂ�Canvas�ɏ�������
	// pc.drawLineParts1()  ���Ȃǂ�Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawLineParts : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){ this.drawLineParts1(clist[i]);}
		this.vinc();
	},
	drawLineParts1 : function(id){
		var lw = this.lw;
		g.fillStyle = this.BorderQuescolor;

		var qs = bd.QuC(id);
		if(qs==101||qs==102||qs==104||qs==105){
			if(this.vnop("c"+id+"_lp1_",1)){ g.fillRect(bd.cell[id].px()+mf(k.cwidth/2)-1, bd.cell[id].py()                  , lw, mf((k.cheight+lw)/2));}
		}
		else{ this.vhide("c"+id+"_lp1_");}
		if(qs==101||qs==102||qs==106||qs==107){
			if(this.vnop("c"+id+"_lp2_",1)){ g.fillRect(bd.cell[id].px()+mf(k.cwidth/2)-1, bd.cell[id].py()+mf(k.cheight/2)-1, lw, mf((k.cheight+lw)/2));}
		}
		else{ this.vhide("c"+id+"_lp2_");}
		if(qs==101||qs==103||qs==105||qs==106){
			if(this.vnop("c"+id+"_lp3_",1)){ g.fillRect(bd.cell[id].px()                  , bd.cell[id].py()+mf(k.cheight/2)-1, mf((k.cwidth+lw)/2), lw);}
		}
		else{ this.vhide("c"+id+"_lp3_");}
		if(qs==101||qs==103||qs==104||qs==107){
			if(this.vnop("c"+id+"_lp4_",1)){ g.fillRect(bd.cell[id].px()+mf(k.cwidth/2)-1, bd.cell[id].py()+mf(k.cheight/2)-1, mf((k.cwidth+lw)/2), lw);}
		}
		else{ this.vhide("c"+id+"_lp4_");}
	},

	//---------------------------------------------------------------------------
	// pc.draw51()      [�_]��Canvas�ɏ�������
	// pc.drawEXcell()  EXCell���[�_]��Canvas�ɏ�������
	// pc.setPath51_1() drawEXcell�Ŏg���ΐ���ݒ肷��
	// pc.drawChassis_ex1()   k.isextencdell==1�ő�����O�g��Canvas�ɕ`�悷��
	//---------------------------------------------------------------------------
	draw51 : function(x1,y1,x2,y2,errdisp){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.QuC(c)==51){
				if(errdisp){
					if(bd.ErC(c)==1){
						g.fillStyle = this.errbcolor1;
						if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px()+1, bd.cell[c].py()+1, k.cwidth-1, k.cheight-1);}
					}
					else{ this.vhide("c"+c+"_full_");}
				}
				this.setPath51_1(c, bd.cell[c].px(), bd.cell[c].py());
				if(this.vnop("c"+c+"_q51_",0)){ g.stroke();}
			}
			else{ this.vhide("c"+c+"_q51_");}
		}
		this.vinc();
	},
	drawEXcell : function(x1,y1,x2,y2,errdisp){
		var lw = this.lw;

		for(var cx=x1-1;cx<=x2;cx++){
			for(var cy=y1-1;cy<=y2;cy++){
				var c = bd.exnum(cx,cy);
				if(c==-1){ continue;}

				if(errdisp){
					if(bd.ErE(c)==1){
						g.fillStyle = this.errbcolor1;
						if(this.vnop("ex"+c+"_full_",1)){ g.fillRect(bd.excell[c].px()+1, bd.excell[c].py()+1, k.cwidth-1, k.cheight-1);}
					}
					else{ this.vhide("ex"+c+"_full_");}
				}

				g.fillStyle = this.Cellcolor;
				this.setPath51_1(c, bd.excell[c].px(), bd.excell[c].py());
				if(this.vnop("ex"+c+"_q51_",0)){ g.stroke();}

				g.strokeStyle = this.Cellcolor;
				if(bd.excell[c].cy==-1 && bd.excell[c].cx<k.qcols-1){
					if(this.vnop("ex"+c+"_bdx_",1)){ g.fillRect(bd.excell[c].px()+k.cwidth, bd.excell[c].py(), 1, k.cheight);}
				}
				if(bd.excell[c].cx==-1 && bd.excell[c].cy<k.qrows-1){
					if(this.vnop("ex"+c+"_bdy_",1)){ g.fillRect(bd.excell[c].px(), bd.excell[c].py()+k.cheight, k.cwidth, 1);}
				}
			}
		}
		this.vinc();
	},
	setPath51_1 : function(c,px,py){
		g.strokeStyle = this.Cellcolor;
		g.lineWidth = 1;
		g.beginPath();
		g.moveTo(px+1       , py+1        );
		g.lineTo(px+k.cwidth, py+k.cheight);
		g.closePath();
	},

	drawChassis_ex1 : function(x1,y1,x2,y2,boldflag){
		var lw = this.lw, lm = this.lm;

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = "black";
		if(boldflag){
			if(x1<1){ if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+2, k.p0.y+y1*k.cheight-lw+2, lw, (y2-y1+1)*k.cheight+lw-2);} }
			if(y1<1){ if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+2, k.p0.y+y1*k.cheight-lw+2, (x2-x1+1)*k.cwidth+lw-2, lw); } }
		}
		else{
			if(x1<1){ if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight);} }
			if(y1<1){ if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth, 1); } }
		}
		if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y2+1)*k.cheight , (x2-x1+2)*k.cwidth+2*lw-1, lw); } }
		if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth , k.p0.y+(y1-1)*k.cheight-lw+1, lw, (y2-y1+2)*k.cheight+2*lw-1);} }
		if(x1<1)         { if(this.vnop("chs21_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y1-1)*k.cheight-lw+1, lw, (y2-y1+2)*k.cheight+2*lw-1);} }
		if(y1<1)         { if(this.vnop("chs22_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y1-1)*k.cheight-lw+1, (x2-x1+2)*k.cwidth+2*lw-1, lw); } }
		this.vinc();

		if(!boldflag){
			g.fillStyle = pc.Cellcolor;
			var clist = this.cellinside(x1-1,y1-1,x2+1,y2+1,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QuC(c)==51){ continue;}
				if(bd.cell[c].cx==0){ this.drawBorder1x(0                , 2*bd.cell[c].cy+1, true);}
				if(bd.cell[c].cy==0){ this.drawBorder1x(2*bd.cell[c].cx+1, 0                , true);}
			}
			this.vinc();
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawTCell()   Cell�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTCross()  Cross�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTBorder() Border�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.hideTCell()   �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.hideTCross()  �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.hideTBorder() �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.drawTargetTriangle() [�_]�̂������͑Ώۂ̂ق��ɔw�i�F������
	//---------------------------------------------------------------------------
	drawTCell : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2 || x2*2+2 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2 || y2*2+2 < tc.cursoly){ return;}

		var px = k.p0.x + mf((tc.cursolx-1)*k.cwidth/2);
		var py = k.p0.y + mf((tc.cursoly-1)*k.cheight/2);
		var w = (k.cwidth<32?2:mf(k.cwidth/16));

		this.vdel(["tc1_","tc2_","tc3_","tc4_"]);
		g.fillStyle = (k.mode==1?"rgb(255,64,64)":"rgb(64,64,255)");
		if(this.vnop("tc1_",0)){ g.fillRect(px+1,           py+1, k.cwidth-2,  w);}
		if(this.vnop("tc2_",0)){ g.fillRect(px+1,           py+1, w, k.cheight-2);}
		if(this.vnop("tc3_",0)){ g.fillRect(px+1, py+k.cheight-w, k.cwidth-2,  w);}
		if(this.vnop("tc4_",0)){ g.fillRect(px+k.cwidth-w,  py+1, w, k.cheight-2);}

		this.vinc();
	},
	drawTCross : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2-1 || x2*2+3 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2-1 || y2*2+3 < tc.cursoly){ return;}

		var px = k.p0.x + mf((tc.cursolx-1)*k.cwidth/2);
		var py = k.p0.y + mf((tc.cursoly-1)*k.cheight/2);
		var w = (k.cwidth<32?2:mf(k.cwidth/16));

		this.vdel(["tx1_","tx2_","tx3_","tx4_"]);
		g.fillStyle = (k.mode==1?"rgb(255,64,64)":"rgb(64,64,255)");
		if(this.vnop("tx1_",0)){ g.fillRect(px+1,           py+1, k.cwidth-2,  w);}
		if(this.vnop("tx2_",0)){ g.fillRect(px+1,           py+1, w, k.cheight-2);}
		if(this.vnop("tx3_",0)){ g.fillRect(px+1, py+k.cheight-w, k.cwidth-2,  w);}
		if(this.vnop("tx4_",0)){ g.fillRect(px+k.cwidth-w,  py+1, w, k.cheight-2);}

		this.vinc();
	},
	drawTBorder : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2-1 || x2*2+3 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2-1 || y2*2+3 < tc.cursoly){ return;}

		var px = k.p0.x + mf(tc.cursolx*k.cwidth/2);
		var py = k.p0.y + mf(tc.cursoly*k.cheight/2);
		var w = (k.cwidth<24?1:mf(k.cwidth/24));
		var size = mf(k.cwidth*0.28);

		this.vdel(["tb1_","tb2_","tb3_","tb4_"]);
		g.fillStyle = (k.mode==1?"rgb(255,64,64)":"rgb(64,64,255)");
		if(this.vnop("tb1_",0)){ g.fillRect(px-size  , py-size  , size*2, 1);}
		if(this.vnop("tb2_",0)){ g.fillRect(px-size  , py-size  , 1, size*2);}
		if(this.vnop("tb3_",0)){ g.fillRect(px-size  , py+size-w, size*2, 1);}
		if(this.vnop("tb4_",0)){ g.fillRect(px+size-w, py-size  , 1, size*2);}

		this.vinc();
	},
	hideTCell   : function(){ this.vhide(["tc1_","tc2_","tc3_","tc4_"]);},
	hideTCross  : function(){ this.vhide(["tx1_","tx2_","tx3_","tx4_"]);},
	hideTBorder : function(){ this.vhide(["tb1_","tb2_","tb3_","tb4_"]);},

	drawTargetTriangle : function(x1,y1,x2,y2){
		if(k.mode==3){ return;}

		if(tc.cursolx < x1*2 || x2*2+2 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2 || y2*2+2 < tc.cursoly){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc==-1){ ex = bd.exnum(tc.getTCX(),tc.getTCY());}
		var target = kc.detectTarget(cc,ex);
		if(target==-1){ return;}

		var num = target==2?4:2;

		g.fillStyle = this.TTcolor;
		this.drawTriangle1(k.p0.x+tc.getTCX()*k.cwidth, k.p0.y+tc.getTCY()*k.cheight, num, tc.getTCX(), tc.getTCY());

		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawDashLines()     �Z���̒��S���璆�S�ɂЂ����_����Canvas�ɕ`�悷��
	// pc.drawDashLines2vml() �Z���̒��S���璆�S�ɂЂ����_����Canvas�ɕ`�悷��(VML�p)
	//---------------------------------------------------------------------------
	drawDashLines : function(x1,y1,x2,y2){
		if(k.br.IE){ this.drawDashLines2vml(x1,y1,x2,y2); return;}

		if(x1<1){ x1=1;} if(x2>k.qcols-2){ x2=k.qcols-2;}
		if(y1<1){ y1=1;} if(y2>k.qrows-2){ y2=k.qrows-2;}

		g.fillStyle = this.BDlinecolor;
		for(var i=x1-1;i<=x2+1;i++){
			for(var j=(k.p0.y+(y1-0.5)*k.cheight);j<(k.p0.y+(y2+1.5)*k.cheight);j+=6){
				g.fillRect(k.p0.x+(i+0.5)*k.cwidth, j, 1, 3);
			}
		}
		for(var i=y1-1;i<=y2+1;i++){
			for(var j=(k.p0.x+(x1-0.5)*k.cwidth);j<(k.p0.x+(x2+1.5)*k.cwidth);j+=6){
				g.fillRect(j, k.p0.y+(i+0.5)*k.cheight, 3, 1);
			}
		}

		this.vinc();
	},
	drawDashLines2vml : function(x1,y1,x2,y2){
		if(x1<1){ x1=1;} if(x2>k.qcols-2){ x2=k.qcols-2;}
		if(y1<1){ y1=1;} if(y2>k.qrows-2){ y2=k.qrows-2;}

//		g.fillStyle = this.BDlinecolor;
//		g.lineWidth = 1;
//		g.enabledash = true;
//		for(var i=x1-1;i<=x2+1;i++){ if(this.vnop("bdy"+i+"_",1)){
//			g.beginPath()
//			g.moveTo(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y1-0.5)*k.cheight);
//			g.lineTo(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y2+1.5)*k.cheight);
//			g.closePath()
//			g.stroke()
//		} }
//		for(var i=y1-1;i<=y2+1;i++){ if(this.vnop("bdx"+i+"_",1)){
//			g.beginPath()
//			g.moveTo(k.p0.x+(x1-0.5)*k.cwidth, k.p0.y+( i+0.5)*k.cheight);
//			g.lineTo(k.p0.x+(x2+1.5)*k.cwidth, k.p0.y+( i+0.5)*k.cheight);
//			g.closePath()
//			g.stroke()
//		} }
//		g.enabledash = false;
//
//		g.fillStyle = "white";

		g.fillStyle = "rgb(192,192,192)";
		for(var i=x1-1;i<=x2+1;i++){ if(this.vnop("bdy"+i+"_1_",1)){ g.fillRect(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y1-0.5)*k.cheight, 1, (y2-y1+2)*k.cheight+1);} }
		for(var i=y1-1;i<=y2+1;i++){ if(this.vnop("bdx"+i+"_1_",1)){ g.fillRect(k.p0.x+(x1-0.5)*k.cwidth, k.p0.y+(i+0.5)*k.cheight, (x2-x1+2)*k.cwidth+1, 1);} }

		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawBDline()     �Z���̘g��(����)��Canvas�ɏ�������
	// pc.drawBDline2()    �Z���̘g��(�_��)��Canvas�ɏ�������
	// pc.drawBDline2vml() �Z���̘g��(�_��)��Canvas�ɏ�������(VML�p)
	// pc.drawChassis()  �O�g��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawBDline : function(x1,y1,x2,y2){
		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		var f=(k.isoutsideborder==0&&this.chassisflag);

		g.fillStyle = this.BDlinecolor;
		var xa = f?(x1>1?x1:1)                    :(x1>0?x1:0);
		var xb = f?(x2+1<k.qcols-1?x2+1:k.qcols-1):(x2+1<k.qcols?x2+1:k.qcols);
		var ya = f?(y1>1?y1:1)                    :(y1>0?y1:0);
		var yb = f?(y2+1<k.qrows-1?y2+1:k.qrows-1):(y2+1<k.qrows?y2+1:k.qrows);
		for(var i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_",1)){ g.fillRect(k.p0.x+i*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight+1);} }
		for(var i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+i*k.cheight, (x2-x1+1)*k.cwidth+1, 1);} }

		this.vinc();
	},
	drawBDline2 : function(x1,y1,x2,y2){
		if(k.br.IE){ this.drawBDline2vml(x1,y1,x2,y2); return;}

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		var f=(k.isoutsideborder==0&&this.chassisflag);

		var dotmax = mf(k.cwidth/10)+3;
		var dotCount = (mf(k.cwidth/dotmax)>=1?mf(k.cwidth/dotmax):1);
		var dotSize  = k.cwidth/(dotCount*2);

		g.fillStyle = this.BDlinecolor;
		var xa = f?(x1>1?x1:1)                    :(x1>0?x1:0);
		var xb = f?(x2+1<k.qcols-1?x2+1:k.qcols-1):(x2+1<k.qcols?x2+1:k.qcols);
		var ya = f?(y1>1?y1:1)                    :(y1>0?y1:0);
		var yb = f?(y2+1<k.qrows-1?y2+1:k.qrows-1):(y2+1<k.qrows?y2+1:k.qrows);
		for(var i=xa;i<=xb;i++){
			for(var j=(k.p0.y+y1*k.cheight);j<(k.p0.y+(y2+1)*k.cheight);j+=(2*dotSize)){
				g.fillRect(k.p0.x+i*k.cwidth, mf(j), 1, mf(dotSize));
			}
		}
		for(var i=ya;i<=yb;i++){
			for(var j=(k.p0.x+x1*k.cwidth);j<(k.p0.x+(x2+1)*k.cwidth);j+=(2*dotSize)){
				g.fillRect(mf(j), k.p0.y+i*k.cheight, mf(dotSize), 1);
			}
		}
	},
	drawBDline2vml : function(x1,y1,x2,y2){
		this.BDlinecolor = "rgb(160,160,160)";
		this.drawBDline(x1,y1,x2,y2);

//		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
//		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}
//
//		var f=(k.isoutsideborder==0&&this.chassisflag);
//
//		g.fillStyle = this.BDlinecolor;
//		var xa = f?(x1>1?x1:1)                    :(x1>0?x1:0);
//		var xb = f?(x2+1<k.qcols-1?x2+1:k.qcols-1):(x2+1<k.qcols?x2+1:k.qcols);
//		var ya = f?(y1>1?y1:1)                    :(y1>0?y1:0);
//		var yb = f?(y2+1<k.qrows-1?y2+1:k.qrows-1):(y2+1<k.qrows?y2+1:k.qrows);
//		g.lineWidth = 1;
//		g.enabledash = true;
//		for(var i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_",0)){
//			g.beginPath()
//			g.moveTo(mf(k.p0.x+i*k.cwidth+0.0), mf(k.p0.y+ y1   *k.cheight));
//			g.lineTo(mf(k.p0.x+i*k.cwidth+0.0), mf(k.p0.y+(y2+1)*k.cheight));
//			g.closePath()
//			g.stroke()
//		} }
//		for(var i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_",0)){
//			g.beginPath()
//			g.moveTo(mf(k.p0.x+ x1   *k.cwidth), mf(k.p0.y+i*k.cheight));
//			g.lineTo(mf(k.p0.x+(x2+1)*k.cwidth), mf(k.p0.y+i*k.cheight));
//			g.closePath()
//			g.stroke()
//		} }
//		g.enabledash = false;
//
//		g.fillStyle = "white";
//		for(var i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_1_",1)){ g.fillRect(k.p0.x+i*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight+1);} }
//		for(var i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+i*k.cheight, (x2-x1+1)*k.cwidth+1, 1);} }
//
//		this.vinc();
	},

	drawChassis : function(x1,y1,x2,y2){
		var lw = this.lw;

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = "black";
		if(x1<1)         { if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		if(y1<1)         { if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+(y2+1)*k.cheight , (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth , k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.flushCanvas()    �w�肳�ꂽ�̈�𔒂œh��Ԃ�
	// pc.flushCanvasAll() Canvas�S�ʂ𔒂œh��Ԃ�
	//---------------------------------------------------------------------------
	flushCanvas : function(x1,y1,x2,y2){
		if(!g.vml){
			if(((k.isextendcell==0&&x1<=0&&y1<=0)||(k.isextendcell!=0&&x1<=-1&&y1<=-1)) &&
			   ((k.isextendcell!=2&&x2>=k.qcols-1&&y2>=k.qrows-1)||(k.isextendcell==2&&x2>=k.qcols&&y2>=k.qrows))
			){
				this.flushCanvasAll();
			}
			else{
				g.fillStyle = "rgb(255, 255, 255)";
				g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth, (y2-y1+1)*k.cheight);
			}
		}
		else{ g.zidx=1;}
	},
	// excanvas�̏ꍇ�A�����`�悵�Ȃ���VML�v�f���I������Ă��܂�
	flushCanvasAll : function(){
		if(g.vml){
			g.zidx=0; g.vid="bg_"; g.elements = [];	// VML�p
			//g.clearRect(); 						// excanvas�p
		}
		if(k.br.IE){ g._clear();}	// uuCanvas�p���ꏈ��

		g.fillStyle = "rgb(255, 255, 255)";
		g.fillRect(0, 0, base.cv_obj.width(), base.cv_obj.height());
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.vnop()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���ĕ`�悹���A�F�͐ݒ肷��
	// pc.vhide() VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���B��
	// pc.vdel()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���폜����
	// pc.vinc()  z-index�ɐݒ肳���l��+1����
	//---------------------------------------------------------------------------
	// excanvas�֌W�֐�
	vnop : function(vid, isfill){
		if(g.vml){
			if(g.elements[vid]){
				var el = g.elements[vid].get(0);
				if(el){
					el.color = uuColor.parse((isfill==1?g.fillStyle:g.strokeStyle))[0];
				}
				var pel = g.elements["p_"+vid].get(0);
				if(pel){
					if(!this.zstable){ pel.style.zIndex = g.zidx;}
					pel.style.display = 'inline';
				}
				return false;
			}
			g.vid = vid;
		}
		return true;
	},
	vhide : function(vid){
		if(g.vml){
			if(!vid.shift){ vid = [vid];}
			for(var i=0;i<vid.length;i++){ if(g.elements[vid[i]]){ g.elements["p_"+vid[i]].get(0).style.display = 'none';} }
		}
	},
	vdel : function(vid){
		if(g.vml){
			if(!vid.shift){ vid = [vid];}
			for(var i=0;i<vid.length;i++){
				if(g.elements[vid[i]]){
					g.elements["p_"+vid[i]].remove();
					g.elements["p_"+vid[i]]=null;
					g.elements[vid[i]]=null;
				}
			}
		}
	},
	vinc : function(){
		if(g.vml){ g.vid = ""; g.zidx++;}
	},

	//---------------------------------------------------------------------------
	// pc.CreateDOMAndSetNop()     ������`�悷��ׂ̃G�������g�𐶐�����
	// pc.CreateElementAndSetNop() �G�������g�𐶐�����
	// pc.isdispnumCell()          �������L���ł��邩���肷��
	// pc.getNumberColor()         �����̐F�𔻒肷��
	//---------------------------------------------------------------------------
	// �����\���֐�
	CreateDOMAndSetNop : function(){
		if(this.textenable){ return null;}
		return this.CreateElementAndSetNop();
	},
	CreateElementAndSetNop : function(){
		obj = newEL("div");
		obj.mousedown(mv.e_mousedown.ebind(mv))
		   .mouseup(mv.e_mouseup.ebind(mv))
		   .mousemove(mv.e_mousemove.ebind(mv))
		   .appendTo("#numobj_parent")
		   .unselectable();
		obj.context.className = "divnum";
		obj.context.oncontextmenu = function(){ return false;}; //�Ë��_ 

		return obj;
	},
	isdispnumCell : function(id){
		return ( (bd.QnC(id)>0 || (bd.QnC(id)==0 && k.dispzero)) || 
				((bd.QaC(id)>0 || (bd.QaC(id)==0 && k.dispzero)) && k.isAnsNumber) ||
				((bd.QnC(id)==-2 || bd.QuC(id)==-2) && k.isDispHatena) );
	},
	getNumberColor : function(id){
		if     (bd.QuC(id)==-2)                              { return this.fontcolor;      }
		else if((k.BlackCell==0?bd.QuC(id)!=0:bd.QaC(id)==1)){ return this.BCell_fontcolor;}
		else if(bd.ErC(id)==1 || bd.ErC(id)==4)              { return this.fontErrcolor;   }
		else if(k.isAnsNumber && bd.QnC(id)!=-1)             { return this.fontcolor;      }
		else if(k.isAnsNumber && bd.QaC(id)!=-1)             { return this.fontAnscolor;   }
		return this.fontcolor;
	},
	//---------------------------------------------------------------------------
	// pc.dispnumCell_General() Cell�ɐ������L�����邽�߂̒l�����肷��
	// pc.dispnumCross()        Cross�ɐ������L�����邽�߂̒l�����肷��
	// pc.dispnumBorder()       Border�ɐ������L�����邽�߂̒l�����肷��
	//---------------------------------------------------------------------------
	dispnumCell_General : function(id){
		if(bd.cell[id].numobj && !this.isdispnumCell(id)){ bd.cell[id].numobj.get(0).style.display = 'none'; return;}
		if(this.isdispnumCell(id)){
			if(!bd.cell[id].numobj){ bd.cell[id].numobj = this.CreateDOMAndSetNop();}
			var obj = bd.cell[id].numobj;

			var type = 1;
			if     (k.isDispNumUL){ type=5;}
			else if(bd.QuC(id)>=2 && bd.QuC(id)<=5){ type=bd.QuC(id);}
			else if(k.puzzleid=="reflect"){ if(!this.textenable){ obj.get(0).style.display = 'none';} return;}

			var num = (bd.QnC(id)!=-1 ? bd.QnC(id) : bd.QaC(id));

			var text = (num>=0 ? ""+num : "?");
			if(bd.QuC(id)==-2){ text = "?";}

			var fontratio = 0.45;
			if(type==1){ fontratio = (num<10?0.8:(num<100?0.7:0.55));}
			if(k.isArrowNumber==1){
				var dir = bd.DiC(id);
				if(dir!=0){ fontratio *= 0.85;}
				if     (dir==1||dir==2){ type=6;}
				else if(dir==3||dir==4){ type=7;}
			}

			var color = this.getNumberColor(id);

			this.dispnumCell1(id, obj, type, text, fontratio, color);
		}
	},
	dispnumCross : function(id){
		if(bd.QnX(id)>0||(bd.QnX(id)==0&&k.dispzero==1)){
			if(!bd.cross[id].numobj){ bd.cross[id].numobj = this.CreateDOMAndSetNop();}
			this.dispnumCross1(id, bd.cross[id].numobj, 101, ""+bd.QnX(id), 0.6 ,this.crossnumcolor);
		}
		else if(bd.cross[id].numobj){ bd.cross[id].numobj.get(0).style.display = 'none';}
	},
	dispnumBorder : function(id){
		if(bd.QnB(id)>0||(bd.QnB(id)==0&&k.dispzero==1)){
			if(!bd.border[id].numobj){ bd.border[id].numobj = this.CreateDOMAndSetNop();}
			this.dispnumBorder1(id, bd.border[id].numobj, 101, ""+bd.QnB(id), 0.45 ,this.borderfontcolor);
		}
		else if(bd.border[id].numobj){ bd.border[id].numobj.get(0).style.display = 'none';}
	},

	//---------------------------------------------------------------------------
	// pc.dispnumCell1()   Cell�ɐ������L�����邽��dispnum1�֐��ɒl��n��
	// pc.dispnumEXcell1() EXCell�ɐ������L�����邽��dispnum1�֐��ɒl��n��
	// pc.dispnumCross1()  Cross�ɐ������L�����邽��dispnum1�֐��ɒl��n��
	// pc.dispnumBorder1() Border�ɐ������L�����邽��dispnum1�֐��ɒl��n��
	// pc.dispnum1()       �������L�����邽�߂̋��ʊ֐�
	//---------------------------------------------------------------------------
	dispnumCell1 : function(c, obj, type, text, fontratio, color){
		this.dispnum1(obj, type, text, fontratio, color, bd.cell[c].px(), bd.cell[c].py());
	},
	dispnumEXcell1 : function(c, obj, type, text, fontratio, color){
		this.dispnum1(obj, type, text, fontratio, color, bd.excell[c].px(), bd.excell[c].py());
	},
	dispnumCross1 : function(c, obj, type, text, fontratio, color){
		this.dispnum1(obj, type, text, fontratio, color, bd.cross[c].px(), bd.cross[c].py());
	},
	dispnumBorder1 : function(c, obj, type, text, fontratio, color){
		this.dispnum1(obj, type, text, fontratio, color, bd.border[c].px(), bd.border[c].py());
	},
	dispnum1 : function(obj, type, text, fontratio, color, px, py){
//		if(!this.textenable){
			if(!obj){ return;}
			var IE = k.br.IE;
			var el = obj.context;

			el.innerHTML = text;

			var fontsize = mf(k.cwidth*fontratio*pc.fontsizeratio);
			el.style.fontSize = (""+ fontsize + 'px');

			el.style.display = 'inline';	// ��ɕ\�����Ȃ���wid,hgt=0�ɂȂ��Ĉʒu�������

			var wid = el.clientWidth;
			var hgt = el.clientHeight;

			if(type==1||type==6||type==7){
				el.style.left = k.cv_oft.x+px+mf((k.cwidth-wid) /2)+(IE?2:2)-(type==6?mf(k.cwidth *0.1):0);
				el.style.top  = k.cv_oft.y+py+mf((k.cheight-hgt)/2)+(IE?3:1)+(type==7?mf(k.cheight*0.1):0);
			}
			else if(type==101){
				el.style.left = k.cv_oft.x+px-wid/2+(IE?2:2);
				el.style.top  = k.cv_oft.y+py-hgt/2+(IE?3:1);
			}
			else{
				if     (type==3||type==4){ el.style.left = k.cv_oft.x+px+k.cwidth -wid+(IE?1: 0);}
				else if(type==2||type==5){ el.style.left = k.cv_oft.x+px              +(IE?5: 4);}
				if     (type==2||type==3){ el.style.top  = k.cv_oft.y+py+k.cheight-hgt+(IE?1:-1);}
				else if(type==4||type==5){ el.style.top  = k.cv_oft.y+py              +(IE?4: 2);}
			}

			el.style.color = color;
//		}
//		// Native�ȕ��@�͂������Ȃ񂾂��ǁA�v5�`6%���炢�x���Ȃ�B�B
//		else{
//			g.font = ""+mf(k.cwidth*fontratio*pc.fontsizeratio)+"px 'Serif'";
//			g.fillStyle = color;
//			if(type==1||type==6||type==7){
//				g.textAlign = 'center'; g.textBaseline = 'middle';
//				g.fillText(text, px+mf(k.cwidth/2)-(type==6?mf(k.cwidth*0.1):0), py+mf(k.cheight/2)+(type==7?mf(k.cheight*0.1):0));
//			}
//			else if(type==101){
//				g.textAlign = 'center'; g.textBaseline = 'middle';
//				g.fillText(text, px, py);
//			}
//			else{
//				g.textAlign    = ((type==3||type==4)?'right':'left');
//				g.textBaseline = ((type==2||type==3)?'alphabetic':'top');
//				g.fillText(text, px+((type==3||type==4)?k.cwidth:3), py+((type==2||type==3)?k.cheight-1:0));
//			}
//		}
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbersOn51()   Cell���[�_]�ɐ������L������
	// pc.drawNumbersOn51EX() EXCell���[�_]�ɐ������L������
	//---------------------------------------------------------------------------
	drawNumbersOn51 : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2,f_true);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.QnC(c)==-1 || bd.QuC(c)!=51 || bd.rt(c)==-1 || bd.QuC(bd.rt(c))==51){
				if(bd.cell[c].numobj){ bd.cell[c].numobj.get(0).style.display = 'none';}
			}
			else{
				if(!bd.cell[c].numobj){ bd.cell[c].numobj = this.CreateDOMAndSetNop();}
				var color = (bd.ErC(c)==1?this.fontErrcolor:this.fontcolor);
				var text = (bd.QnC(c)>=0?""+bd.QnC(c):"");
				this.dispnumCell1(c, bd.cell[c].numobj, 4, text, 0.45, color);
			}

			if(bd.DiC(c)==-1 || bd.QuC(c)!=51 || bd.dn(c)==-1 || bd.QuC(bd.dn(c))==51){
				if(bd.cell[c].numobj2){ bd.cell[c].numobj2.get(0).style.display = 'none';}
			}
			else{
				if(!bd.cell[c].numobj2){ bd.cell[c].numobj2 = this.CreateDOMAndSetNop();}
				var color = (bd.ErC(c)==1?this.fontErrcolor:this.fontcolor);
				var text = (bd.DiC(c)>=0?""+bd.DiC(c):"");
				this.dispnumCell1(c, bd.cell[c].numobj2, 2, text, 0.45, color);
			}
		}
		this.vinc();
	},
	drawNumbersOn51EX : function(x1,y1,x2,y2){
		for(var cx=x1-1;cx<=x2;cx++){
			for(var cy=y1-1;cy<=y2;cy++){
				var c = bd.exnum(cx,cy);
				if(c==-1){ continue;}

				if(bd.QnE(c)==-1 || bd.excell[c].cy==-1 || bd.QuC(bd.excell[c].cy*k.qcols)==51){
					if(bd.excell[c].numobj){ bd.excell[c].numobj.get(0).style.display = 'none';}
				}
				else{
					if(!bd.excell[c].numobj){ bd.excell[c].numobj = this.CreateDOMAndSetNop();}
					var color = (bd.ErE(c)==1?this.fontErrcolor:this.fontcolor);
					var text = (bd.QnE(c)>=0?""+bd.QnE(c):"");
					this.dispnum1(bd.excell[c].numobj, 4, text, 0.45, color, bd.excell[c].px()-1, bd.excell[c].py()+1);
				}

				if(bd.DiE(c)==-1 || bd.excell[c].cx==-1 || bd.QuC(bd.excell[c].cx)==51){
					if(bd.excell[c].numobj2){ bd.excell[c].numobj2.get(0).style.display = 'none';}
				}
				else{
					if(!bd.excell[c].numobj2){ bd.excell[c].numobj2 = this.CreateDOMAndSetNop();}
					var color = (bd.ErE(c)==1?this.fontErrcolor:this.fontcolor);
					var text = (bd.DiE(c)>=0?""+bd.DiE(c):"");
					this.dispnum1(bd.excell[c].numobj2, 2, text, 0.45, color, bd.excell[c].px()-1, bd.excell[c].py()+1);
				}
			}
		}
		this.vinc();
	}
};

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

//---------------------------------------------------------------------------
// ��KeyEvent�N���X �L�[�{�[�h���͂Ɋւ�����̕ێ��ƃC�x���g����������
//---------------------------------------------------------------------------
// �p�Y������ �L�[�{�[�h���͕�
// KeyEvent�N���X���`
KeyEvent = function(){
	this.isCTRL;
	this.isALT;	// ALT�̓��j���[�p�Ȃ̂ŋɗ͎g��Ȃ�
	this.isSHIFT;
	this.inUNDO;
	this.inREDO;
	this.tcMoved;	// �J�[�\���ړ����ɃX�N���[�������Ȃ�
	this.keyPressed;
	this.ca;
	this.prev;
	this.keyreset();
};
KeyEvent.prototype = {
	//---------------------------------------------------------------------------
	// kc.keyreset() �L�[�{�[�h���͂Ɋւ����������������
	//---------------------------------------------------------------------------
	keyreset : function(){
		this.isCTRL  = false;
		this.isALT   = false;
		this.isSHIFT = false;
		this.inUNDO  = false;
		this.inREDO  = false;
		this.tcMoved = false;
		this.keyPressed = false;
		this.prev = -1;
		this.ca = '';
		if(this.isZ){ this.isZ = false;}
		if(this.isX){ this.isX = false;}
	},

	//---------------------------------------------------------------------------
	// kc.e_keydown()  �L�[���������ۂ̃C�x���g���ʏ���
	// kc.e_keyup()    �L�[�𗣂����ۂ̃C�x���g���ʏ���
	// kc.e_keypress() �L�[���͂����ۂ̃C�x���g���ʏ���(-�L�[�p)
	//---------------------------------------------------------------------------
	// ����3�̃L�[�C�x���g��window����Ăяo�����(kc��bind���Ă���)
	// 48�`57��0�`9�L�[�A65�`90��a�`z�A96�`105�̓e���L�[�A112�`123��F1�`F12�L�[
	e_keydown : function(e){
		if(!k.enableKey){ return;}

		um.newOperation(true);
		this.ca = this.getchar(e, this.getKeyCode(e));
		this.tcMoved = false;
		if(!this.isZ){ bd.errclear();}

		if(this.keydown_common(e)){ return false;}
		if(this.ca){ this.keyinput(this.ca);} //kc.keydown(e.modifier, String.fromCharCode(e.which), e);

		this.keyPressed = true;
	},
	e_keyup : function(e)    {
		if(!k.enableKey){ return;}

		um.newOperation(false);
		this.ca = this.getchar(e, this.getKeyCode(e));

		this.keyPressed = false;

		if(this.keyup_common(e)){ return false;}
		if(this.ca){ this.keyup(this.ca);} //kc.keyup(e.modifier, String.fromCharCode(e.which), e);
	},
	//(keypress�̂�)45��-(�}�C�i�X)
	e_keypress : function(e)    {
		if(!k.enableKey){ return;}

		um.newOperation(false);
		this.ca = this.getcharp(e, this.getKeyCode(e));

		if(this.ca){ this.keyinput(this.ca);}
	},

	//---------------------------------------------------------------------------
	// kc.e_SLkeydown()  Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[���������ۂ̃C�x���g���ʏ���
	// kc.e_SLkeyup()    Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[�𗣂����ۂ̃C�x���g���ʏ���
	//---------------------------------------------------------------------------
	e_SLkeydown : function(sender,keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventEvent:f_true };
		return this.e_keydown(emulate);
	},
	e_SLkeyup : function(sender,keyEventArgs){
		var emulate = {keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl, altKey:false};
		return this.e_keyup(emulate);
	},

	//---------------------------------------------------------------------------
	// kc.keyinput() �L�[���������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// kc.keyup()    �L�[�𗣂����ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//---------------------------------------------------------------------------
	// �I�[�o�[���C�h�p
	keyinput : function(ca){ },
	keyup    : function(ca){ },

	//---------------------------------------------------------------------------
	// kc.getchar()    ���͂��ꂽ�L�[��\���������Ԃ�
	// kc.getcharp()   ���͂��ꂽ�L�[��\���������Ԃ�(keypress�̎�)
	// kc.getKeyCode() ���͂��ꂽ�L�[�̃R�[�h�𐔎��ŕԂ�
	//---------------------------------------------------------------------------
	getchar : function(e, keycode){
		if     (e.keyCode == 38)            { return 'up';   }
		else if(e.keyCode == 40)            { return 'down'; }
		else if(e.keyCode == 37)            { return 'left'; }
		else if(e.keyCode == 39)            { return 'right';}
		else if(48<=keycode && keycode<=57) { return (keycode - 48).toString(36);}
		else if(65<=keycode && keycode<=90) { return (keycode - 55).toString(36);} //�A���t�@�x�b�g
		else if(96<=keycode && keycode<=105){ return (keycode - 96).toString(36);} //�e���L�[�Ή�
		else if(112<=keycode && keycode<=123){return 'F'+(keycode - 111).toString(10);}
		else if(keycode==32 || keycode==46) { return ' ';} // 32�̓X�y�[�X�L�[ 46��del�L�[
		else if(keycode==8)                 { return 'BS';}
		else if(e.shiftKey)                 { return 'shift';}
		else{ return '';}
	},
	getcharp : function(e, keycode){
		if(keycode==45){ return '-';}
		else{ return '';}
	},
	//Programming Magic�l�̃R�[�h
	getKeyCode : function(e){
		if(document.all) return  e.keyCode;
		else if(document.getElementById) return (e.keyCode)? e.keyCode: e.charCode;
		else if(document.layers) return  e.which;
	},

	//---------------------------------------------------------------------------
	// kc.keydown_common() �L�[���������ۂ̃C�x���g���ʏ���(Shift,Undo,F2��)
	// kc.keyup_common()   �L�[�𗣂����ۂ̃C�x���g���ʏ���(Shift,Undo��)
	//---------------------------------------------------------------------------
	keydown_common : function(e){
		var flag = false;
		if(!this.isSHIFT && e.shiftKey){ this.isSHIFT=true; }
		if(!this.isCTRL  && e.ctrlKey ){ this.isCTRL=true;  flag = true; }
		if(!this.isALT   && e.altKey  ){ this.isALT=true;   flag = true; }

		if(this.isCTRL && this.ca=='z'){ this.inUNDO=true; flag = true; }
		if(this.isCTRL && this.ca=='y'){ this.inREDO=true; flag = true; }

		if(this.ca=='F2' && k.callmode == "pmake"){ // 112�`123��F1�`F12�L�[
			if     (k.mode==1 && !this.isSHIFT){ k.mode=3; menu.setVal('mode',3); flag = true;}
			else if(k.mode==3 &&  this.isSHIFT){ k.mode=1; menu.setVal('mode',1); flag = true;}
		}
		if(k.scriptcheck && debug){ flag = (flag || debug.keydown(this.ca));}

		return flag;
	},
	keyup_common : function(e){
		var flag = false;
		if(this.isSHIFT && !e.shiftKey){ this.isSHIFT=false; flag = true; }
		if((this.isCTRL || this.inUNDO || this.inREDO)  && !e.ctrlKey ){ this.isCTRL=false;  flag = true; this.inUNDO = false; this.inREDO = false; }
		if(this.isALT   && !e.altKey  ){ this.isALT=false;   flag = true; }

		if(this.inUNDO && this.ca=='z'){ this.inUNDO=false; flag = true; }
		if(this.inREDO && this.ca=='y'){ this.inREDO=false; flag = true; }

		return flag;
	},
	//---------------------------------------------------------------------------
	// kc.moveTCell()   Cell�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTCross()  Cross�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTBorder() Border�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTC()      ��L3�̊֐��̋��ʏ���
	//---------------------------------------------------------------------------
	moveTCell   : function(ca){ return this.moveTC(ca,2);},
	moveTCross  : function(ca){ return this.moveTC(ca,2);},
	moveTBorder : function(ca){ return this.moveTC(ca,1);},
	moveTC : function(ca,mv){
		var tcx = tc.cursolx, tcy = tc.cursoly, flag = false;
		if     (ca == 'up'    && tcy-mv >= tc.miny){ tc.decTCY(mv); flag = true;}
		else if(ca == 'down'  && tcy+mv <= tc.maxy){ tc.incTCY(mv); flag = true;}
		else if(ca == 'left'  && tcx-mv >= tc.minx){ tc.decTCX(mv); flag = true;}
		else if(ca == 'right' && tcx+mv <= tc.maxx){ tc.incTCX(mv); flag = true;}

		if(flag){
			pc.paint(mf(tcx/2)-1, mf(tcy/2)-1, mf(tcx/2), mf(tcy/2));
			pc.paint(mf(tc.cursolx/2)-1, mf(tc.cursoly/2)-1, mf(tc.cursolx/2), mf(tc.cursoly/2));
			this.tcMoved = true;
		}
		return flag;
	},

	//---------------------------------------------------------------------------
	// kc.key_inputcross() ���max�܂ł̐�����Cross�̖��f�[�^�����ē��͂���(keydown��)
	//---------------------------------------------------------------------------
	key_inputcross : function(ca, max){
		var cc = tc.getTXC();

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(bd.QnX(cc)<=0){
				if(num<=max){ bd.sQnX(cc,num);}
			}
			else{
				if(bd.QnX(cc)*10+num<=max){ bd.sQnX(cc,bd.QnX(cc)*10+num);}
				else if(num<=max){ bd.sQnX(cc,num);}
			}
		}
		else if(ca=='-'){
			if(bd.QnX(cc)!=-2){ bd.sQnX(cc,-2);}
			else{ bd.sQnX(cc,-1);}
		}
		else if(ca==' '){
			bd.sQnX(cc,-1);
		}
		else{ return;}

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//---------------------------------------------------------------------------
	// kc.key_inputqnum() ���max�܂ł̐�����Cell�̖��f�[�^�����ē��͂���(keydown��)
	// kc.setnum()        ���[�h�ʂɐ�����ݒ肷��
	// kc.getnum()        ���[�h�ʂɐ������擾����
	//---------------------------------------------------------------------------
	key_inputqnum : function(ca, max){
		var cc = tc.getTCC();
		if(k.mode==1 && k.isOneNumber){ cc = room.getTopOfRoomByCell(cc);}
		if(bd.roommaxfunc){ max = bd.roommaxfunc(cc,k.mode);}

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);
			if(k.mode==3){ bd.sDiC(cc,0);}

			if(this.getnum(cc)<=0 || this.prev!=cc){
				if(num<=max){ if(k.NumberIsWhite){ bd.sQaC(cc,-1);} this.setnum(cc,num);}
			}
			else{
				if(this.getnum(cc)*10+num<=max){ this.setnum(cc,this.getnum(cc)*10+num);}
				else if(num<=max){ this.setnum(cc,num);}
			}
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ if(k.mode==1){ bd.sQaC(cc,-1);} bd.sQsC(cc,0); }
		}
		else if(ca=='-'){
			if(k.mode==1 && bd.QnC(cc)!=-2){ this.setnum(cc,-2);}
			else{ this.setnum(cc,-1);}
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ bd.sQsC(cc,0);}
		}
		else if(ca==' '){
			this.setnum(cc,-1);
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ bd.sQsC(cc,0);}
		}
		else{ return;}

		this.prev = cc;
		pc.paintCell(cc);
	},

	setnum : function(cc,val){ if(k.dispzero || val!=0){ (k.mode==1 ? bd.sQnC(cc,val) : bd.sQaC(cc,val));} },
	getnum : function(cc){ return (k.mode==1 ? bd.QnC(cc) : bd.QaC(cc));},

	//---------------------------------------------------------------------------
	// kc.key_inputdirec()  �l�����̖��Ȃǂ�ݒ肷��
	//---------------------------------------------------------------------------
	key_inputdirec : function(ca){
		if(!this.isSHIFT){ return false;}

		var cc = tc.getTCC();
		if(bd.QnC(cc)==-1){ return false;}

		var flag = false;

		if     (ca == 'up'   ){ bd.sDiC(cc, (bd.DiC(cc)!=1?1:0)); flag = true;}
		else if(ca == 'down' ){ bd.sDiC(cc, (bd.DiC(cc)!=2?2:0)); flag = true;}
		else if(ca == 'left' ){ bd.sDiC(cc, (bd.DiC(cc)!=3?3:0)); flag = true;}
		else if(ca == 'right'){ bd.sDiC(cc, (bd.DiC(cc)!=4?4:0)); flag = true;}

		if(flag){
			pc.paint(mf(tc.cursolx/2), mf(tc.cursoly/2), mf(tc.cursolx/2), mf(tc.cursoly/2));
			this.tcMoved = true;
		}
		return flag;
	},

	//---------------------------------------------------------------------------
	// kc.inputnumber51()  [�_]�̐���������͂���
	// kc.setnum51()      ���[�h�ʂɐ�����ݒ肷��
	// kc.getnum51()      ���[�h�ʂɐ������擾����
	//---------------------------------------------------------------------------
	inputnumber51 : function(ca,max_obj){
		if(this.chtarget(ca)){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc==-1){ ex = bd.exnum(tc.getTCX(),tc.getTCY());}
		var target = this.detectTarget(cc,ex);
		if(target==-1 || (cc!=-1 && bd.QuC(cc)==51)){
			if(ca=='q' && cc!=-1){
				mv.set51cell(cc,(bd.QuC(cc)!=51));
				pc.paint(tc.getTCX()-1,tc.getTCY()-1,tc.getTCX()+1,tc.getTCY()+1);
				return;
			}
		}
		if(target==-1){ return;}

		var max = max_obj[target];

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(this.getnum51(cc,ex,target)<=0 || this.prev!=cc){
				if(num<=max){ this.setnum51(cc,ex,target,num);}
			}
			else{
				if(this.getnum51(cc,ex,target)*10+num<=max){ this.setnum51(cc,ex,target,this.getnum51(cc,ex,target)*10+num);}
				else if(num<=max){ this.setnum51(cc,ex,target,num);}
			}
		}
		else if(ca=='-' || ca==' '){ this.setnum51(cc,ex,target,-1);}
		else{ return;}

		this.prev = cc;
		if(cc!=-1){ pc.paintCell(tc.getTCC());}else{ pc.paint(tc.getTCX(),tc.getTCY(),tc.getTCX(),tc.getTCY());}
	},
	setnum51 : function(cc,ex,target,val){
		if(cc!=-1){ (target==2 ? bd.sQnC(cc,val) : bd.sDiC(cc,val));}
		else      { (target==2 ? bd.sQnE(ex,val) : bd.sDiE(ex,val));}
	},
	getnum51 : function(cc,ex,target){
		if(cc!=-1){ return (target==2 ? bd.QnC(cc) : bd.DiC(cc));}
		else      { return (target==2 ? bd.QnE(ex) : bd.DiE(ex));}
	},

	//---------------------------------------------------------------------------
	// kc.chtarget()     SHIFT������������[�_]�̓��͂���Ƃ����I������
	// kc.detectTarget() [�_]�̉E�E���ǂ���ɐ�������͂��邩���f����
	//---------------------------------------------------------------------------
	chtarget : function(ca){
		if(ca!='shift'){ return false;}
		if(tc.targetdir==2){ tc.targetdir=4;}
		else{ tc.targetdir=2;}
		pc.paintCell(tc.getTCC());
		return true;
	},
	detectTarget : function(cc,ex){
		if((cc==-1 && ex==-1) || (cc!=-1 && bd.QuC(cc)!=51)){ return -1;}
		if(cc==bd.cell.length-1 || ex==k.qcols+k.qrows){ return -1;}
		if(cc!=-1){
			if	  ((bd.rt(cc)==-1 || bd.QuC(bd.rt(cc))==51) &&
				   (bd.dn(cc)==-1 || bd.QuC(bd.dn(cc))==51)){ return -1;}
			else if(bd.rt(cc)==-1 || bd.QuC(bd.rt(cc))==51){ return 4;}
			else if(bd.dn(cc)==-1 || bd.QuC(bd.dn(cc))==51){ return 2;}
		}
		else if(ex!=-1){
			if	  ((bd.excell[ex].cy==-1 && bd.QuC(bd.excell[ex].cx)==51) ||
				   (bd.excell[ex].cx==-1 && bd.QuC(bd.excell[ex].cy*k.qcols)==51)){ return -1;}
			else if(bd.excell[ex].cy==-1){ return 4;}
			else if(bd.excell[ex].cx==-1){ return 2;}
		}

		return tc.targetdir;
	}
};

//---------------------------------------------------------------------------
// ��KeyPopup�N���X �}�E�X����L�[�{�[�h���͂���ۂ�Popup�E�B���h�E���Ǘ�����
//---------------------------------------------------------------------------
// �L�[���͗pPopup�E�B���h�E
// KeyPopup�N���X
KeyPopup = function(){
	this.x = -1;
	this.y = -1;
	this.ctl = { 1:{ el:"", enable:false, target:"cell"},		// �����͎��ppopup
				 3:{ el:"", enable:false, target:"cell"} };		// �񓚓��͎��ppopup
	this.tdcolor = "black";
	this.imgCR = [1,1];			// img�\���p�摜�̉��~�c�̃T�C�Y

	this.tds  = new Array();	// resize�p
	this.imgs = new Array();	// resize�p

	this.defaultdisp = false;

	this.tbodytmp=null, this.trtmp=null;
};
KeyPopup.prototype = {
	//---------------------------------------------------------------------------
	// kp.kpinput()  �L�[�|�b�v�A�b�v������͂��ꂽ���̏������I�[�o�[���C�h�ŋL�q����
	// kp.enabled()  �L�[�|�b�v�A�b�v���̂��L�����ǂ�����Ԃ�
	//---------------------------------------------------------------------------
	// �I�[�o�[���C�h�p
	kpinput : function(ca){ },
	enabled : function(){ return menu.getVal('keypopup');},

	//---------------------------------------------------------------------------
	// kp.generate()   �L�[�|�b�v�A�b�v�𐶐����ď���������
	// kp.gentable()   �L�[�|�b�v�A�b�v�̃e�[�u�����쐬����
	// kp.gentable10() �L�[�|�b�v�A�b�v��0�`9����͂ł���e�[�u�����쐬����
	// kp.gentable4()  �L�[�|�b�v�A�b�v��0�`4����͂ł���e�[�u�����쐬����
	//---------------------------------------------------------------------------
	generate : function(type, enablemake, enableplay, func){
		if(enablemake && k.callmode=="pmake"){ this.gentable(1, type, func);}
		if(enableplay)                       { this.gentable(3, type, func);}
	},

	gentable : function(mode, type, func){
		this.ctl[mode].enable = true;
		this.ctl[mode].el = newEL('div').attr("class", "popup")
										.css("padding", "3pt").css("background-color", "silver")
										.mouseout(this.hide.ebind(this))
										.appendTo($("#popup_parent"));

		var table = newEL('table').attr("cellspacing", "2pt").appendTo(this.ctl[mode].el);
		this.tbodytmp = newEL('tbody').appendTo(table);

		this.trtmp = null;
		if(func)							  { func(mode);                }
		else if(type==0 || type==3)			  { this.gentable10(mode,type);}
		else if(type==1 || type==2 || type==4){ this.gentable4 (mode,type);}
	},

	gentable10 : function(mode, type){
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
		if     (type==0){ (mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knum.','','');}
		else if(type==3){ this.inputcol('num','knum.','-','��');}
		this.insertrow();
	},
	gentable4 : function(mode, type, tbody){
		this.inputcol('num','knum0','0','0');
		this.inputcol('num','knum1','1','1');
		this.inputcol('num','knum2','2','2');
		this.inputcol('num','knum3','3','3');
		this.insertrow();
		this.inputcol('num','knum4','4','4');
		this.inputcol('empty','knumx','','');
		this.inputcol('num','knum_',' ',' ');
		if     (type==1){ (mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knum.','','');}
		else if(type==2){ this.inputcol('num','knum.', '-', '��');}
		else if(type==4){ this.inputcol('num','knum.', '-', '��');}
		this.insertrow();
	},

	//---------------------------------------------------------------------------
	// kp.inputcol()  �e�[�u���̃Z����ǉ�����
	// kp.insertrow() �e�[�u���̍s��ǉ�����
	//---------------------------------------------------------------------------
	inputcol : function(type, id, ca, disp){
		if(!this.trtmp){ this.trtmp = newEL('tr');}
		var td = null;
		if(type=='num'){
			td = newEL('td').attr("id",id).attr("class","kpnum")
						   .html(disp).css("color", this.tdcolor)
						   .click(this.inputnumber.ebind(this, ca));
		}
		else if(type=='empty'){
			td = newEL('td').attr("id",id);
		}
		else if(type=='image'){
			var img = newEL('img').attr("id", ""+id+"_i").attr("class","kp").attr("src", "./src/img/"+k.puzzleid+"_kp.gif").unselectable();
			var div = newEL('div').css("position",'relative').css("display",'inline').unselectable().append(img);
			var td = newEL('td').attr("id",id).attr("class","kpimg").click(this.inputnumber.ebind(this, ca)).append(div);
			this.imgs.push({'el':img, 'cx':disp[0], 'cy':disp[1]});
		}

		if(td){
			this.tds.push(td);
			td.appendTo(this.trtmp).unselectable();
		}
	},
	insertrow : function(){
		if(this.trtmp){
			this.tbodytmp.append(this.trtmp);
			this.trtmp = null;
		}
	},

	//---------------------------------------------------------------------------
	// kp.display()     �L�[�|�b�v�A�b�v��\������
	// kp.inputnumber() kpinput�֐����Ăяo���ăL�[�|�b�v�A�b�v���B��
	// kp.hide()        �L�[�|�b�v�A�b�v���B��
	//---------------------------------------------------------------------------
	display : function(x,y){
		if(this.ctl[k.mode].el && this.ctl[k.mode].enable && menu.getVal('keypopup') && mv.btn.Left){
			this.x = x;
			this.y = y;

			this.ctl[k.mode].el.css("left", k.cv_oft.x + x - 3 + k.IEMargin.x);
			this.ctl[k.mode].el.css("top" , k.cv_oft.y + y - 3 + k.IEMargin.y);
			this.ctl[k.mode].el.css("z-index", 100);

			if(this.ctl[k.mode].target=="cell"){
				var cc0 = tc.getTCC();
				var cc = mv.cellid(new Pos(this.x,this.y));
				if(cc==-1){ return;}
				tc.setTCC(cc);
				pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
				pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			}
			else if(this.ctl[k.mode].target=="cross"){
				var cc0 = tc.getTXC();
				var cc = mv.crossid(new Pos(this.x,this.y));
				if(cc==-1){ return;}
				tc.setTXC(cc);
				pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
				pc.paint(bd.cross[cc0].cx-1, bd.cross[cc0].cy-1, bd.cross[cc0].cx, bd.cross[cc0].cy);
			}

			this.ctl[k.mode].el.css("visibility","visible");
		}
	},
	inputnumber : function(e, ca){
		this.kpinput(ca);
		this.ctl[k.mode].el.css("visibility","hidden");
	},
	hide : function(e){
		if(this.ctl[k.mode].el && !menu.insideOf(this.ctl[k.mode].el, e)){ this.ctl[k.mode].el.css("visibility","hidden");}
	},

	//---------------------------------------------------------------------------
	// kp.resize() �L�[�|�b�v�A�b�v�̃Z���̃T�C�Y��ύX����
	//---------------------------------------------------------------------------
	resize : function(){
		var tfunc = function(el,tsize){
			el.css("width"    , ""+mf(tsize*0.90)+"px")
			  .css("height"   , ""+mf(tsize*0.90)+"px")
			  .css("font-size", ""+mf(tsize*0.70)+"px");
		};
		var ifunc = function(el,cx,cy,bsize){
			el.css("width" , ""+(bsize*kp.imgCR[0])+"px")
			  .css("height", ""+(bsize*kp.imgCR[1])+"px")
			  .css("clip"  , "rect("+(bsize*cy+1)+"px,"+(bsize*(cx+1))+"px,"+(bsize*(cy+1))+"px,"+(bsize*cx+1)+"px)")
			  .css("top"   , "-"+(cy*bsize+1)+"px")
			  .css("left"  , "-"+(cx*bsize+1)+"px");
		};

		if(k.def_csize>=24){
			$.each(this.tds , function(i,obj){ tfunc(obj, k.def_csize);} );
			$.each(this.imgs, function(i,obj){ ifunc(obj.el,obj.cx,obj.cy,mf(k.def_csize*0.90));} );
		}
		else{
			$.each(this.tds , function(i,obj){ tfunc(obj, 22);} );
			$.each(this.imgs, function(i,obj){ ifunc(obj.el,obj.cx,obj.cy,18);} );
		}
	}
};

//---------------------------------------------------------------------------
// ��TCell�N���X �L�[���͂̃^�[�Q�b�g��ێ����� (�֐��̐����͗�)
//---------------------------------------------------------------------------

TCell = function(){
	this.cursolx = 1;
	this.cursoly = 1;

	this.minx = (k.isextendcell!=0?-1:1);
	this.miny = (k.isextendcell!=0?-1:1);
	this.maxx = (k.isextendcell==2?2*k.qcols+1:2*k.qcols-1);
	this.maxy = (k.isextendcell==2?2*k.qrows+1:2*k.qrows-1);
};
TCell.prototype = {
	//---------------------------------------------------------------------------
	// tc.Adjust()   �͈͂ƃ^�[�Q�b�g�̈ʒu�𒲐߂���
	// tc.setAlign() ���[�h�ύX���Ɉʒu�����������ꍇ�ɒ��߂���(�I�[�o�[���C�h�p)
	//---------------------------------------------------------------------------
	Adjust : function(){
		if(this.cursolx<this.minx){ this.tborderx=this.minx; }
		if(this.cursoly<this.miny){ this.tbordery=this.miny; }
		if(this.cursolx>this.maxx){ this.tborderx=this.maxx; }
		if(this.cursoly>this.maxy){ this.tbordery=this.maxy; }
	},
	setAlign : function(){ },

	//---------------------------------------------------------------------------
	// tc.incTCX(), tc.incTCY(), tc.decTCX(), tc.decTCY() �^�[�Q�b�g�̈ʒu�𓮂���
	//---------------------------------------------------------------------------
	incTCX : function(mv){ this.cursolx+=mv;},
	incTCY : function(mv){ this.cursoly+=mv;},
	decTCX : function(mv){ this.cursolx-=mv;},
	decTCY : function(mv){ this.cursoly-=mv;},

	//---------------------------------------------------------------------------
	// tc.getTCP() �^�[�Q�b�g�̈ʒu��(X,Y)�Ŏ擾����(�Z����1/2=1�Ƃ���)
	// tc.setTCP() �^�[�Q�b�g�̈ʒu��(X,Y)�Őݒ肷��(�Z����1/2=1�Ƃ���)
	// tc.getTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Ŏ擾����
	// tc.setTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Őݒ肷��
	// tc.getTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Ŏ擾����
	// tc.setTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Őݒ肷��
	// tc.getTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Ŏ擾����
	// tc.setTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Őݒ肷��
	//---------------------------------------------------------------------------
	getTCP : function(){ return new Pos(this.cursolx,this.cursoly);},
	setTCP : function(pos){
		if(pos.x<this.minx || this.maxx<pos.x || pos.y<this.miny || this.maxy<pos.y){ return;}
		this.cursolx = pos.x; this.cursoly = pos.y;
	},
	getTCC : function(){ return bd.cnum(mf((this.cursolx-1)/2), mf((this.cursoly-1)/2));},
	setTCC : function(id){
		if(id<0 || bd.cell.length<=id){ return;}
		this.cursolx = bd.cell[id].cx*2+1; this.cursoly = bd.cell[id].cy*2+1;
	},
	getTXC : function(){ return bd.xnum(mf(this.cursolx/2), mf(this.cursoly/2));},
	setTXC : function(id){
		if(!k.iscross || id<0 || bd.cross.length<=id){ return;}
		this.cursolx = bd.cross[id].cx*2; this.cursoly = bd.cross[id].cy*2;
	},
	getTBC : function(){ return bd.bnum(this.cursolx, this.cursoly);},
	setTBC : function(id){
		if(!k.isborder || id<0 || bd.border.length<=id){ return;}
		this.cursolx = bd.border[id].cx*2; this.cursoly = bd.border[id].cy;
	}
};

//---------------------------------------------------------------------------
// ��Encode�N���X URL�̃G���R�[�h/�f�R�[�h������
//    p.html?(pid)/(qdata)
//                  qdata -> [(pflag)/](cols)/(rows)/(bstr)
//---------------------------------------------------------------------------
// URL�G���R�[�h/�f�R�[�h
// Encode�N���X
Encode = function(search){
	this.uri = [];
	this.uri.pid = "";			// ���͂��ꂽURL��ID����
	this.uri.qdata = "";		// ���͂��ꂽURL�̖�蕔��

	this.uri.pflag = "";		// ���͂��ꂽURL�̃t���O����
	this.uri.cols = 0;			// ���͂��ꂽURL�̉�������
	this.uri.rows = 0;			// ���͂��ꂽURL�̏c������
	this.uri.bstr = "";			// ���͂��ꂽURL�̔Ֆʕ���

	this.first_decode(search);
};
Encode.prototype = {
	//---------------------------------------------------------------------------
	// enc.init()         Encode�I�u�W�F�N�g�Ŏ��l������������
	// enc.first_decode() �͂��߂�URL����͂���puzzleid��G�f�B�^��player���𔻒f����
	// enc.pzlinput()     "URL�����"�܂��͋N�����̐ݒ芮����ɌĂ΂�āA�e�p�Y����pzlinput�֐����Ăяo��
	// enc.pzlimport()    �e�p�Y����URL���͗p(�I�[�o�[���C�h�p)
	//---------------------------------------------------------------------------
	init : function(){
		this.uri.pid = "";
		this.uri.qdata = "";
		this.uri.pflag = "";
		this.uri.cols = 0;
		this.uri.rows = 0;
		this.uri.bstr = "";
	},
	first_decode : function(search){
		if(search.length>0){
			if(search.substring(0,3)=="?m+"){
				k.callmode = "pmake"; k.mode = 1;
				search = search.substring(3, search.length);
			}
			else{
				k.callmode = ((!k.scriptcheck)?"pplay":"pmake"); k.mode = 3;
				search = search.substring(1, search.length);
			}
			this.data_decode(search, 0)
		}
	},
	pzlinput : function(type){
		if(k.puzzleid=="icebarn" && bd.arrowin==-1 && bd.arrowout==-1){
			bd.inputarrowin (0 + bd.bdinside, 1);
			bd.inputarrowout(2 + bd.bdinside, 1);
		}

		if(this.uri.bstr){
			this.pzlimport(type, this.uri.bstr);

			bd.ansclear();
			um.allerase();

			base.resize_canvas_onload();
		}
	},
	pzlimport : function(type,bstr){ },	// �I�[�o�[���C�h�p
	pzlexport : function(type){ },		// �I�[�o�[���C�h�p

	//---------------------------------------------------------------------------
	// enc.get_search()   ���͂��ꂽURL��?�ȉ��̕�����Ԃ�
	// enc.data_decode()  pzlURI����pflag,bstr���̕����ɕ�������
	// enc.checkpflag()   pflag�Ɏw�肵�������񂪊܂܂�Ă��邩���ׂ�
	//---------------------------------------------------------------------------
	get_search : function(url){
		var type = 0;	// 0�͂ς��Ղ�v3�Ƃ���
		if(url.indexOf("indi.s58.xrea.com", 0)>=0){
			if(url.indexOf("/sa/", 0)>=0 || url.indexOf("/sc/", 0)>=0){ type = 1;} // 1�͂ς��Ղ�/URL�W�F�l���[�^�Ƃ���
		}
		else if(url.indexOf("www.kanpen.net", 0)>=0 || url.indexOf("www.geocities.jp/pencil_applet", 0)>=0 ){
			// �J���y��������URL�͂ւ�킯�A�v���b�g
			if(url.indexOf("heyawake=", 0)>=0){
				url = "http://www.geocities.jp/heyawake/?problem="+url.substring(url.indexOf("heyawake=", 0)+9,url.length);
				type = 4;
			}
			// �J���y��������URL�͂ς��Ղ�
			else if(url.indexOf("pzpr=", 0)>=0){
				url = "http://indi.s58.xrea.com/"+k.puzzleid+"/sa/q.html?"+url.substring(url.indexOf("pzpr=", 0)+5,url.length);
				type = 0;
			}
			else{ type = 2;} // 2�̓J���y���Ƃ���
		}
		else if(url.indexOf("www.geocities.jp/heyawake", 0)>=0 || url.indexOf("www.geocities.co.jp/heyawake", 0)>=0){
			type = 4; // 4�͂ւ�킯�A�v���b�g
		}

		var qus;
		if(type!=2){ qus = url.indexOf("?", 0);}
		else if(url.indexOf("www.kanpen.net", 0)>=0){ qus = url.indexOf("www.kanpen.net", 0);}
		else if(url.indexOf("www.geocities.jp/pencil_applet", 0)>=0){ qus = url.indexOf("www.geocities.jp/pencil_applet", 0);}

		if(qus>=0){
			this.data_decode(url.substring(qus+1,url.length), type);
		}
		else{
			this.init();
		}
		return type;
	},
	data_decode : function(search, type){
		this.init();

		if(type==0||type==1){
			var idx = search.indexOf("/", 0);

			if(idx==-1){
				this.uri.pid = search.substring(0, search.length);
				this.uri.qdata = "";
				return;
			}

			this.uri.pid = search.substring(0, idx);
			if(type==0){
				this.uri.qdata = search.substring(idx+1, search.length);
			}
			else if(type==1){
				this.uri.qdata = search;
			}

			var inp = this.uri.qdata.split("/");
			if(!isNaN(parseInt(inp[0]))){ inp.unshift("");}

			if(inp.length==3){
				this.uri.pflag = inp.shift();
				this.uri.cols = parseInt(inp.shift());
				this.uri.rows = parseInt(inp.shift());
			}
			else if(inp.length>=4){
				this.uri.pflag = inp.shift();
				this.uri.cols = parseInt(inp.shift());
				this.uri.rows = parseInt(inp.shift());
				this.uri.bstr = inp.join("/");
			}
		}
		else if(type==2){
			//this.uri.pid = "heyawake";
			var idx = search.indexOf("=", 0);
			this.uri.qdata = search.substring(idx+1, search.length);

			var inp = this.uri.qdata.split("/");

			if(!isNaN(parseInt(inp[0]))){ inp.unshift("");}

			this.uri.pflag = inp.shift();
			if(k.puzzleid!="sudoku"){
				this.uri.rows = parseInt(inp.shift());
				this.uri.cols = parseInt(inp.shift());
				if(k.puzzleid=="kakuro"){ this.uri.rows--; this.uri.cols--;}
			}
			else{
				this.uri.rows = this.uri.cols = parseInt(inp.shift());
			}
			this.uri.bstr = inp.join("/");
		}
		else if(type==4){
			this.uri.pid = "heyawake";
			var idx = search.indexOf("=", 0);
			this.uri.qdata = search.substring(idx+1, search.length);

			var inp = this.uri.qdata.split("/");

			this.uri.pflag = "";
			var inp0 = inp.shift().split("x");
			this.uri.cols = parseInt(inp0[0]);
			this.uri.rows = parseInt(inp0[1]);
			this.uri.bstr = inp.join("/");
		}

	},
	checkpflag : function(ca){ return (this.uri.pflag.indexOf(ca)>=0);},

	//---------------------------------------------------------------------------
	// enc.decode4()  ques��0�`4�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encode4()  ques��0�`4�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decode4 : function(bstr, func, max){
		var cell=0, i=0;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (this.include(ca,"0","4")){ func(cell, parseInt(ca,16));    cell++; }
			else if(this.include(ca,"5","9")){ func(cell, parseInt(ca,16)-5);  cell+=2;}
			else if(this.include(ca,"a","e")){ func(cell, parseInt(ca,16)-10); cell+=3;}
			else if(this.include(ca,"g","z")){ cell+=(parseInt(ca,36)-15);}
			else if(ca=="."){ func(cell, -2); cell++;}

			if(cell>=max){ break;}
		}
		return bstr.substring(i+1,bstr.length);
	},
	encode4 : function(func, max){
		var count = 0, cm = "";
		for(var i=0;i<max;i++){
			var pstr = "";

			if(func(i)>=0){
				if(func(i+1)>=0||func(i+1)==-2){ pstr=""+func(i).toString(16);}
				else if(func(i+2)>=0||func(i+2)==-2){ pstr=""+(5+func(i)).toString(16); i++;}
				else{ pstr=""+(10+func(i)).toString(16); i+=2;}
			}
			else if(func(i)==-2){ pstr=".";}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += ((count+15).toString(36));}

		return cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeNumber10()  ques��0�`9�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeNumber10()  ques��0�`9�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeNumber10 : function(bstr){
		var c=0, i=0;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if     (this.include(ca,"0","9")){ bd.sQnC(c, parseInt(bstr.substring(i,i+1),10)); c++;}
			else if(this.include(ca,"a","z")){ c += (parseInt(ca,36)-9);}
			else if(ca == '.'){ bd.sQnC(c, -2); c++;}
			else{ c++;}

			if(c > bd.cell.length){ break;}
		}
		return bstr.substring(i,bstr.length);
	},
	encodeNumber10 : function(){
		var cm="", count=0;
		for(var i=0;i<bd.cell.length;i++){
			pstr = "";
			var val = bd.QnC(i);

			if     (val==  -2            ){ pstr = ".";}
			else if(val>=   0 && val<  10){ pstr =       val.toString(10);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==26){ cm+=((9+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(9+count).toString(36);}

		return cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeNumber16()  ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeNumber16()  ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeNumber16 : function(bstr){
		var c = 0, i=0;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","f")){ bd.sQnC(c, parseInt(bstr.substring(i,i+1),16)); c++;}
			else if(ca == '.'){ bd.sQnC(c, -2);                                        c++;      }
			else if(ca == '-'){ bd.sQnC(c, parseInt(bstr.substring(i+1,i+3),16));      c++; i+=2;}
			else if(ca == '+'){ bd.sQnC(c, parseInt(bstr.substring(i+1,i+4),16));      c++; i+=3;}
			else if(ca == '='){ bd.sQnC(c, parseInt(bstr.substring(i+1,i+4),16)+4096); c++; i+=3;}
			else if(ca == '%'){ bd.sQnC(c, parseInt(bstr.substring(i+1,i+4),16)+8192); c++; i+=3;}
			else if(ca >= 'g' && ca <= 'z'){ c += (parseInt(ca,36)-15);}
			else{ c++;}

			if(c > bd.cell.length){ break;}
		}
		return bstr.substring(i,bstr.length);
	},
	encodeNumber16 : function(){
		var count=0, cm="";
		for(var i=0;i<bd.cell.length;i++){
			pstr = "";
			var val = bd.QnC(i);

			if     (val==  -2            ){ pstr = ".";}
			else if(val>=   0 && val<  16){ pstr =       val.toString(16);}
			else if(val>=  16 && val< 256){ pstr = "-" + val.toString(16);}
			else if(val>= 256 && val<4096){ pstr = "+" + val.toString(16);}
			else if(val>=4096 && val<8192){ pstr = "=" + (val-4096).toString(16);}
			else if(val>=8192            ){ pstr = "%" + (val-8192).toString(16);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(15+count).toString(36);}

		return cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeRoomNumber16()  �����{�����̈��ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeRoomNumber16()  �����{�����̈��ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeRoomNumber16 : function(bstr){
		room.resetRarea();
		var r = 1, i=0;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","f")){ bd.sQnC(room.getTopOfRoom(r), parseInt(bstr.substring(i,i+1),16)); r++;}
			else if(ca == '-'){ bd.sQnC(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+3),16));      r++; i+=2;}
			else if(ca == '+'){ bd.sQnC(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16));      r++; i+=3;}
			else if(ca == '='){ bd.sQnC(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16)+4096); r++; i+=3;}
			else if(ca == '%'){ bd.sQnC(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16)+8192); r++; i+=3;}
			else if(ca == '*'){ bd.sQnC(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16)+12240); r++; i+=4;}
			else if(ca == '$'){ bd.sQnC(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16)+77776); r++; i+=5;}
			else if(ca >= 'g' && ca <= 'z'){ r += (parseInt(ca,36)-15);}
			else{ r++;}

			if(r > room.rareamax){ break;}
		}
		return bstr.substring(i,bstr.length);
	},
	encodeRoomNumber16 : function(){
		room.resetRarea();
		var count=0, cm="";
		for(var i=1;i<=room.rareamax;i++){
			var pstr = "";
			var val = bd.QnC(room.getTopOfRoom(i));

			if     (val>=     0 && val<    16){ pstr =       val.toString(16);}
			else if(val>=    16 && val<   256){ pstr = "-" + val.toString(16);}
			else if(val>=   256 && val<  4096){ pstr = "+" + val.toString(16);}
			else if(val>=  4096 && val<  8192){ pstr = "=" + (val-4096).toString(16);}
			else if(val>=  8192 && val< 12240){ pstr = "%" + (val-8192).toString(16);}
			else if(val>= 12240 && val< 77776){ pstr = "*" + (val-12240).toString(16);}
			else if(val>= 77776              ){ pstr = "$" + (val-77776).toString(16);} // �ő�1126352
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(15+count).toString(36);}

		return cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeArrowNumber16()  ���t��ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeArrowNumber16()  ���t��ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeArrowNumber16 : function(bstr){
		var c=0, i=0;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if     (ca=='0'){ bd.sQnC(c, parseInt(bstr.substring(i+1,i+2),16)); c++; i++; }
			else if(ca=='5'){ bd.sQnC(c, parseInt(bstr.substring(i+1,i+3),16)); c++; i+=2;}
			else if(this.include(ca,"1","4")){
				bd.sDiC(c, parseInt(ca,16));
				if(bstr.charAt(i+1)!="."){ bd.sQnC(c, parseInt(bstr.substring(i+1,i+2),16));}
				else{ bd.sQnC(c,-2);}
				c++; i++;
			}
			else if(this.include(ca,"6","9")){
				bd.sDiC(c, parseInt(ca,16)-5);
				bd.sQnC(c, parseInt(bstr.substring(i+1,i+3),16));
				c++; i+=2;
			}
			else if(ca>='a' && ca<='z'){ c+=(parseInt(ca,36)-9);}
			else{ c++;}

			if(c > bd.cell.length){ break;}
		}
		return bstr.substring(i,bstr.length);
	},
	encodeArrowNumber16 : function(){
		var cm = "", count = 0;
		for(var c=0;c<bd.cell.length;c++){
			var pstr="";
			if(bd.QnC(c)!=-1){
				if     (bd.QnC(c)==-2){ pstr=((bd.DiC(c)==0?0:bd.DiC(c)  )+".");}
				else if(bd.QnC(c)< 16){ pstr=((bd.DiC(c)==0?0:bd.DiC(c)  )+bd.QnC(c).toString(16));}
				else if(bd.QnC(c)<256){ pstr=((bd.DiC(c)==0?5:bd.DiC(c)+5)+bd.QnC(c).toString(16));}
			}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+9).toString(36)+pstr); count=0;}
			else if(count==26){ cm += "z"; count=0;}
		}
		if(count>0){ cm += (count+9).toString(36);}

		return cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeBorder() ���̋��E�����f�R�[�h����
	// enc.encodeBorder() ���̋��E�����G���R�[�h����
	//---------------------------------------------------------------------------
	decodeBorder : function(bstr){
		var pos1, pos2;

		if(bstr){
			pos1 = Math.min(mf(((k.qcols-1)*k.qrows+4)/5)     , bstr.length);
			pos2 = Math.min(mf((k.qcols*(k.qrows-1)+4)/5)+pos1, bstr.length);
		}
		else{ pos1 = 0; pos2 = 0;}

		for(var i=0;i<pos1;i++){
			var ca = parseInt(bstr.charAt(i),32);
			for(var w=0;w<5;w++){
				if(i*5+w<(k.qcols-1)*k.qrows){ bd.sQuB(i*5+w,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		var oft = (k.qcols-1)*k.qrows;
		for(var i=0;i<pos2-pos1;i++){
			var ca = parseInt(bstr.charAt(i+pos1),32);
			for(var w=0;w<5;w++){
				if(i*5+w<k.qcols*(k.qrows-1)){ bd.sQuB(i*5+w+oft,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		return bstr.substring(pos2,bstr.length);
	},
	encodeBorder : function(){
		var num, pass;
		var cm = "";

		num = 0; pass = 0;
		for(var i=0;i<(k.qcols-1)*k.qrows;i++){
			if(bd.QuB(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		num = 0; pass = 0;
		for(var i=(k.qcols-1)*k.qrows;i<bd.bdinside;i++){
			if(bd.QuB(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		return cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeCrossMark() ���_���f�R�[�h����
	// enc.encodeCrossMark() ���_���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeCrossMark : function(bstr){
		var cc = -1, i=0;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","z")){
				cc += (parseInt(ca,36)+1);
				var cx = (k.isoutsidecross==1?   cc%(k.qcols+1) :   cc%(k.qcols-1) +1);
				var cy = (k.isoutsidecross==1?mf(cc/(k.qcols+1)):mf(cc/(k.qcols-1))+1);

				if(cy>=k.qrows+(k.isoutsidecross==1?1:0)){ i++; break;}
				bd.sQnX(bd.xnum(cx,cy), 1);
			}
			else if(ca == '.'){ cc += 36;}
			else{ cc++;}

			if(cc >= (k.isoutsidecross==1?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1))-1){ i++; break;}
		}
		return bstr.substring(i, bstr.length);
	},
	encodeCrossMark : function(){
		var cm = "", count = 0;
		for(var i=0;i<(k.isoutsidecross==1?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1));i++){
			var pstr = "";
			var cx = (k.isoutsidecross==1?   i%(k.qcols+1) :   i%(k.qcols-1) +1);
			var cy = (k.isoutsidecross==1?mf(i/(k.qcols+1)):mf(i/(k.qcols-1))+1);

			if(bd.QnX(bd.xnum(cx,cy))==1){ pstr = ".";}
			else{ pstr=" "; count++;}

			if(pstr!=" "){ cm += count.toString(36); count=0;}
			else if(count==36){ cm += "."; count=0;}
		}
		if(count>0){ cm += count.toString(36);}

		return cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodecross_old() Cross�̖�蕔���f�R�[�h����(���`��)
	//---------------------------------------------------------------------------
	decodecross_old : function(bstr){
		for(var i=0;i<Math.min(bstr.length, bd.cross.length);i++){
			if     (bstr.charAt(i)=="0"){ bd.sQnX(i,0);}
			else if(bstr.charAt(i)=="1"){ bd.sQnX(i,1);}
			else if(bstr.charAt(i)=="2"){ bd.sQnX(i,2);}
			else if(bstr.charAt(i)=="3"){ bd.sQnX(i,3);}
			else if(bstr.charAt(i)=="4"){ bd.sQnX(i,4);}
			else{ bd.sQnX(i,-1);}
		}
		for(var j=bstr.length;j<bd.cross.length;j++){ bd.sQnX(j,-1);}

		return bstr.substring(i,bstr.length);
	},

	//---------------------------------------------------------------------------
	// enc.include()    ������ca��bottom��up�̊Ԃɂ��邩
	// enc.getURLbase() ���̃X�N���v�g���u���Ă���URL��\������
	// enc.getDocbase() ���̃X�N���v�g���u���Ă���h���C������\������
	// enc.kanpenbase() �J���y���̃h���C������\������
	//---------------------------------------------------------------------------
	include : function(ca, bottom, up){
		if(bottom <= ca && ca <= up) return true;
		return false;
	},
	getURLbase : function(){ return "http://indi.s58.xrea.com/pzpr/v3/p.html";},
	getDocbase : function(){ return "http://indi.s58.xrea.com/";},
	kanpenbase : function(){ return "http://www.kanpen.net/";}
};

//---------------------------------------------------------------------------
// ��FileIO�N���X �t�@�C���̃f�[�^�`���G���R�[�h/�f�R�[�h������
//   ��fstruct�̓��e�ɂ���
//     "cellques41_42" Cell��́��Ɓ��̃G���R�[�h/�f�R�[�h
//     "cellqnum"      Cell��̖�萔���݂̂̃G���R�[�h/�f�R�[�h
//     "cellqnum51"    Cell,EXCell���[�^]�̃G���R�[�h/�f�R�[�h
//     "cellqnumb"     Cell��̍��}�X�{��萔��(0�`4)�̃G���R�[�h/�f�R�[�h
//     "cellqnumans"   Cell��̖�萔���Ɓ��ƁE�̃G���R�[�h/�f�R�[�h
//     "celldirecnum"  Cell��̖�����萔���̃G���R�[�h/�f�R�[�h
//     "cellans"       Cell�́��ƁE�̃G���R�[�h/�f�R�[�h
//     "cellqanssub"   Cell��̉񓚐����ƕ⏕�L��(qsub==1�`4)�̃G���R�[�h/�f�R�[�h
//     "cellqsub"      Cell��̕⏕�L���݂̂̃G���R�[�h/�f�R�[�h
//     "crossnum"      Cross/qnum��0�`�A-2���G���R�[�h/�f�R�[�h
//     "borderques"    ���E��(���)�̃G���R�[�h/�f�R�[�h
//     "borderline"    �񓚂̐��Ɓ~�̃G���R�[�h/�f�R�[�h
//     "borderans"     ���E��(��)�ƕ⏕�L���̃G���R�[�h/�f�R�[�h
//     "borderans2"    �O�g����܂߂����E��(��)�ƕ⏕�L���̃G���R�[�h/�f�R�[�h
//     "arearoom"      ����(�C�ӂ̌`)�̃G���R�[�h/�f�R�[�h
//     "others"        �p�Y����puz�I�u�W�F�N�g�̊֐����Ăяo��
//---------------------------------------------------------------------------
FileIO = function(){
	this.max = 0;
	this.check = new Array();

	this.db = null;
	this.dbmgr = null;
	this.DBtype = 0;
	this.DBsid  = -1;
	this.DBlist = new Array();
};
FileIO.prototype = {
	//---------------------------------------------------------------------------
	// fio.fileopen()  �t�@�C�����J���A�t�@�C������̃f�R�[�h���s���C���֐�
	//---------------------------------------------------------------------------
	fileopen : function(arrays, type){
		if(type==1){
			if(arrays.shift()!='pzprv3'){ alert('�ς��Ղ�v3�`���̃t�@�C���ł͂���܂���B');}
			if(arrays.shift()!=k.puzzleid){ alert(base.getPuzzleName()+'�̃t�@�C���ł͂���܂���B');}
		}

		var row = parseInt(arrays.shift(), 10), col;
		if(k.puzzleid!="sudoku"){ col=parseInt(arrays.shift(), 10);}else{ col=row;}

		if     (row>0 && col>0 && (type==1 || k.puzzleid!="kakuro")){ menu.ex.newboard2(col, row);}
		else if(row>0 && col>0){ menu.ex.newboard2(col-1, row-1);}
		else{ return;}

		um.disableRecord();

		if(type==1){
			var line = 0;
			var item = 0;
			var stacks = new Array();
			while(1){
				if(arrays.length<=0){ break;}
				stacks.push( arrays.shift() ); line++;
				if     (k.fstruct[item] == "cellques41_42"&& line>=k.qrows    ){ this.decodeCellQues41_42(stacks); }
				else if(k.fstruct[item] == "cellqnum"     && line>=k.qrows    ){ this.decodeCellQnum(stacks);      }
				else if(k.fstruct[item] == "cellqnum51"   && line>=k.qrows+1  ){ this.decodeCellQnum51(stacks);    }
				else if(k.fstruct[item] == "cellqnumb"    && line>=k.qrows    ){ this.decodeCellQnumb(stacks);     }
				else if(k.fstruct[item] == "cellqnumans"  && line>=k.qrows    ){ this.decodeCellQnumAns(stacks);   }
				else if(k.fstruct[item] == "celldirecnum" && line>=k.qrows    ){ this.decodeCellDirecQnum(stacks); }
				else if(k.fstruct[item] == "cellans"      && line>=k.qrows    ){ this.decodeCellAns(stacks);       }
				else if(k.fstruct[item] == "cellqanssub"  && line>=k.qrows    ){ this.decodeCellQanssub(stacks);   }
				else if(k.fstruct[item] == "cellqsub"     && line>=k.qrows    ){ this.decodeCellQsub(stacks);      }
				else if(k.fstruct[item] == "crossnum"     && line>=k.qrows+1  ){ this.decodeCrossNum(stacks);      }
				else if(k.fstruct[item] == "borderques"   && line>=2*k.qrows-1){ this.decodeBorderQues(stacks);    }
				else if(k.fstruct[item] == "borderline"   && line>=2*k.qrows-1){ this.decodeBorderLine(stacks);    }
				else if(k.fstruct[item] == "borderans"    && line>=2*k.qrows-1){ this.decodeBorderAns(stacks);     }
				else if(k.fstruct[item] == "borderans2"   && line>=2*k.qrows+1){ this.decodeBorderAns2(stacks);    }
				else if(k.fstruct[item] == "arearoom"     && line>=k.qrows+1  ){ this.decodeAreaRoom(stacks);      }
				else if(k.fstruct[item] == "others" && this.decodeOthers(stacks) ){ }
				else{ continue;}

				// decode�������Ƃ̏���
				line=0;
				item++;
				stacks = new Array();
			}
		}
		else if(type==2){
			this.kanpenOpen(arrays);
		}

		um.enableRecord();
		base.resize_canvas();
	},
	//---------------------------------------------------------------------------
	// fio.filesave()    �t�@�C���ۑ��A�t�@�C���ւ̃G���R�[�h���s�֐�
	// fio.filesavestr() �t�@�C���ۑ��A�t�@�C���ւ̃G���R�[�h���s���C���֐�
	//---------------------------------------------------------------------------
	filesave : function(type){
		var fname = prompt("�ۑ�����t�@�C��������͂��ĉ������B", k.puzzleid+".txt");
		if(!fname){ return;}
		var prohibit = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
		for(var i=0;i<prohibit.length;i++){ if(fname.indexOf(prohibit[i])!=-1){ alert('�t�@�C�����Ƃ��Ďg�p�ł��Ȃ��������܂܂�Ă��܂��B'); return;} }

		document.fileform2.filename.value = fname;

		if     (navigator.platform.indexOf("Win")!=-1){ document.fileform2.platform.value = "Win";}
		else if(navigator.platform.indexOf("Mac")!=-1){ document.fileform2.platform.value = "Mac";}
		else                                          { document.fileform2.platform.value = "Others";}

		document.fileform2.ques.value = this.filesavestr(type);

		if(type==1){
			if(!k.isKanpenExist || k.puzzleid=="lits"){ document.fileform2.urlstr.value = enc.getURLbase() + "?" + k.puzzleid + enc.pzldata();}
			else{ enc.pzlexport(2); document.fileform2.urlstr.value = document.urloutput.ta.value;}
		}
		else if(type==2){
			document.fileform2.urlstr.value = "";
		}

		document.fileform2.submit();
	},
	filesavestr : function(type){
		var str = "";

		if(type==1){
			str = "pzprv3/"+k.puzzleid+"/"+k.qrows+"/"+k.qcols+"/";
			if(k.puzzleid=="sudoku"){ str = "pzprv3/"+k.puzzleid+"/"+k.qcols+"/";}

			for(var i=0;i<k.fstruct.length;i++){
				if     (k.fstruct[i] == "cellques41_42" ){ str += this.encodeCellQues41_42(); }
				else if(k.fstruct[i] == "cellqnum"      ){ str += this.encodeCellQnum();      }
				else if(k.fstruct[i] == "cellqnum51"    ){ str += this.encodeCellQnum51();    }
				else if(k.fstruct[i] == "cellqnumb"     ){ str += this.encodeCellQnumb();     }
				else if(k.fstruct[i] == "cellqnumans"   ){ str += this.encodeCellQnumAns();   }
				else if(k.fstruct[i] == "celldirecnum"  ){ str += this.encodeCellDirecQnum(); }
				else if(k.fstruct[i] == "cellans"       ){ str += this.encodeCellAns();       }
				else if(k.fstruct[i] == "cellqanssub"   ){ str += this.encodeCellQanssub();   }
				else if(k.fstruct[i] == "cellqsub"      ){ str += this.encodeCellQsub();      }
				else if(k.fstruct[i] == "crossnum"      ){ str += this.encodeCrossNum();      }
				else if(k.fstruct[i] == "borderques"    ){ str += this.encodeBorderQues();    }
				else if(k.fstruct[i] == "borderline"    ){ str += this.encodeBorderLine();    }
				else if(k.fstruct[i] == "borderans"     ){ str += this.encodeBorderAns();     }
				else if(k.fstruct[i] == "borderans2"    ){ str += this.encodeBorderAns2();    }
				else if(k.fstruct[i] == "arearoom"      ){ str += this.encodeAreaRoom();      }
				else if(k.fstruct[i] == "others"        ){ str += this.encodeOthers();         }
			}
		}
		else if(type==2){
			if     (k.puzzleid=="kakuro"){ str = ""+(k.qrows+1)+"/"+(k.qcols+1)+"/";}
			else if(k.puzzleid=="sudoku"){ str = ""+k.qrows+"/";}
			else                         { str = ""+k.qrows+"/"+k.qcols+"/";}
			str += this.kanpenSave();
		}

		return str;
	},

	//---------------------------------------------------------------------------
	// fio.retarray() ���s�{�X�y�[�X��؂�̕������z��ɂ���
	//---------------------------------------------------------------------------
	retarray : function(str){
		var array1 = str.split(" ");
		var array2 = new Array();
		for(var i=0;i<array1.length;i++){ if(array1[i]!=""){ array2.push(array1[i]);} }
		return array2;
	},

	//---------------------------------------------------------------------------
	// fio.decodeObj()     �z��ŁA�ʕ����񂩂�ʃZ���Ȃǂ̐ݒ���s��
	// fio.decodeCell()    �z��ŁA�ʕ����񂩂�ʃZ���̐ݒ���s��
	// fio.decodeCross()   �z��ŁA�ʕ����񂩂��Cross�̐ݒ���s��
	// fio.decodeBorder()  �z��ŁA�ʕ����񂩂��Border(�O�g��Ȃ�)�̐ݒ���s��
	// fio.decodeBorder2() �z��ŁA�ʕ����񂩂��Border(�O�g�゠��)�̐ݒ���s��
	//---------------------------------------------------------------------------
	decodeObj : function(func, stack, width, getid){
		var item = new Array();
		for(var i=0;i<stack.length;i++){ item = item.concat( this.retarray( stack[i] ) );    }
		for(var i=0;i<item.length;i++) { func(getid(i%width,mf(i/width)), item[i]);}
	},
	decodeCell   : function(func, stack){ this.decodeObj(func, stack, k.qcols  , function(cx,cy){return bd.cnum(cx,cy);});},
	decodeCross  : function(func, stack){ this.decodeObj(func, stack, k.qcols+1, function(cx,cy){return bd.xnum(cx,cy);});},
	decodeBorder : function(func, stack){
		this.decodeObj(func, stack.slice(0      ,k.qrows    ), k.qcols-1, function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);});
		this.decodeObj(func, stack.slice(k.qrows,2*k.qrows-1), k.qcols  , function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	decodeBorder2: function(func, stack){
		this.decodeObj(func, stack.slice(0      ,k.qrows    ), k.qcols+1, function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);});
		this.decodeObj(func, stack.slice(k.qrows,2*k.qrows+1), k.qcols  , function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
	},

	//---------------------------------------------------------------------------
	// fio.encodeObj()     �ʃZ���f�[�^������ʕ�����̐ݒ���s��
	// fio.encodeCell()    �ʃZ���f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeCross()   ��Cross�f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeBorder()  ��Border�f�[�^(�O�g��Ȃ�)����ʕ�����̐ݒ���s��
	// fio.encodeBorder2() ��Border�f�[�^(�O�g�゠��)����ʕ�����̐ݒ���s��
	//---------------------------------------------------------------------------
	encodeObj : function(func, width, height, getid){
		var str = "";
		for(var cy=0;cy<height;cy++){
			for(var cx=0;cx<width;cx++){ str += func(getid(cx,cy)); }
			str += "/";
		}
		return str;
	},
	encodeCell   : function(func){ return this.encodeObj(func, k.qcols  , k.qrows  , function(cx,cy){return bd.cnum(cx,cy);});},
	encodeCross  : function(func){ return this.encodeObj(func, k.qcols+1, k.qrows+1, function(cx,cy){return bd.xnum(cx,cy);});},
	encodeBorder : function(func){
		return this.encodeObj(func, k.qcols-1, k.qrows  , function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);})
			 + this.encodeObj(func, k.qcols  , k.qrows-1, function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	encodeBorder2: function(func){
		return this.encodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);})
			 + this.encodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
	},

	//---------------------------------------------------------------------------
	// fio.decodeCellQues41_42() ���ۂƔ��ۂ̃f�R�[�h���s��
	// fio.encodeCellQues41_42() ���ۂƔ��ۂ̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQues41_42 : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "-"){ bd.sQnC(c, -2);}
			else if(ca == "1"){ bd.sQuC(c, 41);}
			else if(ca == "2"){ bd.sQuC(c, 42);}
		},stack);
	},
	encodeCellQues41_42 : function(){
		return this.encodeCell( function(c){
			if     (bd.QuC(c)==41){ return "1 ";}
			else if(bd.QuC(c)==42){ return "2 ";}
			else if(bd.QnC(c)==-2){ return "- ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum() ��萔���̃f�R�[�h���s��
	// fio.encodeCellQnum() ��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "-"){ bd.sQnC(c, -2);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnum : function(){
		return this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)==-2){ return "- ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumb() ���{��萔���̃f�R�[�h���s��
	// fio.encodeCellQnumb() ���{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumb : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "5"){ bd.sQnC(c, -2);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnumb : function(){
		return this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)==-2){ return "5 ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumAns() ��萔���{���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellQnumAns() ��萔���{���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumAns : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.sQaC(c, 1);}
			else if(ca == "+"){ bd.sQsC(c, 1);}
			else if(ca == "-"){ bd.sQnC(c, -2);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnumAns : function(){
		return this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)==-2){ return "- ";}
			else if(bd.QaC(c)==1) { return "# ";}
			else if(bd.QsC(c)==1) { return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellDirecQnum() �����{��萔���̃f�R�[�h���s��
	// fio.encodeCellDirecQnum() �����{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellDirecQnum : function(stack){
		this.decodeCell( function(c,ca){
			if(ca != "."){
				var inp = ca.split(",");
				bd.sDiC(c, (inp[0]!="0"?parseInt(inp[0]): 0));
				bd.sQnC(c, (inp[1]!="-"?parseInt(inp[1]):-2));
			}
		},stack);
	},
	encodeCellDirecQnum : function(){
		return this.encodeCell( function(c){
			if(bd.QnC(c)!=-1){
				var ca1 = (bd.DiC(c)!= 0?(bd.DiC(c)).toString():"0");
				var ca2 = (bd.QnC(c)!=-2?(bd.QnC(c)).toString():"-");
				return ""+ca1+","+ca2+" ";
			}
			else{ return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellAns() ���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellAns() ���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellAns : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.sQaC(c, 1);}
			else if(ca == "+"){ bd.sQsC(c, 1);}
		},stack);
	},
	encodeCellAns : function(){
		return this.encodeCell( function(c){
			if     (bd.QaC(c)==1){ return "# ";}
			else if(bd.QsC(c)==1){ return "+ ";}
			else                 { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQanssub() �񓚐����Ɣw�i�F�̃f�R�[�h���s��
	// fio.encodeCellQanssub() �񓚐����Ɣw�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQanssub : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "+"){ bd.sQsC(c, 1);}
			else if(ca == "-"){ bd.sQsC(c, 2);}
			else if(ca == "="){ bd.sQsC(c, 3);}
			else if(ca == "%"){ bd.sQsC(c, 4);}
			else if(ca != "."){ bd.sQaC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQanssub : function(){
		return this.encodeCell( function(c){
			//if(bd.QuC(c)!=0 || bd.QnC(c)!=-1){ return ". ";}
			if     (bd.QaC(c)!=-1){ return (bd.QaC(c).toString() + " ");}
			else if(bd.QsC(c)==1 ){ return "+ ";}
			else if(bd.QsC(c)==2 ){ return "- ";}
			else if(bd.QsC(c)==3 ){ return "= ";}
			else if(bd.QsC(c)==4 ){ return "% ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQsub() �w�i�F�̃f�R�[�h���s��
	// fio.encodeCellQsub() �w�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQsub : function(stack){
		this.decodeCell( function(c,ca){
			if(ca != "0"){ bd.sQsC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQsub : function(){
		return this.encodeCell( function(c){
			if     (bd.QsC(c)>0){ return (bd.QsC(c).toString() + " ");}
			else                { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCrossNum() ��_�̐����̃f�R�[�h���s��
	// fio.encodeCrossNum() ��_�̐����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCrossNum : function(stack){
		this.decodeCross( function(c,ca){
			if     (ca == "-"){ bd.sQnX(c, -2);}
			else if(ca != "."){ bd.sQnX(c, parseInt(ca));}
		},stack);
	},
	encodeCrossNum : function(){
		return this.encodeCross( function(c){
			if     (bd.QnX(c)>=0) { return (bd.QnX(c).toString() + " ");}
			else if(bd.QnX(c)==-2){ return "- ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderQues() ���̋��E���̃f�R�[�h���s��
	// fio.encodeBorderQues() ���̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderQues : function(stack){
		this.decodeBorder( function(c,ca){
			if(ca == "1"){ bd.sQuB(c, 1);}
		},stack);
	},
	encodeBorderQues : function(){
		return this.encodeBorder( function(c){
			if     (bd.QuB(c)==1){ return "1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderLine() Line�̃f�R�[�h���s��
	// fio.encodeBorderLine() Line�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderLine : function(stack){
		this.decodeBorder( function(c,ca){
			if     (ca == "-1"){ bd.sQsB(c, 2);}
			else if(ca != "0" ){ bd.sLiB(c, parseInt(ca)); if(bd.LiB(c)==0){ bd.border[c].line=parseInt(ca);}}	// fix
		},stack);
	},
	encodeBorderLine : function(){
		return this.encodeBorder( function(c){
			if     (bd.LiB(c)> 0){ return ""+bd.LiB(c)+" ";}
			else if(bd.QsB(c)==2){ return "-1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns() ���E�񓚂̋��E���̃f�R�[�h���s��
	// fio.encodeBorderAns() ���E�񓚂̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderAns : function(stack){
		this.decodeBorder( function(c,ca){
			if     (ca == "1" ){ bd.sQaB(c, 1);}
			else if(ca == "2" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca == "-1"){ bd.sQsB(c, 1);}
		},stack);
	},
	encodeBorderAns : function(){
		return this.encodeBorder( function(c){
			if     (bd.QaB(c)==1 && bd.QsB(c)==1){ return "2 ";}
			else if(bd.QaB(c)==1){ return "1 ";}
			else if(bd.QsB(c)==1){ return "-1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns2() ���E�񓚂̋��E���̃f�R�[�h(�O�g����)���s��
	// fio.encodeBorderAns2() ���E�񓚂̋��E���̃G���R�[�h(�O�g����)���s��
	//---------------------------------------------------------------------------
	decodeBorderAns2 : function(stack){
		this.decodeBorder2( function(c,ca){
			if     (ca == "1" ){ bd.sQaB(c, 1);}
			else if(ca == "2" ){ bd.sQsB(c, 1);}
			else if(ca == "3" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca == "-1"){ bd.sQsB(c, 2);}
		},stack);
	},
	encodeBorderAns2 : function(){
		return this.encodeBorder2( function(c){
			if     (bd.QaB(c)==1 && bd.QsB(c)==1){ return "3 ";}
			else if(bd.QsB(c)==1){ return "2 ";}
			else if(bd.QaB(c)==1){ return "1 ";}
			else if(bd.QsB(c)==2){ return "-1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeAreaRoom() �����̃f�R�[�h���s��
	// fio.encodeAreaRoom() �����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeAreaRoom : function(stack){
		stack.shift();
		this.decodeCell( function(c,ca){
			room.cell[c] = parseInt(ca)+1;
		},stack);

		var saved = room.isenable;
		room.isenable = false;
		for(var c=0;c<k.qcols*k.qrows;c++){
			if(bd.dn(c)!=-1 && room.getRoomID(c) != room.getRoomID(bd.dn(c))){ bd.sQuB(bd.db(c),1); }
			if(bd.rt(c)!=-1 && room.getRoomID(c) != room.getRoomID(bd.rt(c))){ bd.sQuB(bd.rb(c),1); }
		}
		room.isenable = saved;

		room.resetRarea();
	},
	encodeAreaRoom : function(){
		var saved = room.isenable;
		room.isenable = true;
		room.resetRarea();
		room.isenable = saved;

		var str = ""+room.rareamax+"/";
		return str + this.encodeCell( function(c){
			return ((room.getRoomID(c)-1) + " ");
		});
	},

	//---------------------------------------------------------------------------
	// fio.decodeCellQnum51() [�_]�̃f�R�[�h���s��
	// fio.encodeCellQnum51() [�_]�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum51 : function(stack){
		var item = new Array();
		for(var i=0;i<stack.length;i++){ item = item.concat( fio.retarray( stack[i] ) );}
		for(var i=0;i<item.length;i++) {
			var cx=i%(k.qcols+1)-1, cy=mf(i/(k.qcols+1))-1;
			if(item[i]!="."){
				if     (cy==-1){ bd.sDiE(bd.exnum(cx,cy), parseInt(item[i]));}
				else if(cx==-1){ bd.sQnE(bd.exnum(cx,cy), parseInt(item[i]));}
				else{
					var inp = item[i].split(",");
					var c = bd.cnum(cx,cy);
					mv.set51cell(c, true);
					bd.sQnC(c, inp[0]);
					bd.sDiC(c, inp[1]);
				}
			}
		}
	},
	encodeCellQnum51 : function(){
		var str = "";
		for(var cy=-1;cy<k.qrows;cy++){
			for(var cx=-1;cx<k.qcols;cx++){
				if     (cx==-1 && cy==-1){ str += "0 ";}
				else if(cy==-1){ str += (""+bd.DiE(bd.exnum(cx,cy)).toString()+" ");}
				else if(cx==-1){ str += (""+bd.QnE(bd.exnum(cx,cy)).toString()+" ");}
				else{
					var c = bd.cnum(cx,cy);
					if(bd.QuC(c)==51){ str += (""+bd.QnC(c).toString()+","+bd.DiC(c).toString()+" ");}
					else{ str += ". ";}
				}
			}
			str += "/";
		}
		return str;
	},

//---------------------------------------------------------------------------
// ��Local Storage�p�f�[�^�x�[�X�̐ݒ�E�Ǘ����s��
//---------------------------------------------------------------------------
	//---------------------------------------------------------------------------
	// fio.choiceDataBase() LocalStorage���g���邩�ǂ������肷��
	//---------------------------------------------------------------------------
	choiceDataBase : function(){
		if(window.google && google.gears){ this.DBtype=1; return 1;}
		var factory = 0;

		// FireFox
		if (typeof GearsFactory != 'undefined') { factory=11;}
		else{
			try {
				// IE
				var axobj = new ActiveXObject('Gears.Factory');
				factory=21;
			} catch (e) {
				// Safari
				if((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"]){
					factory=31;
				}
			}
		}
		this.DBtype=(factory>0?1:0);
		return factory;
	},

	//---------------------------------------------------------------------------
	// fio.initDataBase() �f�[�^�x�[�X��V�K�쐬����
	// fio.dropDataBase() �f�[�^�x�[�X���폜����
	// fio.remakeDataBase() �f�[�^�x�[�X���č\�z����
	// fio.updateManager() �X�V���Ԃ��X�V����
	//---------------------------------------------------------------------------
	initDataBase : function(){
		if(this.DBtype==0){ return false;}
		else if(this.DBtype==1){
			this.dbmgr = google.gears.factory.create('beta.database', '1.0');
			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)');
			this.dbmgr.close();

//			this.remakeDataBase2();

			this.db    = google.gears.factory.create('beta.database', '1.0');
			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');
			this.db.close();
		}
		else if(this.DBtype==2){
			this.dbmgr = openDataBase('pzprv3_manage', '1.0');
			this.dbmgr.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)');
			});

			this.db = openDataBase('pzprv3_'+k.puzzleid, '1.0');
			this.db.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');
			});
		}

		this.updateManager(false);

		var sortlist = { idlist:"ID��", newsave:"�ۑ����V������", oldsave:"�ۑ����Â���", size:"�T�C�Y/��Փx��"};
		var str="";
		for(s in sortlist){ str += ("<option value=\""+s+"\">"+sortlist[s]+"</option>");}
		document.database.sorts.innerHTML = str;

		return true;
	},
	dropDataBase : function(){
		if(this.DBtype==1){
			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
			this.dbmgr.close();

			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('DROP TABLE IF EXISTS pzldata');
			this.db.close();
		}
		else if(this.DBtype==2){
			this.dbmgr.transaction(function(tx){
				tx.executeSql('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
			});

			this.db.transaction(function(tx){
				tx.executeSql('DROP TABLE IF EXISTS pzldata');
			});
		}
	},

	remakeDataBase : function(){
		this.DBlist = new Array();

		this.db.open('pzprv3_'+k.puzzleid);
		var rs = this.db.execute('SELECT * FROM pzldata');
		while(rs.isValidRow()){
			var src = {};
			for(var i=0;i<rs.fieldCount();i++){ src[rs.fieldName(i)] = rs.field(i);}
			this.DBlist.push(src);
			rs.next();
		}
		rs.close();

		this.db.execute('DROP TABLE IF EXISTS pzldata');
		this.db.execute('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');

		for(var r=0;r<this.DBlist.length;r++){
			var row=this.DBlist[r];
			this.db.execute('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[row.id,row.col,row.row,row.hard,row.pdata,row.time,row.comment]);
		}

		this.db.close();
	},

	updateManager : function(flag){
		var count = -1;
		if(this.DBtype==1){
			if(!flag){
				this.db.open('pzprv3_'+k.puzzleid);
				var rs = this.db.execute('SELECT COUNT(*) FROM pzldata');
				count = (rs.isValidRow()?rs.field(0):0);
				this.db.close();
			}
			else{ count=this.DBlist.length;}

			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)',[k.puzzleid,'1.0',count,mf((new Date()).getTime()/1000)]);
			this.dbmgr.close();
		}
		else if(this.DBtype==2){
			if(!flag){
				this.db.transaction(function(tx){
					tx.executeSql('SELECT COUNT(*) FROM pzldata',function(){},function(tx,rs){ count = rs.rows[0];});
				});
			}
			else{ count=this.DBlist.length;}

			this.dbmgr.transaction(function(tx){
				tx.executeSql('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)',[k.puzzleid,'1.0',count,mf((new Date()).getTime()/1000)]);
			});
		}
	},

	//---------------------------------------------------------------------------
	// fio.displayDataTableList() �ۑ����Ă���f�[�^�̈ꗗ��\������
	// fio.ni()                   �������1���Ȃ�0������
	// fio.getDataTableList()     �ۑ����Ă���f�[�^�̈ꗗ���擾����
	//---------------------------------------------------------------------------
	displayDataTableList : function(){
		if(this.DBtype>0){
			switch(document.database.sorts.value){
				case 'idlist':  this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);}); break;
				case 'newsave': this.DBlist = this.DBlist.sort(function(a,b){ return (b.time-a.time || a.id-b.id);}); break;
				case 'oldsave': this.DBlist = this.DBlist.sort(function(a,b){ return (a.time-b.time || a.id-b.id);}); break;
				case 'size':    this.DBlist = this.DBlist.sort(function(a,b){ return (a.col-b.col || a.row-b.row || a.hard-b.hard || a.id-b.id);}); break;
			}

			var html = "";
			for(var i=0;i<this.DBlist.length;i++){
				var row = this.DBlist[i];
				if(!row){ alert(i);}
				var src = ((row.id<10?"&nbsp;":"")+row.id+" :&nbsp;");
				var dt = new Date(); dt.setTime(row.time*1000);
				src += (" "+this.ni(dt.getFullYear()%100)+"/"+this.ni(dt.getMonth()+1)+"/"+this.ni(dt.getDate())+" "+this.ni(dt.getHours())+":"+this.ni(dt.getMinutes()) + "&nbsp;&nbsp;");
				src += (""+row.col+"�~"+row.row+"&nbsp;&nbsp;");
				if     (lang.isJP()){ src += ({0:'�|',1:'�炭�炭',2:'���Ă���',3:'�����ւ�',4:'�A�[��'}[row.hard]);}
				else if(lang.isEN()){ src += ({0:'-',1:'Easy',2:'Normal',3:'Hard',4:'Expert'}[row.hard]);}
				html += ("<option value=\""+row.id+"\""+(this.DBsid==row.id?" selected":"")+">"+src+"</option>\n");
			}
			html += ("<option value=\"new\""+(this.DBsid==-1?" selected":"")+">&nbsp;&lt;�V�����ۑ�����&gt;</option>\n");
			document.database.datalist.innerHTML = html;

			this.selectDataTable();
		}
	},
	ni : function(num){ return (num<10?"0"+num:""+num);},
	getDataTableList : function(){
		this.DBlist = new Array();
		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);
			var rs = this.db.execute('SELECT * FROM pzldata');
			while(rs.isValidRow()){
				var src = {};
				for(var i=0;i<rs.fieldCount();i++){ src[rs.fieldName(i)] = rs.field(i);}
				this.DBlist.push(src);
				rs.next();
			}
			rs.close();
			this.db.close();
			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM pzldata',[],function(tx,rs){
				for(var r=0;r<rs.rows.length;r++){ self.DBlist.push(rs.rows[r]);}
				self.DBlist = rs;
				self.displayDataTableList();
			}); });
		}
	},

	//---------------------------------------------------------------------------
	// fio.upDataTable()        �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ�ɂ���
	// fio.downDataTable()      �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ��ɂ���
	// fio.convertDataTableID() �f�[�^��ID��t������
	//---------------------------------------------------------------------------
	upDataTable : function(){
		var selected = this.getDataID();
		if(this.DBtype==0 || selected==-1 || selected==0){ return;}

		this.convertDataTableID(selected, selected-1);
	},
	downDataTable : function(){
		var selected = this.getDataID();
		if(this.DBtype==0 || selected==-1 || selected==this.DBlist.length-1){ return;}

		this.convertDataTableID(selected, selected+1);
	},
	convertDataTableID : function(selected,target){
		var sid = this.DBsid;
		var tid = this.DBlist[target].id;
		this.DBsid = tid;

		this.DBlist[selected].id = tid;
		this.DBlist[target].id   = sid;

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sid]);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[sid,tid]);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[tid,  0]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sid]);
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[sid,tid]);
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[tid,  0]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.getDataID()       �f�[�^��ID���擾����
	// fio.selectDataTable() �f�[�^��I�����āA�R�����g�Ȃǂ�\������
	//---------------------------------------------------------------------------
	getDataID : function(){
		if(document.database.datalist.value!="new" && document.database.datalist.value!=""){
			for(var i=0;i<this.DBlist.length;i++){
				if(this.DBlist[i].id==document.database.datalist.value){ return i;}
			}
		}
		return -1;
	},
	selectDataTable : function(){
		var selected = this.getDataID();
		if(selected>=0){
			document.database.comtext.value = ""+this.DBlist[selected].comment;
			this.DBsid = this.DBlist[selected].id;
		}
		else{
			document.database.comtext.value = "";
			this.DBsid = -1;
		}

		document.database.tableup.disabled = (document.database.sorts.value!='idlist' || this.DBsid==-1 || this.DBsid==1);
		document.database.tabledn.disabled = (document.database.sorts.value!='idlist' || this.DBsid==-1 || this.DBsid==this.DBlist.length);
		document.database.comedit.disabled = (this.DBsid==-1);
		document.database.difedit.disabled = (this.DBsid==-1);
		document.database.open.disabled    = (this.DBsid==-1);
		document.database.del.disabled     = (this.DBsid==-1);
	},

	//---------------------------------------------------------------------------
	// fio.openDataTable()   �f�[�^�̔Ֆʂɓǂݍ���
	// fio.saveDataTable()   �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable : function(){
		var id = this.getDataID();
		if(id==-1 || !confirm("���̃f�[�^��ǂݍ��݂܂����H (���݂̔Ֆʂ͔j������܂�)")){ return;}

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			var id = this.getDataID();
			var rs = this.db.execute('SELECT * FROM pzldata WHERE ID==?',[this.DBlist[id].id]);
			this.fileopen(rs.field(4).split("/"),1);

			rs.close();
			this.db.close();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM pzldata WHERE ID==?',[self.DBlist[id].id],
					function(tx,rs){ self.fileopen(rs.rows[0].pdata.split("/"),1); }
				);
			});
		}
	},
	saveDataTable : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || (id!=-1 && !confirm("���̃f�[�^�ɏ㏑�����܂����H"))){ return;}

		var time = mf((new Date()).getTime()/1000);
		var pdata = this.filesavestr(1);
		var str = "";
		if(id==-1){ str = prompt("�R�����g������ꍇ�͓��͂��Ă��������B",""); if(str==null){ str="";} }
		else      { str = this.DBlist[this.getDataID()].comment;}

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);
			if(id==-1){
				id = this.DBlist.length+1;
				this.db.execute('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
			}
			else{
				id = document.database.datalist.value;
				this.db.execute('INSERT OR REPLACE INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
			}
			this.db.close();
			this.getDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			if(id==-1){
				id = this.DBlist.length+1;
				this.db.transaction(function(tx){
					tx.executeSql('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
				},f_true,self.getDataTableList);
			}
			else{
				id = document.database.datalist.value;
				this.db.transaction(function(tx){
					tx.executeSql('INSERT OR REPLACE INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
				},f_true,self.getDataTableList);
			}
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.editComment()   �f�[�^�̃R�����g���X�V����
	// fio.editDifficult() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	editComment : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || id==-1){ return;}

		var str = prompt("���̖��ɑ΂���R�����g����͂��Ă��������B",this.DBlist[id].comment);
		if(str==null){ return;}

		this.DBlist[id].comment = str;

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('UPDATE pzldata SET comment=? WHERE ID==?',[str,this.DBlist[id].id]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET comment=? WHERE ID==?',[str,self.DBlist[id].id]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},
	editDifficult : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || id==-1){ return;}

		var hard = prompt("���̖��̓�Փx��ݒ肵�Ă��������B\n[0:�Ȃ� 1:�炭�炭 2:���Ă��� 3:�����ւ� 4:�A�[��]",this.DBlist[id].hard);
		if(hard==null){ return;}

		this.DBlist[id].hard = ((hard=='1'||hard=='2'||hard=='3'||hard=='4')?hard:0);

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('UPDATE pzldata SET hard=? WHERE ID==?',[hard,this.DBlist[id].id]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET hard=? WHERE ID==?',[hard,self.DBlist[id].id]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.deleteDataTable() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || id==-1 || !confirm("���̃f�[�^�����S�ɍ폜���܂����H")){ return;}

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('DELETE FROM pzldata WHERE ID==?',[this.DBlist[id].id]);

			this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);});
			for(var i=id+1;i<this.DBlist.length;i++){
				this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[this.DBlist[i].id-1,this.DBlist[i].id]);
				this.DBlist[i].id--;
				this.DBlist[i-1] = this.DBlist[i];
			}
			this.DBlist.splice(this.DBlist.length-1,1);

			this.db.close();
			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('DELETE FROM pzldata WHERE ID==?',[self.DBlist[id].id]);
				self.DBlist = self.DBlist.sort(function(a,b){ return (a.id-b.id);});
				for(var i=id+1;i<self.DBlist.length;i++){
					tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[self.DBlist[i].id-1,self.DBlist[i].id]);
					self.DBlist[i].id--;
					self.DBlist[i-1] = self.DBlist[i];
				}
				self.DBlist.splice(this.DBlist.length-1,1);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	}
};

//---------------------------------------------------------------------------
// ��AnsCheck�N���X �����`�F�b�N�֘A�̊֐�������
//---------------------------------------------------------------------------

AreaInfo = function(){
	this.max = 0;
	this.check = new Array();
	this.room  = new Array();
};

// �񓚃`�F�b�N�N���X
// AnsCheck�N���X
AnsCheck = function(){
	this.performAsLine = false;
	this.errDisp = false;
	this.setError = true;
	this.inAutoCheck = false;
	this.alstr = { jp:'' ,en:''};
	this.lcnts = { cell:new Array(), total:new Array()};
	this.reset();
};
AnsCheck.prototype = {
	//---------------------------------------------------------------------------
	// ans.reset()        lcnts���̕ϐ��̏��������s��
	//---------------------------------------------------------------------------
	reset : function(){
		var self = this;
		if(k.isCenterLine){
			if(bd.border){ for(var c=0;c<bd.cell.length;c++){ self.lcnts.cell[c]=0;} };
			for(var i=1;i<=4;i++){ self.lcnts.cell[i]=0;}
			this.lcnts.total[0] = k.qcols*k.qrows;
		}
		else{
			if(bd.border){ for(var c=0;c<(k.qcols+1)*(k.qrows+1);c++){ self.lcnts.cell[c]=0;} };
			for(var i=1;i<=4;i++){ self.lcnts.cell[i]=0;}
			this.lcnts.total[0] = (k.qcols+1)*(k.qrows+1);
		}
	},

	//---------------------------------------------------------------------------
	// ans.check()     �����̃`�F�b�N���s��(checkAns()���Ăяo��)
	// ans.checkAns()  �����̃`�F�b�N���s��(�I�[�o�[���C�h�p)
	// ans.check1st()  �I�[�g�`�F�b�N���ɏ��߂ɔ�����s��(�I�[�o�[���C�h�p)
	// ans.setAlert()  check()����߂��Ă����Ƃ��ɕԂ��A�G���[���e��\������alert����ݒ肷��
	//---------------------------------------------------------------------------
	check : function(){
		this.inCheck = true;
		this.alstr = { jp:'' ,en:''};
		kc.keyreset();

		if(!this.checkAns()){
			alert((lang.isJP()||!this.alstr.en)?this.alstr.jp:this.alstr.en);
			this.errDisp = true;
			pc.paintAll();
			this.inCheck = false;
			return false;
		}

		alert(lang.isJP()?"�����ł��I":"Complete!");
		this.inCheck = false;
		return true;
	},
	checkAns : function(){},	//�I�[�o�[���C�h�p
	//check1st : function(){},	//�I�[�o�[���C�h�p
	setAlert : function(strJP, strEN){ this.alstr.jp = strJP; this.alstr.en = strEN;},

	//---------------------------------------------------------------------------
	// ans.autocheck()    �����̎����`�F�b�N���s��(alert���łȂ�������A�G���[�\�����s��Ȃ�)
	// ans.autocheck1st() autocheck�O�ɁA�y������������s��
	//
	// ans.disableSetError()  �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł��Ȃ��悤�ɂ���
	// ans.enableSetError()   �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł���悤�ɂ���
	// ans.isenableSetError() �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł��邩�ǂ�����Ԃ�
	//---------------------------------------------------------------------------
	autocheck : function(){
		if(!k.autocheck || k.mode!=3 || this.inCheck){ return;}

		var ret = false;

		this.inCheck = true;
		this.disableSetError();

		if(this.autocheck1st() && this.checkAns() && this.inCheck){
			mv.mousereset();
			alert(lang.isJP()?"�����ł��I":"Complete!");
			ret = true;
			menu.setVal('autocheck',false);
		}
		this.enableSetError();
		this.inCheck = false;

		return ret;
	},
	// �����N�n�͏d���̂ōŏ��ɒ[�_�𔻒肷��
	autocheck1st : function(){
		if(this.check1st){ return this.check1st();}
		else if( (k.isCenterLine && !ans.checkLcntCell(1)) || (k.isborderAsLine && !ans.checkLcntCross(1,0)) ){ return false;}
		return true;
	},

	disableSetError  : function(){ this.setError = false;},
	enableSetError   : function(){ this.setError = true; },
	isenableSetError : function(){ return this.setError; },

	//---------------------------------------------------------------------------
	// ans.checkdir4Cell()     �㉺���E4�����ŏ���func==true�ɂȂ�}�X�̐����J�E���g����
	// ans.setErrLareaByCell() �ЂƂȂ���ɂȂ����������݂���}�X�ɃG���[��ݒ肷��
	// ans.setErrLareaById()   �ЂƂȂ���ɂȂ����������݂���}�X�ɃG���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkdir4Cell : function(cc, func){
		if(cc<0 || cc>=bd.cell.length){ return 0;}
		var cnt = 0;
		if(bd.up(cc)!=-1 && func(bd.up(cc))){ cnt++;}
		if(bd.dn(cc)!=-1 && func(bd.dn(cc))){ cnt++;}
		if(bd.lt(cc)!=-1 && func(bd.lt(cc))){ cnt++;}
		if(bd.rt(cc)!=-1 && func(bd.rt(cc))){ cnt++;}
		return cnt;
	},

	setErrLareaByCell : function(area, c, val){ this.setErrLareaById(area, area.check[c], val); },
	setErrLareaById : function(area, areaid, val){
		var blist = new Array();
		for(var id=0;id<bd.border.length;id++){
			if(bd.LiB(id)!=1){ continue;}
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
			if(cc1!=-1 && cc2!=-1 && area.check[cc1]==areaid && area.check[cc1]==area.check[cc2]){ blist.push(id);}
		}
		bd.sErB(blist,val);

		var clist = new Array();
		for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==areaid && bd.QnC(c)!=-1){ clist.push(c);} }
		bd.sErC(clist,4);
	},

	//---------------------------------------------------------------------------
	// ans.checkAllCell()   ����func==true�ɂȂ�}�X����������G���[��ݒ肷��
	// ans.linkBWarea()     ���}�X/���}�X/�����ЂƂȂ��肩�ǂ����𔻒肷��
	// ans.check2x2Block()  2x2�̃Z�����S�ď���func==true�̎��A�G���[��ݒ肷��
	// ans.checkSideCell()  �ׂ荇����2�̃Z��������func==true�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkAllCell : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(func(c)){ bd.sErC([c],1); return false;}
		}
		return true;
	},
	linkBWarea : function(area){
		if(area.max>1){
			if(this.performAsLine){ bd.sErB(bd.borders,2); this.setErrLareaByCell(area,1,1); }
			if(!this.performAsLine || k.puzzleid=="firefly"){ bd.sErC(area.room[1],1);}
			return false;
		}
		return true;
	},
	check2x2Block : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.cell[c].cx<k.qcols-1 && bd.cell[c].cy<k.qrows-1){
				if( func(c) && func(c+1) && func(c+k.qcols) && func(c+k.qcols+1) ){
					bd.sErC([c,c+1,c+k.qcols,c+k.qcols+1],1);
					return false;
				}
			}
		}
		return true;
	},
	checkSideCell : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.cell[c].cx<k.qcols-1 && func(c,c+1)){
				bd.sErC([c,c+1],1); return false;
			}
			if(bd.cell[c].cy<k.qrows-1 && func(c,c+k.qcols)){
				bd.sErC([c,c+k.qcols],1); return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.isAreaRect()     ���ׂĂ�func�𖞂����}�X�ō\�������G���A���l�p�`�ł��邩�ǂ������肷��
	// ans.checkAllArea()   ���ׂĂ�func�𖞂����}�X�ō\�������G���A���T�C�Y����func2�𖞂������ǂ������肷��
	// ans.getSizeOfArea()  �w�肳�ꂽarea�̏㉺���E�̒[�ƁA���̒��ŏ���func�𖞂����Z���̑傫����Ԃ�
	// ans.getSizeOfClist() �w�肳�ꂽCell�̃��X�g�̏㉺���E�̒[�ƁA���̒��ŏ���func�𖞂����Z���̑傫����Ԃ�
	//---------------------------------------------------------------------------
	isAreaRect : function(area, func){ return this.checkAllArea(area, func, function(w,h,a){ return (w*h==a)}); },
	checkAllArea : function(area, func, func2){
		for(var id=1;id<=area.max;id++){
			var d = this.getSizeOfArea(area,id,func);
			if(!func2(d.x2-d.x1+1, d.y2-d.y1+1, d.cnt)){
				bd.sErC(area.room[id],1);
				return false;
			}
		}
		return true;
	},
	getSizeOfArea : function(area, id, func){
		return this.getSizeOfClist(area.room[id], func);
	},
	getSizeOfClist : function(clist, func){
		var d = { x1:k.qcols, x2:-1, y1:k.qrows, y2:-1, cnt:0 };
		for(var i=0;i<clist.length;i++){
			if(d.x1>bd.cell[clist[i]].cx){ d.x1=bd.cell[clist[i]].cx;}
			if(d.x2<bd.cell[clist[i]].cx){ d.x2=bd.cell[clist[i]].cx;}
			if(d.y1>bd.cell[clist[i]].cy){ d.y1=bd.cell[clist[i]].cy;}
			if(d.y2<bd.cell[clist[i]].cy){ d.y2=bd.cell[clist[i]].cy;}
			if(func(clist[i])){ d.cnt++;}
		}
		return d;
	},

	//---------------------------------------------------------------------------
	// ans.checkQnumCross()  cross������func==false�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkQnumCross : function(func){	//func(cr,bcnt){} -> �G���[�Ȃ�false��Ԃ��֐��ɂ���
		for(var c=0;c<bd.cross.length;c++){
			if(bd.QnX(c)<0){ continue;}
			if(!func(bd.QnX(c), bd.bcntCross(bd.cross[c].cx, bd.cross[c].cy))){
				bd.sErX([c],1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.isLoopLine()    ��������������[�v�ɂȂ��Ă��邩�ǂ����𔻒肷��
	// ans.isConnectLine() ������������ЂƂȂ���ɂȂ��Ă��邩�ǂ����𔻒肷��
	// ans.LineList()      ����������̂ЂƂȂ���̐��̃��X�g��Ԃ�
	// ans.checkOneLoop()  ���������������ǂ������肷��
	//---------------------------------------------------------------------------
	isLoopLine : function(startid){ return this.isConnectLine(startid, startid, -1); },
	isConnectLine : function(startid, terminal, startback){
		var forward = -1;
		var backward = startback;
		var here = startid;
		if(startid==-1){ return false;}
		while(k.qcols*k.qrows*3){
			forward = bd.forwardLine(here, backward);
			backward = here; here = forward;
			if(forward==terminal || forward==startid || forward==-1){ break;}
		}

		if(forward==terminal){ return true;}
		return false;
	},

	LineList : function(startid){
		if(startid==-1||startid==null){ return [];}
		var lists = [startid];
		var forward,backward, here;
		if(bd.backLine(startid)!=-1){
			here = startid;
			backward = bd.nextLine(startid);
			while(k.qcols*k.qrows*3){
				forward = bd.forwardLine(here, backward);
				backward = here; here = forward;
				if(forward==startid || forward==-1){ break;}
				lists.push(forward);
			}
		}
		if(forward!=startid && bd.nextLine(startid)!=-1){
			here = startid;
			backward = bd.backLine(startid);
			while(k.qcols*k.qrows*3){
				forward = bd.forwardLine(here, backward);
				backward = here; here = forward;
				if(forward==startid || forward==-1){ break;}
				lists.push(forward);
			}
		}
		return lists;
	},
	checkOneLoop : function(){
		var xarea = this.searchXarea();
		if(xarea.max>1){
			bd.sErB(bd.borders,2);
			bd.sErB(xarea.room[1],1);
			return false;
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.setLcnts()      ���������ꂽ�������Ă��肵�����ɁA�ϐ�lcnts�̓��e��ύX����
	// ans.resetLcount()   ��]���]�E�g��k������lcnt�ϐ����č\�z����
	// ans.lcntCell()      �Z���ɑ��݂�����̖{����Ԃ�
	// ans.checkLcntCell() �Z������o�Ă�����̖{���ɂ��Ĕ��肷��
	//---------------------------------------------------------------------------
	setLcnts : function(id, val){
		var cc1, cc2;
		if(k.isCenterLine){ cc1 = bd.cc1(id),      cc2 = bd.cc2(id);}
		else              { cc1 = bd.crosscc1(id), cc2 = bd.crosscc2(id);}

		if(val>0){
			if(cc1!=-1){ this.lcnts.total[this.lcnts.cell[cc1]]--; this.lcnts.cell[cc1]++; this.lcnts.total[this.lcnts.cell[cc1]]++;}
			if(cc2!=-1){ this.lcnts.total[this.lcnts.cell[cc2]]--; this.lcnts.cell[cc2]++; this.lcnts.total[this.lcnts.cell[cc2]]++;}
		}
		else{
			if(cc1!=-1){ this.lcnts.total[this.lcnts.cell[cc1]]--; this.lcnts.cell[cc1]--; this.lcnts.total[this.lcnts.cell[cc1]]++;}
			if(cc2!=-1){ this.lcnts.total[this.lcnts.cell[cc2]]--; this.lcnts.cell[cc2]--; this.lcnts.total[this.lcnts.cell[cc2]]++;}
		}
	},
	resetLcount : function(){
		if(k.isborder){
			this.reset();
			for(var id=0;id<bd.border.length;id++){
				if((k.isCenterLine && bd.LiB(id)>0) || (!k.isCenterLine && bd.QaB(id)>0)){
					this.setLcnts(id,1);
				}
			}
		}
	},

	lcntCell : function(cc){ return col.lcntCell(cc);},
	checkLcntCell : function(val){
		if(this.lcnts.total[val]==0){ return true;}
		for(var c=0;c<bd.cell.length;c++){
			if(this.lcnts.cell[c]==val){
				if(!this.performAsLine){ bd.sErC([c],1);}
				else{ bd.sErB(bd.borders,2); this.setCellLineError(c,true);}
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkdir4Border()  �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{���𔻒肷��
	// ans.checkdir4Border1() �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{����Ԃ�
	// ans.checkenableLineParts() '�ꕔ����������Ă���'���̕����ɁA����������Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkdir4Border : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.QnC(c)>=0 && this.checkdir4Border1(c)!=bd.QnC(c)){ bd.sErC([c],1); return false;}
		}
		return true;
	},
	checkdir4Border1 : function(cc){
		if(cc<0 || cc>=bd.cell.length){ return 0;}
		var func = function(id){ return (id!=-1&&((bd.QuB(id)==1)||(bd.QaB(id)==1)));};
		var cnt = 0;
		var cx = bd.cell[cc].cx; var cy = bd.cell[cc].cy;
		if( (k.isoutsideborder==0 && cy==0        ) || func(bd.bnum(cx*2+1,cy*2  )) ){ cnt++;}
		if( (k.isoutsideborder==0 && cy==k.qrows-1) || func(bd.bnum(cx*2+1,cy*2+2)) ){ cnt++;}
		if( (k.isoutsideborder==0 && cx==0        ) || func(bd.bnum(cx*2  ,cy*2+1)) ){ cnt++;}
		if( (k.isoutsideborder==0 && cx==k.qcols-1) || func(bd.bnum(cx*2+2,cy*2+1)) ){ cnt++;}
		return cnt;
	},

	checkenableLineParts : function(val){
		var func = function(i){
			return ((bd.ub(i)!=-1 && bd.LiB(bd.ub(i))==1 && bd.isnoLPup(i)) ||
					(bd.db(i)!=-1 && bd.LiB(bd.db(i))==1 && bd.isnoLPdown(i)) ||
					(bd.lb(i)!=-1 && bd.LiB(bd.lb(i))==1 && bd.isnoLPleft(i)) ||
					(bd.rb(i)!=-1 && bd.LiB(bd.rb(i))==1 && bd.isnoLPright(i)) ); };
		for(var i=0;i<bd.cell.length;i++){ if(func(i)){ bd.sErC([i],1); return false;} }
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.isLineStraight()   �Z���̏�Ő������i���Ă��邩���肷��
	// ans.setCellLineError() �Z���Ǝ���̐��ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	isLineStraight : function(cc){
		if     (this.lcntCell(cc)==3 || this.lcntCell(cc)==4){ return true;}
		else if(this.lcntCell(cc)==0 || this.lcntCell(cc)==1){ return false;}

		if     (bd.LiB(bd.ub(cc))==1 && bd.LiB(bd.db(cc))==1){ return true;}
		else if(bd.LiB(bd.lb(cc))==1 && bd.LiB(bd.rb(cc))==1){ return true;}

		return false;
	},

	setCellLineError : function(cc, flag){
		if(flag){ bd.sErC([cc],1);}
		bd.sErB([bd.ub(cc),bd.db(cc),bd.lb(cc),bd.rb(cc)], 1);
	},

	//---------------------------------------------------------------------------
	// ans.checkOneNumber()      �����̒���func==true�𖞂���Cell�̐���eval()==true���ǂ����𒲂ׂ�
	//                           ������func==true�ɂȂ�Z���̐��̔���A�����ɂ��鐔���ƍ��}�X�̐��̔�r�A
	//                           ���}�X�̖ʐςƓ����Ă��鐔���̔�r�Ȃǂɗp������
	// ans.checkBlackCellCount() �̈���̐����ƍ��}�X�̐��������������肷��
	// ans.checkDisconnectLine() �����ȂǂɌq�����Ă��Ȃ����̔�����s��
	// ans.checkNumberAndSize()  �G���A�ɂ��鐔���Ɩʐς������������肷��
	// ans.checkQnumsInArea()    �����ɂ��鐔���̐��̔�����s��
	// ans.checkBlackCellInArea()�����ɂ��鍕�}�X�̐��̔�����s��
	// ans,checkNoObjectInRoom() �G���A�Ɏw�肳�ꂽ�I�u�W�F�N�g���Ȃ��Ɣ��肷��
	//
	// ans.getQnumCellInArea()   �����̒��ň�ԍ���ɂ��鐔����Ԃ�
	// ans.getTopOfRoom()        ������TOP��Cell��ID��Ԃ�
	// ans.getCntOfRoom()        �����̖ʐς�Ԃ�
	// ans.getCellsOfRoom()      �����̒���func==true�ƂȂ�Z���̐���Ԃ�
	//---------------------------------------------------------------------------
	checkOneNumber : function(area, eval, func){
		for(var id=1;id<=area.max;id++){
			if(eval( bd.QnC(this.getQnumCellInArea(area,id)), this.getCellsOfRoom(area, id, func) )){
				if(this.performAsLine){ bd.sErB(bd.borders,2); this.setErrLareaById(area,id,1);}
				else{ bd.sErC(area.room[id],(k.puzzleid!="tateyoko"?1:4));}
				return false;
			}
		}
		return true;
	},
	checkBlackCellCount  : function(area)          { return this.checkOneNumber(area, function(top,cnt){ return (top>=0 && top!=cnt);}, function(c){ return bd.QaC(c)== 1;} );},
	checkDisconnectLine  : function(area)          { return this.checkOneNumber(area, function(top,cnt){ return (top==-1 && cnt==0); }, function(c){ return bd.QnC(c)!=-1;} );},
	checkNumberAndSize   : function(area)          { return this.checkOneNumber(area, function(top,cnt){ return (top> 0 && top!=cnt);}, f_true); },
	checkQnumsInArea     : function(area, func)    { return this.checkOneNumber(area, function(top,cnt){ return func(cnt);},            function(c){ return bd.QnC(c)!=-1;} );},
	checkBlackCellInArea : function(area, func)    { return this.checkOneNumber(area, function(top,cnt){ return func(cnt);},            function(c){ return bd.QaC(c)== 1;} );},
	checkNoObjectInRoom  : function(area, getvalue){ return this.checkOneNumber(area, function(top,cnt){ return (cnt==0); },            function(c){ return getvalue(c)!=-1;} );},

	getQnumCellInArea : function(area, areaid){
		if(k.isOneNumber){ return this.getTopOfRoom(area,areaid); }
		for(var i=0;i<area.room[areaid].length;i++){ if(bd.QnC(area.room[areaid][i])!=-1){ return area.room[areaid][i];} }
		return -1;
	},
	getTopOfRoom : function(area, areaid){
		var cc=-1;
		var ccx=k.qcols;
		for(var i=0;i<area.room[areaid].length;i++){
			var c = area.room[areaid][i];
			if(bd.cell[c].cx < ccx){ cc=c; ccx=bd.cell[c].cx; }
		}
		return cc;
	},
	getCntOfRoom : function(area, areaid){
		return area.room[areaid].length;
	},
	getCellsOfRoom : function(area, areaid, func){
		var cnt=0;
		for(var i=0;i<area.room[areaid].length;i++){ if(func(area.room[areaid][i])){ cnt++;} }
		return cnt;
	},

	//---------------------------------------------------------------------------
	// ans.checkSideAreaCell()     ���E�����͂���Ń^�e���R�ɐڂ���Z���̔�����s��
	// ans.checkSeqBlocksInRoom()  �����̒�����ŁA���}�X���ЂƂȂ��肩�ǂ������肷��
	// ans.checkSameObjectInRoom() �����̒���getvalue�ŕ�����ނ̒l�������邱�Ƃ𔻒肷��
	// ans.checkObjectRoom()       getvalue�œ����l��������Z�����A�����̕����̕��U���Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkSideAreaCell : function(area, func, flag){
		for(var id=0;id<bd.border.length;id++){
			if(bd.QuB(id)!=1&&bd.QaB(id)!=1){ continue;}
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
			if(cc1!=-1 && cc2!=-1 && func(area, cc1, cc2)){
				if(!flag){ bd.sErC([cc1,cc2],1);}
				else{ bd.sErC(area.room[area.check[cc1]],1); bd.sErC(area.room[area.check[cc2]],1); }
				return false;
			}
		}
		return true;
	},

	checkSeqBlocksInRoom : function(rarea){
		for(var id=1;id<=rarea.max;id++){
			var area = new AreaInfo();
			var func = function(id){ return (id!=-1 && bd.QaC(id)==1); };
			for(var c=0;c<bd.cell.length;c++){ area.check.push(((rarea.check[c]==id && bd.QaC(c)==1)?0:-1));}
			for(var c=0;c<k.qcols*k.qrows;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.sc0(func, area, c, area.max);} }
			if(area.max>1){
				bd.sErC(rarea.room[id],1);
				return false;
			}
		}
		return true;
	},

	checkSameObjectInRoom : function(area, getvalue){
		var d = new Array();
		for(var i=1;i<=area.max;i++){ d[i]=-1;}
		for(var c=0;c<bd.cell.length;c++){
			if(area.check[c]==-1 || getvalue(c)==-1){ continue;}
			if(d[area.check[c]]==-1 && getvalue(c)!=-1){ d[area.check[c]] = getvalue(c);}
			else if(d[area.check[c]]!=getvalue(c)){
				if(this.performAsLine){ bd.sErB(bd.borders,2); this.setErrLareaByCell(area,c,1);}
				else{ bd.sErC(area.room[area.check[c]],1);}
				if(k.puzzleid=="kaero"){
					for(var cc=0;cc<bd.cell.length;cc++){
						if(area.check[c]==area.check[cc] && this.getBeforeCell(cc)!=-1 && area.check[c]!=area.check[this.getBeforeCell(cc)]){
							bd.sErC([this.getBeforeCell(cc)],4);
						}
					}
				}
				return false;
			}
		}
		return true;
	},
	checkObjectRoom : function(area, getvalue){
		var d = new Array();
		var dmax = 0;
		for(var c=0;c<bd.cell.length;c++){ if(dmax<getvalue(c)){ dmax=getvalue(c);} }
		for(var i=0;i<=dmax;i++){ d[i]=-1;}
		for(var c=0;c<bd.cell.length;c++){
			if(getvalue(c)==-1){ continue;}
			if(d[getvalue(c)]==-1){ d[getvalue(c)] = area.check[c];}
			else if(d[getvalue(c)]!=area.check[c]){
				var clist = new Array();
				for(var cc=0;cc<bd.cell.length;cc++){
					if(k.puzzleid=="kaero"){ if(getvalue(c)==bd.QnC(cc)){ clist.push(cc);}}
					else{ if(area.check[c]==area.check[cc] || d[getvalue(c)]==area.check[cc]){ clist.push(cc);} }
				}
				bd.sErC(clist,1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkLcntCross()      �����_�Ƃ̎���l�����̋��E���̐��𔻒肷��(bp==1:���_���ł���Ă���ꍇ)
	// ans.setCrossBorderError() �����_�Ƃ��̎���l�����ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	checkLcntCross : function(val, bp){
		for(var i=0;i<(k.qcols+1)*(k.qrows+1);i++){
			var cx = i%(k.qcols+1), cy = mf(i/(k.qcols+1));
			if(k.isoutsidecross==0 && k.isborderAsLine==0 && (cx==0||cy==0||cx==k.qcols||cy==k.qrows)){ continue;}
			var lcnts = this.lcnts.cell[i] + ((k.isoutsideborder==0&&(cx==0||cy==0||cx==k.qcols||cy==k.qrows))?2:0);
			if(lcnts==val && (bp==0 || (bp==1&&bd.QnX(bd.xnum(cx, cy))==1) || (bp==2&&bd.QnX(bd.xnum(cx, cy))!=1) )){
				bd.sErB(bd.borders,2);
				this.setCrossBorderError(cx,cy);
				return false;
			}
		}
		return true;
	},
	setCrossBorderError : function(cx,cy){
		if(k.iscross){ bd.sErX([bd.xnum(cx, cy)], 1);}
		bd.sErB([bd.bnum(cx*2,cy*2-1),bd.bnum(cx*2,cy*2+1),bd.bnum(cx*2-1,cy*2),bd.bnum(cx*2+1,cy*2)], 1);
	},

	//---------------------------------------------------------------------------
	// ans.searchWarea()   �Ֆʂ̔��}�X�̃G���A����AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchBarea()   �Ֆʂ̍��}�X�̃G���A����AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchBWarea()  searchWarea, searchBarea����Ă΂��֐�
	// ans.sc0()           searchBWarea����Ă΂��ċA�Ăяo���p�֐�
	//
	// ans.searchRarea()   �Ֆʂ̋��E���ŋ�؂�ꂽ��������AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchLarea()   �Ֆʏ�Ɉ�����Ă�����łȂ������G���A����AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchRLrea()   searchRarea, searchLarea����Ă΂��֐�
	// ans.sr0()           searchRLarea����Ă΂��ċN�Ăяo���p�֐�
	//---------------------------------------------------------------------------
	searchWarea : function(){
		return this.searchBWarea(function(id){ return (id!=-1 && bd.QaC(id)!=1); });
	},
	searchBarea : function(){
		return this.searchBWarea(function(id){ return (id!=-1 && bd.QaC(id)==1); });
	},
	searchBWarea : function(func){
		var area = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){ area.check[c]=(func(c)?0:-1);}
		for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.sc0(func, area, c, area.max);} }
		return area;
	},
	sc0 : function(func, area, i, areaid){
		if(area.check[i]!=0){ return;}
		area.check[i] = areaid;
		area.room[areaid].push(i);
		if( func(bd.up(i)) ){ this.sc0(func, area, bd.up(i), areaid);}
		if( func(bd.dn(i)) ){ this.sc0(func, area, bd.dn(i), areaid);}
		if( func(bd.lt(i)) ){ this.sc0(func, area, bd.lt(i), areaid);}
		if( func(bd.rt(i)) ){ this.sc0(func, area, bd.rt(i), areaid);}
		return;
	},

	searchRarea : function(){
		return this.searchRLarea(function(id){ return (id!=-1 && bd.QuB(id)==0 && bd.QaB(id)==0); }, false);
	},
	searchLarea : function(){
		return this.searchRLarea(function(id){ return (id!=-1 && bd.LiB(id)>0); }, true);
	},
	searchRLarea : function(func, flag){
		var area = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){ area.check[c]=((!flag||this.lcnts.cell[c]>0)?0:-1);}
		for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.sr0(func, area, c, area.max);} }
		return area;
	},
	sr0 : function(func, area, i, areaid){
		if(area.check[i]!=0){ return;}
		area.check[i] = areaid;
		area.room[areaid].push(i);
		if( func(bd.ub(i)) ){ this.sr0(func, area, bd.up(i), areaid);}
		if( func(bd.db(i)) ){ this.sr0(func, area, bd.dn(i), areaid);}
		if( func(bd.lb(i)) ){ this.sr0(func, area, bd.lt(i), areaid);}
		if( func(bd.rb(i)) ){ this.sr0(func, area, bd.rt(i), areaid);}
		return;
	},

	//---------------------------------------------------------------------------
	// ans.searchXarea()   ����������̂Ȃ������AreaInfo(border)�I�u�W�F�N�g�Ŏ擾����
	// ans.setLineArea()   1�̂Ȃ��������ɃG���A�����Z�b�g����
	//---------------------------------------------------------------------------
	searchXarea : function(){
		var area = new AreaInfo();
		for(var id=0;id<bd.border.length;id++){ area.check[id]=((k.isborderAsLine==0?bd.LiB(id)==1:bd.QaB(id)==1)?0:-1); }
		for(var id=0;id<bd.border.length;id++){ if(area.check[id]==0){ this.setLineArea(area, this.LineList(id), area.max);} }
		return area;
	},
	setLineArea : function(area, idlist, areaid){
		area.max++;
		area.room[area.max] = idlist;
		for(var i=0;i<idlist.length;i++){if(idlist[i]>=0 && bd.border.length>idlist[i]){ area.check[idlist[i]] = area.max;} }
	}
};

//---------------------------------------------------------------------------
// ��UndoManager�N���X ������������AUndo/Redo�̓������������
//---------------------------------------------------------------------------
// ���͏��Ǘ��N���X
// Operation�N���X
Operation = function(obj, property, id, old, num){
	this.obj = obj;
	this.property = property;
	this.id = id;
	this.old = old;
	this.num = num;
	this.chain = um.chainflag;
	this.undoonly = um.undoonly;
};

// UndoManager�N���X
UndoManager = function(){
	this.ope = new Array();	// Operation�N���X��ێ�����z��
	this.current = 0;		// ���݂̕\������ԍ���ێ�����
	this.disrec = 0;		// ���̃N���X����̌Ăяo������1�ɂ���
	this.chainflag = 0;
	this.undoonly = 0;
	this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
	this.reqReset = 0;
	this.disCombine = 0;
	this.anscount = 0;
	this.changeflag = false;
};
UndoManager.prototype = {
	//---------------------------------------------------------------------------
	// um.disableRecord()  ����̓o�^���֎~����
	// um.enableRecord()   ����̓o�^��������
	// um.isenableRecord() ����̓o�^�ł��邩��Ԃ�
	// um.enb_btn()        html���[��][�i]�{�^�����������Ƃ��\���ݒ肷��
	// um.allerase()       �L�����Ă��������S�Ĕj������
	// um.newOperation()   �}�E�X�A�L�[���͊J�n���ɌĂяo��
	//---------------------------------------------------------------------------
	disableRecord : function(){ this.disrec++; },
	enableRecord  : function(){ if(this.disrec>0){ this.disrec--;} },
	isenableRecord : function(){ return (this.disrec==0);},
	enb_btn : function(){
		if(!this.ope.length){
			$("#btnundo").attr("disabled","true");
			$("#btnredo").attr("disabled","true");
		}
		else{
			if(!this.current){ $("#btnundo").attr("disabled","true");}
			else{ $("#btnundo").attr("disabled","");}

			if(this.current==this.ope.length){ $("#btnredo").attr("disabled","true");}
			else{ $("#btnredo").attr("disabled","");}
		}
	},
	allerase : function(){
		for(var i=this.ope.length-1;i>=0;i--){ this.ope.pop();}
		this.current  = 0;
		this.anscount = 0;
		this.enb_btn();
	},
	newOperation : function(flag){	// �L�[�A�{�^���������n�߂��Ƃ���true
		this.chainflag = 0;
		if(flag){ this.changeflag = false;}
	},

	//---------------------------------------------------------------------------
	// um.addOpe() �w�肳�ꂽ�����ǉ�����Bid���������ꍇ�͍ŏI�����ύX����
	//---------------------------------------------------------------------------
	addOpe : function(obj, property, id, old, num){
		if(!this.isenableRecord()){ return;}
		else if(old==num){ return;}

		if(obj==property){
			if(obj=='cell' || obj=='excell'){
				this.addOpe(obj, 'ques', id, old.ques, 0);
				this.addOpe(obj, 'qnum', id, old.qnum, -1);
				this.addOpe(obj, 'direc', id, old.direc, 0);
				this.addOpe(obj, 'qans', id, old.qans, -1);
				this.addOpe(obj, 'qsub', id, old.qsub, 0);
				if(old.obj){ this.addOpe(obj, 'numobj', id, old.numobj, "");}
				if(old.obj){ this.addOpe(obj, 'numobj2', id, old.numobj2, "");}
			}
			else if(obj=='cross'){
				this.addOpe('cross', 'ques', id, old.ques, -1);
				this.addOpe('cross', 'qnum', id, old.qnum, -1);
				if(old.obj){ this.addOpe('cross', 'numobj', id, old.numobj, "");}
			}
			else if(obj=='border'){
				this.addOpe('border', 'ques', id, old.ques, 0);
				this.addOpe('border', 'qnum', id, old.ques, 0);
				this.addOpe('border', 'qans', id, old.qans, 0);
				this.addOpe('border', 'qsub', id, old.qsub, 0);
				this.addOpe('border', 'line', id, old.line, 0);
				this.addOpe('border', 'color', id, old.color, "");
				if(old.obj){ this.addOpe('border', 'numobj', id, old.numobj, "");}
			}
		}
		else{
			var lastid = this.ope.length-1;

			if(this.current < this.ope.length){
				for(var i=this.ope.length-1;i>=this.current;i--){ this.ope.pop();}
				lastid = -1;
			}
			else if(this.undoonly!=1){ lastid!=-1;}

			// �O��Ɠ����ꏊ�Ȃ�O��̍X�V�̂�
			if(lastid>=0 && this.ope[lastid].obj == obj && this.ope[lastid].property == property && this.ope[lastid].id == id && this.ope[lastid].num == old
				&& this.disCombine==0 && ( (obj == 'cell' && ( property=='qnum' || (property=='qans' && k.isAnsNumber) )) || obj == 'cross')
			)
			{
				this.ope[lastid].num = num;
			}
			else{
				this.ope.push(new Operation(obj, property, id, old, num));
				this.current++;
				if(this.chainflag==0){ this.chainflag = 1;}
			}
		}
		if(property!='qsub' && property!='color'){ this.anscount++;}
		this.changeflag = true;
		this.enb_btn();
	},

	//---------------------------------------------------------------------------
	// um.undo()  Undo�����s����
	// um.redo()  Redo�����s����
	// um.exec()  ����ope�𔽉f����Bundo(),redo()��������I�ɌĂ΂��
	//---------------------------------------------------------------------------
	undo : function(){
		if(this.current==0){ return;}

		this.disableRecord(); this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
		while(this.current>0){
			this.exec(this.ope[this.current-1], this.ope[this.current-1].old);
			if(this.ope[this.current-1].property!='qsub' && this.ope[this.current-1].property!='color'){ this.anscount--;}
			this.current--;

			if(!this.ope[this.current].chain){ break;}
		}
		if(this.reqReset==1){ room.resetRarea(); this.reqReset=0;}
		this.enableRecord(); pc.paint(this.range.x1, this.range.y1, this.range.x2, this.range.y2);
		this.enb_btn();
	},
	redo : function(){
		if(this.current==this.ope.length){ return;}
		this.disableRecord(); this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
		while(this.current<this.ope.length){
			if(this.ope[this.current].undoonly!=1){ this.exec(this.ope[this.current], this.ope[this.current].num);}
			if(this.ope[this.current].property!='qsub' && this.ope[this.current].property!='color'){ this.anscount++;}
			this.current++;

			if(this.current<this.ope.length && !this.ope[this.current].chain){ break;}
		}
		if(this.reqReset==1){ room.resetRarea(); this.reqReset=0;}
		this.enableRecord(); pc.paint(this.range.x1, this.range.y1, this.range.x2, this.range.y2);
		this.enb_btn();
	},
	exec : function(ope, num){
		var pp = ope.property;
		if(ope.obj == 'cell'){
			if     (pp == 'ques'){ bd.sQuC(ope.id, num);}
			else if(pp == 'qnum'){ bd.sQnC(ope.id, num);}
			else if(pp == 'direc'){ bd.sDiC(ope.id, num);}
			else if(pp == 'qans'){ bd.sQaC(ope.id, num);}
			else if(pp == 'qsub'){ bd.sQsC(ope.id, num);}
			else if(pp == 'numobj'){ bd.cell[ope.id].numobj = num;}
			else if(pp == 'numobj2'){ bd.cell[ope.id].numobj2 = num;}
			this.paintStack(bd.cell[ope.id].cx, bd.cell[ope.id].cy, bd.cell[ope.id].cx, bd.cell[ope.id].cy);
		}
		else if(ope.obj == 'excell'){
			if     (pp == 'qnum'){ bd.sQnE(ope.id, num);}
			else if(pp == 'direc'){ bd.sDiE(ope.id, num);}
		}
		else if(ope.obj == 'cross'){
			if     (pp == 'ques'){ bd.sQuX(ope.id, num);}
			else if(pp == 'qnum'){ bd.sQnX(ope.id, num);}
			else if(pp == 'numobj'){ bd.cross[ope.id].numobj = num;}
			this.paintStack(bd.cross[ope.id].cx-1, bd.cross[ope.id].cy-1, bd.cross[ope.id].cx, bd.cross[ope.id].cy);
		}
		else if(ope.obj == 'border'){
			if     (pp == 'ques'){ bd.sQuB(ope.id, num);}
			else if(pp == 'qnum'){ bd.sQnB(ope.id, num);}
			else if(pp == 'qans'){ bd.sQaB(ope.id, num);}
			else if(pp == 'qsub'){ bd.sQsB(ope.id, num);}
			else if(pp == 'line'){ bd.sLiB(ope.id, num);}
			else if(pp == 'color'){ bd.border[ope.id].color = num;}
			this.paintBorder(ope.id);
		}
		else if(ope.obj == 'board'){
			if     (pp == 'expandup'){ if(num==1){ menu.ex.expandup();}else{ menu.ex.reduceup();} }
			else if(pp == 'expanddn'){ if(num==1){ menu.ex.expanddn();}else{ menu.ex.reducedn();} }
			else if(pp == 'expandlt'){ if(num==1){ menu.ex.expandlt();}else{ menu.ex.reducelt();} }
			else if(pp == 'expandrt'){ if(num==1){ menu.ex.expandrt();}else{ menu.ex.reducert();} }
			else if(pp == 'reduceup'){ if(num==1){ menu.ex.reduceup();}else{ menu.ex.expandup();} }
			else if(pp == 'reducedn'){ if(num==1){ menu.ex.reducedn();}else{ menu.ex.expanddn();} }
			else if(pp == 'reducelt'){ if(num==1){ menu.ex.reducelt();}else{ menu.ex.expandlt();} }
			else if(pp == 'reducert'){ if(num==1){ menu.ex.reducert();}else{ menu.ex.expandrt();} }

			else if(pp == 'flipy'){ menu.ex.flipy(0,0,k.qcols-1,k.qrows-1);}
			else if(pp == 'flipx'){ menu.ex.flipx(0,0,k.qcols-1,k.qrows-1);}
			else if(pp == 'turnr'){ if(num==1){ menu.ex.turnr(0,0,k.qcols-1,k.qrows-1);} else{ menu.ex.turnl(0,0,k.qcols-1,k.qrows-1);} }
			else if(pp == 'turnl'){ if(num==1){ menu.ex.turnl(0,0,k.qcols-1,k.qrows-1);} else{ menu.ex.turnr(0,0,k.qcols-1,k.qrows-1);} }

			tc.Adjust();
			base.resize_canvas();
			this.range = { x1:0, y1:0, x2:k.qcols-1, y2:k.qrows-1};
			this.reqReset = 1;
		}
	},
	//---------------------------------------------------------------------------
	// um.paintBorder()  Border�̎����`�悷�邽�߁A�ǂ͈̔͂܂ŕύX�����������L�����Ă���
	// um.paintStack()   �ύX���������͈͂�Ԃ�
	//---------------------------------------------------------------------------
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paintStack(mf((bd.border[id].cx-1)/2)-1, mf(bd.border[id].cy/2)-1,
							mf((bd.border[id].cx-1)/2)+1, mf(bd.border[id].cy/2)   );
		}
		else{
			this.paintStack(mf(bd.border[id].cx/2)-1, mf((bd.border[id].cy-1)/2)-1,
							mf(bd.border[id].cx/2)  , mf((bd.border[id].cy-1)/2)+1 );
		}
	},
	paintStack : function(x1,y1,x2,y2){
		if(this.range.x1 > x1){ this.range.x1 = x1;}
		if(this.range.y1 > y1){ this.range.y1 = y1;}
		if(this.range.x2 < x2){ this.range.x2 = x2;}
		if(this.range.y2 < y2){ this.range.y2 = y2;}
	}
};

//---------------------------------------------------------------------------
// ��Menu�N���X [�t�@�C��]���̃��j���[�̓����ݒ肷��
//---------------------------------------------------------------------------
Caption = function(){
	this.menu     = '';
	this.label    = '';
};
MenuData = function(strJP, strEN){
	this.caption = { ja: strJP, en: strEN};
	this.smenus = new Array();
};

// ���j���[�`��/�擾/html�\���n
// Menu�N���X
Menu = function(){
	this.dispfloat  = new Array();	// ���ݕ\�����Ă���t���[�g���j���[�E�B���h�E(�I�u�W�F�N�g)
	this.floatpanel = new Array();	// (2�i�ڊ܂�)�t���[�g���j���[�I�u�W�F�N�g�̃��X�g
	this.pop        = "";			// ���ݕ\�����Ă���|�b�v�A�b�v�E�B���h�E(�I�u�W�F�N�g)

	this.isptitle   = 0;			// �^�C�g���o�[��������Ă��邩
	this.offset = new Pos(0, 0);	// �|�b�v�A�b�v�E�B���h�E�̍��ォ��̈ʒu

	this.btnstack   = new Array();	// �{�^���̏��(idname�ƕ�����̃��X�g)
	this.labelstack = new Array();	// span���̕�����̏��(idname�ƕ�����̃��X�g)

	this.ex = new MenuExec();
};
Menu.prototype = {
	//---------------------------------------------------------------------------
	// menu.menuinit()  ���j���[�A�{�^���A�T�u���j���[�A�t���[�g���j���[�A
	//                  �|�b�v�A�b�v���j���[�̏����ݒ���s��
	// menu.menureset() ���j���[�p�̐ݒ����������
	//---------------------------------------------------------------------------
	menuinit : function(){
		this.buttonarea();
		this.menuarea();
		this.poparea();

		this.displayAll();
	},

	menureset : function(){
		this.dispfloat  = new Array();
		this.floatpanel = new Array();
		this.pop        = "";
		this.btnstack   = new Array();
		this.labelstack = new Array();

		this.popclose();
		this.menuclear();

		$("#popup_parent > .floatmenu").remove();
		$("#menupanel,#usepanel,#checkpanel").html("");
		if($("#btncolor2").length>0){ $("#btncolor2").remove();}
		$("#btnclear2").nextAll().remove();
		$("#outbtnarea").remove();

		pp.reset();
	},

	//---------------------------------------------------------------------------
	// menu.menuarea()   ���j���[�̏����ݒ���s��
	// menu.addMenu()    ���j���[�̏���ϐ��ɓo�^����
	// menu.menuhover(e) ���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.menuout(e)   ���j���[����}�E�X���O�ꂽ���̕\���ݒ���s��
	// menu.menuclear()  ���j���[/�T�u���j���[/�t���[�g���j���[��S�đI������Ă��Ȃ���Ԃɖ߂�
	//---------------------------------------------------------------------------
	menuarea : function(){
		this.addMenu('file', "�t�@�C��", "File");
		this.addMenu('edit', "�ҏW", "Edit");
		this.addMenu('disp', "�\��", "Display");
		this.addMenu('setting', "�ݒ�", "Setting");
		this.addMenu('other', "���̑�", "Others");

		pp.setDefaultFlags();
		this.createFloats();

		$("#expression").html(base.expression.ja);
		if(k.callmode=="pplay"){ $("#ms_newboard,#ms_urloutput").attr("class", "smenunull");}
		if(k.callmode=="pplay"){ $("#ms_adjust").attr("class", "smenunull");}
		$("#ms_jumpv3,#ms_jumptop,#ms_jumpblog").css("font-size",'10pt').css("padding-left",'8pt');

		this.managearea();
	},

	addMenu : function(idname, strJP, strEN){
		newEL("div").attr("class", 'menu').attr("id",'menu_'+idname).appendTo($("#menupanel"))
					.html("["+strJP+"]").css("margin-right","4pt")
					.hover(this.menuhover.ebind(this,idname), this.menuout.ebind(this));
		this.addLabels($("menu_"+idname), "["+strJP+"]", "["+strEN+"]");
	},
	menuhover : function(e, idname){
		this.floatmenuopen(e,idname,0);
		$("div.menusel").attr("class", "menu");
		$(getSrcElement(e)).attr("class", "menusel");
	},
	menuout   : function(e){ if(!this.insideOfMenu(e)){ this.menuclear();} },
	menuclear : function(){
		$("div.menusel").attr("class", "menu");
		$("div.smenusel").attr("class", "smenu");
		$("#popup_parent > .floatmenu").hide();
		this.dispfloat = [];
	},

	//---------------------------------------------------------------------------
	// menu.submenuhover(e) �T�u���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.submenuout(e)   �T�u���j���[����}�E�X���O�ꂽ�Ƃ��̕\���ݒ���s��
	// menu.submenuclick(e) �ʏ�/�I���^/�`�F�b�N�^�T�u���j���[���N���b�N���ꂽ�Ƃ��̓�������s����
	// menu.checkclick()    �Ǘ��̈�̃`�F�b�N�{�^���������ꂽ�Ƃ��A�`�F�b�N�^�̐ݒ��ݒ肷��
	//---------------------------------------------------------------------------
	submenuhover : function(e, idname){
		if($(getSrcElement(e)).attr("class")=="smenu"){ $(getSrcElement(e)).attr("class", "smenusel");}
		if(pp.flags[idname] && pp.type(idname)==1){ this.floatmenuopen(e,idname,this.dispfloat.length);}
	},
	submenuout   : function(e, idname){
		if($(getSrcElement(e)).attr("class")=="smenusel"){ $(getSrcElement(e)).attr("class", "smenu");}
		if(pp.flags[idname] && pp.type(idname)==1){ this.floatmenuout(e);}
	},
	submenuclick : function(e, idname){
		if($(getSrcElement(e)).attr("class") == "smenunull"){ return;}
		this.menuclear();

		if(pp.type(idname)==0){
			this.popclose();							// �\�����Ă���E�B���h�E������ꍇ�͕���
			if(pp.funcs[idname]){ pp.funcs[idname]();}	// ���̒���this.popupenu���ݒ肳��܂��B
			if(this.pop){
				this.pop.css("left", mv.pointerX(e) - 8 + k.IEMargin.x)
						.css("top",  mv.pointerY(e) - 8 + k.IEMargin.y).css("visibility", "visible");
			}
		}
		else if(pp.type(idname)==4){ this.setVal(pp.flags[idname].parent, pp.getVal(idname));}
		else if(pp.type(idname)==2){ this.setVal(idname, !pp.getVal(idname));}
	},
	checkclick : function(idname){ this.setVal(idname, $("#ck_"+idname).attr("checked"));},

	//---------------------------------------------------------------------------
	// menu.floatmenuopen()  �}�E�X�����j���[���ڏ�ɗ������Ƀt���[�g���j���[��\������
	// menu.floatmenuclose() �t���[�g���j���[��close����
	// menu.floatmenuout(e)  �}�E�X���t���[�g���j���[�𗣂ꂽ���Ƀt���[�g���j���[��close����
	// menu.insideOf()       �C�x���ge��jQuery�I�u�W�F�N�gjqobj�͈͓̔��ŋN���������H
	// menu.insideOfMenu()   �}�E�X�����j���[�̈�̒��ɂ��邩���肷��
	//---------------------------------------------------------------------------
	floatmenuopen : function(e, idname, depth){
		this.floatmenuclose(depth);
		var src = $(getSrcElement(e));

		if(depth==0||this.dispfloat[depth-1]){
			if(depth==0){ this.floatpanel[idname].css("left", src.offset().left - 3 + k.IEMargin.x).css("top" , src.offset().top + src.height());}
			else        { this.floatpanel[idname].css("left", src.offset().left + src.width())     .css("top",  src.offset().top - 3);}
			this.floatpanel[idname].css("z-index",101+depth).css("visibility", "visible").show();
			this.dispfloat.push(idname);
		}
	},
	// �}�E�X�����ꂽ�Ƃ��Ƀt���[�g���j���[���N���[�Y����
	// �t���[�g->���j���[���ɊO�ꂽ���́A�֐��I�������floatmenuopen()���Ă΂��
	floatmenuclose : function(depth){
		if(depth==0){ this.menuclear(); return;}
		for(var i=this.dispfloat.length-1;i>=depth;i--){
			if(this.dispfloat[i]){
				$("#ms_"+this.dispfloat[i]).attr("class", "smenu");
				this.floatpanel[this.dispfloat[i]].hide();
				this.dispfloat.pop();
			}
		}
	},
	floatmenuout : function(e){
		for(var i=this.dispfloat.length-1;i>=0;i--){
			if(this.insideOf(this.floatpanel[this.dispfloat[i]],e)){ this.floatmenuclose(i+1); return;}
		}
		this.menuclear();
	},

	insideOf : function(jqobj, e){
		var LT = new Pos(jqobj.offset().left, jqobj.offset().top);
		var ev = new Pos(mv.pointerX(e), mv.pointerY(e));
		return !(ev.x<=LT.x || ev.x>=LT.x+jqobj.width() || ev.y<=LT.y || ev.y>=LT.y+jqobj.height());
	},
	insideOfMenu : function(e){
		var upperLimit = $("#menu_file").offset().top;
		var leftLimit  = $("#menu_file").offset().left;
		var rightLimit = $("#menu_other").offset().left + $("#menu_other").width();
		var ex = mv.pointerX(e), ey = mv.pointerY(e);
		return (ex>leftLimit && ex<rightLimit && ey>upperLimit);
	},

	//---------------------------------------------------------------------------
	// menu.addUseToFlags()      �u������@�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedLineToFlags()  �u���̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedBlockToFlags() �u���}�X�̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	//---------------------------------------------------------------------------
	// menu�o�^�p�̊֐�
	addUseToFlags : function(){
		pp.addUseToFlags('use','setting',1,[1,2]);
		pp.setMenuStr('use', '������@', 'Input Type');
		pp.setLabel  ('use', '������@', 'Input Type');

		pp.addUseChildrenToFlags('use','use');
		pp.setMenuStr('use_1', '���E�{�^��', 'LR Button');
		pp.setMenuStr('use_2', '1�{�^��', 'One Button');
	},
	addRedLineToFlags : function(){
		pp.addCheckToFlags('dispred','setting',false);
		pp.setMenuStr('dispred', '�q����`�F�b�N', 'Continuous Check');
		pp.setLabel  ('dispred', '���̂Ȃ�����`�F�b�N����', 'Check countinuous lines');
	},
	addRedBlockToFlags : function(){
		pp.addCheckToFlags('dispred','setting',false);
		pp.setMenuStr('dispred', '�q����`�F�b�N', 'Continuous Check');
		pp.setLabel  ('dispred', '���}�X�̂Ȃ�����`�F�b�N����', 'Check countinuous black cells');
	},

	//---------------------------------------------------------------------------
	// menu.getVal()     �e�t���O��val�̒l��Ԃ�
	// menu.setVal()     �e�t���O�̐ݒ�l��ݒ肷��
	// menu.setdisplay() �Ǘ��p�l���ƃT�u���j���[�ɕ\�����镶�����ݒ肷��
	// menu.displayAll() �S�Ẵ��j���[�A�{�^���A���x���ɑ΂��ĕ������ݒ肷��
	//---------------------------------------------------------------------------
	getVal : function(idname)  { return pp.getVal(idname);},
	setVal : function(idname, newval){ pp.setVal(idname,newval);},
	setdisplay : function(idname){
		if(pp.type(idname)==0||pp.type(idname)==3){
			if($("#ms_"+idname)){ $("#ms_"+idname).html(pp.getMenuStr(idname));}
		}
		else if(pp.type(idname)==1){
			if($("#ms_"+idname)){ $("#ms_"+idname).html("&nbsp;"+pp.getMenuStr(idname));}	// ���j���[��̕\�L�̐ݒ�
			$("#cl_"+idname).html(pp.getLabel(idname));									// �Ǘ��̈��̕\�L�̐ݒ�
			for(var i=0;i<pp.flags[idname].child.length;i++){ this.setdisplay(""+idname+"_"+pp.flags[idname].child[i]);}
		}
		else if(pp.type(idname)==4){
			var issel = (pp.getVal(idname) == pp.getVal(pp.flags[idname].parent));
			var cap = pp.getMenuStr(idname);
			$("#ms_"+idname).html((issel?"+":"&nbsp;")+cap);					// ���j���[�̍���
			$("#up_"+idname).html(cap).attr("class", issel?"flagsel":"flag");	// �Ǘ��̈�̍���
		}
		else if(pp.type(idname)==2){
			var flag = pp.getVal(idname);
			if($("#ms_"+idname)){ $("#ms_"+idname).html((flag?"+":"&nbsp;")+pp.getMenuStr(idname));}	// ���j���[
			$("#ck_"+idname).attr("checked",flag);			// �Ǘ��̈�(�`�F�b�N�{�b�N�X)
			$("#cl_"+idname).html(pp.getLabel(idname));		// �Ǘ��̈�(���x��)
		}
	},
	displayAll : function(){
		for(var i in pp.flags){ this.setdisplay(i);}
		$.each(this.btnstack,function(i,obj){obj.el.attr("value",obj.str[lang.language]);});
		$.each(this.labelstack,function(i,obj){obj.el.html(obj.str[lang.language]);});
	},

	//---------------------------------------------------------------------------
	// menu.createFloatMenu() �o�^���ꂽ�T�u���j���[����t���[�g���j���[���쐬����
	// menu.getFloatpanel()   �w�肳�ꂽID�����t���[�g���j���[��Ԃ�(�Ȃ��ꍇ�͍쐬����)
	//---------------------------------------------------------------------------
	createFloats : function(){
		var last=0;
		for(var i=0;i<pp.flaglist.length;i++){
			var idname = pp.flaglist[i];
			if(!pp.flags[idname]){ continue;}

			var menuid = pp.flags[idname].parent;
			var floats = this.getFloatpanel(menuid);

			if(menuid=='setting'){
				if(last>0 && last!=pp.type(idname)){ $("<div class=\"smenusep\">&nbsp;</div>").appendTo(floats);}
				last=pp.type(idname);
			}

			var smenu;
			if     (pp.type(idname)==5){ smenu = $("<div class=\"smenusep\">&nbsp;</div>");}
			else if(pp.type(idname)==3){ smenu = newEL("span").css("color", 'white');}
			else if(pp.type(idname)==1){
				smenu = newEL("div").attr("class", 'smenu').css("font-weight","900").css("font-size",'10pt')
									.hover(this.submenuhover.ebind(this,idname), this.submenuout.ebind(this,idname));
				this.getFloatpanel(idname);
			}
			else{
				smenu = newEL("div").attr("class", 'smenu')
									.hover(this.submenuhover.ebind(this,idname), this.submenuout.ebind(this,idname))
									.click(this.submenuclick.ebind(this,idname));
				if(pp.type(idname)!=0){ smenu.css("font-size",'10pt').css("padding-left",'6pt');}
			}
			smenu.attr("id","ms_"+idname).appendTo(floats);
			this.setdisplay(idname);
		}
		this.floatpanel[menuid] = floats;
	},
	getFloatpanel : function(id){
		if(!this.floatpanel[id]){
			this.floatpanel[id] = newEL("div")
				.attr("class", 'floatmenu').attr("id",'float_'+id).appendTo($("#popup_parent"))
				.css("background-color", base.floatbgcolor).css("z-index",101)
				.mouseout(this.floatmenuout.ebind(this)).hide();
		}
		return this.floatpanel[id];
	},

	//---------------------------------------------------------------------------
	// menu.managearea()   �Ǘ��̈�̏��������s��
	//---------------------------------------------------------------------------
	managearea : function(){
		for(var n=0;n<pp.flaglist.length;n++){
			var idname = pp.flaglist[n];
			if(!pp.flags[idname] || !pp.getLabel(idname)){ continue;}

			if(pp.type(idname)==1){
				$("#usepanel").append("<span id=\"cl_"+idname+"\">"+pp.getLabel(idname)+"</span> |&nbsp;");
				for(var i=0;i<pp.flags[idname].child.length;i++){
					var num = pp.flags[idname].child[i];
					var el = newEL('div').attr("class",((num==pp.getVal(idname))?"flagsel":"flag")).attr("id","up_"+idname+"_"+num)
										 .html(pp.getMenuStr(""+idname+"_"+num)).appendTo($("#usepanel"))
										 .click(pp.setVal.bind(pp,idname,num)).unselectable();
					$("#usepanel").append(" ");
				}
				$("#usepanel").append("<br>\n");
			}
			else if(pp.type(idname)==2){
				$("#checkpanel").append("<input type=\"checkbox\" id=\"ck_"+idname+"\""+(pp.getVal(idname)?' checked':'')+"> ")
								.append("<span id=\"cl_"+idname+"\"> "+pp.getLabel(idname)+"</span>");
				if(idname=="irowake"){
					$("#checkpanel").append("<input type=button id=\"ck_irowake2\" value=\"�F�������Ȃ���\" onClick=\"javascript:col.irowakeRemake();\">");
					this.addButtons($("#ck_irowake2"), "�F�������Ȃ���", "Change the color of Line");
				}
				$("#checkpanel").append("<br>\n");
				$("#ck_"+idname).click(this.checkclick.bind(this,idname));
			}
		}

		$("#translation").css("position","absolute").css("cursor","pointer")
						 .css("font-size","10pt").css("color","green").css("background-color","#dfdfdf")
						 .click(lang.translate.bind(lang)).unselectable();
		if(k.callmode=="pmake"){ $("#timerpanel,#separator2").hide();}
		if(k.irowake!=0){
			$("#btnarea").append("<input type=\"button\" id=\"btncolor2\" value=\"�F�������Ȃ���\">");
			$("#btncolor2").click(col.irowakeRemake.ebind(col)).hide();
			menu.addButtons($("#btncolor2"), "�F�������Ȃ���", "Change the color of Line");
		}
	},

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.poparea()     �|�b�v�A�b�v���j���[�̏����ݒ���s��
	// menu.popclose()    �|�b�v�A�b�v���j���[�����
	//---------------------------------------------------------------------------
	poparea : function(){
		var self = this;
		// Popup���j���[�𓮂����C�x���g
		var popupfunc = function(){
			$(this).mousedown(self.titlebardown.ebind(self)).mouseup(self.titlebarup.ebind(self))
				   .mouseout(self.titlebarout.ebind(self)).mousemove(self.titlebarmove.ebind(self))
				   .unselectable();
		};
		$("div.titlebar,#credir3_1").each(popupfunc);

		//---------------------------------------------------------------------------
		//// form�{�^���̃C�x���g
		var px = this.popclose.ebind(this);

		// �Ֆʂ̐V�K�쐬
		$(document.newboard.newboard).click(this.ex.newboard.ebind(this.ex));
		$(document.newboard.cancel).click(px);

		// URL����
		$(document.urlinput.urlinput).click(this.ex.urlinput.ebind(this.ex));
		$(document.urlinput.cancel).click(px);

		// URL�o��
		$(document.urloutput.ta).before(newEL('div').attr('id','outbtnarea'));
		var ib = function(name, strJP, strEN, eval){ if(!eval) return;
			var btn = newEL('input').attr('type','button').attr("name",name).click(this.ex.urloutput.ebind(this.ex));
			$("#outbtnarea").append(btn).append("<br>");
			this.addButtons(btn, strJP, strEN);
		}.bind(this);
		ib('pzprv3', "�ς��Ղ�v3��URL���o�͂���", "Output PUZ-PRE v3 URL", true);
		ib('pzprapplet', "�ς��Ղ�\(�A�v���b�g\)��URL���o�͂���", "Output PUZ-PRE(JavaApplet) URL", !k.ispzprv3ONLY);
		ib('kanpen', "�J���y����URL���o�͂���", "Output Kanpen URL", k.isKanpenExist);
		ib('heyaapp', "�ւ�킯�A�v���b�g��URL���o�͂���", "Output Heyawake-Applet URL", (k.puzzleid=="heyawake"));
		ib('pzprv3edit', "�ς��Ղ�v3�̍ĕҏW�pURL���o�͂���", "Output PUZ-PRE v3 Re-Edit URL", true);
		$("#outbtnarea").append("<br>\n");
		$(document.urloutput.openurl).click(this.ex.openurl.ebind(this.ex));
		$(document.urloutput.close).click(px);

		this.addButtons($(document.urloutput.openurl), "����URL���J��", "Open this URL on another window/tab");
		this.addButtons($(document.urloutput.close),   "����", "Close");

		// �t�@�C������
		$(document.fileform.filebox).change(this.ex.fileopen.ebind(this.ex));
		$(document.fileform.close).click(px);

		// �f�[�^�x�[�X���J��
		$(document.database.sorts   ).change(fio.displayDataTableList.ebind(fio));
		$(document.database.datalist).change(fio.selectDataTable.ebind(fio));
		$(document.database.tableup ).click(fio.upDataTable.ebind(fio));
		$(document.database.tabledn ).click(fio.downDataTable.ebind(fio));
		$(document.database.open    ).click(fio.openDataTable.ebind(fio));
		$(document.database.save    ).click(fio.saveDataTable.ebind(fio));
		$(document.database.comedit ).click(fio.editComment.ebind(fio));
		$(document.database.difedit ).click(fio.editDifficult.ebind(fio));
		$(document.database.del     ).click(fio.deleteDataTable.ebind(fio));
		$(document.database.close   ).click(px);

		// �Ֆʂ̒���
		var pa = this.ex.popupadjust.ebind(this.ex);
		$(document.adjust.expandup).click(pa);
		$(document.adjust.expanddn).click(pa);
		$(document.adjust.expandlt).click(pa);
		$(document.adjust.expandrt).click(pa);
		$(document.adjust.reduceup).click(pa);
		$(document.adjust.reducedn).click(pa);
		$(document.adjust.reducelt).click(pa);
		$(document.adjust.reducert).click(pa);
		$(document.adjust.close   ).click(px);

		// ���]�E��]
		var pf = this.ex.popupflip.ebind(this.ex);
		$(document.flip.turnl).click(pf);
		$(document.flip.turnr).click(pf);
		$(document.flip.flipy).click(pf);
		$(document.flip.flipx).click(pf);
		$(document.flip.close).click(px);

		// credit
		$(document.credit.close).click(px);

		// �\���T�C�Y
		$(document.dispsize.dispsize).click(this.ex.dispsize.ebind(this));
		$(document.dispsize.cancel).click(px);
	},
	popclose : function(){
		if(this.pop){
			this.pop.css("visibility","hidden");
			this.pop = '';
			this.menuclear();
			this.isptitle = 0;
			k.enableKey = true;
		}
	},

	//---------------------------------------------------------------------------
	// menu.titlebardown() Popup�^�C�g���o�[���N���b�N�����Ƃ��̓�����s��
	// menu.titlebarup()   Popup�^�C�g���o�[�Ń{�^���𗣂����Ƃ��̓�����s��
	// menu.titlebarout()  Popup�^�C�g���o�[����}�E�X�����ꂽ�Ƃ��̓�����s��
	// menu.titlebarmove() Popup�^�C�g���o�[����}�E�X�𓮂������Ƃ��|�b�v�A�b�v���j���[�𓮂���
	//---------------------------------------------------------------------------
	titlebardown : function(e){
		this.isptitle = 1;
		this.offset.x = mv.pointerX(e) - parseInt(this.pop.css("left"));
		this.offset.y = mv.pointerY(e) - parseInt(this.pop.css("top"));
	},
	titlebarup   : function(e){ this.isptitle = 0; },
	titlebarout  : function(e){ if(this.pop && !this.insideOf(this.pop, e)){ this.isptitle = 0;} },
	titlebarmove : function(e){
		if(this.pop && this.isptitle){
			this.pop.css("left", (mv.pointerX(e) - this.offset.x));
			this.pop.css("top" , (mv.pointerY(e) - this.offset.y));
		}
	},

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.buttonarea()        �{�^���̏����ݒ���s��
	// menu.addButtons()        �{�^���̏���ϐ��ɓo�^����
	// menu.addLAbels()         ���x���̏���ϐ��ɓo�^����
	// menu.setDefaultButtons() �{�^����btnstack�ɐݒ肷��
	// menu.setDefaultLabels()  ���x����spanstack�ɐݒ肷��
	//---------------------------------------------------------------------------
	buttonarea : function(){
		this.addButtons($("#btncheck").click(ans.check.bind(ans)),              "�`�F�b�N", "Check");
		this.addButtons($("#btnundo").click(um.undo.bind(um)),                  "��",       "<-");
		this.addButtons($("#btnredo").click(um.redo.bind(um)),                  "�i",       "->");
		this.addButtons($("#btnclear").click(menu.ex.ACconfirm.bind(menu.ex)),  "�񓚏���", "Erase Answer");
		this.addButtons($("#btnclear2").click(menu.ex.ASconfirm.bind(menu.ex)), "�⏕����", "Erase Auxiliary Marks");
		$("#btnarea,#btnundo,#btnredo,#btnclear,#btnclear2").unselectable();

		this.setDefaultButtons();
		this.setDefaultLabels();
	},
	addButtons : function(jqel, strJP, strEN){ this.btnstack.push({el:jqel, str:{ja:strJP, en:strEN}}); },
	addLabels  : function(jqel, strJP, strEN){ this.labelstack.push({el:jqel, str:{ja:strJP, en:strEN}}); },

	setDefaultButtons : function(){
		var t = this.addButtons.bind(this);
		t($(document.newboard.newboard), "�V�K�쐬",   "Create");
		t($(document.newboard.cancel),   "�L�����Z��", "Cancel");
		t($(document.urlinput.urlinput), "�ǂݍ���",   "Import");
		t($(document.urlinput.cancel),   "�L�����Z��", "Cancel");
		t($(document.fileform.button),   "����",     "Close");
		t($(document.database.save),     "�Ֆʂ�ۑ�", "Save");
		t($(document.database.comedit),  "�R�����g��ҏW����", "Edit Comment");
		t($(document.database.difedit),  "��Փx��ݒ肷��",   "Set difficulty");
		t($(document.database.open),     "�f�[�^��ǂݍ���",   "Load");
		t($(document.database.del),      "�폜",       "Delete");
		t($(document.database.close),    "����",     "Close");
		t($(document.adjust.expandup),   "��",         "UP");
		t($(document.adjust.expanddn),   "��",         "Down");
		t($(document.adjust.expandlt),   "��",         "Left");
		t($(document.adjust.expandrt),   "�E",         "Right");
		t($(document.adjust.reduceup),   "��",         "UP");
		t($(document.adjust.reducedn),   "��",         "Down");
		t($(document.adjust.reducelt),   "��",         "Left");
		t($(document.adjust.reducert),   "�E",         "Right");
		t($(document.adjust.close),      "����",     "Close");
		t($(document.flip.turnl),        "��90����]", "Turn left by 90 degree");
		t($(document.flip.turnr),        "�E90����]", "Turn right by 90 degree");
		t($(document.flip.flipy),        "�㉺���]",   "Flip upside down");
		t($(document.flip.flipx),        "���E���]",   "Flip leftside right");
		t($(document.flip.close),        "����",     "Close");
		t($(document.dispsize.dispsize), "�ύX����",   "Change");
		t($(document.dispsize.cancel),   "�L�����Z��", "Cancel");
		t($(document.credit.close),      "����",     "OK");
	},
	setDefaultLabels : function(){
		var t = this.addLabels.bind(this);
		t($("#translation"), "English",                      "���{��");
		t($("#bar1_1"),      "&nbsp;�Ֆʂ̐V�K�쐬",         "&nbsp;Createing New Board");
		t($("#pop1_1_cap0"), "�Ֆʂ�V�K�쐬���܂��B",       "Create New Board.");
		t($("#pop1_1_cap1"), "�悱",                         "Cols");
		t($("#pop1_1_cap2"), "����",                         "Rows");
		t($("#bar1_2"),      "&nbsp;URL����",                "&nbsp;Import from URL");
		t($("#pop1_2_cap0"), "URL�������ǂݍ��݂܂��B",  "Import a question from URL.");
		t($("#bar1_3"),      "&nbsp;URL�o��",                "&nbsp;Export URL");
		t($("#bar1_4"),      "&nbsp;�t�@�C�����J��",         "&nbsp;Open file");
		t($("#pop1_4_cap0"), "�t�@�C���I��",                 "Choose file");
		t($("#bar1_8"),      "&nbsp;�f�[�^�x�[�X�̊Ǘ�",     "&nbsp;Database Management");
		t($("#pop1_8_com"),  "�R�����g:",                    "Comment:");
		t($("#bar2_1"),      "&nbsp;�Ֆʂ̒���",             "&nbsp;Adjust the board");
		t($("#pop2_1_cap0"), "�Ֆʂ̒������s���܂��B",       "Adjust the board.");
		t($("#pop2_1_cap1"), "�g��",                         "Expand");
		t($("#pop2_1_cap2"), "�k��",                         "Reduce");
		t($("#bar2_2"),      "&nbsp;���]�E��]",             "&nbsp;Flip/Turn the board");
		t($("#pop2_2_cap0"), "�Ֆʂ̉�]�E���]���s���܂��B", "Flip/Turn the board.");
		t($("#bar4_1"),      "&nbsp;�\���T�C�Y�̕ύX",       "&nbsp;Change size");
		t($("#pop4_1_cap0"), "�\���T�C�Y��ύX���܂��B",     "Change the display size.");
		t($("#pop4_1_cap1"), "�\���T�C�Y",                   "Display size");
		t($("#bar3_1"),      "&nbsp;credit",                 "&nbsp;credit");
		t($("#credit3_1"), "�ς��Ղ�v3 "+pzprversion+"<br>\n<br>\n�ς��Ղ�v3�� �͂���/�A�����j���쐬���Ă��܂��B<br>\n���C�u�����Ƃ���jQuery1.3.2, uuCanvas1.0, <br>Google Gears��\n�g�p���Ă��܂��B<br>\n<br>\n",
						   "PUZ-PRE v3 "+pzprversion+"<br>\n<br>\nPUZ-PRE v3 id made by happa.<br>\nThis script use jQuery1.3.2, uuCanvas1.0, <br>Google Gears as libraries.<br>\n<br>\n");
	}
};

//---------------------------------------------------------------------------
// ��Properties�N���X �ݒ�l�̒l�Ȃǂ�ێ�����
//---------------------------------------------------------------------------
SSData = function(){
	this.id     = '';
	this.type   = 0;
	this.val    = 1;
	this.parent = 1;
	this.child  = [];

	this.str    = { ja: new Caption(), en: new Caption()};
	//this.func   = null;
};
Properties = function(){
	this.flags    = new Array();	// �T�u���j���[���ڂ̏��(SSData�N���X�̃I�u�W�F�N�g�̔z��ɂȂ�)
	this.flaglist = new Array();	// idname�̔z��
};
Properties.prototype = {
	reset : function(){
		this.flags    = new Array();
		this.flaglist = new Array();
	},

	// pp.setMenuStr() �Ǘ��p�l���ƑI���^/�`�F�b�N�^�T�u���j���[�ɕ\�����镶�����ݒ肷��
	addSmenuToFlags : function(idname, parent)       { this.addToFlags(idname, parent, 0, 0);},
	addCheckToFlags : function(idname, parent, first){ this.addToFlags(idname, parent, 2, first);},
	addCaptionToFlags     : function(idname, parent) { this.addToFlags(idname, parent, 3, 0);},
	addSeparatorToFlags   : function(idname, parent) { this.addToFlags(idname, parent, 5, 0);},
	addUseToFlags   : function(idname, parent, first, child){
		this.addToFlags(idname, parent, 1, first);
		this.flags[idname].child = child;
	},
	addUseChildrenToFlags : function(idname, parent){
		if(!this.flags[idname]){ return;}
		for(var i=0;i<this.flags[idname].child.length;i++){
			var num = this.flags[idname].child[i];
			this.addToFlags(""+idname+"_"+num, parent, 4, num);
		}
	},
	addToFlags : function(idname, parent, type, first){
		this.flags[idname] = new SSData();
		this.flags[idname].id     = idname;
		this.flags[idname].type   = type;
		this.flags[idname].val    = first;
		this.flags[idname].parent = parent;
		this.flaglist.push(idname);
	},

	setMenuStr : function(idname, strJP, strEN){
		if(!this.flags[idname]){ return;}
		this.flags[idname].str.ja.menu = strJP; this.flags[idname].str.en.menu = strEN;
	},
	setLabel : function(idname, strJP, strEN){
		if(!this.flags[idname]){ return;}
		this.flags[idname].str.ja.label = strJP; this.flags[idname].str.en.label = strEN;
	},

	//---------------------------------------------------------------------------
	// pp.getMenuStr() �Ǘ��p�l���ƑI���^/�`�F�b�N�^�T�u���j���[�ɕ\�����镶�����Ԃ�
	// pp.getLabel()   �Ǘ��p�l���ƃ`�F�b�N�^�T�u���j���[�ɕ\�����镶�����Ԃ�
	// pp.type()       �ݒ�l�̃T�u���j���[�^�C�v��Ԃ�
	// pp.getVal()     �e�t���O��val�̒l��Ԃ�
	// pp.setVal()     �e�t���O�̐ݒ�l��ݒ肷��
	//---------------------------------------------------------------------------
	getMenuStr : function(idname){ return this.flags[idname].str[lang.language].menu; },
	getLabel   : function(idname){ return this.flags[idname].str[lang.language].label;},
	type : function(idname){ return this.flags[idname].type;},

	getVal : function(idname)  { return this.flags[idname]?this.flags[idname].val:0;},
	setVal : function(idname, newval){
		if(!this.flags[idname]){ return;}
		else if(this.type(idname)==1 || this.type(idname)==2){
			this.flags[idname].val = newval;
			menu.setdisplay(idname);
			if(this.funcs[idname]){ this.funcs[idname](newval);}
		}
	},

	//---------------------------------------------------------------------------
	// pp.setDefaultFlags()  �ݒ�l��o�^����
	// pp.setStringToFlags() �ݒ�l�ɕ������o�^����
	//---------------------------------------------------------------------------
	setDefaultFlags : function(){
		var as = this.addSmenuToFlags.bind(this),
			au = this.addUseToFlags.bind(this),
			ac = this.addCheckToFlags.bind(this),
			aa = this.addCaptionToFlags.bind(this),
			ai = this.addUseChildrenToFlags.bind(this),
			ap = this.addSeparatorToFlags.bind(this);

		au('mode','setting',k.mode,[1,3]);

		puz.menufix();	// �e�p�Y�����Ƃ̃��j���[�ǉ�

		ac('autocheck','setting',k.autocheck);
		ac('lrcheck','setting',false);
		ac('keypopup','setting',kp.defaultdisp);
		au('language','setting',0,[0,1]);
		if(k.callmode=="pplay"){ delete this.flags['mode'];}
		if(!kp.ctl[1].enable && !kp.ctl[3].enable){ delete this.flags['keypopup'];}

		as('newboard', 'file');
		as('urlinput', 'file');
		as('urloutput', 'file');
		ap('sep_2','file');
		as('fileopen', 'file');
		as('filesave', 'file');
		as('database', 'file');
		ap('sep_3','file');
		as('fileopen2', 'file');
		as('filesave2', 'file');
		if(fio.DBtype==0){ delete this.flags['database'];}
		if(!k.isKanpenExist || (k.puzzleid=="nanro"||k.puzzleid=="ayeheya"||k.puzzleid=="kurochute")){
			delete this.flags['fileopen2']; delete this.flags['filesave2']; delete this.flags['sep_3'];
		}

		as('adjust', 'edit');
		as('turn', 'edit');

		au('size','disp',k.widthmode,[0,1,2,3,4]);
		ap('sep_4','disp');
		ac('irowake','disp',(k.irowake==2?true:false));
		ap('sep_5','disp');
		as('manarea', 'disp');
		if(k.irowake==0){ delete this.flags['irowake']; delete this.flags['sep_4'];}

		as('dispsize', 'size');
		aa('cap_dispmode', 'size');
		ai('size','size');

		ai('mode','mode');

		ai('language','language');

		as('credit', 'other');
		aa('cap_others1', 'other');
		as('jumpv3', 'other');
		as('jumptop', 'other');
		as('jumpblog', 'other');

		this.setStringToFlags();
	},
	setStringToFlags : function(){
		var sm = this.setMenuStr.bind(this),
			sl = this.setLabel.bind(this);

		sm('size', '�\���T�C�Y', 'Cell Size');
		sm('size_0', '�T�C�Y �ɏ�', 'Ex Small');
		sm('size_1', '�T�C�Y ��', 'Small');
		sm('size_2', '�T�C�Y �W��', 'Normal');
		sm('size_3', '�T�C�Y ��', 'Large');
		sm('size_4', '�T�C�Y ����', 'Ex Large');

		sm('irowake', '���̐F����', 'Color coding');
		sl('irowake', '���̐F����������', 'Color each lines');

		sm('mode', '���[�h', 'mode');
		sl('mode', '���[�h', 'mode');
		sm('mode_1', '���쐬���[�h', 'Edit mode');
		sm('mode_3', '�񓚃��[�h', 'Answer mode');

		sm('autocheck', '������������', 'Auto Answer Check');

		sm('lrcheck', '�}�E�X���E���]', 'Mouse button inversion');
		sl('lrcheck', '�}�E�X�̍��E�{�^���𔽓]����', 'Invert button of the mouse');

		sm('keypopup', '�p�l������', 'Panel inputting');
		sl('keypopup', '�����E�L�����p�l���œ��͂���', 'Input numbers by panel');

		sm('language', '����', 'Language');
		sm('language_0', '���{��', '���{��');
		sm('language_1', 'English', 'English');

		sm('newboard', '�V�K�쐬', 'New Board');
		sm('urlinput', 'URL����', 'Import from URL');
		sm('urloutput', 'URL�o��', 'Export URL');
		sm('fileopen', '�t�@�C�����J��', 'Open the file');
		sm('filesave', '�t�@�C���ۑ�', 'Save the file as ...');
		sm('database', '�f�[�^�x�[�X�̊Ǘ�', 'Database Management');
		sm('fileopen2', 'pencilbox�̃t�@�C�����J��', 'Open the pencilbox file');
		sm('filesave2', 'pencilbox�̃t�@�C����ۑ�', 'Save the pencilbox file as ...');
		sm('adjust', '�Ֆʂ̒���', 'Adjust the Board');
		sm('turn', '���]�E��]', 'Filp/Turn the Board');
		sm('dispsize', '�T�C�Y�w��', 'Cell Size');
		sm('cap_dispmode', '&nbsp;�\�����[�h', '&nbsp;Display mode');
		sm('manarea', '�Ǘ��̈���B��', 'Hide Management Area');
		sm('credit', '�ς��Ղ�v3�ɂ���', 'About PUZ-PRE v3');
		sm('cap_others1', '&nbsp;�����N', '&nbsp;Link');
		sm('jumpv3', '�ς��Ղ�v3�̃y�[�W��', 'Jump to PUZ-PRE v3 page');
		sm('jumptop', '�A�����j�ۊǌ�TOP��', 'Jump to indi.s58.xrea.com');
		sm('jumpblog', '�͂��ϓ��L(blog)��', 'Jump to my blog');

		sm('eval', '�e�X�g�p', 'for Evaluation');
	},

//--------------------------------------------------------------------------------------------------------------
	// submenu����Ăяo�����֐�����
	funcs : {
		urlinput  : function(){ menu.pop = $("#pop1_2");},
		urloutput : function(){ menu.pop = $("#pop1_3"); document.urloutput.ta.value = "";},
		filesave  : function(){ menu.ex.filesave();},
		database  : function(){ menu.pop = $("#pop1_8"); fio.getDataTableList();},
		filesave2 : function(){ if(fio.kanpenSave){ menu.ex.filesave2();}},
		adjust    : function(){ menu.pop = $("#pop2_1");},
		turn      : function(){ menu.pop = $("#pop2_2");},
		credit    : function(){ menu.pop = $("#pop3_1");},
		jumpv3    : function(){ window.open('./', '', '');},
		jumptop   : function(){ window.open('../../', '', '');},
		jumpblog  : function(){ window.open('http://d.hatena.ne.jp/sunanekoroom/', '', '');},
		irowake   : function(){ col.irowakeClick();},
		manarea   : function(){ menu.ex.dispman();},
		autocheck : function(val){ k.autocheck = !k.autocheck;},
		mode      : function(num){ menu.ex.modechange(num);},
		size      : function(num){ k.widthmode=num; base.resize_canvas();},
		use       : function(num){ k.use =num;},
		language  : function(num){ lang.setLang({0:'ja',1:'en'}[num]);},

		newboard : function(){
			menu.pop = $("#pop1_1");
			if(k.puzzleid!="sudoku"){
				document.newboard.col.value = k.qcols;
				document.newboard.row.value = k.qrows;
			}
			k.enableKey = false;
		},
		fileopen : function(){
			document.fileform.pencilbox.value = "0";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = $("#pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		fileopen2 : function(){
			if(!fio.kanpenOpen){ return;}
			document.fileform.pencilbox.value = "1";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = $("#pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		dispsize : function(){
			menu.pop = $("#pop4_1");
			document.dispsize.cs.value = k.def_csize;
			k.enableKey = false;
		},
		keypopup : function(){
			var f = kp.ctl[k.mode].enable;
			$("#ck_keypopup").attr("disabled", f?"":"true");
			$("#cl_keypopup").css("color",f?"black":"silver");
		}
	}
};

//---------------------------------------------------------------------------
// ��MenuExec�N���X �|�b�v�A�b�v�E�B���h�E���Ń{�^���������ꂽ���̏������e���L�q����
//---------------------------------------------------------------------------

// Menu�N���X���s��
MenuExec = function(){
	this.displaymanage = true;
	this.qnumw;	// Ques==51�̉�]����]�p
	this.qnumh;	// Ques==51�̉�]����]�p
};
MenuExec.prototype = {
	//------------------------------------------------------------------------------
	// menu.ex.modechange() ���[�h�ύX���̏������s��
	//------------------------------------------------------------------------------
	modechange : function(num){
		k.mode=num;
		kc.prev = -1;
		ans.errDisp=true;
		bd.errclear();
		if(kp.ctl[1].enable || kp.ctl[3].enable){ pp.funcs.keypopup();}
		tc.setAlign();
		pc.paintAll();
	},

	//------------------------------------------------------------------------------
	// menu.ex.newboard()  �V�K�Ֆʂ��쐬����
	// menu.ex.newboard2() �T�C�Y(col�~row)�̐V�K�Ֆʂ��쐬����(���s��)
	// menu.ex.bdcnt()     border�̐���Ԃ�(newboard2()����Ă΂��)
	//------------------------------------------------------------------------------
	newboard : function(e){
		if(menu.pop){
			var col,row;
			if(k.puzzleid!="sudoku"){
				col = mf(parseInt(document.newboard.col.value));
				row = mf(parseInt(document.newboard.row.value));
			}
			else{
				if     (document.newboard.size[0].checked){ col=row= 9;}
				else if(document.newboard.size[1].checked){ col=row=16;}
				else if(document.newboard.size[2].checked){ col=row=25;}
				else if(document.newboard.size[3].checked){ col=row= 4;}
			}

			if(col>0 && row>0){ this.newboard2(col,row);}
			menu.popclose();
			base.resize_canvas();				// Canvas���X�V����
		}
	},
	newboard2 : function(col,row){
		// �����̃T�C�Y��菬�����Ȃ�delete����
		for(var n=k.qcols*k.qrows-1;n>=col*row;n--){
			if(bd.cell[n].numobj) { bd.cell[n].numobj.remove();}
			if(bd.cell[n].numobj2){ bd.cell[n].numobj2.remove();}
			delete bd.cell[n]; bd.cell.pop(); bd.cells.pop();
		}
		if(k.iscross){ for(var n=(k.qcols+1)*(k.qrows+1)-1;n>=(col+1)*(row+1);n--){
			if(bd.cross[n].numobj){ bd.cross[n].numobj.remove();}
			delete bd.cross[n]; bd.cross.pop(); bd.crosses.pop();
		}}
		if(k.isborder){ for(var n=this.bdcnt(k.qcols,k.qrows)-1;n>=this.bdcnt(col,row);n--){
			if(bd.border[n].numobj){ bd.border[n].numobj.remove();}
			delete bd.border[n]; bd.border.pop(); bd.borders.pop();
		}}
		if(k.isextendcell==1){ for(var n=k.qcols+k.qrows;n>=col+row+1;n--){
			if(bd.excell[n].numobj) { bd.excell[n].numobj.remove();}
			if(bd.excell[n].numobj2){ bd.excell[n].numobj2.remove();}
			delete bd.excell[n]; bd.excell.pop();
		}}
		else if(k.isextendcell==2){ for(var n=2*k.qcols+2*k.qrows+3;n>=2*col+2*row+4;n--){
			if(bd.excell[n].numobj) { bd.excell[n].numobj.remove();}
			if(bd.excell[n].numobj2){ bd.excell[n].numobj2.remove();}
			delete bd.excell[n]; bd.excell.pop();
		}}

		// �����̃T�C�Y���傫���Ȃ�new���s��
		for(var i=k.qcols*k.qrows;i<col*row;i++){ bd.cell.push(new Cell()); bd.cells.push(i);}
		if(k.iscross){ for(var i=(k.qcols+1)*(k.qrows+1);i<(col+1)*(row+1);i++)         { bd.cross.push(new Cross());   bd.crosses.push(i);} }
		if(k.isborder){ for(var i=this.bdcnt(k.qcols,k.qrows);i<this.bdcnt(col,row);i++){ bd.border.push(new Border()); bd.borders.push(i);} }
		if(k.isextendcell==1){ for(var i=k.qcols+k.qrows+1;i<col+row+1;i++)        { bd.excell.push(new Cell());} }
		if(k.isextendcell==2){ for(var i=2*k.qcols+2*k.qrows+4;i<2*col+2*row+4;i++){ bd.excell.push(new Cell());} }

		// �T�C�Y�̕ύX
		if(k.puzzleid=="icebarn"){
			if(bd.arrowin<k.qcols){ if(bd.arrowin>col){ bd.arrowin=col-1;} }
			else{ if(bd.arrowin>col+row){ bd.arrowin=col+row-1;} }
			if(bd.arrowout<k.qcols){ if(bd.arrowout>col){ bd.arrowout=col-1;} }
			else{ if(bd.arrowout>col+row){ bd.arrowout=col+row-1;} }
			if(bd.arrowin==bd.arrowout){ bd.arrowin--;}
		}
		if(k.puzzleid=="slalom"){
			bd.startid = 0;
			bd.hinfo.init();
		}
		tc.maxx += (col-k.qcols)*2;
		tc.maxy += (row-k.qrows)*2;
		k.qcols = col; k.qrows = row;

		// cellinit() = allclear()+setpos()���Ăяo��
		for(var i=0;i<bd.cell.length;i++){ bd.cell[i].allclear(i);}
		if(k.iscross){ for(var i=0;i<bd.cross.length;i++){ bd.cross[i].allclear(i);} }
		if(k.isborder){ for(var i=0;i<bd.border.length;i++){ bd.border[i].allclear(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<bd.excell.length;i++){ bd.excell[i].allclear();} }

		um.allerase();
		bd.setposAll();

		room.resetRarea();

		ans.reset();
	},
	bdcnt : function(col,row){ return (col-1)*row+col*(row-1)+(k.isoutsideborder==0?0:2*(col+row));},

	//------------------------------------------------------------------------------
	// menu.ex.urlinput()   URL����͂���
	// menu.ex.urloutput()  URL���o�͂���
	// menu.ex.openurl()    �u����URL���J���v�����s����
	//------------------------------------------------------------------------------
	urlinput : function(e){
		if(menu.pop){
			var type = enc.get_search(document.urlinput.ta.value);
			if(enc.uri.cols && enc.uri.rows){ this.newboard2(enc.uri.cols, enc.uri.rows);}
			enc.pzlinput(type);
			room.resetRarea();

			tm.reset();
			menu.popclose();
		}
	},
	urloutput : function(e){
		if(menu.pop){
			switch(getSrcElement(e).name){
				case "pzprv3":     enc.pzlexport(0); break;
				case "pzprapplet": enc.pzlexport(1); break;
				case "kanpen":     enc.pzlexport(2); break;
				case "pzprv3edit": enc.pzlexport(3); break;
				case "heyaapp":    enc.pzlexport(4); break;
			}
		}
	},
	openurl : function(e){
		if(menu.pop){
			if(document.urloutput.ta.value!=''){ var win = window.open(document.urloutput.ta.value, '', '');}
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.fileopen()  �t�@�C�����J��
	// menu.ex.filesave()  �t�@�C����ۑ�����
	// menu.ex.filesave2() pencilboxo�`���̃t�@�C����ۑ�����
	//------------------------------------------------------------------------------
	fileopen : function(e){
		if(menu.pop){ menu.popclose();}
		if(document.fileform.filebox.value){
			document.fileform.submit();
			document.fileform.filebox.value = "";
			tm.reset();
		}
	},
	filesave  : function(e){ fio.filesave(1);},
	filesave2 : function(e){ fio.filesave(2);},

	//------------------------------------------------------------------------------
	// menu.ex.dispsize()  Canvas�ł̃}�X�ڂ̕\���T�C�Y��ύX����
	//------------------------------------------------------------------------------
	dispsize : function(e){
		if(menu.pop){
			var csize = parseInt(document.dispsize.cs.value);

			if(csize>0){
				k.def_psize = mf(csize*(k.def_psize/k.def_csize));
				if(k.def_psize==0){ k.def_psize=1;}
				k.def_csize = mf(csize);
			}
			menu.popclose();
			base.resize_canvas();	// Canvas���X�V����
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.dispman()    �Ǘ��̈���B��/�\�����邪�����ꂽ���ɓ��삷��
	// menu.ex.dispmanstr() �Ǘ��̈���B��/�\������ɂǂ̕������\�����邩
	//------------------------------------------------------------------------------
	dispman : function(e){
		var idlist = ['expression','usepanel','checkpanel'];
		var sparatorlist = (k.callmode=="pmake")?['separator1']:['separator1','separator2'];

		if(this.displaymanage){
			for(var i=0;i<idlist.length;i++){ $("#"+idlist[i]).hide(800, base.resize_canvas.bind(base));}
			for(var i=0;i<sparatorlist.length;i++){ $("#"+sparatorlist[i]).hide();}
			if(k.irowake!=0 && menu.getVal('irowake')){ $("#btncolor2").show();}
			$("#menuboard").css('padding-bottom','0pt');
		}
		else{
			for(var i=0;i<idlist.length;i++){ $("#"+idlist[i]).show(800, base.resize_canvas.bind(base));}
			for(var i=0;i<sparatorlist.length;i++){ $("#"+sparatorlist[i]).show();}
			if(k.irowake!=0 && menu.getVal('irowake')){ $("#btncolor2").hide();}
			$("#menuboard").css('padding-bottom','8pt');
		}
		this.dispmanstr();
		this.displaymanage = !this.displaymanage;
	},
	dispmanstr : function(){
		if(this.displaymanage){ $("#ms_manarea").html(lang.isJP()?"�Ǘ��̈��\��":"Show management area");}
		else                  { $("#ms_manarea").html(lang.isJP()?"�Ǘ��̈���B��":"Hide management area");}
	},

	//------------------------------------------------------------------------------
	// menu.ex.popupadjust()  "�Ֆʂ̒���"�Ń{�^���������ꂽ���ɐU�蕪���ē�����s��
	// menu.ex.expandup() menu.ex.expanddn() menu.ex.expandlt() menu.ex.expandrt()
	// menu.ex.expand()       �Ֆʂ̊g������s����
	// menu.ex.expandborder() �Ֆʂ̊g�厞�A����V�����o�^����
	// menu.ex.reduceup() menu.ex.reducedn() menu.ex.reducelt() menu.ex.reducert()
	// menu.ex.reduce()       �Ֆʂ̏k�������s����
	// menu.ex.reduceborder() �Ֆʂ̊g�厞�A���������������Ƃ�o�^����
	//---------------------------------------------------------------------------
	popupadjust : function(e){
		if(menu.pop){
			um.newOperation(true);

			if(getSrcElement(e).name.indexOf("expand")!=-1){ um.addOpe('board', getSrcElement(e).name, 0, 0, 1);}

			var f=true;
			switch(getSrcElement(e).name){
				case "expandup": this.expandup(); break;
				case "expanddn": this.expanddn(); break;
				case "expandlt": this.expandlt(); break;
				case "expandrt": this.expandrt(); break;
				case "reduceup": um.undoonly = 1; f=this.reduceup(); um.undoonly = 0; break;
				case "reducedn": um.undoonly = 1; f=this.reducedn(); um.undoonly = 0; break;
				case "reducelt": um.undoonly = 1; f=this.reducelt(); um.undoonly = 0; break;
				case "reducert": um.undoonly = 1; f=this.reducert(); um.undoonly = 0; break;
			}

			if(f&&getSrcElement(e).name.indexOf("reduce")!=-1){ um.addOpe('board', getSrcElement(e).name, 0, 0, 1);}

			room.resetRarea();
			tc.Adjust();
			base.resize_canvas();				// Canvas���X�V����
		}
	},
	expandup : function(){ this.expand(k.qcols, 'r', 'up' ); },
	expanddn : function(){ this.expand(k.qcols, 'r', 'dn' ); },
	expandlt : function(){ this.expand(k.qrows, 'c', 'lt' ); },
	expandrt : function(){ this.expand(k.qrows, 'c', 'rt' ); },
	expand : function(number, rc, key){
		this.adjustSpecial(5,key);
		this.adjustGeneral(5,'',0,0,k.qcols-1,k.qrows-1);

		if(rc=='c'){ k.qcols++; tc.maxx+=2;}else if(rc=='r'){ k.qrows++; tc.maxy+=2;}

		var tf = ((key=='up'||key=='lt')?1:-1);
		var func;
		if     (rc=='r'){ func = function(cx,cy){ var ty=(k.qrows-1)/2; return (ty+tf*(cy-ty)==0);};}
		else if(rc=='c'){ func = function(cx,cy){ var tx=(k.qcols-1)/2; return (tx+tf*(cx-tx)==0);};}

		var margin = number; var ncount = bd.cell.length;
		for(var i=0;i<margin;i++){ bd.cell.push(new Cell()); bd.cells.push(ncount+i);} 
		for(var i=0;i<bd.cell.length;i++){ bd.setposCell(i);}
		for(var i=bd.cell.length-1;i>=0;i--){
			if(i-margin<0 || func(bd.cell[i].cx, bd.cell[i].cy)){
				bd.cell[i] = new Cell(); bd.cell[i].cellinit(i); margin--;
			}
			else if(margin>0){ bd.cell[i] = bd.cell[i-margin];}
			if(margin==0){ break;}
		}
		if(k.iscross){
			var func2, oc = k.isoutsidecross?0:1;
			if     (rc=='r'){ func2 = function(cx,cy){ var ty=k.qrows/2; return (ty+tf*(cy-ty)==oc);};}
			else if(rc=='c'){ func2 = function(cx,cy){ var tx=k.qcols/2; return (tx+tf*(cx-tx)==oc);};}

			margin = number+1; ncount = bd.cross.length;
			for(var i=0;i<margin;i++){ bd.cross.push(new Cross()); bd.crosses.push(ncount+i);} 
			for(var i=0;i<bd.cross.length;i++){ bd.setposCross(i);}
			for(var i=bd.cross.length-1;i>=0;i--){
				if(i-margin<0 || func2(bd.cross[i].cx, bd.cross[i].cy)){
					bd.cross[i] = new Cross(); bd.cross[i].cellinit(i); margin--;
				}
				else if(margin>0){ bd.cross[i] = bd.cross[i-margin];}
				if(margin==0){ break;}
			}
		}
		if(k.isborder){
			var func2;
			if     (rc=='r'){ func2 = function(cx,cy){ var h=k.qrows+tf*(cy-k.qrows); return (h==1||h==2);};}
			else if(rc=='c'){ func2 = function(cx,cy){ var w=k.qcols+tf*(cx-k.qcols); return (w==1||w==2);};}

			bd.bdinside = (k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);
			margin = 2*number-1+(k.isoutsideborder==0?0:2); ncount = bd.border.length;
			for(var i=0;i<margin;i++){ bd.border.push(new Border()); bd.borders.push(ncount+i);} 
			for(var i=0;i<bd.border.length;i++){ bd.setposBorder(i);}
			for(var i=bd.border.length-1;i>=0;i--){
				if(i-margin<0 || func2(bd.border[i].cx, bd.border[i].cy)){
					bd.border[i] = new Border(); bd.border[i].cellinit(i); margin--;
				}
				else if(margin>0){ bd.border[i] = bd.border[i-margin];}
				if(margin==0){ break;}
			}
		}
		if(k.isextendcell!=0){
			margin = k.isextendcell; ncount = bd.excell.length;
			for(var i=0;i<margin;i++){ bd.excell.push(new Cell());}
			for(var i=0;i<bd.excell.length;i++){ bd.setposEXcell(i);}
			for(var i=bd.excell.length-1;i>=0;i--){
				if(i-margin<0 || func(bd.excell[i].cx, bd.excell[i].cy)){
					bd.excell[i] = new Cell(); bd.excell[i].allclear(); bd.excell[i].qnum=-1; margin--;
				}
				else if(margin>0){ bd.excell[i] = bd.excell[i-margin];}
				if(margin==0){ break;}
			}
		}

		bd.setposAll();

		// �g�厞�A���E���͑�����Ă���
		if(k.isborder && um.isenableRecord()){ this.expandborder(key);}
		this.adjustSpecial2(5,key);
		ans.resetLcount();
	},
	expandborder : function(key){
		if(k.puzzleid=='icebarn'||k.puzzleid=='minarism'){ return;}
		for(var i=0;i<bd.border.length;i++){
			var source = -1;
			if(k.isborderAsLine==0){
				if     (key=='up' && bd.border[i].cy==1          ){ source = bd.bnum(bd.border[i].cx, 3          );}
				else if(key=='dn' && bd.border[i].cy==2*k.qrows-1){ source = bd.bnum(bd.border[i].cx, 2*k.qrows-3);}
				else if(key=='lt' && bd.border[i].cx==1          ){ source = bd.bnum(3,           bd.border[i].cy);}
				else if(key=='rt' && bd.border[i].cx==2*k.qcols-1){ source = bd.bnum(2*k.qcols-3, bd.border[i].cy);}

				if(source!=-1){
					bd.sQuB(i, bd.QuB(source));
					bd.sQaB(i, bd.QaB(source));
				}
			}
			else{
				if     (key=='up' && bd.border[i].cy==2          ){ source = bd.bnum(bd.border[i].cx, 0        );}
				else if(key=='dn' && bd.border[i].cy==2*k.qrows-2){ source = bd.bnum(bd.border[i].cx, 2*k.qrows);}
				else if(key=='lt' && bd.border[i].cx==2          ){ source = bd.bnum(0,         bd.border[i].cy);}
				else if(key=='rt' && bd.border[i].cx==2*k.qcols-2){ source = bd.bnum(2*k.qcols, bd.border[i].cy);}

				if(source!=-1){
					bd.sQuB(i, bd.QuB(source)); bd.sQuB(source,  0);
					bd.sQaB(i, bd.QaB(source)); bd.sQaB(source, -1);
					bd.sQsB(i, bd.QsB(source)); bd.sQsB(source,  0);
				}
			}
		}
	},

	reduceup : function(){ return this.reduce(k.qcols, 'r', 'up'); },
	reducedn : function(){ return this.reduce(k.qcols, 'r', 'dn'); },
	reducelt : function(){ return this.reduce(k.qrows, 'c', 'lt'); },
	reducert : function(){ return this.reduce(k.qrows, 'c', 'rt'); },
	reduce : function(number, rc, key){
		if((rc=='c'&&k.qcols==1)||(rc=='r'&&k.qrows==1)){ return false;}

		this.adjustSpecial(6,key);
		this.adjustGeneral(6,'',0,0,k.qcols-1,k.qrows-1);

		if(k.isborder && um.isenableRecord()){ this.reduceborder(key);}

		var tf = ((key=='up'||key=='lt')?1:-1);
		var func;
		if     (rc=='r'){ func = function(cx,cy){ var ty=(k.qrows-1)/2; return (ty+tf*(cy-ty)==0);};}
		else if(rc=='c'){ func = function(cx,cy){ var tx=(k.qcols-1)/2; return (tx+tf*(cx-tx)==0);};}
		var margin = 0;
		var qnums = new Array();

		for(var i=0;i<bd.cell.length;i++){
			if(func(bd.cell[i].cx, bd.cell[i].cy, 0)){
				if(bd.cell[i].numobj) { bd.cell[i].numobj.hide();}
				if(bd.cell[i].numobj2){ bd.cell[i].numobj2.hide();}
				if(!bd.isNullCell(i)){ um.addOpe('cell', 'cell', i, bd.cell[i], 0);}
				if(k.isOneNumber){
					if(bd.QnC(i)!=-1){ qnums.push({ areaid:room.getRoomID(i), val:bd.QnC(i)});}
					room.cell[i] = -1;
				}
				margin++;
			}
			else if(margin>0){ bd.cell[i-margin] = bd.cell[i];}
		}
		for(var i=0;i<number;i++){ bd.cell.pop(); bd.cells.pop();}

		if(k.iscross){
			var func2, oc = k.isoutsidecross?0:1;
			if     (rc=='r'){ func2 = function(cx,cy){ var ty=k.qrows/2; return (ty+tf*(cy-ty)==oc);};}
			else if(rc=='c'){ func2 = function(cx,cy){ var tx=k.qcols/2; return (tx+tf*(cx-tx)==oc);};}
			margin = 0;
			for(var i=0;i<bd.cross.length;i++){
				if(func2(bd.cross[i].cx, bd.cross[i].cy)){
					if(bd.cross[i].numobj){ bd.cross[i].numobj.hide();}
					if(!bd.isNullCross(i)){ um.addOpe('cross', 'cross', i, bd.cross[i], 0);}
					margin++;
				}
				else if(margin>0){ bd.cross[i-margin] = bd.cross[i];}
			}
			for(var i=0;i<number+1;i++){ bd.cross.pop(); bd.crosses.pop();}
		}
		if(k.isborder){
			var func2;
			if     (rc=='r'){ func2 = function(cx,cy){ var h=k.qrows+tf*(cy-k.qrows); return (h==1||h==2);};}
			else if(rc=='c'){ func2 = function(cx,cy){ var w=k.qcols+tf*(cx-k.qcols); return (w==1||w==2);};}
			bd.bdinside = (k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);
			margin = 0;
			for(var i=0;i<bd.border.length;i++){
				if(func2(bd.border[i].cx, bd.border[i].cy)){
					if(bd.border[i].numobj){ bd.border[i].numobj.hide();}
					if(!bd.isNullBorder(i)){ um.addOpe('border', 'border', i, bd.border[i], 0);}
					margin++;
				}
				else if(margin>0){ bd.border[i-margin] = bd.border[i];}
			}
			for(var i=0;i<2*number-1+(k.isoutsideborder==0?0:2);i++){ bd.border.pop(); bd.borders.pop();}
		}
		if(k.isextendcell!=0){
			margin = 0;
			for(var i=0;i<bd.excell.length;i++){
				if(func(bd.excell[i].cx, bd.excell[i].cy)){
					if(bd.excell[i].numobj) { bd.excell[i].numobj.hide();}
					if(bd.excell[i].numobj2){ bd.excell[i].numobj2.hide();}
					if(!bd.isNullCell(i)){ um.addOpe('excell', 'excell', i, bd.excell[i], 0);}
					margin++;
				}
				else if(margin>0){ bd.excell[i-margin] = bd.excell[i];}
			}
			for(var i=0;i<k.isextendcell;i++){ bd.excell.pop();}
		}

		if(rc=='c'){ k.qcols--; tc.maxx-=2;}else if(rc=='r'){ k.qrows--; tc.maxy-=2;}

		bd.setposAll();
		if(k.isOneNumber){
			room.resetRarea();
			for(var i=0;i<qnums.length;i++){ bd.sQnC(room.getTopOfRoom(qnums[i].areaid), qnums[i].val);}
		}
		this.adjustSpecial2(6,key);
		ans.resetLcount();
		return true;
	},
	reduceborder : function(key){
		for(var i=0;i<bd.border.length;i++){
			var source = -1;
			if(k.isborderAsLine==1){
				if     (key=='up' && bd.border[i].cy==0        ){ source = bd.bnum(bd.border[i].cx, 2          );}
				else if(key=='dn' && bd.border[i].cy==2*k.qrows){ source = bd.bnum(bd.border[i].cx, 2*k.qrows-2);}
				else if(key=='lt' && bd.border[i].cx==0        ){ source = bd.bnum(2,           bd.border[i].cy);}
				else if(key=='rt' && bd.border[i].cx==2*k.qcols){ source = bd.bnum(2*k.qcols-2, bd.border[i].cy);}

				if(source!=-1){
					bd.sQuB(i, bd.QuB(source)); bd.sQuB(source,  0);
					bd.sQaB(i, bd.QaB(source)); bd.sQaB(source, -1);
					bd.sQsB(i, bd.QsB(source)); bd.sQsB(source, -1);
				}
			}
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.popupflip()   "��]�E���]"�Ń{�^���������ꂽ���̓�����w�肷��
	// menu.ex.flipy()       �㉺���]�����s����
	// menu.ex.flipx()       ���E���]�����s����
	// menu.ex.turnr()       �E90����]�����s����
	// menu.ex.turnl()       ��90����]�����s����
	// menu.ex.turn2()       turnr(),turnl()��������I�ɌĂ΂���]���s��
	//------------------------------------------------------------------------------
	popupflip : function(e){
		if(menu.pop){
			um.newOperation(true);

			switch(getSrcElement(e).name){
				case "turnl": this.turnl(0,0,k.qcols-1,k.qrows-1); break;
				case "turnr": this.turnr(0,0,k.qcols-1,k.qrows-1); break;
				case "flipy": this.flipy(0,0,k.qcols-1,k.qrows-1); break;
				case "flipx": this.flipx(0,0,k.qcols-1,k.qrows-1); break;
			}

			um.addOpe('board', getSrcElement(e).name, 0, 0, 1);

			tc.Adjust();
			room.resetRarea();
			base.resize_canvas();				// Canvas���X�V����
		}
	},
	// ��]�E���](�㉺���])
	flipy : function(rx1,ry1,rx2,ry2){
		this.adjustSpecial(1,'');
		this.adjustGeneral(1,'',rx1,ry1,rx2,ry2);

		for(var cy=ry1;cy<(ry2+ry1)/2;cy++){
			for(var cx=rx1;cx<=rx2;cx++){
				var c = bd.cell[bd.cnum(cx,cy)];
				bd.cell[bd.cnum(cx,cy)] = bd.cell[bd.cnum(cx,(ry1+ry2)-cy)];
				bd.cell[bd.cnum(cx,(ry1+ry2)-cy)] = c;
			}
		}
		if(k.iscross){
			for(var cy=ry1;cy<(ry2+ry1+1)/2;cy++){
				for(var cx=rx1;cx<=rx2+1;cx++){
					var c = bd.cross[bd.xnum(cx,cy)];
					bd.cross[bd.xnum(cx,cy)] = bd.cross[bd.xnum(cx,(ry1+ry2+1)-cy)];
					bd.cross[bd.xnum(cx,(ry1+ry2+1)-cy)] = c;
				}
			}
		}
		if(k.isborder){
			for(var cy=ry1*2;cy<(ry2+ry1)*2/2+1;cy++){
				for(var cx=rx1*2;cx<=(rx2+1)*2;cx++){
					if(bd.bnum(cx,cy)==-1){ continue;}
					var c = bd.border[bd.bnum(cx,cy)];
					bd.border[bd.bnum(cx,cy)] = bd.border[bd.bnum(cx,(ry1+ry2+1)*2-cy)];
					bd.border[bd.bnum(cx,(ry1+ry2+1)*2-cy)] = c;
				}
			}
		}
		if(k.isextendcell==1){
			for(var cy=ry1;cy<(ry2+ry1)/2;cy++){
				var c = bd.excell[bd.exnum(-1,cy)];
				bd.excell[bd.exnum(-1,cy)] = bd.excell[bd.exnum(-1,(ry1+ry2)-cy)];
				bd.excell[bd.exnum(-1,(ry1+ry2)-cy)] = c;
			}
		}
		else if(k.isextendcell==2){
			for(var cy=ry1-1;cy<(ry2+ry1)/2;cy++){
				for(var cx=rx1-1;cx<=rx2+1;cx++){
					if(bd.exnum(cx,cy)==-1){ continue;}
					var c = bd.excell[bd.exnum(cx,cy)];
					bd.excell[bd.exnum(cx,cy)] = bd.excell[bd.exnum(cx,(ry1+ry2)-cy)];
					bd.excell[bd.exnum(cx,(ry1+ry2)-cy)] = c;
				}
			}
		}

		bd.setposAll();
		this.adjustSpecial2(1,'');
		ans.resetLcount();
	},
	// ��]�E���](���E���])
	flipx : function(rx1,ry1,rx2,ry2){
		this.adjustSpecial(2,'');
		this.adjustGeneral(2,'',rx1,ry1,rx2,ry2);

		for(var cx=rx1;cx<(rx2+rx1)/2;cx++){
			for(var cy=ry1;cy<=ry2;cy++){
				var c = bd.cell[bd.cnum(cx,cy)];
				bd.cell[bd.cnum(cx,cy)] = bd.cell[bd.cnum((rx1+rx2)-cx,cy)];
				bd.cell[bd.cnum((rx1+rx2)-cx,cy)] = c;
			}
		}
		if(k.iscross){
			for(var cx=rx1;cx<(rx2+rx1+1)/2;cx++){
				for(var cy=ry1;cy<=ry2+1;cy++){
					var c = bd.cross[bd.xnum(cx,cy)];
					bd.cross[bd.xnum(cx,cy)] = bd.cross[bd.xnum((rx1+rx2+1)-cx,cy)];
					bd.cross[bd.xnum((rx1+rx2+1)-cx,cy)] = c;
				}
			}
		}
		if(k.isborder){
			for(var cx=rx1*2;cx<(rx2+rx1)*2/2+1;cx++){
				for(var cy=ry1*2;cy<=(ry2+1)*2;cy++){
					if(bd.bnum(cx,cy)==-1){ continue;}
					var c = bd.border[bd.bnum(cx,cy)];
					bd.border[bd.bnum(cx,cy)] = bd.border[bd.bnum((rx1+rx2+1)*2-cx,cy)];
					bd.border[bd.bnum((rx1+rx2+1)*2-cx,cy)] = c;
				}
			}
		}
		if(k.isextendcell==1){
			for(var cx=rx1;cx<(rx2+rx1)/2;cx++){
				var c = bd.excell[bd.exnum(cx,-1)];
				bd.excell[bd.exnum(cx,-1)] = bd.excell[bd.exnum((rx1+rx2)-cx,-1)];
				bd.excell[bd.exnum((rx1+rx2)-cx,-1)] = c;
			}
		}
		else if(k.isextendcell==2){
			for(var cx=rx1-1;cx<(rx2+rx1)/2;cx++){
				for(var cy=ry1-1;cy<=ry2+1;cy++){
					if(bd.exnum(cx,cy)==-1){ continue;}
					var c = bd.excell[bd.exnum(cx,cy)];
					bd.excell[bd.exnum(cx,cy)] = bd.excell[bd.exnum((rx1+rx2)-cx,cy)];
					bd.excell[bd.exnum((rx1+rx2)-cx,cy)] = c;
				}
			}
		}

		bd.setposAll();
		this.adjustSpecial2(2,'');
		ans.resetLcount();
	},
	// ��]�E���](�E90����])
	turnr : function(rx1,ry1,rx2,ry2){ this.turn2(rx1,ry1,rx2,ry2,1); },
	// ��]�E���](��90����])
	turnl : function(rx1,ry1,rx2,ry2){ this.turn2(rx1,ry1,rx2,ry2,2); },
	turn2 : function(rx1,ry1,rx2,ry2,f){
		this.adjustSpecial(f+2,'');
		this.adjustGeneral(f+2,'',rx1,ry1,rx2,ry2);

		var tmp = k.qcols; k.qcols = k.qrows; k.qrows = tmp;
		tmp = tc.maxx; tc.maxx = tc.maxy; tc.maxy = tmp;

		bd.setposAll();

		var cnt = k.qcols*k.qrows;
		var ch = new Array(); for(var i=0;i<cnt;i++){ ch[i]=1;}
		while(cnt>0){
			var tmp, source, prev, target, nex;
			for(source=0;source<k.qcols*k.qrows;source++){ if(ch[source]==1){ break;}}
			tmp = bd.cell[source]; target = source;
			while(true){
//				alert(""+(bd.cell[target].cy)+" "+(bd.cell[target].cx));
				if(f==1){ nex = bd.cnum2(bd.cell[target].cy, (ry2+ry1)-bd.cell[target].cx, k.qrows, k.qcols);}
				else{ nex = bd.cnum2((rx2+rx1)-bd.cell[target].cy, bd.cell[target].cx, k.qrows, k.qcols);}
				if(nex==source){ break;}
				bd.cell[target] = bd.cell[nex]; ch[target]=0; cnt--; target = nex;
			}
			bd.cell[target] = tmp; ch[target]=0; cnt--; 
		}
		if(k.iscross){
			cnt = (k.qcols+1)*(k.qrows+1);
			ch = new Array(); for(var i=0;i<cnt;i++){ ch[i]=1;}
			while(cnt>0){
				var tmp, source, prev, target, nex;
				for(source=0;source<(k.qcols+1)*(k.qrows+1);source++){ if(ch[source]==1){ break;}}
				tmp = bd.cross[source]; target = source;
				while(true){
					nex = bd.xnum2(bd.cross[target].cy, (ry2+ry1+1)-bd.cross[target].cx, k.qrows, k.qcols);
					if(f==1){ nex = bd.xnum2(bd.cross[target].cy, (ry2+ry1+1)-bd.cross[target].cx, k.qrows, k.qcols);}
					else{ nex = bd.xnum2((rx2+rx1+1)-bd.cross[target].cy, bd.cross[target].cx, k.qrows, k.qcols);}
					if(nex==source){ break;}
					bd.cross[target] = bd.cross[nex]; ch[target]=0; cnt--; target = nex;
				}
				bd.cross[target] = tmp; ch[target]=0; cnt--; 
			}
		}
		if(k.isborder){
			cnt = bd.bdinside+(k.isoutsideborder==0?0:2*(k.qcols+k.qrows));
			ch = new Array(); for(var i=0;i<cnt;i++){ ch[i]=1;}
			while(cnt>0){
				var tmp, source, prev, target, nex;
				for(source=0;source<bd.bdinside+(k.isoutsideborder==0?0:2*(k.qcols+k.qrows));source++){ if(ch[source]==1){ break;}}
				tmp = bd.border[source]; target = source;
				while(true){
					nex = bd.bnum2(bd.border[target].cy, (ry2+ry1+1)*2-bd.border[target].cx, k.qrows, k.qcols);
					if(f==1){ nex = bd.bnum2(bd.border[target].cy, (ry2+ry1+1)*2-bd.border[target].cx, k.qrows, k.qcols);}
					else{ nex = bd.bnum2((rx2+rx1+1)*2-bd.border[target].cy, bd.border[target].cx, k.qrows, k.qcols);}
					if(nex==source){ break;}
					bd.border[target] = bd.border[nex]; ch[target]=0; cnt--; target = nex;
				}
				bd.border[target] = tmp; ch[target]=0; cnt--;
			}
		}
		if(k.isextendcell==2){
			cnt = 2*(k.qcols+k.qrows)+4;
			ch = new Array(); for(var i=0;i<cnt;i++){ ch[i]=1;}
			while(cnt>0){
				var tmp, source, prev, target, nex;
				for(source=0;source<2*(k.qcols+k.qrows)+4;source++){ if(ch[source]==1){ break;}}
				tmp = bd.excell[source]; target = source;
				while(true){
					if(f==1){ nex = bd.exnum2(bd.excell[target].cy, (ry2+ry1)-bd.excell[target].cx, k.qrows, k.qcols);}
					else{ nex = bd.exnum2((rx2+rx1)-bd.excell[target].cy, bd.excell[target].cx, k.qrows, k.qcols);}
					if(nex==source){ break;}
					bd.excell[target] = bd.excell[nex]; ch[target]=0; cnt--; target = nex;
				}
				bd.excell[target] = tmp; ch[target]=0; cnt--; 
			}
		}

		bd.setposAll();
		this.adjustSpecial2(f+2,'');
		ans.resetLcount();
	},

	//------------------------------------------------------------------------------
	// menu.ex.adjustGeneral()  ��]�E���]���Ɋe�Z���̒��߂��s��(���ʏ���)
	// menu.ex.adjustSpecial()  ��]�E���]�E�Ֆʒ��ߊJ�n�O�Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustSpecial2() ��]�E���]�E�Ֆʒ��ߏI����Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustQues51_1() [�_]�Z���̒���(adjustSpecial�֐��ɑ������p)
	// menu.ex.adjustQues51_2() [�_]�Z���̒���(adjustSpecial2�֐��ɑ������p)
	//------------------------------------------------------------------------------

	adjustGeneral : function(type,key,rx1,ry1,rx2,ry2){
		um.disableRecord();
		for(var cy=ry1;cy<=ry2;cy++){
			for(var cx=rx1;cx<=rx2;cx++){
				var c = bd.cnum(cx,cy);

				switch(type){
				case 1: // �㉺���]
					if(true){
						var val = ({2:5,3:4,4:3,5:2,104:107,105:106,106:105,107:104})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!=1){
						var val = ({1:2,2:1})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 2: // ���E���]
					if(true){
						var val = ({2:3,3:2,4:5,5:4,104:105,105:104,106:107,107:106})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!=1){
						var val = ({3:4,4:3})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 3: // �E90�����]
					if(true){
						var val = {2:5,3:2,4:3,5:4,21:22,22:21,102:103,103:102,104:107,105:104,106:105,107:106}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!=1){
						var val = {1:4,2:3,3:1,4:2}[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 4: // ��90�����]
					if(true){
						var val = {2:3,3:4,4:5,5:2,21:22,22:21,102:103,103:102,104:105,105:106,106:107,107:104}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!=1){
						var val = {1:3,2:4,3:2,4:1}[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 5: // �Ֆʊg��
					break;
				case 6: // �Ֆʏk��
					break;
				}
			}
		}
		um.enableRecord();
	},
	adjustQues51_1 : function(type,key){
		this.qnumw = new Array();
		this.qnumh = new Array();

		for(var cy=0;cy<=k.qrows-1;cy++){
			this.qnumw[cy] = [bd.QnE(bd.exnum(-1,cy))];
			for(var cx=0;cx<=k.qcols-1;cx++){
				if(bd.QuC(bd.cnum(cx,cy))==51){ this.qnumw[cy].push(bd.QnC(bd.cnum(cx,cy)));}
			}
		}
		for(var cx=0;cx<=k.qcols-1;cx++){
			this.qnumh[cx] = [bd.DiE(bd.exnum(cx,-1))];
			for(var cy=0;cy<=k.qrows-1;cy++){
				if(bd.QuC(bd.cnum(cx,cy))==51){ this.qnumh[cx].push(bd.DiC(bd.cnum(cx,cy)));}
			}
		}
	},
	adjustQues51_2 : function(type,key){
		um.disableRecord();
		var idx;
		switch(type){
		case 1: // �㉺���]
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1; this.qnumh[cx] = this.qnumh[cx].reverse();
				bd.sDiE(bd.exnum(cx,-1), this.qnumh[cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))==51){ bd.sDiC(bd.cnum(cx,cy), this.qnumh[cx][idx]); idx++;}
				}
			}
			break;
		case 2: // ���E���]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1; this.qnumw[cy] = this.qnumw[cy].reverse();
				bd.sQnE(bd.exnum(-1,cy), this.qnumw[cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))==51){ bd.sQnC(bd.cnum(cx,cy), this.qnumw[cy][idx]); idx++;}
				}
			}
			break;
		case 3: // �E90�����]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1; this.qnumh[cy] = this.qnumh[cy].reverse();
				bd.sQnE(bd.exnum(-1,cy), this.qnumh[cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))==51){ bd.sQnC(bd.cnum(cx,cy), this.qnumh[cy][idx]); idx++;}
				}
			}
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1;
				bd.sDiE(bd.exnum(cx,-1), this.qnumw[k.qcols-1-cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))==51){ bd.sDiC(bd.cnum(cx,cy), this.qnumw[k.qcols-1-cx][idx]); idx++;}
				}
			}
			break;
		case 4: // ��90�����]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1;
				bd.sQnE(bd.exnum(-1,cy), this.qnumh[k.qrows-1-cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))==51){ bd.sQnC(bd.cnum(cx,cy), this.qnumh[k.qrows-1-cy][idx]); idx++;}
				}
			}
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1; this.qnumw[cx] = this.qnumw[cx].reverse();
				bd.sDiE(bd.exnum(cx,-1), this.qnumw[cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))==51){ bd.sDiC(bd.cnum(cx,cy), this.qnumw[cx][idx]); idx++;}
				}
			}
			break;
		}
		um.enableRecord();
	},
	adjustSpecial  : function(type,key){ },
	adjustSpecial2 : function(type,key){ },

	//------------------------------------------------------------------------------
	// menu.ex.ACconfirm()  �u�񓚏����v�{�^�����������Ƃ��̏���
	// menu.ex.ASconfirm()  �u�⏕�����v�{�^�����������Ƃ��̏���
	//------------------------------------------------------------------------------
	ACconfirm : function(){
		if(confirm(lang.isJP()?"�񓚂��������܂����H":"Do you want to erase the Answer?")){
			um.newOperation(true);
			for(var i=0;i<bd.cell.length;i++){
				if(bd.QaC(i)!=0){ um.addOpe('cell','qans',i,bd.QaC(i),0);}
				if(bd.QsC(i)!=0){ um.addOpe('cell','qsub',i,bd.QsC(i),0);}
			}
			if(k.isborder){
				var val = (k.puzzleid!="bosanowa"?0:-1);
				for(var i=0;i<bd.border.length;i++){
					if(bd.QaB(i)!=0){ um.addOpe('border','qans',i,bd.QaB(i),0);}
					if(bd.QsB(i)!=val){ um.addOpe('border','qsub',i,bd.QsB(i),val);}
					if(bd.LiB(i)!=0){ um.addOpe('border','line',i,bd.LiB(i),0);}
				}
			}
			if(!g.vml){ pc.flushCanvasAll();}
			bd.ansclear();
		}
	},
	ASconfirm : function(){
		if(confirm(lang.isJP()?"�⏕�L�����������܂����H":"Do you want to erase the auxiliary marks?")){
			um.newOperation(true);
			for(var i=0;i<bd.cell.length;i++){
				if(bd.QsC(i)!=0){ um.addOpe('cell','qsub',i,bd.QsC(i),0);}
			}
			if(k.isborder){
				var val = (k.puzzleid!="bosanowa"?0:-1);
				for(var i=0;i<bd.border.length;i++){
					if(bd.QsB(i)!=val){ um.addOpe('border','qsub',i,bd.QsB(i),val);}
				}
			}
			if(!g.vml){ pc.flushCanvasAll();}
			bd.subclear();
		}
	}
};

//---------------------------------------------------------------------------
// ��Colors�N���X ��ɐF�����̏����Ǘ�����
//---------------------------------------------------------------------------
// Colors�N���X�̒�`
Colors = function(){
	this.lastHdeg = 0;
	this.lastYdeg = 0;
	this.minYdeg = 0.18;
	this.maxYdeg = 0.70;
};
Colors.prototype = {
	//---------------------------------------------------------------------------
	// col.getNewLineColor() �V�����F��Ԃ�
	//---------------------------------------------------------------------------
	getNewLineColor : function(){
		while(1){
			var Rdeg = mf(Math.random() * 384)-64; if(Rdeg<0){Rdeg=0;} if(Rdeg>255){Rdeg=255;}
			var Gdeg = mf(Math.random() * 384)-64; if(Gdeg<0){Gdeg=0;} if(Gdeg>255){Gdeg=255;}
			var Bdeg = mf(Math.random() * 384)-64; if(Bdeg<0){Bdeg=0;} if(Bdeg>255){Bdeg=255;}

			// HLS�̊e�g���l�����߂�
			var Cmax = Math.max(Rdeg,Math.max(Gdeg,Bdeg));
			var Cmin = Math.min(Rdeg,Math.min(Gdeg,Bdeg));

			var Hdeg = 0;
			var Ldeg = (Cmax+Cmin)*0.5 / 255;
			var Sdeg = (Cmax==Cmin?0:(Cmax-Cmin)/((Ldeg<=0.5)?(Cmax+Cmin):(2*255-Cmax-Cmin)) );

			if(Cmax==Cmin){ Hdeg = 0;}
			else if(Rdeg>=Gdeg && Rdeg>=Bdeg){ Hdeg = (    60*(Gdeg-Bdeg)/(Cmax-Cmin)+360)%360;}
			else if(Gdeg>=Rdeg && Gdeg>=Bdeg){ Hdeg = (120+60*(Bdeg-Rdeg)/(Cmax-Cmin)+360)%360;}
			else if(Bdeg>=Gdeg && Bdeg>=Rdeg){ Hdeg = (240+60*(Rdeg-Gdeg)/(Cmax-Cmin)+360)%360;}

			// YCbCr��Y�����߂�
			var Ydeg = (0.29891*Rdeg + 0.58661*Gdeg + 0.11448*Bdeg) / 255;

			if( (this.minYdeg<Ydeg && Ydeg<this.maxYdeg) && (Math.abs(this.lastYdeg-Ydeg)>0.15) && (Sdeg<0.02 || 0.40<Sdeg)
				 && (((360+this.lastHdeg-Hdeg)%360>=45)&&((360+this.lastHdeg-Hdeg)%360<=315)) ){
				this.lastHdeg = Hdeg;
				this.lastYdeg = Ydeg;
				//alert("rgb("+Rdeg+", "+Gdeg+", "+Bdeg+")\nHLS("+mf(Hdeg)+", "+(""+mf(Ldeg*1000)*0.001).slice(0,5)+", "+(""+mf(Sdeg*1000)*0.001).slice(0,5)+")\nY("+(""+mf(Ydeg*1000)*0.001).slice(0,5)+")");
				return "rgb("+Rdeg+","+Gdeg+","+Bdeg+")";
			}
		}
	},

	//---------------------------------------------------------------------------
	// col.setLineColor()  ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����
	// col.setLineColor1() ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����(������������)
	// col.setLineColor2() ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����(������������)
	//---------------------------------------------------------------------------
	setLineColor : function(id, val){
		if(k.br.IE && !menu.getVal('irowake')){ return;}

		if(!k.isborderCross){ this.setColor1(id,val); return;}

		var cc1, cc2;
		if(k.isborderAsLine==0){ cc1 = bd.cc1(id);      cc2 = bd.cc2(id);     }
		else                   { cc1 = bd.crosscc1(id); cc2 = bd.crosscc2(id);}

		if(val==1){ this.setLineColor1(id,cc1,cc2);}
		else      { this.setLineColor2(id,cc1,cc2);}
	},
	setLineColor1 : function(id, cc1, cc2){
		var setc = "";
		if(cc1!=-1 && bd.backLine(id)!=-1){
			if(this.lcntCell(cc1)!=3){
				setc = bd.border[bd.backLine(id)].color;
			}
			else{
				setc = bd.border[bd.backLine(id)].color;
				this.changeColors(bd.backLine(id), id, setc);
				if(!ans.isConnectLine(this.tshapeid(cc1),id,-1)){ this.changeColors(this.tshapeid(cc1), -1, this.getNewLineColor());}
			}
		}
		if(cc2!=-1 && bd.nextLine(id)!=-1){
			if(this.lcntCell(cc2)!=3){
				if(!setc){ setc = bd.border[bd.nextLine(id)].color;}
				else{ this.changeColors(bd.nextLine(id), id, setc);}
			}
			else{
				if(!setc){ setc = bd.border[bd.nextLine(id)].color;}
				this.changeColors(bd.nextLine(id), id, setc);
				if(!ans.isConnectLine(this.tshapeid(cc2),id,-1)){ this.changeColors(this.tshapeid(cc2), -1, this.getNewLineColor());}
			}
		}

		if(!setc){ bd.border[id].color = this.getNewLineColor();}
		else{ bd.border[id].color = setc;}
	},
	setLineColor2 : function(id, cc1, cc2){
		var keeped = 0;
		var firstchange = false;
		if(cc1!=-1 && cc2!=-1){
			if(!ans.isLoopLine(id) && cc1!=-1 && (this.lcntCell(cc1)==2 || this.lcntCell(cc1)==4)){
				keeped=1;
			}
			else if(cc1!=-1 && this.lcntCell(cc1)==3 && this.tshapeid(cc1)!=id){
				this.changeColors(this.tshapeid(cc1), -1, bd.border[bd.backLine(id)].color);
				firstchange = true;
				if(!ans.isConnectLine(bd.nextLine(id), this.tshapeid(cc1), id)){ keeped=1;}
			}
			
			if(!ans.isLoopLine(id) && cc2!=-1 && (this.lcntCell(cc2)==2 || this.lcntCell(cc2)==4) && keeped==1){
				this.changeColors(bd.nextLine(id), id, this.getNewLineColor());
			}
			else if(cc2!=-1 && this.lcntCell(cc2)==3 && this.tshapeid(cc2)!=id){
				if(keeped==0){ this.changeColors(this.tshapeid(cc2), -1, bd.border[bd.nextLine(id)].color);}
				else{
					if(ans.isConnectLine(this.tshapeid(cc2),bd.nextLine(id),-1)){
						if(!ans.isConnectLine(bd.backLine(id),this.tshapeid(cc2),id)){ this.changeColors(bd.nextLine(id), -1, this.getNewLineColor());}
					}
					else{
						this.changeColors(bd.nextLine(id), -1, bd.border[this.tshapeid(cc2)].color);
						if(firstchange){ this.changeColors(this.tshapeid(cc1), -1, bd.border[bd.backLine(id)].color);}
					}
				}
			}
		}
		bd.border[id].color = "";
	},
	//---------------------------------------------------------------------------
	// col.lcntCell()     ����̐��̖{�����擾����
	// col.changeColors() startid�Ɍq�����Ă�����̐F��col�ɕς���
	// col.repaintParts() �e�p�Y���ŁA�F�ς����ɏ������������Ƃ��I�[�o�[���C�h����
	// col.changeLines()  startid�Ɍq�����Ă�����ɉ��炩�̏������s��
	// col.tshapeid()     lcnt==3�̎��A�s���H�̂Ԃ����Ă��������Line��ID��Ԃ�
	//---------------------------------------------------------------------------
	lcntCell : function(id){
		if(k.isborderAsLine==0){
			if(id==-1 || id>=bd.cell.length){ return -1;}
			return bd.lcntCell(bd.cell[id].cx,bd.cell[id].cy);
		}
		else{
			if(id==-1 || id>=(k.qcols+1)*(k.qrows+1)){ return -1;}
			return bd.lcntCross(id%(k.qcols+1), mf(id/(k.qcols+1)));
		}
	},
	changeColors : function(startid, backid, col){
		pc.zstable = true;
		this.changeLines(startid, backid, col, function(id,col){
			bd.border[id].color = col;
			if(menu.getVal('irowake')){
				if(k.isborderAsLine==0){ pc.drawLine1(id,true);}else{ pc.drawBorder1(id,true);}
				if(!g.vml){ this.repaintParts(id);}
			}
		}.bind(this));
		pc.zstable = false;
	},
	repaintParts : function(id){ }, // �I�[�o�[���C�h�p
	changeLines : function(startid, backid, col, func){
		if(startid==-1){ return;}
		var forward = -1;
		var here = startid;
		var backward = backid;
		while(k.qcols*k.qrows*3){
			func(here,col);
			forward = bd.forwardLine(here, backward);
			backward = here; here = forward;
			if(forward==startid || forward==-1){ break;}
		}
	},
	tshapeid : function(cc){
		var bx, by, func;
		if(k.isborderAsLine==0){
			bx = cc%(k.qcols)*2+1; by = mf(cc/(k.qcols))*2+1;
			if(cc==-1 || bd.lcntCell(bd.cell[cc].cx,bd.cell[cc].cy)!=3){ return -1;}
			func = bd.LiB.bind(bd);
		}
		else{
			bx = cc%(k.qcols+1)*2; by = mf(cc/(k.qcols+1))*2;
			if(cc==-1 || bd.lcntCross(mf(bx/2),mf(by/2))!=3){ return -1;}
			func = bd.QaB.bind(bd);
		}

		if     (func(bd.bnum(bx-1,by  ))<=0){ return bd.bnum(bx+1,by  );}
		else if(func(bd.bnum(bx+1,by  ))<=0){ return bd.bnum(bx-1,by  );}
		else if(func(bd.bnum(bx  ,by-1))<=0){ return bd.bnum(bx  ,by+1);}
		else if(func(bd.bnum(bx  ,by+1))<=0){ return bd.bnum(bx  ,by-1);}

		return -1;
	},

	//---------------------------------------------------------------------------
	// col.setColor1() ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����(�����Ȃ��p)
	// col.point()     �Z������o�Ă������1�{���ǂ������肷��
	//---------------------------------------------------------------------------
	setColor1 : function(id,val){
		var idlist=new Array();
		var cc1, cc2, color;
		if(k.isborderAsLine==0){ cc1 = bd.cc1(id);      cc2 = bd.cc2(id);     }
		else                   { cc1 = bd.crosscc1(id); cc2 = bd.crosscc2(id);}

		pc.zstable = true;
		if(val!=0){
			if(this.point(id,cc1) && this.point(id,cc2)){ bd.border[id].color = this.getNewLineColor();}
			else if(bd.nextLine(id)!=-1 && this.point(id,cc1)){
				bd.border[id].color = bd.border[bd.nextLine(id)].color;
			}
			else if(bd.backLine(id)!=-1 && this.point(id,cc2)){
				bd.border[id].color = bd.border[bd.backLine(id)].color;
			}
			else if(bd.backLine(id)!=-1){
				color = bd.border[bd.backLine(id)].color;
				for(var i=0;i<bd.border.length;i++){ idlist[i]=0;}
				var bx = bd.border[id].cx-(k.isborderAsLine==0?bd.border[id].cy:bd.border[id].cx)%2;
				var by = bd.border[id].cy-(k.isborderAsLine==0?bd.border[id].cx:bd.border[id].cy)%2;
				this.sc0(idlist,bx,by,0);
				this.changeColor2(idlist,color,true);
			}
		}
		else{
			if(this.point(id,cc1) || this.point(id,cc2)){ return;}
			for(var i=0;i<bd.border.length;i++){ idlist[i]=0;} idlist[id]=1; idlist[bd.nextLine(id)]=2;
			if(bd.border[id].cx%2==1){
				this.sc0(idlist,bd.border[id].cx,bd.border[id].cy,(k.isborderAsLine==0?1:3));
				if(idlist[bd.nextLine(id)]!=3){
					for(var i=0;i<bd.border.length;i++){ idlist[i]=0;} idlist[id]=1;
					this.sc0(idlist,bd.border[id].cx,bd.border[id].cy,(k.isborderAsLine==0?2:4));
					this.changeColor2(idlist,this.getNewLineColor(),true);
				}
			}
			else{
				this.sc0(idlist,bd.border[id].cx,bd.border[id].cy,(k.isborderAsLine==0?3:1));
				if(idlist[bd.nextLine(id)]!=3){
					for(var i=0;i<bd.border.length;i++){ idlist[i]=0;} idlist[id]=1;
					this.sc0(idlist,bd.border[id].cx,bd.border[id].cy,(k.isborderAsLine==0?4:2));
					this.changeColor2(idlist,this.getNewLineColor(),true);
				}
			}
		}
		pc.zstable = false;
	},
	point : function(id,cc){
		return this.lcntCell(cc)==1;
	},

	//---------------------------------------------------------------------------
	// col.changeColor2() �ЂƂȂ���̐��̐F��ς���
	// col.sc0()          �ЂƂȂ���̐��̐F��ς���
	// col.branch()       �Z������o�Ă������3�{�ȏォ�ǂ������肷��
	//---------------------------------------------------------------------------
	changeColor2 : function(idlist,color,flag){
		for(var i=0;i<bd.border.length;i++){
			if(idlist[i]==1){
				bd.border[i].color = color;
				if(flag && menu.getVal('irowake')){
					if(k.isborderAsLine==0){ pc.drawLine1(i,true);}else{ pc.drawBorder1(i,true);}
					if(!g.vml){ this.repaintParts(i);}
				}
			}
		}
	},
	sc0 : function(idlist,bx,by,dir){
		var line = (k.isborderAsLine==0?bd.LiB.bind(bd):bd.QaB.bind(bd));
		while(1){
			switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
			if((bx+by)%2==0){
				var lcnt = this.lcntCell(mf(bx/2)+mf(by/2)*(k.qcols+(k.isborderAsLine==0?0:1)));
				if(dir==0 || this.branch(bx,by,lcnt)){
					if(line(bd.bnum(bx,by-1))>0){ this.sc0(idlist,bx,by,1)}
					if(line(bd.bnum(bx,by+1))>0){ this.sc0(idlist,bx,by,2)}
					if(line(bd.bnum(bx-1,by))>0){ this.sc0(idlist,bx,by,3)}
					if(line(bd.bnum(bx+1,by))>0){ this.sc0(idlist,bx,by,4)}
					break;
				}
				else if(lcnt==3||lcnt==4){ }
				else if(lcnt==0){ return;}
				else if(dir!=1 && line(bd.bnum(bx,by+1))>0){ dir=2;}
				else if(dir!=2 && line(bd.bnum(bx,by-1))>0){ dir=1;}
				else if(dir!=3 && line(bd.bnum(bx+1,by))>0){ dir=4;}
				else if(dir!=4 && line(bd.bnum(bx-1,by))>0){ dir=3;}
			}
			else{
				var id = bd.bnum(bx,by);
				if(id==-1 || line(id)<=0 || idlist[id]!=0){ if(idlist[id]==2){ idlist[id]=3;} return;}
				idlist[id]=1;
			}
		}
	},
	branch : function(bx,by,lcnt){
		return (lcnt==3||lcnt==4);
	},

	//---------------------------------------------------------------------------
	// col.irowakeClick()  �u�F�������Ȃ����v�{�^������������
	// col.irowakeRemake() �u�F�������Ȃ����v�{�^�������������ɐF�������Ȃ���
	//---------------------------------------------------------------------------
	irowakeClick : function(){
		if(k.br.IE && menu.getVal('irowake')){ this.irowakeRemake(); return;}
		pc.paint(0,0,k.qcols-1,k.qrows-1);
	},
	irowakeRemake : function(){
		if(!menu.getVal('irowake')){ return;}

		var cnt=0;
		var first=-1;
		for(var i=0;i<bd.border.length;i++){ bd.border[i].color = ""; }
		for(var i=0;i<bd.border.length;i++){
			if( bd.border[i].color == "" && ((k.isborderAsLine==0 && bd.LiB(i)>0) || (k.isborderAsLine==1 && bd.QaB(i)==1)) ){
				var newColor = col.getNewLineColor();
				if(k.isborderCross){
					this.changeLines(i,bd.backLine(i),newColor, function(id,col){ bd.border[id].color = col;});
					this.changeLines(i,bd.nextLine(i),newColor, function(id,col){ bd.border[id].color = col;});
				}
				else{
					var idlist=new Array();
					for(var id=0;id<bd.border.length;id++){ idlist[id]=0;}
					var bx = bd.border[i].cx-(k.isborderAsLine==0?bd.border[i].cy:bd.border[i].cx)%2;
					var by = bd.border[i].cy-(k.isborderAsLine==0?bd.border[i].cx:bd.border[i].cy)%2;
					this.sc0(idlist,bx,by,0);
					this.changeColor2(idlist,newColor,false);
				}
			}
		}
		pc.paint(0,0,k.qcols-1,k.qrows-1);
	}
};

//--------------------------------------------------------------------------------
// ��Rooms�N���X ������TOP-Cell�̈ʒu���̏�������
//--------------------------------------------------------------------------------
// ������TOP�ɐ�������͂��鎞�́A�n���h�����O��
Rooms = function(){
	this.enable = false;
	this.rareamax;
	this.cell = new Array();
	if(k.isOneNumber){ this.setEnable();}
};
Rooms.prototype = {
	//--------------------------------------------------------------------------------
	// room.isEnable()   ���̃I�u�W�F�N�g�̓��삪�L����
	// room.setEnable()  ���̃I�u�W�F�N�g�̓����L���ɂ���
	// room.resetRarea() �����̏���reset����
	//--------------------------------------------------------------------------------
	isEnable : function(){ return this.isenable;},
	setEnable : function(){
		this.isenable = true;
		this.resetRarea();
	},
	resetRarea : function(){
		if(!this.isEnable()){ return;}

		this.cell = new Array();
		var rarea = ans.searchRarea();
		for(var c=0;c<bd.cell.length;c++){ this.cell[c] = rarea.check[c]; }
		this.rareamax = rarea.max;

		if(!k.isOneNumber){ return;}
		for(var i=1;i<=this.rareamax;i++){
			var val = -1;
			for(var c=0;c<bd.cell.length;c++){
				if(this.cell[c]==i && bd.QnC(c)!=-1){
					if(val==-1){ val = bd.QnC(c);}
					if(this.getTopOfRoom(i)!=c){ bd.sQnC(c, -1);}
				}
			}
			if(val!=-1){ bd.sQnC(this.getTopOfRoom(i), val);}
		}
	},
	//--------------------------------------------------------------------------------
	// room.setLineToRarea()      ���E�������͂��ꂽ���ɁA������TOP�ɂ��鐔�����ǂ��n���h�����O���邩
	// room.removeLineFromRarea() ���E���������ꂽ���ɁA������TOP�ɂ��鐔�����ǂ��n���h�����O���邩
	// room.sr0()                 setLineToRarea()����Ă΂�āAid���܂ވ�̕����̗̈���A�w�肳�ꂽareaid�ɂ���
	//--------------------------------------------------------------------------------
	setLineToRarea : function(id){
		var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
		var bx = bd.border[id].cx, by = bd.border[id].cy;
		if( bd.lcntCross(mf((bx-bx%2)/2), mf((by-by%2)/2))>=2 && bd.lcntCross(mf((bx+bx%2)/2), mf((by+by%2)/2))>=2
			&& cc1!=-1 && cc2!=-1)
		{
			var keep = this.cell[cc1];
			var func = function(id){ return (id!=-1 && bd.QuB(id)==0); };
			this.rareamax++;
			this.sr0(func, this.cell, cc2, this.rareamax);
			if(this.cell[cc1] == this.rareamax){
				for(var i=0;i<bd.cell.length;i++){ if(this.cell[i]==this.rareamax){ this.cell[i] = keep;} }
				this.rareamax--;
			}
		}
	},
	removeLineFromRarea : function(id){
		if(!um.isenableRecord()){ return;}	// �Ֆʊg�厞�̕���������fix
		var fordel, keep;
		var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
		if(cc1!=-1 && cc2!=-1 && this.cell[cc1] != this.cell[cc2]){
			var tc1 = this.getTopOfRoomByCell(cc1);
			var tc2 = this.getTopOfRoomByCell(cc2);

			if(k.isOneNumber){
				if     (bd.QnC(tc1)!=-1&&bd.QnC(tc2)==-1){ bd.sQnC(tc2, bd.QnC(tc1)); pc.paintCell(tc2);}
				else if(bd.QnC(tc1)==-1&&bd.QnC(tc2)!=-1){ bd.sQnC(tc1, bd.QnC(tc2)); pc.paintCell(tc1);}
			}

			var dcc = -1;
			if(bd.cell[tc1].cx > bd.cell[tc2].cx || (bd.cell[tc1].cx == bd.cell[tc2].cx && bd.cell[tc1].cy > bd.cell[tc2].cy)){
				fordel = this.cell[tc1]; keep = this.cell[tc2]; dcc = tc1;
			}
			else{ fordel = this.cell[tc2]; keep = this.cell[tc1]; dcc = tc2;}

			for(var i=0;i<bd.cell.length;i++){ if(this.cell[i]==fordel){ this.cell[i] = keep;} }

			if(k.isOneNumber && bd.QnC(dcc) != -1){ bd.sQnC(dcc, -1); pc.paintCell(dcc);}
		}
	},
	sr0 : function(func, checks, i, areaid){
		if(checks[i]==areaid){ return;}
		checks[i] = areaid;
		if( func(bd.ub(i)) ){ this.sr0(func, checks, bd.up(i), areaid);}
		if( func(bd.db(i)) ){ this.sr0(func, checks, bd.dn(i), areaid);}
		if( func(bd.lb(i)) ){ this.sr0(func, checks, bd.lt(i), areaid);}
		if( func(bd.rb(i)) ){ this.sr0(func, checks, bd.rt(i), areaid);}
		return;
	},

	//--------------------------------------------------------------------------------
	// room.getRoomID()          ���̃I�u�W�F�N�g�ŊǗ����Ă���Z���̕���ID���擾����
	// room.getTopOfRoomByCell() �w�肵���Z�����܂܂��̈��TOP�̕������擾����
	// room.getCntOfRoomByCell() �w�肵���Z�����܂܂��̈�̑傫���𒊏o����
	// room.getTopOfRoom()       �w�肵���̈��TOP�̕������擾����
	// room.getCntOfRoom()       �w�肵���̈�̑傫���𒊏o����
	//--------------------------------------------------------------------------------
	getRoomID : function(cc){ return this.cell[cc];},
	getTopOfRoomByCell : function(cc){ return this.getTopOfRoom(this.cell[cc]);},
	getTopOfRoom : function(areaid){
		var cc=-1; var cx=k.qcols;
		for(var i=0;i<bd.cell.length;i++){
			if(this.cell[i] == areaid && bd.cell[i].cx < cx){ cc=i; cx = bd.cell[i].cx; }
		}
		return cc;
	},
	getCntOfRoomByCell : function(cc){ return this.getCntOfRoom(this.cell[cc]);},
	getCntOfRoom : function(areaid){
		var cnt=0;
		for(var i=0;i<bd.cell.length;i++){
			if(this.cell[i] == areaid){ cnt++; }
		}
		return cnt;
	}
};

//--------------------------------------------------------------------------------
// ��LangMgr�N���X ����̐؂�ւ���������
//--------------------------------------------------------------------------------

LangMgr = function(){
	this.language = 'ja';
};
LangMgr.prototype = {
	//--------------------------------------------------------------------------------
	// lang.isJP()   ���ꃂ�[�h����{��ɂ���
	// lang.isEN()   ���ꃂ�[�h���p��ɂ���
	//--------------------------------------------------------------------------------
	isJP : function(){ return this.language == 'ja';},
	isEN : function(){ return this.language == 'en';},

	//--------------------------------------------------------------------------------
	// lang.setLang()   �����ݒ肷��
	// lang.translate() html�̌����ς���
	//--------------------------------------------------------------------------------
	setLang : function(ln){ (ln=='ja')   ?this.setJP():this.setEN();},
	translate : function(){ (this.isJP())?this.setEN():this.setJP();},

	//--------------------------------------------------------------------------------
	// lang.setJP()  ���͂���{��ɂ���
	// lang.setEN()  ���͂��p��ɂ���
	// lang.setStr() ���͂�ݒ肷��
	//--------------------------------------------------------------------------------
	setJP : function(){ this.setStr('ja');},
	setEN : function(){ this.setStr('en');},
	setStr : function(ln){
		this.language = ln;
		document.title = base.gettitle();
		$("#title2").html(base.gettitle());
		$("#expression").html(base.expression[this.language]);

		menu.ex.dispmanstr();
		menu.displayAll();

		base.resize_canvas();
	}
};

//---------------------------------------------------------------------------
// ��PBase�N���X �ς��Ղ�v3�̃x�[�X�����₻�̑��̏������s��
//---------------------------------------------------------------------------

// PBase�N���X
PBase = function(){
	this.floatbgcolor = "black";
	this.proto        = 0;	// �e�N���X��prototype���p�Y���p�X�N���v�g�ɂ���ĕύX����Ă��邩
	this.expression   = { ja:'' ,en:''};
	this.puzzlename   = { ja:'' ,en:''};
	this.cv_obj       = null;	// HTML�\�[�X��Canvas�������I�u�W�F�N�g
	this.onresizenow  = false;	// resize�����ǂ���
};
PBase.prototype = {
	//---------------------------------------------------------------------------
	// base.preload_func()
	//   ���̃t�@�C�����Ă΂ꂽ�Ƃ��Ɏ��s�����֐� -> onLoad�O�̍ŏ����̐ݒ���s��
	//---------------------------------------------------------------------------
	preload_func : function(){
		// URL�̎擾 -> URL��?�ȉ�����puzzleid����pzlURI���ɕ���(������url_decode()�Ă�ł���)
		enc = new Encode(location.search);
		k.puzzleid = enc.uri.pid;
		if(location.href.indexOf('for_test.html')>=0){ k.puzzleid = 'country';}
		if(!k.puzzleid){ location.href = "./";} // �w�肳�ꂽ�p�Y�����Ȃ��ꍇ�͂��悤�Ȃ�`
		if(enc.uri.cols){ k.qcols = enc.uri.cols;}
		if(enc.uri.rows){ k.qrows = enc.uri.rows;}

		// Gears_init.js�̓ǂݍ���
		fio = new FileIO();
		if(fio.choiceDataBase()>0){
			document.writeln("<script type=\"text/javascript\" src=\"src/gears_init.js\"></script>");
		}

		// �p�Y����p�t�@�C���̓ǂݍ���
		if(location.href.indexOf('for_test.html')==-1){
			document.writeln("<script type=\"text/javascript\" src=\"src/"+k.puzzleid+".js\"></script>");
		}
		else{
			document.writeln("<script type=\"text/javascript\" src=\"src/puzzles_Full.js\"></script>");
		}

		// onLoad��onResize�ɓ�������蓖�Ă�
		$(document).ready(this.onload_func.ebind(this));
		$(window).resize(this.onresize_func.ebind(this));
	},

	//---------------------------------------------------------------------------
	// base.onload_func()
	//   �y�[�W��Load���ꂽ���̏����B�e�N���X�̃I�u�W�F�N�g�ւ̓ǂݍ��ݓ������ݒ���s��
	// base.initObjects()
	//   �e�I�u�W�F�N�g�̐����Ȃǂ̏���
	// base.setEvents()
	//   �}�E�X���́A�L�[���͂̃C�x���g�̐ݒ���s��
	// base.initSilverlight()
	//   Silverlight�I�u�W�F�N�g�ɃC�x���g�̐ݒ���s��(IE��Silverlight���[�h��)
	// base.reload_func()  �ʃX�N���v�g��ǂݍ��݂��Ȃ����ۂ̏���
	// base.postfix()      �e�p�Y���̏������㏈�����Ăяo��
	//---------------------------------------------------------------------------
	onload_func : function(){
		this.initCanvas();

		this.initObjects();
		this.setEvents(1);	// �C�x���g����������

		if(document.domain=='indi.s58.xrea.com' && k.callmode=='pplay'){ this.accesslog();}	// �A�N�Z�X���O���Ƃ��Ă݂�
		tm = new Timer();	// �^�C�}�[�I�u�W�F�N�g�̐����ƃ^�C�}�[�X�^�[�g
	},
	initObjects : function(){
		this.proto = 0;

		puz = new Puzzles[k.puzzleid]();	// �p�Y���ŗL�I�u�W�F�N�g
		puz.setting();					// �p�Y���ŗL�̕ϐ��ݒ�(�f�t�H���g��)
		if(this.proto){ puz.protoChange();}

		// �N���X������
		bd = new Board();		// �ՖʃI�u�W�F�N�g
		mv = new MouseEvent();	// �}�E�X���̓I�u�W�F�N�g
		kc = new KeyEvent();	// �L�[�{�[�h���̓I�u�W�F�N�g
		kp = new KeyPopup();	// ���̓p�l���I�u�W�F�N�g
		col = new Colors();		// �F�����Ǘ��I�u�W�F�N�g
		pc = new Graphic();		// �`��n�I�u�W�F�N�g
		tc = new TCell();		// �L�[���͂̃^�[�Q�b�g�Ǘ��I�u�W�F�N�g
		ans = new AnsCheck();	// ���𔻒�I�u�W�F�N�g
		um = new UndoManager();	// ������Ǘ��I�u�W�F�N�g
		room = new Rooms();		// �������̃I�u�W�F�N�g
		lang = new LangMgr();	// ������I�u�W�F�N�g
		fio.initDataBase();		// �f�[�^�x�[�X�̐ݒ�
		menu = new Menu();		// ���j���[�������I�u�W�F�N�g
		pp = new Properties();	// ���j���[�֌W�̐ݒ�l��ێ�����I�u�W�F�N�g

		this.doc_design();		// �f�U�C���ύX�֘A�֐��̌Ăяo��

		enc.pzlinput(0);									// URL����p�Y���̃f�[�^��ǂݏo��
		if(!enc.uri.bstr){ this.resize_canvas_onload();}	// Canvas�̐ݒ�(pzlinput�ŌĂ΂��̂ŁA�����ł͌Ă΂Ȃ�)

		if(k.scriptcheck && debug){ debug.testonly_func();}	// �e�X�g�p
	},
	setEvents : function(first){
		this.cv_obj.mousedown(mv.e_mousedown.ebind(mv)).mouseup(mv.e_mouseup.ebind(mv)).mousemove(mv.e_mousemove.ebind(mv));
		this.cv_obj.context.oncontextmenu = function(){return false;};	//�Ë��_ 

		if(first){
			$(document).keydown(kc.e_keydown.kcbind()).keyup(kc.e_keyup.kcbind()).keypress(kc.e_keypress.kcbind());
		}
	},
	initSilverlight : function(sender){
		sender.AddEventListener("KeyDown", kc.e_SLkeydown.bind(kc));
		sender.AddEventListener("KeyUp",   kc.e_SLkeyup.bind(kc));
	},

	reload_func : function(newid){
		if(this.proto){ puz.protoOriginal();}

		$("*").unbind();
		menu.menureset();
		$("#numobj_parent").html("");
		if(kp.ctl[1].enable){ kp.ctl[1].el.remove();}
		if(kp.ctl[3].enable){ kp.ctl[3].el.remove();}

		k.puzzleid = newid;
		if(!Puzzles[k.puzzleid]){
			newEL("script").attr("type", "text/javascript")
//						   .attr("charset", "Shift_JIS")
						   .attr("src", "src/"+k.puzzleid+".js")
						   .appendTo($("head"));
		}

		this.initObjects();
		this.setEvents(0);
	},

	postfix : function(){
		puz.input_init();
		puz.graphic_init();
		puz.encode_init();
		puz.answer_init();
	},

	//---------------------------------------------------------------------------
	// base.doc_design()       onload_func()�ŌĂ΂��Bhtml�Ȃǂ̐ݒ���s��
	// base.gettitle()         ���݊J���Ă���^�C�g����Ԃ�
	// base.getPuzzleName()    ���݊J���Ă���p�Y���̖��O��Ԃ�
	// base.setTitle()         �p�Y���̖��O��ݒ肷��
	// base.setExpression()    ��������ݒ肷��
	// base.setFloatbgcolor()  �t���[�g���j���[�̔w�i�F��ݒ肷��
	//---------------------------------------------------------------------------
	// �w�i�摜�Ƃ�title��/html�\���̐ݒ� //
	doc_design : function(){
		this.resize_canvas_only();	// Canvas�̃T�C�Y�ݒ�

		document.title = this.gettitle();
		$("#title2").html(this.gettitle());

		$("body").css("background-image","url(../../"+k.puzzleid+"/bg.gif)");
		if(k.br.IE){
			$("#title2").css("margin-top","24px");
			$("hr").each(function(){ $(this).css("margin",'0pt');});
		}

		k.autocheck = (k.callmode!="pmake");
		this.postfix();			// �e�p�Y�����Ƃ̐ݒ�(��t����)
		menu.menuinit();
		um.enb_btn();
	},
	gettitle : function(){
		if(k.callmode=='pmake'){ return ""+this.getPuzzleName()+(lang.isJP()?" �G�f�B�^ - �ς��Ղ�v3":" editor - PUZ-PRE v3");}
		else				   { return ""+this.getPuzzleName()+(lang.isJP()?" player - �ς��Ղ�v3"  :" player - PUZ-PRE v3");}
	},
	getPuzzleName : function(){ return (lang.isJP()||!this.puzzlename.en)?this.puzzlename.ja:this.puzzlename.en;},
	setTitle      : function(strJP, strEN){ this.puzzlename.ja = strJP; this.puzzlename.en = strEN;},
	setExpression : function(strJP, strEN){ this.expression.ja = strJP; this.expression.en = strEN;},
	setFloatbgcolor : function(color){ this.floatbgcolor = color;},

	//---------------------------------------------------------------------------
	// base.initCanvas()           Canvas�̐ݒ���s��
	// base.resize_canvas_only()   �E�B���h�E��Load/Resize���̏����BCanvas/�\������}�X�ڂ̑傫����ݒ肷��B
	// base.resize_canvas()        resize_canvas_only()+Canvas�̍ĕ`��
	// base.resize_canvas_onload() ����������paint�ĕ`�悪�N����Ȃ��悤�ɁAresize_canvas���Ăяo��
	// base.onresize_func()        �E�B���h�E���T�C�Y���ɌĂ΂��֐�
	// base.getWindowSize()        �E�B���h�E�̑傫����Ԃ�
	//---------------------------------------------------------------------------
	initCanvas : function(){
		k.IEMargin = (k.br.IE)?(new Pos(4, 4)):(new Pos(0, 0));

		var canvas = document.getElementById('puzzle_canvas');	// Canvas�I�u�W�F�N�g����

		// jQuery���Ɠǂݍ��ݏ��̊֌W��initElement����Ȃ��Ȃ邽�߁AinitElement���Ȃ���
		if(k.br.IE){
			canvas = uuCanvas.init(canvas,!uuMeta.slver);		// uuCanvas�p
//			canvas = uuCanvas.init(canvas,true);				// uuCanvas(����VML���[�h)�p
//			canvas = G_vmlCanvasManager.initElement(canvas);	// excanvas�p
		}
		g = canvas.getContext("2d");

		this.cv_obj = $(canvas).unselectable();
	},
	resize_canvas_only : function(){
		var wsize = this.getWindowSize();
		k.p0 = new Pos(k.def_psize, k.def_psize);

		// �Z���̃T�C�Y�̌���
		var cratio = {0:(19/36), 1:0.75, 2:1.0, 3:1.5, 4:3.0}[k.widthmode];
		var ci0 = Math.round((wsize.x-k.p0.x*2)/(k.def_csize*cratio)*0.75);
		var ci1 = Math.round((wsize.x-k.p0.x*2)/(k.def_csize*cratio));
		var ci2 = Math.round((wsize.x-k.p0.x*2)/(k.def_csize)*2.25);

		if(k.qcols < ci0){				// ���ɏk�����Ȃ��Ƃ�
			k.cwidth = k.cheight = mf(k.def_csize*cratio);
			$("#main").css("width",'80%');
		}
		else if(k.qcols < ci1){			// �E�B���h�E�̕�75%�ɓ���ꍇ �t�H���g�̃T�C�Y��3/4�܂ŏk�߂Ă悢
			k.cwidth = k.cheight = mf(k.def_csize*cratio*(1-0.25*((k.qcols-ci0)/(ci1-ci0))));
			k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
			$("#main").css("width",'80%');
		}
		else if(k.qcols < ci2){			// main��table���L����Ƃ�
			k.cwidth = k.cheight = mf(k.def_csize*cratio*(0.75-0.35*((k.qcols-ci1)/(ci2-ci1))));
			k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
			$("#main").css("width",""+(k.p0.x*2+k.qcols*k.cwidth+12)+"px");
		}
		else{							// �W���T�C�Y��40%�ɂ���Ƃ�(���������̉���)
			k.cwidth = k.cheight = mf(k.def_csize*0.4);
			k.p0 = new Pos(k.def_psize*0.4, k.def_psize*0.4);
			$("#main").css("width",'96%');
		}

		// Canvas�̃T�C�Y�ύX
		this.cv_obj.attr("width",  k.p0.x*2 + k.qcols*k.cwidth);
		this.cv_obj.attr("height", k.p0.y*2 + k.qrows*k.cheight);

		// extendxell==1�̎��͏㉺�̊Ԋu���L���� (extendxell==2��def_psize�Œ���)
		if(k.isextendcell==1){
			k.p0.x += mf(k.cwidth*0.45);
			k.p0.y += mf(k.cheight*0.45);
		}

		k.cv_oft.x = this.cv_obj.offset().left;
		k.cv_oft.y = this.cv_obj.offset().top;

		kp.resize();

		pc.onresize_func();

		// jQuery�Ή�:���߂�Canvas���̃T�C�Y��0�ɂȂ�A�`�悳��Ȃ��s��ւ̑Ώ�
		if(g.vml){
			var fc = this.cv_obj.children(":first");
			fc.css("width",  ''+this.cv_obj.attr("clientWidth") + 'px');
			fc.css("height", ''+this.cv_obj.attr("clientHeight") + 'px');
		}
	},
	resize_canvas : function(){
		this.resize_canvas_only();
		pc.flushCanvasAll();
		pc.paintAll();
	},
	resize_canvas_onload : function(){
		if(!k.br.IE || pc.already()){ this.resize_canvas();}
		else{ uuCanvas.ready(this.resize_canvas.bind(this));}
	},
	onresize_func : function(){
		if(this.onresizenow){ return;}
		this.onresizenow = true;

		this.resize_canvas();

		this.onresizenow = false;
	},
	getWindowSize : function(){
		if(document.all){
			return new Pos(document.body.clientWidth, document.body.clientHeight);
		}
		else if(document.layers || document.getElementById){
			return new Pos(innerWidth, innerHeight);
		}
		return new Pos(0, 0);
	},

	//---------------------------------------------------------------------------
	// base.accesslog() player�̃A�N�Z�X���O���Ƃ�
	//---------------------------------------------------------------------------
	accesslog : function(){
		var refer = document.referrer;
		refer = refer.replace(/\?/g,"%3f");
		refer = refer.replace(/\&/g,"%26");
		refer = refer.replace(/\=/g,"%3d");
		refer = refer.replace(/\//g,"%2f");

		$.post("./record.cgi", "pid="+k.puzzleid+"&pzldata="+enc.uri.qdata+"&referer="+refer);
	}
};

base = new PBase();	// onLoad�܂ł̍ŏ����̐ݒ���s��
base.preload_func();