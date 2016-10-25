/*jslint browser: true*/
/*global console,require*/

//-----------------------------------------------------------------------

var dataSource = 'berlin',
	dataURI = 'http://www.berlin.de/sen/wirtschaft/service/maerkte-feste/weihnachtsmaerkte/index.php/index.json?ipp=500',
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

function analyseDataLine(data) {
	'use strict';

	var obj = {};

	function parseDates() {
		var currentDate, endDate;
		obj.begin = data.von;
		obj.end = data.bis;

		currentDate = new Date(new Date(obj.begin).getFullYear() + "-11-16");
		endDate = new Date((new Date(obj.begin).getFullYear() + 1) + "-01-07");

		for (currentDate; currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
			obj[currentDate.getFullYear() + twoDigits(currentDate.getMonth() + 1) + twoDigits(currentDate.getDate())] = '';
		}

		obj.hours = data.oeffnungszeiten;
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
