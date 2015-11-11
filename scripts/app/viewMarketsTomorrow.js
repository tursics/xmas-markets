// ·································································

define( ['app/config','app/view'], function( config, view) {
	var idView = '#tab-market-tomorrow';

	function sortFn( a, b)
	{
		var timeA = view.getOpeningTime( a, 1);
		var timeB = view.getOpeningTime( b, 1);

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

	return {
		init: function()
		{
			view.add( idView, 'Morgen');

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

		 	for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];

		 		if( '' != obj.data_next_open) {
					txt += composeMarketItem( obj, 1);
 				}
			}

			if( '' == txt) {
				txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Morgen haben keine Weihnachtsmärkte geöffnet</p></li>';
			}

			txt = '<header>Morgen geöffnet</header>' + txt;
			txt = view.composeList( txt);
			txt = view.composeSectionList( txt);

			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

			view.finishMarketList( txt);
		}
	};
});

// ·································································
