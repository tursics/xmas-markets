/*jslint browser: true*/
/*global console,require*/

//-----------------------------------------------------------------------

var dataVec = [],
	lastTimeDataVec = [];

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

	if (typeof str === 'string') {
		arr = str.replace(/\r\n|\r|\n/g, '\n').split('\n');
	} else {
		console.log('- could not parse date of type ' + (typeof str) + ': ' + JSON.stringify(str, null, ' '));
	}

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
					} else if ('Uhr' === date[1]) {
						// 10.00 Uhr
						date[0] = date[0].replace('.', ':');

						if (date[0].length < 3) {
							// 10 Uhr
							date[0] = twoDigits(parseInt(date[0], 10)) + ':00';
						}

						daily = date[0];
					} else if ('Winterwelt:' === left[0]) {
						// ignore me
						left = date[0].split('-');
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
						} else {
							console.log('- could not parse date [1a]: ' + arr[i]);
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
					} else {
						console.log('- could not parse date [1b]: ' + date[0]);
					}
				} else {
					console.log('- could not parse date [2]: ' + date[0]);
				}
			} else if ((date.length === 5) && ('Uhr' === date[1]) && ('bis' === date[2]) && ('Uhr' === date[4])) {
				// 10.00 Uhr bis 20.00 Uhr
				date[0] = date[0].replace('.', ':');
				date[3] = date[3].replace('.', ':');

				if (date[0].length < 3) {
					// 10 Uhr
					date[0] = twoDigits(parseInt(date[0], 10)) + ':00';
				}
				if (date[3].length < 3) {
					// 10 Uhr
					date[3] = twoDigits(parseInt(date[3], 10)) + ':00';
				}

				daily = date[0] + '-' + date[3];
			} else if ((date.length === 3) && ('Fr,' === date[0]) && ('Sa' === date[1])) {
				weekdays[weekdaysName.indexOf(date[0].substr(0, 2))] = date[2];
				weekdays[weekdaysName.indexOf(date[1])] = date[2];
			} else if ((date.length === 3) && ('Sa,' === date[0]) && ('So' === date[1])) {
				weekdays[weekdaysName.indexOf(date[0].substr(0, 2))] = date[2];
				weekdays[weekdaysName.indexOf(date[1])] = date[2];
			} else if ((date.length === 4) && ('Mi,' === date[0]) && ('Do,' === date[1]) && ('So' === date[2])) {
				weekdays[weekdaysName.indexOf(date[0].substr(0, 2))] = date[3];
				weekdays[weekdaysName.indexOf(date[1].substr(0, 2))] = date[3];
				weekdays[weekdaysName.indexOf(date[2])] = date[3];
			} else if ((date.length === 4) && ('alle' === date[0]) && ('übrigen' === date[1]) && ('Tage' === date[2])) {
				// alle übrigen Tage 10:00-20:00
				daily = date[3];
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
			} else if ((date.length === 18) && ('täglich' === date[0]) && ('geöffnet' === date[1]) && ('ab' === date[2]) && ('Uhr;' === date[4])
					   && ('donnerstags,' === date[5]) && ('freitags' === date[6]) && ('und' === date[7]) && ('samstags' === date[8]) && ('bis' === date[9]) && ('Uhr;' === date[11])
					   && ('sonntags' === date[12]) && ('bis' === date[13]) && ('mittwochs' === date[14]) && ('bis' === date[15]) && ('Uhr' === date[17])) {
				// täglich geöffnet ab 12 Uhr; donnerstags, freitags und samstags bis 22 Uhr; sonntags bis mittwochs bis 20 Uhr
				weekdays[weekdaysName.indexOf('Do')] = date[3] + ':00-' + date[10] + ':00';
				weekdays[weekdaysName.indexOf('Fr')] = date[3] + ':00-' + date[10] + ':00';
				weekdays[weekdaysName.indexOf('Sa')] = date[3] + ':00-' + date[10] + ':00';

				weekdays[weekdaysName.indexOf('So')] = date[3] + ':00-' + date[16] + ':00';
				weekdays[weekdaysName.indexOf('Mo')] = date[3] + ':00-' + date[16] + ':00';
				weekdays[weekdaysName.indexOf('Di')] = date[3] + ':00-' + date[16] + ':00';
				weekdays[weekdaysName.indexOf('Mi')] = date[3] + ':00-' + date[16] + ':00';
			} else {
				console.log('- could not parse date [3]: ' + arr[i]);
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

	if (isNaN(Date.parse(obj.begin)) || (Date.parse(obj.begin) < Date.parse((new Date().getFullYear()) + "-01-01"))) {
		console.log('- ' + obj.name.replace(/\r\n|\r|\n/g, ' ') + ' has invalid begin date: ' + obj.begin);
	}
	if (isNaN(Date.parse(obj.end)) || (Date.parse(obj.end) < Date.parse((new Date().getFullYear()) + "-01-01"))) {
		console.log('- ' + obj.name.replace(/\r\n|\r|\n/g, ' ') + ' has invalid end date: ' + obj.end);
	}
	if (0 === data.length) {
		console.log('- ' + obj.name.replace(/\r\n|\r|\n/g, ' ') + ' has no opening hours!');
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
					splitted = checkTime.split(':');
					if ((splitted.length !== 2) || (parseInt(splitted[0], 10) > 24) || (parseInt(splitted[1], 10) > 60)) {
						console.log('- ' + obj.name + ' has wrong opening time: ' + checkTime);
					} else {
						console.log('[warning: ' + obj.name + ' has only beginning time: ' + checkTime + ']');
					}
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

function buildOpeningHours(obj, hours) {
	'use strict';

	function prefix(date) {
		return date.getFullYear() + twoDigits(date.getMonth() + 1) + twoDigits(date.getDate());
	}

	function getOpeningHours(date) {
		var ret = '', i, item, itemDate, itemWeekday, d, m,
			weekdaysName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

		for (i = 0; i < hours.length; ++i) {
			item = hours[i].split(' ');
			if (1 === item.length) {
				ret = item[0];
			} else if (2 === item.length) {
				itemDate = item[0];
				itemWeekday = weekdaysName.indexOf(itemDate);
				if (itemWeekday > -1) {
					if (itemWeekday === date.getDay()) {
						ret = item[1];
					}
				} else {
					itemDate = itemDate.split('.');
					d = parseInt(itemDate[0], 10);
					m = parseInt(itemDate[1], 10);

					if ((d === date.getDate()) && (m === (date.getMonth() + 1))) {
						ret = item[1];
					}
				}
			}
		}

		if (ret === 'geschlossen') {
			ret = '';
		}

		return ret;
	}

	var currentDate = new Date(new Date(obj.begin).getFullYear() + "-11-01"),
		endDate = new Date(obj.begin);

	for (currentDate; currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
		obj[prefix(currentDate)] = '';
	}

	currentDate = endDate;
	endDate = new Date(obj.end);
	endDate.setDate(endDate.getDate() + 1);

	for (currentDate; currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
		obj[prefix(currentDate)] = getOpeningHours(currentDate, hours);
	}

	currentDate = endDate;
	endDate = new Date((new Date(obj.begin).getFullYear() + 1) + "-01-16");
	for (currentDate; currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
		obj[prefix(currentDate)] = '';
	}

	obj.hours = hours.join('<br>');
}

//-----------------------------------------------------------------------

function buildGeo(obj, latitude, longitude) {
	'use strict';

	var lat = parseFloat(latitude.replace(',', '.')),
		lng = parseFloat(longitude.replace(',', '.'));

	if (isNaN(lat) || isNaN(lng) || (lat < 51.0) || (lat > 53.9) || (lng < 11.0) || (lng > 14.9)) {
		console.log('- ' + obj.name + ' is not geo-coded correctly: ' + latitude + ' - ' + longitude);
	}

	obj.lat = lat;
	obj.lng = lng;
}

//-----------------------------------------------------------------------

function buildInternet(obj, www, mail) {
	'use strict';

	if (mail.indexOf('mailto:') === 0) {
		mail = mail.substr(7);
	}
	if ((www.length > 0) && (www.indexOf('http://') < 0) && (www.indexOf('https://') < 0)) {
		www = 'http://' + www;
	}

	obj.email = mail;
	obj.web = www;
}

//-----------------------------------------------------------------------

function push_back(obj) {
	'use strict';

	var i, item;

	for (i = 0; i < dataVec.length; ++i) {
		item = dataVec[i];
		if ((item.id !== null) && (typeof obj.id !== 'undefined')) {
			if (item.id === obj.id) {
				console.log('- duplicate market ' + obj.name);
			} else if ((item.lat !== 0) && (item.lng !== 0) && (parseInt(item.lat * 10000, 10) === parseInt(obj.lat * 10000, 10)) && (parseInt(item.lng * 10000, 10) === parseInt(obj.lng * 10000, 10))) {
				if (obj.name !== item.name) {
					console.log('- duplicate market position ' + obj.name + ' and ' + item.name);
				} else {
					console.log('- duplicate market position ' + obj.name);
				}
			}
		}
	}

	if (obj.uuid === null) {
		console.log('- ' + obj.name.replace(/\r\n|\r|\n/g, ' ') + ' has no UUID');
	}

	dataVec.push(obj);
}

//-----------------------------------------------------------------------

function addOwnData() {
	'use strict';

	var i, j, item;

	for (i = 0; i < lastTimeDataVec.length; ++i) {
		item = lastTimeDataVec[i];
		for (j = 0; j < dataVec.length; ++j) {
			if (dataVec[j].uuid === item.uuid) {
				break;
			}
		}

		if (j >= dataVec.length) {
			console.log('- missing old market ' + item.name);
			push_back(item);
		}
	}
}

//-----------------------------------------------------------------------

function getRefData(obj) {
	'use strict';

	function normalizeName(name) {
		var str = name || '';

		return str;
	}

	function guid() {
//		function s4() {
//			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//		}
//		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		return Math.floor((1 + Math.random()) * 0x10000).toString(10);
	}

	var i = 0,
		name = normalizeName(obj.name);

	for (i = 0; i < lastTimeDataVec.length; ++i) {
//		if (lastTimeDataVec[i].id === id) {
		if ((parseInt(lastTimeDataVec[i].lat * 10000, 10) === parseInt(obj.lat * 10000, 10)) && (parseInt(lastTimeDataVec[i].lng * 10000, 10) === parseInt(obj.lng * 10000, 10))) {
			return lastTimeDataVec[i];
		}
	}

	for (i = 0; i < lastTimeDataVec.length; ++i) {
		if (normalizeName(lastTimeDataVec[i].name) === name) {
			return lastTimeDataVec[i];
		}
	}

	return {
		id: obj.id,
		uuid: guid(),
		district: '',
		name: '',
		location: '',
		street: '',
		zip_city: '',
		begin: '',
		end: '',
		organizer: '',
		org_address: '',
		org_contact: '',
		phone: '',
		phone2: '',
		fax: '',
		email: '',
		web: '',
		facebook: '',
		kind: '',
		lat: '',
		lng: '',
		fee: '',
		remarks: '',
		todo: '',
		transit: ''
//		bemerkungen: ''
	};
}

//-----------------------------------------------------------------------

function analyseDataLineBerlin(data) {
	'use strict';

	var obj = {}, hours, ref;

	obj.id = parseInt(data.id, 10);
	obj.name = data.name;
	buildGeo(obj, data.lat, data.lng);

	ref = getRefData(obj);

	obj.uuid = ref.uuid;
	obj.district = data.bezirk || '';
	obj.name = data.name;
	obj.location = '';
	obj.street = data.strasse;
	obj.zip_city = data.plz_ort;
	obj.begin = data.von;
	obj.end = data.bis;

	hours = parseOpeningHours(data.oeffnungszeiten);
	testOpeningHours(obj, hours);
	buildOpeningHours(obj, hours);
	buildInternet(obj, data.w3, data.email);

	obj.organizer = data.veranstalter;
//	obj.org_address = ref.;
	obj.org_contact = ref.org_contact;
//	obj.phone = ref.;
//	obj.phone2 = ref.;
//	obj.fax = ref.;
	obj.facebook = ref.facebook || '';
	obj.twitter = ref.twitter || '';
//	obj.kind = ref.kind;
	obj.fee = ref.fee;
	obj.remarks = ref.remarks;
	obj.todo = ref.todo;
//	obj.transit = ref.;

//  obj.bemerkungen = data.bemerkungen;

	push_back(obj);
}

//-----------------------------------------------------------------------

function analyseDataLineMoers(data) {
	'use strict';

	var obj = {}, dates, hours, ref = {}, arr;

	obj.id = null;
	obj.name = data.title;
	obj.lat = 0;
	obj.lng = 0;
//	buildGeo(obj, data.lat, data.lng);

	ref = getRefData(obj);

	obj.uuid = ref.uuid || null;
	obj.district = '';
	obj.name = data.title;
	obj.location = data.locationname;
	obj.street = data.locationstreetaddress;
	obj.zip_city = data.locationzip + ' ' + data.location;

	dates = data.date.split('bis');
	if (dates.length === 1) {
		obj.begin = dates[0];
		obj.end = dates[0];
	} else if (dates.length === 2) {
		obj.begin = dates[0].trim();
		obj.end = dates[1].trim();
	} else {
		console.log('Invalid date of ' + obj.name + ': ' + data.date);
	}

	arr = obj.begin.split('.');
	obj.begin = arr[2] + '-' + arr[1] + '-' + arr[0];
	arr = obj.end.split('.');
	obj.end = arr[2] + '-' + arr[1] + '-' + arr[0];

	hours = parseOpeningHours(data.time);
	testOpeningHours(obj, hours);
	buildOpeningHours(obj, hours);
	buildInternet(obj, data.documenturl, '');

	obj.organizer = data.organizername;
	obj.org_contact = ref.org_contact || data.organizerurl;
	obj.group = ref.group || '';
	obj.facebook = ref.facebook || '';
	obj.twitter = ref.twitter || '';
	obj.fee = ref.fee;
	obj.remarks = ref.remarks;
	obj.todo = ref.todo;

	push_back(obj);
}

//-----------------------------------------------------------------------

function analyseDataLineWesel(data) {
	'use strict';

	var obj = {}, dates, hours, ref = {}, arr, test;

	obj.id = parseInt(data.datensatznummer, 10);
	obj.name = data.bezeichnung;
	obj.lat = 0;
	obj.lng = 0;
//	buildGeo(obj, data.lat, data.lng);

	ref = getRefData(obj);

	obj.uuid = ref.uuid || null;
	obj.district = '';
	obj.name = data.bezeichnung;
	obj.location = data.veranstaltungsort;
	obj.street = data.strasse;
	obj.zip_city = data.plz + ' ' + data.ort;
	obj.begin = data.datum1;
	obj.end = data.datum2;

	arr = obj.begin.split('.');
	obj.begin = arr[2] + '-' + arr[1] + '-' + arr[0];
	if (typeof obj.end !== 'string') {
		obj.end = JSON.stringify(obj.end, null, ' ');
		if ('{}' === obj.end) {
			obj.end = obj.begin;
		}
	} else {
		arr = obj.end.split('.');
		obj.end = arr[2] + '-' + arr[1] + '-' + arr[0];
	}

	test = new Date(obj.begin);
	if (!isNaN(test) && (1 <= test.getMonth()) && (test.getMonth() < 10)) {
		// only accept november, december and january dates
		return;
	}

	hours = parseOpeningHours('');
	testOpeningHours(obj, hours);
	buildOpeningHours(obj, hours);
	buildInternet(obj, data.link_href, '');

	obj.organizer = data.veranstalter_name;
	obj.org_contact = ref.org_contact || data.veranstalter_website;
	obj.group = ref.group || '';
	obj.facebook = ref.facebook || '';
	obj.twitter = ref.twitter || '';
	obj.fee = ref.fee || '';
	obj.remarks = ref.remarks || data.kurztext;
	obj.todo = ref.todo || 'new';

	if (data.highlight === 'ja') {
		console.log('>> ' + data.highlight_bez + ' << ' + data.veranstalter_website);
	}
/*
{
  kategorie: 'Musik und Konzerte',
  beschreibung: {},
  buehnenhaus_abo: {},
  buecherei_reihe: {},
  fb5_veranstaltung: {},
  gs_veranstaltung: {},
  stadtfuehrung: {},
  vos: {},
  vos_datum: {},
  wes_775: 'nein' }
*/

	push_back(obj);
}

//-----------------------------------------------------------------------

function analyseDataLineKrefeld(data) {
	'use strict';

	var obj = {}, dates, time, hours, ref = {}, test,
		i, events = ['Weihnachten', 'Weihnachtsmarkt'];

	obj.id = data['@unid'];
	obj.name = data.DocName;
	obj.lat = 0;
	obj.lng = 0;
//	buildGeo(obj, data.lat, data.lng);

//	ref = getRefData(obj);

	obj.uuid = ref.uuid || null;
	obj.district = '';
	obj.name = data.DocName;
	obj.location = ref.location || '';
	obj.street = ref.street || '';
	obj.zip_city = ref.zip_city || '';
	obj.begin = data.Start;
	obj.end = data.End;

	time = obj.begin.split('T')[1].split(':')[0] + ':' + obj.begin.split('T')[1].split(':')[1];
	obj.begin = obj.begin.split('T')[0];
	if (obj.end.length > 0) {
		time += '-' + obj.end.split('T')[1].split(':')[0] + ':' + obj.end.split('T')[1].split(':')[1];
		obj.end = obj.end.split('T')[0];
	} else {
		obj.end = obj.begin;
	}

//	test = new Date(obj.begin);
//	if (!isNaN(test) && (1 <= test.getMonth()) && (test.getMonth() < 10)) {
//		// only accept november, december and january dates
//		return;
//	}

	if (typeof data.EventType === 'string') {
		if (events.indexOf(data.EventType) === -1) {
			return;
		}
	} else {
		for (i = 0; i < data.EventType.length; ++i) {
			if (events.indexOf(data.EventType[i]) > -1) {
				break;
			}
		}
		if (i === data.EventType.length) {
			return;
		}
	}

	hours = parseOpeningHours(time);
	testOpeningHours(obj, hours);
	buildOpeningHours(obj, hours);
	buildInternet(obj, 'https://www.krefeld.de' + data.URL, '');

	obj.organizer = ref.organizer || '';
	obj.org_contact = ref.org_contact || '';
	obj.group = ref.group || '';
	obj.facebook = ref.facebook || '';
	obj.twitter = ref.twitter || '';
	obj.fee = ref.fee || '';
	obj.remarks = ref.remarks || data.kurztext;
	obj.todo = ref.todo || 'new';

	if (data.EventHighlight === 'ja') {
		console.log('>> ' + obj.name + ' << ' + obj.web);
	}

/*
{ '@entryid': '1-AA548B8CADE383CEC1257FE60036C0AB',
  '@position': '1',
  '@siblings': 556,
  EventSubTitle: '',
  EventType: 'Kultur',
  Kurztext: 'In den Ausstellungsräumen ist unter dem Titel "Das Abenteuer unserer Sammlung I" aus dem immensen Fundus der Kunstmuseen Krefeld eine ungewöhnliche Inszenierung der eigenen Sammlung zu sehen.',
  Thumb: '' }

      "EventType":
      ["Kultur","Weihnachten","Weihnachtsmarkt"
      ],
*/

	push_back(obj);
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
	str += JSON.stringify(data, null, "\t");
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

	if (typeof data !== 'undefined') {
		for (i = 0; i < data.length; ++i) {
			analyseDataLineBerlin(data[i]);
		}
	} else if (typeof json.christmasevents !== 'undefined') {
		data = json.christmasevents.entry;

		for (i = 0; i < data.length; ++i) {
			analyseDataLineMoers(data[i]);
		}
	} else if (typeof json.pressemeldungen !== 'undefined') {
		data = json.pressemeldungen.datensatz;

		for (i = 0; i < data.length; ++i) {
			analyseDataLineWesel(data[i]);
		}
	} else {
		data = json;
		for (i = 0; i < data.length; ++i) {
			analyseDataLineKrefeld(data[i]);
		}
	}

	addOwnData();

	saveAsJSFile(savepath, dataVec);
}

//-----------------------------------------------------------------------

function loadLastTimeJS(filepath, callback) {
	'use strict';

	console.log('Loading ' + filepath);

	var fs = require('fs');

	if (fs.existsSync(filepath)) {
		fs.readFile(filepath, 'utf-8', function (err, json) {
			if (err) {
				console.error(err);
			} else {
				if ((typeof json === 'string') && (0 === json.indexOf('define({ data:'))) {
					json = JSON.parse(json.substr(14, json.length - 14 - 4)); // });\n
				}

				lastTimeDataVec = json;
				callback();
			}
		});
	} else {
		lastTimeDataVec = [];
		callback();
	}
}

//-----------------------------------------------------------------------

function loadJSON(filepath, savepath, callback) {
	'use strict';

	console.log('Loading ' + filepath);

	var fs = require('fs'),
		parser;

	fs.readFile(filepath, 'utf-8', function (err, json) {
		if (err) {
			console.error(err);
		} else {
			if (typeof json === 'string') {
				if ('<?xml' === json.substr(0, 5)) {
					parser = require('xml2json');
					json = parser.toJson(json);
				}
				json = JSON.parse(json);
			}

			analyseJSON(savepath, json);

			callback();
		}
	});
}

//-----------------------------------------------------------------------

function downloadFile(filepath, uri, callback) {
	'use strict';

	var fs = require('fs'),
		http = require('http'),
		https = require('https'),
		file = fs.createWriteStream(filepath);

	if (uri.indexOf('https://') === 0) {
		file.on('finish', function () {
			file.close(callback);
		});

		https.get(uri, function (response) {
			response.pipe(file);
		});
	} else {
		file.on('finish', function () {
			file.close(callback);
		});

		http.get(uri, function (response) {
			response.pipe(file);
		});
	}
}

//-----------------------------------------------------------------------

function parseFolder(path, dataSource, dataURI, fileType, callback) {
	'use strict';

	var fs = require('fs'),
		now = new Date(),
		filename = dataSource + '-' + now.getFullYear() + twoDigits(now.getMonth() + 1) + twoDigits(now.getDate()) + '.' + fileType,
		savename = dataSource + '-' + now.getFullYear() + twoDigits(now.getMonth() + 1) + twoDigits(now.getDate()) + '.js',
		filepath = path + '/' + filename,
		savepath = path + '/' + savename,
		releasepath = path + '/../data/' + dataSource + '.js',
		found = false;

	dataVec = [];
	lastTimeDataVec = [];

	fs.readdir(path, function (err, files) {
		files.forEach(function (file) {
			if (file === filename) {
				found = true;
				console.log('Use cached file ' + filepath);

				loadLastTimeJS(releasepath, function () {
					loadJSON(filepath, savepath, function () {
						fs.createReadStream(savepath).pipe(fs.createWriteStream(releasepath));

						callback();
					});
				});
			}
		});

		if (!found) {
			console.log('Downloading ' + dataURI);
			downloadFile(filepath, dataURI, function () {
				loadLastTimeJS(releasepath, function () {
					loadJSON(filepath, savepath, function () {
						fs.createReadStream(savepath).pipe(fs.createWriteStream(releasepath));

						callback();
					});
				});
			});
		}
	});
}

//-----------------------------------------------------------------------

function buildBerlin(callback) {
	'use strict';

	parseFolder('.', 'berlin', 'http://www.berlin.de/sen/wirtschaft/service/maerkte-feste/weihnachtsmaerkte/index.php/index/all.json?ipp=500', 'json', callback);
}

//-----------------------------------------------------------------------

function buildBrandenburg(callback) {
	'use strict';

	parseFolder('.', 'brandenburg', 'http://www.berlin.de/sen/wirtschaft/service/maerkte-feste/weihnachtsmaerkte/brandenburger-weihnachtsmaerkte/index.php/index.json?ipp=500', 'json', callback);
}

//-----------------------------------------------------------------------

function buildMoers(callback) {
	'use strict';

	parseFolder('.', 'moers', 'https://www.moers.de/de/opendataxml/christmas-xml/', 'xml', callback);
}

//-----------------------------------------------------------------------

function buildKleve(callback) {
	'use strict';

//	parseFolder('.', 'kleve', 'https://www.offenesdatenportal.de/dataset/fc1b9c2c-cbd3-42e7-98ce-de8abd9aec11/resource/e3682fd9-4952-4356-b349-3b611e79c8f5/download/160427-marktverzeichnis-2016.csv', 'csv', callback);
//	parseFolder('.', 'kleve', 'https://www.kleve.de/www/event.nsf/apijson.xsp/view-event-month?compact=false', 'json', callback);

	callback();
}

//-----------------------------------------------------------------------

function buildWesel(callback) {
	'use strict';

	parseFolder('.', 'wesel', 'https://www.wesel.de/de/system/-preview-xml/&src1=xml-veranstaltungen', 'xml', callback);

//	callback();
}

//-----------------------------------------------------------------------

function buildKrefeld(callback) {
	'use strict';

	parseFolder('.', 'krefeld', 'https://www.krefeld.de/www/event.nsf/apijson.xsp/view-event-month?compact=false', 'json', callback);

//	callback();
}

//-----------------------------------------------------------------------

try {
	console.log();
	buildBerlin(function () {
		'use strict';

		console.log();
		buildBrandenburg(function () {
			console.log();
			buildMoers(function () {
				console.log();
				buildKleve(function () {
					console.log();
					buildWesel(function () {
						console.log();
						buildKrefeld(function () {
						});
					});
				});
			});
		});
	});
} catch (e) {
	console.error(e);
}

//-----------------------------------------------------------------------
//eof
