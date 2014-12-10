var config = this.config || {};
config.timeout = 400;
config.currentMarketId = 0;
config.startDate = new Date();
config.startDate.setFullYear( 2014, 10, 17); // month - 1
config.endDate = new Date();
config.endDate.setFullYear( 2015, 0, 6); // month - 1

// ·································································
/*
var utils = this.utils || {};

utils.status = (function() {
	var DISPLAYED_TIME = 2000;
	var section, content;
	var timeoutID;

	function clearHideTimeout() {
		if( timeoutID === null) {
			return;
		}

		window.clearTimeout( timeoutID);
		timeoutID = null;
	}

	function show( message, duration) {
		clearHideTimeout();
		content.innerHTML = '';

		if( typeof message === 'string') {
			content.textContent = message;
		} else {
			try {
				content.appendChild( message);
			} catch( ex) {
				console.error( 'DOMException: ' + ex.message);
			}
		}

		section.classList.remove( 'hidden');
		section.classList.add( 'onviewport');
		timeoutID = window.setTimeout( hide, duration || DISPLAYED_TIME);
	}

	function animationEnd( evt) {
		var eventName = 'status-showed';

		if( evt.animationName === 'hide') {
			clearHideTimeout();
			section.classList.add( 'hidden');
			eventName = 'status-hidden';
		}

		window.dispatchEvent( new CustomEvent( eventName));
	}

	function hide() {
		section.classList.remove( 'onviewport');
	}

	function destroy() {
		section.removeEventListener( 'animationend', animationEnd);
		document.body.removeChild( section);
		clearHideTimeout();
		section = content = null;
	}

	function build() {
		section = document.createElement( 'section');

		section.setAttribute( 'role', 'status');
		section.classList.add( 'hidden');

		content = document.createElement( 'p');

		section.appendChild( content);
		document.body.appendChild( section);

		section.addEventListener( 'animationend', animationEnd);
	}

	function initialize() {
		if( section) {
			return;
		}

		build();
	}

	if( document.readyState === 'complete') {
		initialize();
	} else {
		document.addEventListener( 'DOMContentLoaded', function loaded() {
			document.removeEventListener( 'DOMContentLoaded', loaded);
			initialize();
		});
	}

	return {
		init: initialize,
		show: show,
		hide: hide,
		destroy: destroy,
		setDuration: function setDuration( time) {
			DISPLAYED_TIME = time || DISPLAYED_TIME;
		}
	};
})();
*/
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
			return days;
	    }

		++days;
		workingDate.setDate( workingDate.getDate() + 1);
	}

	return 36500;
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
	var maxOpen = parseInt((config.endDate.getTime() - nowTime) / 1000 / 60 / 60 / 24);
	var diffWeeks = parseInt(diffDays / 7);
	var weekdays = new Array( "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");

	if( maxOpen <= days) {
		openingtime = 'Geschlossen';
	} else if( 0 == days) {
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
	} else {
		openingtime = weekdays[weekday] + ' in ' + diffWeeks + ' Wochen';
	}

	return openingtime;
}

function composeMarketItem( obj, diffdays)
{
	var openingtime = '';
	if( -2 == diffdays) {
		var km = parseInt( obj.data_km * 2);
		var km2 = parseInt( km / 2) * 2;
		if(( 0 == km) && (0 == km2)) {
			openingtime = 'Gleich hier, ' + getNextMarketOpeningTime( obj);
		} else if( 10 <= km2) {
			openingtime = (km2 / 2) + ' km entfernt, ' + getNextMarketOpeningTime( obj);
		} else if( 0 == (km - km2)) {
			openingtime = (km2 / 2) + ' km entfernt, ' + getNextMarketOpeningTime( obj);
		} else {
			openingtime = (km2 / 2) + ',5 km entfernt, ' + getNextMarketOpeningTime( obj);
		}
	} else if( -1 == diffdays) {
		openingtime = getNextMarketOpeningTime( obj);
	} else {
		openingtime = 'von ' + getOpeningTime( obj, diffdays) + ' Uhr';
	}

	if( 'hide' == obj.todo) { return ''; }
//	if( 'mail' == obj.todo) { return ''; }
//	if( 'ready' == obj.todo) { return ''; }
//	if( '' == obj.todo) { return ''; }

	var txt = '<p>' + obj.name + '</p><p>' + openingtime + '</p>';
	var img = '<aside class="pack-begin"><img src="art/' + obj.id + '/128.jpg"></aside>';

	return '<li>' + img + '<a href="javascript:callOneMarket(' + obj.id + ');">' + txt + '</a></li>';
}

