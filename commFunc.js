'use strict';
//Common function
var _readFile = function(uri, encode, type) {
	try {
		var fs = require('fs');
		var path = require('path');
		switch (type) {
			case 'json':
				return JSON.parse(fs.readFileSync(path.normalize(uri), encode));
			case 'txt':
				return fs.readFileSync(path.normalize(uri), encode);
			default:
				return null;
		}
	} catch (e) {
		return null;
	}
};
var _saveFile = function(uri, bufferData, rewrite) {
	try {
		if (rewrite) {
			var fs = require('fs');
			var path = require('path');
			fs.writeFile(path.normalize(uri), bufferData, function(err) {
				if (err) throw err;
			});
			fs.open(path.normalize(uri), 'wx', function(err, fd) {
				if (err) {
					fs.mkdir(path.dirname(uri), function(err) {
						if (!err) {
							fs.writeFile(path.normalize(uri), bufferData, function(err) {
								if (err) throw err;
							});
						}
					});
				}
				fs.close(fd);
			});
		} else {
			//Append
		}
	} catch (e) {}
};
var _showMessage = function(type, message) {
	var msgType = '';
	switch (type) {
		case 'warn':
			msgType = 'alert-danger'; //'common-base-warn';
			break;
		case 'ok':
			msgType = 'alert-success'; //'common-base-ok';
			break;
		default:
			break;
	}
	if (!msgType || !message) return;
	$('#common-message').html(message);
	$('#common-message').addClass(msgType);
	$('#common-message').fadeIn(66);
	setTimeout(function() {
		$('#common-message').removeClass(msgType);
		$('#common-message').fadeOut(888);
	}, 888);
};
var _chkEqual = function(a, b) {
	try {
		return (a.toString().trim() === b.toString().trim());
	} catch (e) {
		return false;
	}
};
var _toInt = function(data) {
	try {
		return parseInt(data);
	} catch (e) {
		return 0;
	}
};
var _toFloat = function(data) {
	try {
		return parseFloat(data);
	} catch (e) {
		return 0;
	}
};
var _hex2char = function(data) {
	var a = data;
	switch (a.length) {
		case 1:
			a = '%u000' + a;
			break;
		case 2:
			a = '%u00' + a;
			break;
		case 3:
			a = '%u0' + a;
			break;
		case 4:
			a = '%u' + a;
			break;
		default:
			break;
	}
	return unescape(a);
};
var _getDefaultMultiples = function(proudctSize) {
	switch (proudctSize) {
		case "16-16":
			if (window.screen.height / window.screen.width === 9 / 16) return 5.63;
			else return 5.45;
		case "32-80":
			if (window.screen.height / window.screen.width === 9 / 16) return 2.35;
			else return 2.15;
		default:
			return 1;
	}
};
var _setEnterCommit = function(e) {
	var ev = document.all ? window.event : e;
	if (ev.keyCode == 13) $(ev.target).trigger('blur');
};
var _clearSubDomEvent = function(baseNode, eveType, func) {
	baseNode.each(function(i, n) {
		var ele = $(n);
		ele.off(eveType, func);
		if (ele.children().length) {
			_clearSubDomEvent(ele.children());
		}
	});
};
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
Date.prototype.getDiff = function(oldTimeStamp) {
	var timeStampDiff = this.getTime() - oldTimeStamp;

	var days = Math.floor(timeStampDiff / (24 * 3600 * 1000));
	var leave1 = timeStampDiff % (24 * 3600 * 1000);
	var hours = Math.floor(leave1 / (3600 * 1000));
	var leave2 = leave1 % (3600 * 1000);
	var minutes = Math.floor(leave2 / (60 * 1000));
	var leave3 = leave2 % (60 * 1000);
	var seconds = Math.round(leave3 / 1000);

	return days + " : " + hours + " : " + minutes + " : " + seconds;
};
var _convolutionBase = function(matrix, type) {
	if (!matrix || matrix.length < 5 || matrix[0].length < 5) return null;
	var result = [];
	var tpEdge = [];
	for (var tpi = 0; tpi < matrix[0].length; tpi++) {
		tpEdge.push(0);
	}
	result.push(tpEdge.slice(0), tpEdge.slice(0));
	for (var i = 2; i < matrix.length - 2; i++) {
		var row = [0, 0];
		for (var j = 2; j < matrix[i].length - 2; j++) {
			switch (type) {
				case 'S00':
					row.push(_convolutionS00(matrix, i, j));
					break;
				case 'S45':
					row.push(_convolutionS45(matrix, i, j));
					break;
				case 'S90':
					row.push(_convolutionS90(matrix, i, j));
					break;
				case 'S135':
					row.push(_convolutionS135(matrix, i, j));
					break;
				default:
					break;
			}
		}
		row.push(0, 0);
		result.push(row);
	}
	result.push(tpEdge.slice(0), tpEdge.slice(0));
	tpEdge = null;
	return result;
};
var _convolutionS00 = function(matrix, row, col) {
	return (2 * (matrix[row][col - 2] + matrix[row][col - 1] + matrix[row][col] + matrix[row][col + 1] + matrix[row][col] + 2) - (matrix[row - 2][col - 2] + matrix[row - 2][col - 1] + matrix[row - 2][col] + matrix[row - 2][col + 1] + matrix[row - 2][col + 2] + matrix[row + 2][col - 2] + matrix[row + 2][col - 1] + matrix[row + 2][col] + matrix[row + 2][col + 1] + matrix[row + 2][col + 2]));
};
var _convolutionS45 = function(matrix, row, col) {
	return (2 * (matrix[row - 2][col + 2] + matrix[row - 1][col + 1] + matrix[row][col] + matrix[row + 1][col - 1] + matrix[row + 2][col - 2]) - (matrix[row - 2][col - 1] + matrix[row - 2][col] + matrix[row - 1][col - 2] + matrix[row - 1][col - 1] + matrix[row][col - 2] + matrix[row][col + 2] + matrix[row + 1][col + 1] + matrix[row + 1][col + 2] + matrix[row + 2][col] + matrix[row + 2][col + 1]));
};
var _convolutionS90 = function(matrix, row, col) {
	return (2 * (matrix[row - 2][col] + matrix[row - 1][col] + matrix[row][col] + matrix[row + 1][col] + matrix[row + 2][col]) - (matrix[row - 2][col - 2] + matrix[row - 1][col - 2] + matrix[row][col - 2] + matrix[row + 1][col - 2] + matrix[row + 2][col - 2] + matrix[row - 2][col + 2] + matrix[row - 1][col + 2] + matrix[row][col + 2] + matrix[row + 1][col + 2] + matrix[row + 2][col + 2]));
};
var _convolutionS135 = function(matrix, row, col) {
	return (2 * (matrix[row - 2][col - 2] + matrix[row - 1][col - 1] + matrix[row][col] + matrix[row + 1][col + 1] + matrix[row + 2][col + 2]) - (matrix[row - 2][col] + matrix[row - 2][col + 1] + matrix[row - 1][col + 1] + matrix[row - 1][col + 2] + matrix[row][col - 2] + matrix[row][col + 2] + matrix[row + 1][col - 2] + matrix[row + 1][col - 1] + matrix[row + 2][col - 1] + matrix[row + 2][col]));
};
var _medianFilter = function(matrix) {
	var tmpInner = [];
	for (var i = 0; i < matrix.length; i++) {
		var row = [];
		for (var j = 0; j < matrix[i].length; j++) {
			var tmpNum = matrix[i][j];
			switch (true) {
				case (i === 0 && j === 0):
					tmpNum += 25 / 9 * matrix[i][j];
					tmpNum += matrix[i + 1][j];
					tmpNum += matrix[i][j + 1];
					tmpNum += matrix[i + 1][j + 1];
					break;
				case (i === (matrix.length - 1) && j === (matrix[i].length - 1)):
					tmpNum += 25 / 9 * matrix[i][j];
					tmpNum += matrix[i - 1][j];
					tmpNum += matrix[i][j - 1];
					tmpNum += matrix[i - 1][j - 1];
					break;
				case (i === (matrix.length - 1) && j === 0):
					tmpNum += 25 / 9 * matrix[i][j];
					tmpNum += matrix[i - 1][j];
					tmpNum += matrix[i - 1][j + 1];
					tmpNum += matrix[i][j + 1];
					break;
				case (i === 0 && j === (matrix[i].length - 1)):
					tmpNum += 25 / 9 * matrix[i][j];
					tmpNum += matrix[i][j - 1];
					tmpNum += matrix[i + 1][j - 1];
					tmpNum += matrix[i + 1][j];
					break;
				case (i === 0 && j <= (matrix[i].length - 1)):
					tmpNum += 5 / 3 * matrix[i][j];
					tmpNum += matrix[i][j - 1];
					tmpNum += matrix[i + 1][j - 1];
					tmpNum += matrix[i + 1][j];
					tmpNum += matrix[i][j + 1];
					tmpNum += matrix[i + 1][j + 1];
					break;
				case (j === 0 && i < (matrix.length - 1)):
					tmpNum += 5 / 3 * matrix[i][j];
					tmpNum += matrix[i - 1][j];
					tmpNum += matrix[i - 1][j + 1];
					tmpNum += matrix[i + 1][j];
					tmpNum += matrix[i][j + 1];
					tmpNum += matrix[i + 1][j + 1];
					break;
				case (i === (matrix.length - 1)):
					tmpNum += 5 / 3 * matrix[i][j];
					tmpNum += matrix[i][j + 1];
					tmpNum += matrix[i - 1][j + 1];
					tmpNum += matrix[i - 1][j];
					tmpNum += matrix[i][j - 1];
					tmpNum += matrix[i - 1][j - 1];
					break;
				case (j === (matrix[i].length - 1)):
					tmpNum += 5 / 3 * matrix[i][j];
					tmpNum += matrix[i + 1][j];
					tmpNum += matrix[i + 1][j - 1];
					tmpNum += matrix[i - 1][j];
					tmpNum += matrix[i][j - 1];
					tmpNum += matrix[i - 1][j - 1];
					break;
				default:
					tmpNum += matrix[i - 1][j - 1];
					tmpNum += matrix[i - 1][j];
					tmpNum += matrix[i - 1][j + 1];
					tmpNum += matrix[i][j + 1];
					tmpNum += matrix[i + 1][j + 1];
					tmpNum += matrix[i + 1][j];
					tmpNum += matrix[i + 1][j - 1];
					tmpNum += matrix[i][j - 1];
					break;
			}
			tmpNum /= 9;
			row.push(tmpNum);
		}
		tmpInner.push(row);
	}
	return tmpInner;
};
var _sobelConvolution = function(matrix) {
	/*
		var canvas = $('.heatmap canvas').get(0);
		var ctx = canvas.getContext("2d");
		var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		if (!_statData.inEdgeDetectionRange) {
			_statData.inEdgeDetectionRange = true;
			var inner = [];
			var row = [];
			for (var i = 0; i < imgData.length; i += 4) {
				if (imgData[i] === null) continue;
				row.push((((imgData[i] * 299 + imgData[i + 1] * 587 + imgData[i + 2] * 114 + 500) / 1000)));
				//row.push(imgData[i + 3]);
				if (row.length === canvas.width) {
					inner.push(row.slice(0));
					row.length = 0;
				}
			}
			imgData = inner;
		}
	*/
	var tmpInner = [];
	for (var i = 1; i < matrix.length - 1; i++) {
		var row = [];
		for (var j = 1; j < matrix[i].length; j++) {
			var Gx = (matrix[i + 1][j - 1] + 2 * matrix[i + 1][j] + matrix[i + 1][j + 1]) - (matrix[i - 1][j - 1] + 2 * matrix[i - 1][j] + matrix[i - 1][j + 1]);
			var Gy = (matrix[i - 1][j - 1] + 2 * matrix[i][j - 1] + matrix[i + 1][j - 1]) - (matrix[i - 1][j + 1] + 2 * matrix[i][j + 1] + matrix[i + 1][j + 1]);
			row.push(Math.abs(Gx) + Math.abs(Gy));
		}
		tmpInner.push(row);
	}

	var innerMatrix = [];
	var maxValue = 0;
	for (var i = 0; i < tmpInner[0].length; i++) {
		var row = [];
		for (var j = 0; j < tmpInner.length; j++) {
			row.push(tmpInner[j][i]);
			if (tmpInner[j][i] > maxValue) maxValue = tmpInner[j][i];
		}
		innerMatrix.push(row);
	}
	return {
		matrix: innerMatrix,
		maxValue: maxValue
	};
};
var _thinImage = function(matrix, skeletonLimit) {
	/*
		var inner = [];
		var row = [];
		for (var i = 0; i < imgData.length; i += 4) {
			if (imgData[i] === null) continue;
			if (imgData[i + 3] > 0) row.push(1);
			else row.push(0);
			if (row.length === canvas.width) {
				inner.push(row.slice(0));
				row.length = 0;
			}
		}
		var postData = {};
		binaryImg = inner;
	*/
	if (!matrix || !matrix.length || !matrix[0].length) return matrix;
	var ite = (!skeletonLimit || isNaN(parseInt(skeletonLimit))) ? 0 : parseInt(skeletonLimit);
	var width = matrix[0].length;
	var height = matrix.length;
	var count = 0;
	while (true) {
		if (ite && count++ > ite) break;
		var delMark = [];
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var p1 = matrix[i][j];
				if (p1 !== 1) continue;
				var p4 = (j === width - 1) ? 0 : matrix[i][j + 1];
				var p8 = (j === 0) ? 0 : matrix[i][j - 1];
				var p2 = (i === 0) ? 0 : matrix[i - 1][j];
				var p3 = (i === 0 || j === width - 1) ? 0 : matrix[i - 1][j + 1];
				var p9 = (i === 0 || j === 0) ? 0 : matrix[i - 1][j - 1];
				var p6 = (i === height - 1) ? 0 : matrix[i + 1][j];
				var p5 = (i === height - 1 || j === width - 1) ? 0 : matrix[i + 1][j + 1];
				var p7 = (i === height - 1 || j === 0) ? 0 : matrix[i + 1][j - 1];
				if ((p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9) >= 2 && (p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9) <= 6) {
					var ap = 0;
					if (p2 === 0 && p3 === 1) ++ap;
					if (p3 === 0 && p4 === 1) ++ap;
					if (p4 === 0 && p5 === 1) ++ap;
					if (p5 === 0 && p6 === 1) ++ap;
					if (p6 === 0 && p7 === 1) ++ap;
					if (p7 === 0 && p8 === 1) ++ap;
					if (p8 === 0 && p9 === 1) ++ap;
					if (p9 === 0 && p2 === 1) ++ap;

					if (ap === 1 && p2 * p4 * p6 === 0 && p4 * p6 * p8 === 0)
						delMark.push({
							x: i,
							y: j
						});
				}
			}
		}
		if (delMark.length <= 0) break;
		else {
			for (var i = 0; i < delMark.length; i++) {
				matrix[delMark[i].x][delMark[i].y] = 0;
			}
		}
		delMark.length = 0;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var p1 = matrix[i][j];
				if (p1 !== 1) continue;
				var p4 = (j === width - 1) ? 0 : matrix[i][j + 1];
				var p8 = (j === 0) ? 0 : matrix[i][j - 1];
				var p2 = (i === 0) ? 0 : matrix[i - 1][j];
				var p3 = (i === 0 || j === width - 1) ? 0 : matrix[i - 1][j + 1];
				var p9 = (i === 0 || j === 0) ? 0 : matrix[i - 1][j - 1];
				var p6 = (i === height - 1) ? 0 : matrix[i + 1][j];
				var p5 = (i === height - 1 || j === width - 1) ? 0 : matrix[i + 1][j + 1];
				var p7 = (i === height - 1 || j === 0) ? 0 : matrix[i + 1][j - 1];
				if ((p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9) >= 2 && (p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9) <= 6) {
					var ap = 0;
					if (p2 === 0 && p3 === 1) ++ap;
					if (p3 === 0 && p4 === 1) ++ap;
					if (p4 === 0 && p5 === 1) ++ap;
					if (p5 === 0 && p6 === 1) ++ap;
					if (p6 === 0 && p7 === 1) ++ap;
					if (p7 === 0 && p8 === 1) ++ap;
					if (p8 === 0 && p9 === 1) ++ap;
					if (p9 === 0 && p2 === 1) ++ap;

					if (ap === 1 && p2 * p4 * p8 === 0 && p2 * p6 * p8 === 0)
						delMark.push({
							x: i,
							y: j
						});
				}
			}
		}
		if (delMark.length <= 0) break;
		else {
			for (var i = 0; i < delMark.length; i++) {
				matrix[delMark[i].x][delMark[i].y] = 0;
			}
		}
		delMark.length = 0;
	}
	return matrix;
};