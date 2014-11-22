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
	var weekdays = new Array( "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");

	if( 0 == days) {
		openingtime = 'Heute von ' + getOpeningTime( obj, days) + ' Uhr';
	} else if( 1 == days) {
		openingtime = 'Morgen von ' + getOpeningTime( obj, days) + ' Uhr';
	} else if( 0 == diffWeeks) {
		openingtime = weekdays[weekday] + ' von ' + getOpeningTime( obj, days) + ' Uhr';
	} else if( 1 == diffWeeks) {
		if( diffNow < 6) {
			openingtime = weekdays[weekday] + ' von ' + getOpeningTime( obj, days) + ' Uhr';
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

	if( 'hide' == market.todo) { return ''; }
//	if( 'mail' == market.todo) { return ''; }
//	if( '' == market.todo) { return ''; }

	var txt = '<p>' + market.name + '</p><p>' + openingtime + '</p>';
	var img = '<aside class="pack-begin"><img src="art/' + market.id + '/128.jpg"></aside>';

	return '<li>' + img + '<a href="javascript:callOneMarket(' + market.id + ');">' + txt + '</a></li>';
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

function composeMarketCalendar( obj)
{
	var txt = '';

	txt += '<p><ul class="calendar">';

	var months = new Array( "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez");
	var workingDate = new Date();
	workingDate.setDate( config.startDate.getDate());

	var weekday = (workingDate.getDay() + 6) % 7;
	for( var i = 0; i < weekday; ++i) {
		txt += '<li class="empty"></li>';
	}

	while( workingDate <= config.endDate) {
		var style = '';
		if( 1 == workingDate.getDay()) {
			style = ' style="clear:both;"';
		}

		var classStr = '';
		var daystr = dateToStr( workingDate);
	   	if(( typeof obj[ daystr] === 'undefined') || ('' == obj[ daystr].trim())) {
   			classStr = ' class="gray"';
    	}

		txt += '<li' + classStr + style + '>' + workingDate.getDate() + '<div>' + months[workingDate.getMonth()] + '</div></li>';

		workingDate.setDate( workingDate.getDate() + 1);
	}

	while( workingDate.getDay() != 1) {
		txt += '<li class="gray">' + workingDate.getDate() + '<div>' + months[workingDate.getMonth()] + '</div></li>';

		workingDate.setDate( workingDate.getDate() + 1);
	}

	txt += '</ul></p>';
	txt += '<div style="clear:both;"></div>';

	return txt;
}

function fillListOneMarket()
{
	var txt = '';
	var obj = getObjFromID( config.currentMarketId);

	txt += '<div style="margin:-1.5rem -1.5rem -1rem -1.5rem;"><img src="art/' + obj.id + '/1200.jpg" style="width:100%;"></div>';

	txt += '<div style="margin:0 -1.5rem 1rem -1.5rem;padding:1.5rem 1.5rem 0 1.5rem;text-align:center;border-bottom:1px solid #f97c17;background:#fde4d0;">';
	txt += '<p style="color:#f97c17;">' + obj.name + '</p>';
	txt += '<p><i class="icon-clock"></i>' + getNextMarketOpeningTime( obj) + ' geöffnet</p>';
	if( '' != obj.fee) {
		txt += '<p>' + obj.fee + '</p>';
	}
	txt += '</div>';

	txt += '<p>' + obj.remarks + '</p>';

	txt += '<div style="margin:1rem -1.5rem 1rem -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
	txt += '<p><ul>';
	txt += '<li style="float:left;padding:0 2rem 0 0;"><button><i class="icon-map"></i></button></li>';
	txt += '<li style="float:left;padding:0 2rem 0 0;"><button><i class="icon-star"></i></button></li>';
	txt += '<li style="float:left;padding:0 2rem 0 0;"><button>Sharen</button></li>';
	txt += '<li style="float:left;padding:0 2rem 0 0;"><button>BVG</button></li>';
	txt += '<li style="clear:both;"></li>';
	txt += '</ul></p>';
	txt += '<p>' + obj.street + ', ' + obj.zip_city + ' ' + obj.district + '</p>';
	txt += '</div>';

	txt += '<p>Öffnungszeiten</p>';
	txt += composeMarketCalendar( obj);
	txt += '<p>' + obj.hours + '</p>';

	txt += '<div style="margin:1rem -1.5rem 0 -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
	txt += '<p>Bildnachweis: ' + obj.copyright + '</p>';
	txt += '</div>';

	document.querySelector('#onemarket > article').innerHTML = txt;
}

function fillListOneMarketDebug()
{
	var txt = '';
	var obj = getObjFromID( config.currentMarketId);

	txt += '<section data-type="list"><header>' + obj.name + '</header></section>';
	txt += '<p>' + getNextMarketOpeningTime( obj) + '</p>';
	txt += '<p>' + obj.street + '<br>' + obj.zip_city + ' (' + obj.district + ')</p>';
	txt += '<p><a href="mailto:' + obj.email + '">' + obj.email + '</a></p>';
	txt += '<p><a href="http://' + obj.web + '">' + obj.web + '</a></p>';
	txt += '<p>ID: ' + obj.id + '</p>';

	if( '' == obj.fee) {
		txt += '<p>Kein Eintritt</p>';
	} else {
		txt += '<p>' + obj.fee + '</p>';
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

	var obj = getObjFromID( marketId);
//	if( 'ready' == obj.todo) {
		setTimeout( fillListOneMarket, config.timeout);
//	} else {
//		setTimeout( fillListOneMarketDebug, config.timeout);
//	}
}

document.querySelector('#btn-onemarket-back').addEventListener('click', function() {
	document.querySelector('#onemarket').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

// ·································································