// ·································································

function sortDataToday( a, b)
{
	var timeA = getOpeningTime( a, 0);
	var timeB = getOpeningTime( b, 0);

	a.data_next_open = timeA;
	b.data_next_open = timeB;

	if(( '' != timeA) && ('' != timeB)) {
		var intA = parseInt( timeA.substr( 6, 2));
		var intB = parseInt( timeB.substr( 6, 2));

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 9, 2));
			intB = parseInt( timeB.substr( 9, 2));
		}

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 0, 2));
			intB = parseInt( timeB.substr( 0, 2));
		}

		if( intA != intB) {
			return intA - intB;
		}

		return a.name < b.name ? 1 : -1;
	} else if( '' != timeA) {
		return 1;
	} else if( '' != timeB) {
		return -1;
	}

	return 0;
}

function fillListTodayMarkets()
{
	document.querySelector( '#tab-market-today').   setAttribute( 'aria-selected', 'true');
	document.querySelector( '#tab-market-tomorrow').setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-all').     setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-nearby').  setAttribute( 'aria-selected', 'false');
//	document.querySelector( '#tab-market-favorite').setAttribute( 'aria-selected', 'false');

	var txt = '<div class="center"><progress></progress></div>';
	document.querySelector( '#marketlist').innerHTML = txt;
	window.scrollTo( 0, 0);
	txt = '';

 	data.sort( sortDataToday);

 	for( var i = 0; i < data.length; ++i) {
 		var obj = data[ i];

 		if( '' != obj.data_next_open) {
			txt += composeMarketItem( obj, 0);
 		}
	}

	if( '' == txt) {
		txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Heute haben keine Weihnachtsmärkte geöffnet</p></li>';
	}

	txt = '<header>Heute geöffnet</header>' + txt;
	txt = composeList( txt);
	txt = composeSectionList( txt);

	txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

	document.querySelector('#marketlist').innerHTML = txt;
}

document.querySelector('#tab-market-today').addEventListener('click', function() {
	fillListTodayMarkets();
});

// ·································································

function sortDataTomorrow( a, b)
{
	var timeA = getOpeningTime( a, 1);
	var timeB = getOpeningTime( b, 1);

	a.data_next_open = timeA;
	b.data_next_open = timeB;

	if(( '' != timeA) && ('' != timeB)) {
		var intA = parseInt( timeA.substr( 6, 2));
		var intB = parseInt( timeB.substr( 6, 2));

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 9, 2));
			intB = parseInt( timeB.substr( 9, 2));
		}

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 0, 2));
			intB = parseInt( timeB.substr( 0, 2));
		}

		if( intA != intB) {
			return intA - intB;
		}

		return a.name < b.name ? 1 : -1;
	} else if( '' != timeA) {
		return 1;
	} else if( '' != timeB) {
		return -1;
	}

	return 0;
}

