// ·································································

define( ['app/config','app/view'], function( config, view) {
	var idView = '#tab-market-nearby';
	var lat = null;
	var lon = null;

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

	function sortFn( a, b)
	{
		var daysA = view.getNextOpeningDays( a);
		var daysB = view.getNextOpeningDays( b);
		var kmA = getDistance( a.lat, a.lng, lat, lon);
		var kmB = getDistance( b.lat, b.lng, lat, lon);

		a.data_next_open = daysA;
		b.data_next_open = daysB;
		a.data_km = kmA;
		b.data_km = kmB;

		if( kmA == kmB) {
			return a.name < b.name ? 1 : -1;
		}

		return kmA - kmB;
	}

	return {
		init: function()
		{
			view.add( idView, '<i class="icon-direction"></i>');

			if( document.querySelector( idView) !== null) {
				document.querySelector( idView).addEventListener( 'click', this.fillList.bind( this), false);
			}
		},
		fillList: function()
		{
			view.setActive( idView);
			window.scrollTo( 0, 0);

			var txt = '<header>Suche die GPS-Position</header>';
			txt = view.composeList( txt);
			txt = view.composeSectionList( txt);
			txt += '<div class="center" style="padding-top:3rem;"><progress></progress></div>';
			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
			view.finishMarketList( txt);
			txt = '';

			if( 'geolocation' in navigator) {
				function success( position) {
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					var txt = '';

					config.markets.sort( sortFn);

					for( var i = 0; i < config.markets.length; ++i) {
						var obj = config.markets[ i];

				 		if( 36500 != obj.data_next_open) {
							txt += view.composeMarketItem( obj, -2);
						}
					}

					if( '' == txt) {
						txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Es gibt keine Weihnachtsmärkte in der Nähe die geöffnet haben</p></li>';
					}

					txt = '<header>In der Nähe</header>' + txt;
					txt = view.composeList( txt);
					txt = view.composeSectionList( txt);
					txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
					view.finishMarketList( txt);
				}

				function error() {
					var txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Bitte schalten sie den GPS-Empfänger ein.</p></li>';
					txt = '<header>In der Nähe</header>' + txt;
					txt = view.composeList( txt);
					txt = view.composeSectionList( txt);
					txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
					view.finishMarketList( txt);
				}

				navigator.geolocation.getCurrentPosition( success, error);
			} else {
				txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Konnte keinen GPS-Empfänger finden.</p></li>';
				txt = '<header>In der Nähe</header>' + txt;
				txt = view.composeList( txt);
				txt = view.composeSectionList( txt);
				txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;
				view.finishMarketList( txt);
			}
		}
	};
});

// ·································································
