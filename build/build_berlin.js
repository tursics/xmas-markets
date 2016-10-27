/*jslint browser: true*/
/*global console,require*/

//-----------------------------------------------------------------------

var dataSource = 'berlin',
	dataURI = 'http://www.berlin.de/sen/wirtschaft/service/maerkte-feste/weihnachtsmaerkte/index.php/index/all.json?ipp=500',
	dataVec = [];

//-----------------------------------------------------------------------

function push_back(data) {
	'use strict';

	dataVec.push(data);
}

//-----------------------------------------------------------------------

function twoDigits(val) {
	'use strict';

	return val.toString().length < 2 ? '0' + val : val.toString();
}

//-----------------------------------------------------------------------

function parseOpeningHours(str) {
	'use strict';

	var arr = [],
		weekdaysName = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
		weekdaysNameDot = ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.'],
		weekdays = ['', '', '', '', '', '', ''],
		days = [],
		daily = '',
		date,
		left,
		i,
		j,
		from,
		fromDot,
		to,
		res = [];

	arr = str.replace(/\r\n|\r|\n/g, '\n').split('\n');

	for (i = 0; i < arr.length; ++i) {
		if (arr[i].length > 0) {
			date = arr[i].trim().split(' ');
			if (date.length === 1) {
				// 10:00-20:00
				daily = date[0];
			} else if (date.length === 2) {
				left = date[0].split('-');
				if (left.length === 1) {
					from = weekdaysName.indexOf(left[0]);
					fromDot = weekdaysNameDot.indexOf(left[0]);
					if (from > -1) {
						// Mo 10:00-20:00
						weekdays[from] = date[1];
					} else if (fromDot > -1) {
						// Mo. 10:00-20:00
						weekdays[fromDot] = date[1];
					} else if ('täglich' === left[0]) {
						// täglich 10:00-20:00
						daily = date[1];
					} else {
						left = date[0].split('.');
						if (left.length === 3) {
							// 24.12. 10:00-20:00
							days.push(left[0] + '.' + left[1] + '. ' + date[1]);
						} else if ((left.length === 4) && (left[1][0] === '/')) {
							// 24./25.12. 10:00-20:00
							days.push(left[0] + '.' + left[2] + '. ' + date[1]);
							days.push(left[1].substr(1) + '.' + left[2] + '. ' + date[1]);
						} else if ((left.length === 5) && (left[1][0] !== '/') && (left[2][0] === '/')) {
							// 24.12/25.12. 10:00-20:00
							days.push(left[0] + '.' + left[1] + '. ' + date[1]);
							days.push(left[2].substr(1) + '.' + left[3] + '. ' + date[1]);
						}
					}
				} else if (left.length === 2) {
					from = weekdaysName.indexOf(left[0]);
					to = weekdaysName.indexOf(left[1]);
					if ((from > -1) && (to > -1)) {
						// Mo-So 10:00-20:00
						if (to < from) {
							to += 7;
						}
						for (j = from; j < (to + 1); ++j) {
							weekdays[j % 7] = date[1].replace(',', '');
						}
					}
				}
			} else if ((date.length === 3) && ('Fr,' === date[0]) && ('Sa' === date[1])) {
				weekdays[weekdaysName.indexOf(date[0].substr(0, 2))] = date[2];
				weekdays[weekdaysName.indexOf(date[1])] = date[2];
			} else if ((date.length === 3) && ('Sa,' === date[0]) && ('So' === date[1])) {
				weekdays[weekdaysName.indexOf(date[0].substr(0, 2))] = date[2];
				weekdays[weekdaysName.indexOf(date[1])] = date[2];
			} else if ((date.length === 5) && ('am' === date[0]) && ('und' === date[2])) {
				// am 24.12. und 25.12. 10:00-20:00
				days.push(date[1] + ' ' + date[4]);
				days.push(date[3] + ' ' + date[4]);
			} else if ((date.length === 6) && ('Do,' === date[0]) && ('Sa' === date[2]) && ('24.12.' === date[4]) && ('geschlossen' === date[5])) {
				// Do, Fr, Sa 14:00-22:00, 24.12. geschlossen
				weekdays[weekdaysName.indexOf(date[0].substr(0, 2))] = date[3].replace(',', '');
				weekdays[weekdaysName.indexOf(date[1].substr(0, 2))] = date[3].replace(',', '');
				weekdays[weekdaysName.indexOf(date[2])] = date[3].replace(',', '');
				days.push(date[4] + ' ' + date[5]);
			}
		}
	}

	if (daily.length > 0) {
		res.push(daily);
	}
	for (i = 0; i < weekdays.length; ++i) {
		if (weekdays[i] !== '') {
			res.push(weekdaysName[i] + ' ' + weekdays[i]);
		}
	}
	for (i = 0; i < days.length; ++i) {
		res.push(days[i]);
	}

	return res;
}

//-----------------------------------------------------------------------