function fillListTomorrowMarkets()
{
	document.querySelector( '#tab-market-today').   setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-tomorrow').setAttribute( 'aria-selected', 'true');
	document.querySelector( '#tab-market-all').     setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-nearby').  setAttribute( 'aria-selected', 'false');
//	document.querySelector( '#tab-market-favorite').setAttribute( 'aria-selected', 'false');

	var txt = '<div class="center"><progress></progress></div>';
	document.querySelector( '#marketlist').innerHTML = txt;
	window.scrollTo( 0, 0);
	txt = '';

 	data.sort( sortDataTomorrow);

 	for( var i = 0; i < data.length; ++i) {
 		var obj = data[ i];

 		if( '' != obj.data_next_open) {
			txt += composeMarketItem( obj, 1);
 		}
	}

	if( '' == txt) {
		txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Morgen haben keine Weihnachtsmärkte geöffnet</p></li>';
	}

	txt = '<header>Morgen geöffnet</header>' + txt;
	txt = composeList( txt);
	txt = composeSectionList( txt);

	txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

	document.querySelector('#marketlist').innerHTML = txt;
}

document.querySelector('#tab-market-tomorrow').addEventListener('click', function() {
	fillListTomorrowMarkets();
});

// ·································································

function sortDataAll( a, b)
{
	var daysA = getNextOpeningDays( a);
	var daysB = getNextOpeningDays( b);

	a.data_next_open = daysA;
	b.data_next_open = daysB;

	if( daysA == daysB) {
		var timeA = getOpeningTime( a, daysA);
		var timeB = getOpeningTime( b, daysB);
		var intA = parseInt( timeA.substr( 6, 2));
		var intB = parseInt( timeB.substr( 6, 2));

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 9, 2));
			intB = parseInt( timeB.substr( 9, 2));
		}

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 0, 2));
			intB = parseInt( timeB.substr( 0, 2));
		}

		if( intA != intB) {
			return intA - intB;
		}

		return a.name < b.name ? 1 : -1;
	}

	return daysA - daysB;
}

function fillListAllMarkets()
{
	document.querySelector( '#tab-market-today').   setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-tomorrow').setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-all').     setAttribute( 'aria-selected', 'true');
	document.querySelector( '#tab-market-nearby').  setAttribute( 'aria-selected', 'false');
//	document.querySelector( '#tab-market-favorite').setAttribute( 'aria-selected', 'false');

	var txt = '<div class="center"><progress></progress></div>';
	document.querySelector( '#marketlist').innerHTML = txt;
	window.scrollTo( 0, 0);
	txt = '';

 	data.sort( sortDataAll);
	var workingDate = new Date();
	workingDate.setHours( 0, 0, 0, 0);
 	var nextOpen = -1;
	var maxOpen = parseInt((config.endDate.getTime() - workingDate.getTime()) / 1000 / 60 / 60 / 24);

 	for( var i = 0; i < data.length; ++i) {
 		var obj = data[ i];

 		if( obj.data_next_open > nextOpen) {
 			if( maxOpen <= obj.data_next_open) {
				txt += '<header>Geschlossene Märkte</header>';
				nextOpen = 36500;
 			} else if( 0 == obj.data_next_open) {
				txt += '<header>Heute geöffnet</header>';
				nextOpen = obj.data_next_open;
 			} else if( 1 == obj.data_next_open) {
				txt += '<header>Morgen geöffnet</header>';
				nextOpen = obj.data_next_open;
 			} else {
				txt += '<header>Weihnachtsmärkte</header>';
				nextOpen = maxOpen;
 			}
 		}

		txt += composeMarketItem( obj, -1);
	}

	txt = composeList( txt);
	txt = composeSectionList( txt);

	txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

	document.querySelector('#marketlist').innerHTML = txt;
}

document.querySelector('#tab-market-all').addEventListener('click', function() {
	fillListAllMarkets();
});

// ·································································

var gLat = null;
var gLon = null;

if( typeof Number.prototype.toRadians == 'undefined') {
	Number.prototype.toRadians = function() { return this * Math.PI / 180; };
}

function getDistance( lat1, lon1, lat2, lon2)
{
	var R = 6371; // km
	var dLat = (lat2 - lat1).toRadians();
	var dLon = (lon2 - lon1).toRadians(); 
	var a = Math.sin( dLat / 2) * Math.sin( dLat / 2) +
			Math.cos( lat1.toRadians()) * Math.cos( lat2.toRadians()) * 
			Math.sin( dLon / 2) * Math.sin( dLon / 2); 
	var c = 2 * Math.atan2( Math.sqrt( a), Math.sqrt( 1 - a)); 
	return R * c;
}

