var config = this.config || {};
config.timeout = 400;
config.readyListAllMarkets = false;
config.currentMarketId = 0;
config.startDate = new Date();
config.startDate.setFullYear( 2014, 10, 17); // month - 1
config.endDate = new Date();
config.endDate.setFullYear( 2015, 0, 6); // month - 1

// ·································································

function composeSectionList( content)
{
	return '<section data-type="list">' + content + '</section>';
}

function composeList( content)
{
	return '<ul>' + content + '</ul>';
}

function dateToStr( obj)
{
	var str = obj.getFullYear().toString();

	if( obj.getMonth() < 9) {
		str += '0';
	}
	str += obj.getMonth() + 1;
	if( obj.getDate() < 10) {
		str += '0';
	}
	str += obj.getDate();

	return str;
}

function getNextOpeningDays( obj)
{
	var days = 0;

	var workingDate = new Date();
	while( workingDate < config.startDate) {
		++days;
		workingDate.setDate( workingDate.getDate() + 1);
	}

	var late = new Date();
	late.setTime( config.endDate.getTime());
	late.setDate( late.getDate() + 1);

	while( workingDate < late) {
		var daystr = dateToStr( workingDate);
    	if(( typeof obj[ daystr] !== 'undefined') && (obj[ daystr].trim() != '')) {
    		break;
	    }

		++days;
		workingDate.setDate( workingDate.getDate() + 1);
	}

	return days;
}

function getOpeningTime( obj, diffdays)
{
	var workingDate = new Date();
	workingDate.setDate( workingDate.getDate() + diffdays);

	var daystr = dateToStr( workingDate);
   	if( typeof obj[ daystr] !== 'undefined') {
   		return obj[ daystr].trim();
    }

	return '';
}

function sortDataByDate( a, b)
{
	var daysA = getNextOpeningDays( a);
	var daysB = getNextOpeningDays( b);

	if( daysA == daysB) {
		return getOpeningTime( a, daysA) > getOpeningTime( b, daysB);
	}

	return daysA > daysB;
}

function getNextMarketOpeningTime( obj)
{
	var days = getNextOpeningDays( obj);
	var openingtime = '';

	var workingDate = new Date();
	workingDate.setHours( 0, 0, 0, 0);
	var nowTime = workingDate.getTime();
	workingDate.setDate( workingDate.getDate() - (workingDate.getDay() + 6) % 7);
	var mondayTime = workingDate.getTime();

	workingDate = new Date();
	workingDate.setDate( workingDate.getDate() + days);
	var workTime = workingDate.getTime();
	var weekday = workingDate.getDay();
	var diffNow = parseInt((workTime - nowTime) / 1000 / 60 / 60 / 24);
	var diffDays = parseInt((workTime - mondayTime) / 1000 / 60 / 60 / 24);
	var diffWeeks = parseInt(diffDays / 7);
	var weekdays = new Array( "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag","Freitag","Samstag");

	if( 0 == days) {
		openingtime = 'Heute ' + getOpeningTime( obj, days) + ' Uhr';
	} else if( 1 == days) {
		openingtime = 'Morgen ' + getOpeningTime( obj, days) + ' Uhr';
	} else if( 0 == diffWeeks) {
		openingtime = weekdays[weekday] + ' ' + getOpeningTime( obj, days) + ' Uhr';
	} else if( 1 == diffWeeks) {
		if( diffNow < 6) {
			openingtime = weekdays[weekday] + ' ' + getOpeningTime( obj, days) + ' Uhr';
		} else {
			openingtime = 'Nächste Woche ' + weekdays[weekday];
		}
	} else if( true) {
		openingtime = weekdays[weekday] + ' in ' + diffWeeks + ' Wochen';
	} else {
		openingtime = 'In ' + days + ' Tagen';
	}

	return openingtime;
}

function composeMarketItem( number)
{
    if( typeof data[ number] === 'undefined') {
    	return '';
    }

	var market = data[ number];
	var openingtime = getNextMarketOpeningTime( market);

	return '<li><a href="javascript:callOneMarket(' + market.id + ');"><p>' + market.name + '</p><p>' + openingtime + '</p></a></li>';
}

function fillListAllMarkets()
{
	if( config.readyListAllMarkets) {
		return;
	}
	config.readyListAllMarkets = true;

	var txt = '';

 	data.sort( sortDataByDate);
 	for( var i = 0; i < data.length; ++i) {
		txt += composeMarketItem( i);
	}

	txt = composeList( txt);
	txt = composeSectionList( txt);
	document.querySelector('#allmarkets > article').innerHTML = txt;
}

document.querySelector('#btn-allmarkets').addEventListener('click', function() {
	document.querySelector('#allmarkets').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
	setTimeout( fillListAllMarkets, config.timeout);
});
document.querySelector('#btn-allmarkets-back').addEventListener('click', function() {
	document.querySelector('#allmarkets').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

// ·································································

function getObjFromID( id)
{
 	for( var i = 0; i < data.length; ++i) {
		if( data[i].id == id) {
			return data[i];
		}
	}

	return null;
}

function fillListOneMarket()
{
	var txt = '';
	var obj = getObjFromID( config.currentMarketId);

	txt += '<section data-type="list"><header>' + obj.name + '</header></section>';
	txt += '<p>' + getNextMarketOpeningTime( obj) + '</p>';
	txt += '<p>' + obj.street + '<br>' + obj.zip_city + ' (' + obj.district + ')</p>';
	txt += '<p><a href="mailto:' + obj.email + '">' + obj.email + '</a></p>';
	txt += '<p><a href="http://' + obj.web + '">' + obj.web + '</a></p>';

	if( 0 == obj.fee) {
		txt += '<p>Kein Eintritt</p>';
	} else {
		txt += '<p>Achtung: Eventuell ist Eintritt zu bezahlen</p>';
	}

	txt += '<p>' + obj.kind + '</p>';
	txt += '<p>' + obj.remarks + '</p>';

	document.querySelector('#onemarket > article').innerHTML = txt;
}

function callOneMarket( marketId)
{
	document.querySelector('#onemarket').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';

	var txt = '<div class="center"><progress></progress></div>';
	document.querySelector('#onemarket > article').innerHTML = txt;

	config.currentMarketId = marketId;

	setTimeout( fillListOneMarket, config.timeout);
}

document.querySelector('#btn-onemarket-back').addEventListener('click', function() {
	document.querySelector('#onemarket').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

// ·································································