// ·································································

define( ['ajax','app/config','app/view'], function( ajax, config, view) {
	var idView = '#onemarket';

//	function callChangeFavorite( marketId)
//	{
//		document.querySelector('#buttonFav').innerHTML = '<i class="icon-heart-filled"></i>';
//
//		var obj = config.getMarketByID( marketId);
//		utils.status.show( obj.name + ' ist jetzt dein Lieblingsevent.');
//	}

	function composeCalendar( obj)
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
			var daystr = view.dateToStr( workingDate);
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

	return {
		init: function()
		{
		},
		fillList: function()
		{
			if( typeof view === 'undefined') {
				view = require( 'app/view');
			}

			var txt = '';
			var obj = config.getMarketByID( config.currentMarketId);

			txt += '<div style="margin:-1.5rem -1.5rem -1rem -1.5rem;"><img src="art/' + obj.path + '/' + obj.uuid + '/1200.jpg" style="width:100%;"></div>';

			txt += '<div style="margin:0 -1.5rem 1rem -1.5rem;padding:1.5rem 1.5rem 0 1.5rem;text-align:center;border-bottom:1px solid #f97c17;background:#fde4d0;">';
			txt += '<p style="color:#f97c17;">' + obj.name + '</p>';

			var opening = view.getNextMarketOpeningTime( obj);
			if( opening != 'Vorbei') {
//				opening += ' geöffnet';
			}
			txt += '<p><i class="icon-clock"></i> ' + opening + '</p>';
			if( '' != obj.fee) {
				txt += '<p>' + obj.fee + '</p>';
			}
			txt += '</div>';

			txt += '<p>' + obj.remarks + '</p>';

			txt += '<div style="margin:1rem -1.5rem 1rem -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
			txt += '<p><ul style="margin:0 auto 0 auto;max-width:4rem;">';
//			txt += '<li style="float:left;padding:0 2rem 0 0;"><a id="buttonFav" href="javascript:callChangeFavorite(' + obj.uuid + ');" class="bb-button" style="font-size:3rem;min-width:4rem;min-height:4rem;text-align:center;padding:1rem 0 0 0;"><i class="icon-heart"></i></a></li>';
//			txt += '<li style="float:left;padding:0 2rem 0 0;"><button><i class="icon-map"></i></button></li>';
//			txt += '<li style="float:left;padding:0 2rem 0 0;"><button>Sharen</button></li>';
//			txt += '<li style="float:left;padding:0 2rem 0 0;"><button>BVG</button></li>';
//			txt += '<li style="float:left;padding:0 2rem 0 0;"><button>Wetter</button></li>';
			txt += '<li style="clear:both;"></li>';
			txt += '</ul></p>';

			if( typeof obj.zip_city !== 'undefined') {
				txt += '<p>' + obj.street + ', ' + obj.zip_city + ' ' + obj.district + '</p>';
			} else {
				txt += '<p>' + obj.street + ', ' + obj.zip + ' ' + obj.city + '</p>';
			}
			txt += '</div>';

			if( obj.begin == obj.end) {
				var date = new Date( obj.begin);
				txt += '<p>Datum: ' + date.getDate() + '.' + (date.getMonth() + 1) + "." + date.getFullYear() + '<br>Uhrzeit: ' + obj.hours + ' Uhr</p>';
			} else {
				txt += '<p>Öffnungszeiten</p>';
				txt += '<p>' + obj.hours + '</p>';
				txt += composeCalendar( obj);
			}

			txt += '<div style="margin:1rem -1.5rem -1.5rem -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
			txt += '<p id="copyright"></p>';
			txt += '</div>';

			document.querySelector('#onemarket > article').innerHTML = txt;

			ajax.get( 'art/' + obj.path + '/' + obj.uuid + '/LICENSE.md', {}, function( text) {
				document.querySelector('#copyright').innerHTML = 'Bildnachweis: ' + text;
			});
		}
	};
});

// ·································································