function sortDataNearby( a, b)
{
	var daysA = getNextOpeningDays( a);
	var daysB = getNextOpeningDays( b);
	var kmA = getDistance( a.lat, a.long, gLat, gLon);
	var kmB = getDistance( b.lat, b.long, gLat, gLon);

	a.data_next_open = daysA;
	b.data_next_open = daysB;
	a.data_km = kmA;
	b.data_km = kmB;

	if( kmA == kmB) {
		return a.name < b.name ? 1 : -1;
	}

	return kmA - kmB;
}

function fillListNearbyMarkets()
{
	document.querySelector( '#tab-market-today').   setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-tomorrow').setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-all').     setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-nearby').  setAttribute( 'aria-selected', 'true');
//	document.querySelector( '#tab-market-favorite').setAttribute( 'aria-selected', 'false');

	var txt = '<header>Suche die GPS-Position</header>';
	txt = composeList( txt);
	txt = composeSectionList( txt);
	txt += '<div class="center" style="padding-top:3rem;"><progress></progress></div>';
	txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
	document.querySelector( '#marketlist').innerHTML = txt;
	window.scrollTo( 0, 0);
	txt = '';

	if( 'geolocation' in navigator) {
		function success( position) {
			gLat = position.coords.latitude;
			gLon = position.coords.longitude;
			var txt = '';

			data.sort( sortDataNearby);

			for( var i = 0; i < data.length; ++i) {
				var obj = data[ i];

		 		if( 36500 != obj.data_next_open) {
					txt += composeMarketItem( obj, -2);
				}
			}

			if( '' == txt) {
				txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Es gibt keine Weihnachtsmärkte in der Nähe die geöffnet haben</p></li>';
			}

			txt = '<header>In der Nähe</header>' + txt;
			txt = composeList( txt);
			txt = composeSectionList( txt);
			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
			document.querySelector('#marketlist').innerHTML = txt;
		}

		function error() {
			var txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Bitte schalten sie den GPS-Empfänger ein.</p></li>';
			txt = '<header>In der Nähe</header>' + txt;
			txt = composeList( txt);
			txt = composeSectionList( txt);
			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
			document.querySelector('#marketlist').innerHTML = txt;
		}

		navigator.geolocation.getCurrentPosition( success, error);
	} else {
		txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Konnte keinen GPS-Empfänger finden.</p></li>';
		txt = '<header>In der Nähe</header>' + txt;
		txt = composeList( txt);
		txt = composeSectionList( txt);
		txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
		document.querySelector('#marketlist').innerHTML = txt;
	}
}

document.querySelector('#tab-market-nearby').addEventListener('click', function() {
	fillListNearbyMarkets();
});

// ·································································

function sortDataFavorite( a, b)
{
	var daysA = getNextOpeningDays( a);
	var daysB = getNextOpeningDays( b);

	a.data_next_open = daysA;
	b.data_next_open = daysB;

	if( daysA == daysB) {
		var timeA = getOpeningTime( a, daysA);
		var timeB = getOpeningTime( b, daysB);
		var intA = parseInt( timeA.substr( 6, 2));
		var intB = parseInt( timeB.substr( 6, 2));

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 9, 2));
			intB = parseInt( timeB.substr( 9, 2));
		}

		if( intA != intB) {
			return intB - intA;
		} else {
			intA = parseInt( timeA.substr( 0, 2));
			intB = parseInt( timeB.substr( 0, 2));
		}

		if( intA != intB) {
			return intA - intB;
		}

		return a.name < b.name ? 1 : -1;
	}

	return daysA - daysB;
}

function fillListFavoriteMarkets()
{
	document.querySelector( '#tab-market-today').   setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-tomorrow').setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-all').     setAttribute( 'aria-selected', 'false');
	document.querySelector( '#tab-market-nearby').  setAttribute( 'aria-selected', 'false');
