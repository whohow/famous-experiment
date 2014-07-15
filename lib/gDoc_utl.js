Xls_Utl = {
	createNew : function(data, key) {
		
		// globals
		var xls = {};
		xls.data = data;
		xls.key = key;
		xls.entries = data.feed.entry;
		xls.title = data.feed.title.$t;
		xls.pos_data_start = 0;
		xls.bound_x = 0;
		xls.bound_y = parseInt(xls.entries[xls.entries.length - 1].title.$t.substr(1));
		xls.pos = 1;
		//used as global pointer of this excel sheet
		xls["Default Score"] = 10;
		//default score
		xls["Default Time"] = 30;
		//default time
		xls["Question"] = "";
		xls.file = new Array();
		xls.headertable = {};
		xls.answerpool=[];

		//==================
		//	Methods
		//==================
		
		xls.generateAnswerPool = function() {
			var a=new Array();
			for (var key in xls.file) 
			{
				if (xls.file[key].hasOwnProperty('Answer'))
				{ a.push(xls.file[key].Answer); }
				else {}
			}
			return a;
		}

		//get pos of specific block in a row
		xls.getPosOfBlock = function(rowPos, colIndex) {
			var i = rowPos;
			var rowIndex = parseInt(xls.entries[rowPos].title.$t.substr(1));
			var blockTitle = /*need fix*/(colIndex) + rowPos.toString();
			while (true) {
				var curRow = parseInt(xls.entries[i].title.$t.substr(1));
				if (curRow == rowIndex) {
					if (xls.entries[i].title.$t == blockTitle) {
						return i;
					}
				} else if (curRow > rowIndex) {
					break;
				}
				i++;
			}
			return -1;
		}
		// get pos of the first block in a row
		// (startPos >= pos_data_start)
		xls.getPosOfRow = function(startPos, rowIndex) {
			var i = startPos;
			while (true) {
				var curRow = parseInt(xls.entries[i].title.$t.substr(1));
				if (curRow == rowIndex) {
					break;
				} else if (curRow > rowIndex) {
					break;
				}
				i++;
			}
			return i;
		}
		// Dispose Obj
		xls.Dispose = function() {

		}
		//==================
		//	Initialize
		//==================

		// read meta-data (row:1)
		xls.pos=0;
		while (true) {
			var curRow = parseInt(xls.entries[xls.pos].title.$t.substr(1));
			if (curRow == 1) {
				var s = xls.entries[xls.pos].content.$t;
				xls[s.substr(0,s.indexOf(":",0)).trim()]=s.substr(s.indexOf(":", 0) + 1).trim();
				/*
				switch(s.substr(0,s.indexOf(":",0)).trim()) {
					case "Question":
						xls.question_str = s.substr(s.indexOf(":", 0) + 1).trim();
						break;
					case "Default Time":
						xls.DEFAULT_TIME = xls.entries[xls.pos].content.$t.substr(s.indexOf(":", 0) + 1).trim();
						break;
					case "Default Score":
						xls.DEFAULT_SCORE = xls.entries[xls.pos].content.$t.substr(s.indexOf(":", 0) + 1).trim();
						break;
				}
				*/
				xls.pos++;
			} else if (curRow > 1)
				break;
		}

		// read data - initialize (row:2)
		// - the data should be stored into 'Xls_Utl.file' in an array format
		while (true) {
			var curRow = parseInt(xls.entries[xls.pos].title.$t.substr(1));
			if (curRow == 2) {
				xls.headertable[xls.entries[xls.pos].title.$t[0]] = xls.entries[xls.pos].content.$t;
				xls.bound_x++;
			} else if (curRow > 2) {
				xls.pos_data_start = xls.pos;
				break;
			}
			xls.pos++;
		}

		//initialize the sheet data array (xls.file)
		var lastRow = parseInt(xls.entries[xls.pos].title.$t.substr(1));
		var tmp = {};
		while (xls.pos < xls.entries.length) {
			var curRow = parseInt(xls.entries[xls.pos].title.$t.substr(1));
			var header
			if (curRow >= 3) {
				if (curRow != lastRow) {
					xls.file.push(tmp);
					tmp = {};	//create a new tmp obj
					lastRow = curRow;
				}
				tmp[xls.headertable[xls.entries[xls.pos].title.$t[0]]] = xls.entries[xls.pos].content.$t;
			}
			xls.pos++;
		}
		xls.file.push(tmp);
		//---end---
		return xls;
	}
}

