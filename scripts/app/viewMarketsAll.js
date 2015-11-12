// ·································································

define( ['app/config','app/view','app/sort'], function( config, view, sort) {
	var idView = '#tab-market-all';

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
		 	sort.all();

			var txt = '';

			var workingDate = new Date();
			workingDate.setHours( 0, 0, 0, 0);
 			var nextOpen = -1;
			var maxOpen = parseInt((config.endDate.getTime() - workingDate.getTime()) / 1000 / 60 / 60 / 24);

		 	for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];

		 		if( obj.data_next_open > nextOpen) {
 					if( maxOpen <= obj.data_next_open) {
						txt += '<header>Zu spät</header>';
						nextOpen = 36500;
 					} else if( 0 == obj.data_next_open) {
						txt += '<header>Heute</header>';
						nextOpen = obj.data_next_open;
 					} else if( 1 == obj.data_next_open) {
						txt += '<header>Ab morgen</header>';
						nextOpen = obj.data_next_open;
 					} else {
						txt += '<header>Veranstaltungen</header>';
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