//	document.querySelector( '#tab-market-favorite').setAttribute( 'aria-selected', 'true');

	var txt = '<div class="center"><progress></progress></div>';
	document.querySelector( '#marketlist').innerHTML = txt;
	window.scrollTo( 0, 0);
	txt = '';

 	data.sort( sortDataFavorite);

	txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

	document.querySelector('#marketlist').innerHTML = txt;
}

//document.querySelector('#tab-market-favorite').addEventListener('click', function() {
//	fillListFavoriteMarkets();
//});

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

	txt += '<p style="margin:0 -1.5rem 0 -1.5rem;"><ul class="calendar">';

	var months = new Array( "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez");
	var workingDate = new Date();
	workingDate.setFullYear( config.startDate.getFullYear(), config.startDate.getMonth(), config.startDate.getDate());

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

function callChangeFavorite( marketId)
{
	document.querySelector('#buttonFav').innerHTML = '<i class="icon-heart-filled"></i>';

	var obj = getObjFromID( marketId);
	utils.status.show( obj.name + ' ist jetzt dein Lieblingsmarkt.');
}

function fillListOneMarket()
{
	var txt = '';
	var obj = getObjFromID( config.currentMarketId);

	txt += '<div style="margin:-1.5rem -1.5rem -1rem -1.5rem;"><img src="art/' + obj.id + '/1200.jpg" style="width:100%;"></div>';

	txt += '<div style="margin:0 -1.5rem 1rem -1.5rem;padding:1.5rem 1.5rem 0 1.5rem;text-align:center;border-bottom:1px solid #f97c17;background:#fde4d0;">';
	txt += '<p style="color:#f97c17;">' + obj.name + '</p>';

	var opening = getNextMarketOpeningTime( obj);
	if( opening != 'Geschlossen') {
		opening += ' geöffnet';
	}
	txt += '<p><i class="icon-clock"></i> ' + opening + '</p>';
	if( '' != obj.fee) {
		txt += '<p>' + obj.fee + '</p>';
	}
	txt += '</div>';

	txt += '<p>' + obj.remarks + '</p>';

	txt += '<div style="margin:1rem -1.5rem 1rem -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
	txt += '<p><ul style="margin:0 auto 0 auto;max-width:4rem;">';
//	txt += '<li style="float:left;padding:0 2rem 0 0;"><a id="buttonFav" href="javascript:callChangeFavorite(' + obj.id + ');" class="bb-button" style="font-size:3rem;min-width:4rem;min-height:4rem;text-align:center;padding:1rem 0 0 0;"><i class="icon-heart"></i></a></li>';
//	txt += '<li style="float:left;padding:0 2rem 0 0;"><button><i class="icon-map"></i></button></li>';
//	txt += '<li style="float:left;padding:0 2rem 0 0;"><button>Sharen</button></li>';
//	txt += '<li style="float:left;padding:0 2rem 0 0;"><button>BVG</button></li>';
	txt += '<li style="clear:both;"></li>';
	txt += '</ul></p>';

	txt += '<p>' + obj.street + ', ' + obj.zip_city + ' ' + obj.district + '</p>';
	txt += '</div>';

	txt += '<p>Öffnungszeiten</p>';
	txt += '<p>' + obj.hours + '</p>';
	txt += composeMarketCalendar( obj);

	txt += '<div style="margin:1rem -1.5rem -1.5rem -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
	txt += '<p>Bildnachweis: ' + obj.copyright + '</p>';
	txt += '</div>';

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
	setTimeout( fillListOneMarket, config.timeout);
}

document.querySelector('#btn-onemarket-back').addEventListener('click', function() {
	document.querySelector('#onemarket').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

// ·································································

var isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
if( isiOS) {
	document.body.className += ' ' + 'ios';
}

setTimeout( fillListTodayMarkets, config.timeout);

// ·································································