function testOpeningHours(obj, data) {
	'use strict';

	var i, item, checkDate, checkTime, splitted,
		weekdaysName = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

	if (0 === data.length) {
		console.log('- ' + obj.name + ' has no opening hours!');
	}

	for (i = 0; i < data.length; ++i) {
		item = data[i].split(' ');
		checkDate = '';
		checkTime = '';
		if (1 === item.length) {
			checkTime = item[0];
		} else if (2 === item.length) {
			checkDate = item[0];
			checkTime = item[1];
		} else {
			console.log('- ' + obj.name + ' has wrong opening hours: ' + data[i]);
		}

		if ('' !== checkDate) {
			if (-1 === weekdaysName.indexOf(checkDate)) {
				splitted = checkDate.split('.');
				if ((checkDate.length !== 6) || (splitted.length !== 3) || (parseInt(splitted[0], 10) > 31) || (parseInt(splitted[1], 10) > 12) || ('' !== splitted[2])) {
					console.log('- ' + obj.name + ' has wrong opening date: ' + checkDate);
				}
			}
		}
		if ('' !== checkTime) {
			splitted = checkTime.split('-');
			if ((checkTime.length !== 11) || (splitted.length !== 2) || (splitted[0].length !== 5) || (splitted[1].length !== 5)) {
				if ('geschlossen' !== checkTime) {
					console.log('- ' + obj.name + ' has wrong opening time: ' + checkTime);
				}
			} else {
				splitted = checkTime.split('-')[0].split(':');
				if ((splitted.length !== 2) || (parseInt(splitted[0], 10) > 24) || (parseInt(splitted[1], 10) > 60)) {
					console.log('- ' + obj.name + ' has wrong opening time: ' + checkTime);
				}
				splitted = checkTime.split('-')[1].split(':');
				if ((splitted.length !== 2) || (parseInt(splitted[0], 10) > 24) || (parseInt(splitted[1], 10) > 60)) {
					console.log('- ' + obj.name + ' has wrong opening time: ' + checkTime);
				}
			}
		}
	}
}

//-----------------------------------------------------------------------

function analyseDataLine(data) {
	'use strict';

	var obj = {};

	function parseDates() {
		var currentDate, endDate,
			hours = parseOpeningHours(data.oeffnungszeiten);
//		obj.begin = data.von;
//		obj.end = data.bis;

		testOpeningHours(obj, hours);

		currentDate = new Date(new Date(obj.begin).getFullYear() + "-11-16");
		endDate = new Date((new Date(obj.begin).getFullYear() + 1) + "-01-07");

//		for (currentDate; currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
//			obj[currentDate.getFullYear() + twoDigits(currentDate.getMonth() + 1) + twoDigits(currentDate.getDate())] = '';
//		}

		obj.hours = hours.join('<br>');
		obj.oeffnungszeiten = data.oeffnungszeiten;
	}

	obj.name = data.name;
	parseDates();

	push_back(obj);

//	console.log(obj.name);
}

//-----------------------------------------------------------------------

function fine() {
	'use strict';

	console.log('');
}

//-----------------------------------------------------------------------

function saveAsJSFile(filepath, data) {
	'use strict';

	console.log('Saving ' + filepath);

	var fs = require('fs'),
		str = '';

	str += "define({ data:\n";
	str += JSON.stringify(data, null, '  ');
	str += "\n});\n";

	fs.writeFile(filepath, str, function (err) {
		if (err) {
			return console.log(err);
		}

		fine();
	});
}

//-----------------------------------------------------------------------

function analyseJSON(savepath, json) {
	'use strict';

	console.log('Analysing file');

	var data = json.index,
		i;

	for (i = 0; i < data.length; ++i) {
		analyseDataLine(data[i]);
	}

	saveAsJSFile(savepath, dataVec);
}

//-----------------------------------------------------------------------

function loadJSON(filepath, savepath) {
	'use strict';

	console.log('Loading ' + filepath);

	var fs = require('fs');

	fs.readFile(filepath, 'utf-8', function (err, json) {
		if (err) {
			console.error(err);
		} else {
			if (typeof json === 'string') {
				json = JSON.parse(json);
			}
			analyseJSON(savepath, json);
		}
	});
}

//-----------------------------------------------------------------------

function downloadFile(filepath, uri, savepath) {
	'use strict';

	console.log('Downloading ' + uri);

	var fs = require('fs'),
		http = require('http'),
		file = fs.createWriteStream(filepath);

	http.get(uri, function (response) {
		response.pipe(file);
		loadJSON(filepath, savepath);
	});
}

//-----------------------------------------------------------------------

function parseFolder(path) {
	'use strict';

	var fs = require('fs'),
		now = new Date(),
		filename = dataSource + '-' + now.getFullYear() + twoDigits(now.getMonth() + 1) + twoDigits(now.getDate()) + '.json',
		savename = dataSource + '-' + now.getFullYear() + twoDigits(now.getMonth() + 1) + twoDigits(now.getDate()) + '.js',
		filepath = path + '/' + filename,
		savepath = path + '/' + savename,
		found = false;

	fs.readdir(path, function (err, files) {
		files.forEach(function (file) {
			if (file === filename) {
				found = true;
				console.log('Use cached file ' + filepath);
				loadJSON(filepath, savepath);
			}
		});

		if (!found) {
			downloadFile(filepath, dataURI, savepath);
		}
	});
}

//-----------------------------------------------------------------------

function buildBerlin() {
	'use strict';

	parseFolder('.');
}

//-----------------------------------------------------------------------

try {
	console.log();
	buildBerlin();
} catch (e) {
	console.error(e);
}

//-----------------------------------------------------------------------
//eof
