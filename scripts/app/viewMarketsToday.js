// ·································································

define( ['app/config','app/view','app/sort'], function( config, view, sort) {
	var idView = '#tab-market-today';

	return {
		init: function()
		{
			view.add( idView, 'Heute');

			if( document.querySelector( idView) !== null) {
				document.querySelector( idView).addEventListener( 'click', this.fillList.bind( this), false);
			}
		},
		count: function()
		{
			var markets = 0;
	 		for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];
 				if( 0 == view.getNextOpeningDays( obj)) {
 					++markets;
 				}
			}

			return markets;
		},
		fillList: function()
		{
			view.setActive( idView);
			view.showProgress();
		 	sort.today();

			var txt = '';
	 		for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];

		 		if( '' != obj.data_next_open) {
					txt += view.composeMarketItem( obj, 0);
		 		}
			}

			if( '' == txt) {
				txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Heute gibt es keine Veranstaltungen</p></li>';
			}

			txt = '<header>Heute</header>' + txt;
			txt = view.composeList( txt);
			txt = view.composeSectionList( txt);

			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

			view.finishMarketList( txt);
		}
	};
});

// ·································································
