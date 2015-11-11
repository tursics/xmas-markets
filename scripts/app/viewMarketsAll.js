// ·································································

define( ['app/config','app/view'], function( config, view) {
	var idView = '#tab-market-all';

	function sortFn( a, b)
	{
		var daysA = view.getNextOpeningDays( a);
		var daysB = view.getNextOpeningDays( b);

		a.data_next_open = daysA;
		b.data_next_open = daysB;

		if( daysA == daysB) {
			var timeA = view.getOpeningTime( a, daysA);
			var timeB = view.getOpeningTime( b, daysB);
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

	return {
		init: function()
		{
			view.add( idView, 'Alle');

			if( document.querySelector( idView) !== null) {
				document.querySelector( idView).addEventListener( 'click', this.fillList.bind( this), false);
			}
		},
		fillList: function()
		{
			view.setActive( idView);
			view.showProgress();

			var txt = '';

		 	config.markets.sort( sortFn);
			var workingDate = new Date();
			workingDate.setHours( 0, 0, 0, 0);
 			var nextOpen = -1;
			var maxOpen = parseInt((config.endDate.getTime() - workingDate.getTime()) / 1000 / 60 / 60 / 24);

		 	for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];

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

				txt += view.composeMarketItem( obj, -1);
			}

			txt = view.composeList( txt);
			txt = view.composeSectionList( txt);

			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

			view.finishMarketList( txt);
		}
	};
});

// ·································································
