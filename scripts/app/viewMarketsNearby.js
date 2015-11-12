// ·································································

define( ['app/config','app/view','app/sort'], function( config, view, sort) {
	var idView = '#tab-market-nearby';

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
					config.userLat = position.coords.latitude;
					config.userLon = position.coords.longitude;
					var txt = '';

				 	sort.around();

					for( var i = 0; i < config.markets.length; ++i) {
						var obj = config.markets[ i];

				 		if( 36500 != obj.data_next_open) {
							txt += view.composeMarketItem( obj, -2);
						}
					}

					if( '' == txt) {
						txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Es gibt keine Veranstaltungen in der Nähe</p></li>';
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
