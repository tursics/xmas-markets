// ·································································

define( ['app/config','app/view'], function( config, view) {
	var idView = '#onemarket';

	return {
		init: function()
		{
		},
		fillList: function()
		{
			var txt = '';
			var obj = config.getMarketByID( config.currentMarketId);

			txt += '<div style="margin:-1.5rem -1.5rem -1rem -1.5rem;"><img src="art/' + obj.uuid + '/1200.jpg" style="width:100%;"></div>';

			txt += '<div style="margin:0 -1.5rem 1rem -1.5rem;padding:1.5rem 1.5rem 0 1.5rem;text-align:center;border-bottom:1px solid #f97c17;background:#fde4d0;">';
			txt += '<p style="color:#f97c17;">' + obj.name + '</p>';

			var opening = view.getNextMarketOpeningTime( obj);
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

			txt += '<p>Öffnungszeiten</p>';
			txt += '<p>' + obj.hours + '</p>';
			txt += composeMarketCalendar( obj);

			txt += '<div style="margin:1rem -1.5rem -1.5rem -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
			txt += '<p>Bildnachweis: ' + obj.copyright + '</p>';
			txt += '</div>';

			document.querySelector('#onemarket > article').innerHTML = txt;
		}
	};
});

// ·································································
