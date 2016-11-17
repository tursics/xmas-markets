// ·································································

define( ['app/config','app/view','app/sort'], function( config, view, sort) {
	var idView = '#tab-market-nextdays';

	return {
		init: function()
		{
			view.add( idView, 'Aktuell');

			if( document.querySelector( idView) !== null) {
				document.querySelector( idView).addEventListener( 'click', this.fillList.bind( this), false);
			}
		},
		fillList: function()
		{
			view.setActive( idView);
			view.showProgress();

			var txt = '';
			var sumtxt = '';

		 	sort.today();
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
			sumtxt += txt;

			txt = '';
		 	sort.tomorrow();
		 	for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];
				if( '' != obj.data_next_open) {
					txt += view.composeMarketItem( obj, 1);
		 		}
			}
			if( '' == txt) {
				txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Morgen gibt es keine Veranstaltungen</p></li>';
			}
			txt = '<header>Morgen</header>' + txt;
			sumtxt += txt;

			txt = '';
		 	sort.overmorrow();
		 	for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];
				if( '' != obj.data_next_open) {
					txt += view.composeMarketItem( obj, 2);
 				}
			}
			if( '' == txt) {
				txt = '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Übermorgen gibt es keine Veranstaltungen</p></li>';
			}
			txt = '<header>Übermorgen</header>' + txt;
			sumtxt += txt;

			txt = view.composeList( sumtxt);
			txt = view.composeSectionList( txt);

			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="' + config.teaserPath + '" style="width:100%;"></div>' + txt;

			view.finishMarketList( txt);
		}
	};
});

// ·································································
