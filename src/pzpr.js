/* jshint node: true */

exports.files = [
	"common/intro",
	"pzpr/core",
	"lib/candle-intro",
	"../node_modules/pzpr-canvas/dist/candle",
	"lib/candle-outro",
	"pzpr/env",
	"pzpr/event",
	"pzpr/classmgr",
	"pzpr/variety",
	"pzpr/parser",
	"pzpr/metadata",
	"pzpr/util",
	"puzzle/Puzzle",
	"puzzle/Config",
	"puzzle/Address",
	"puzzle/Piece",
	"puzzle/PieceList",
	"puzzle/Board",
	"puzzle/BoardExec",
	"puzzle/GraphBase",
	"puzzle/LineManager",
	"puzzle/AreaManager",
	"puzzle/Graphic",
	"puzzle/MouseInput",
	"puzzle/KeyInput",
	"puzzle/Encode",
	"puzzle/FileData",
	"puzzle/Answer",
	"puzzle/Operation",
	"variety-common/Graphic",
	"variety-common/KeyInput",
	"variety-common/MouseInput",
	"variety-common/Answer",
	"variety-common/BoardExec",
	"variety-common/Encode",
	"variety-common/FileData",
	"common/outro"
].map(function(mod){ return "src/"+mod+".js";});
