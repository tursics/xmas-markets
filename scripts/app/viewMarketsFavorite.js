// ·································································

define( ['app/config','app/view','app/sort'], function( config, view, sort) {
	var idView = '#tab-market-favorite';

	return {
		init: function()
		{
			view.add( idView, 'Favoriten');

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

			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="' + config.teaserPath + '" style="width:100%;"></div>' + txt;

			view.finishMarketList( txt);
		}
	};
});

// ·································································
