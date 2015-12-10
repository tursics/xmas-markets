// ·································································

define( ['app/config','app/view','app/sort'], function( config, view, sort) {
	var idView = '#tab-advent-calendar';

	function generateCalendar()
	{
		var txt = '';

		txt += '<div class="adventcalendar">';
	 	for( var i = 0; i < 24; ++i) {
			txt += '<div class="advent">' + i + '</div>';
		}

		txt += '<div style="clear:both;"></div>';
		txt += '</div>';

		return txt;
	}

	return {
		init: function()
		{
			view.add( idView, 'Advent');

			if( document.querySelector( idView) !== null) {
				document.querySelector( idView).addEventListener( 'click', this.fillList.bind( this), false);
			}
		},
		fillList: function()
		{
			view.setActive( idView);
			view.showProgress();

			var txt = '';
/*		 	for( var i = 0; i < config.markets.length; ++i) {
 				var obj = config.markets[ i];

		 		if( '' != obj.data_next_open) {
					txt += view.composeMarketItem( obj, 1);
 				}
			}*/

			txt = '<header>Adventskalender</header>';
			txt += '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Öffne heute das Türchen vom Adventskalender.</p></li>';
			txt = view.composeList( txt);
			txt = view.composeSectionList( txt);

			txt = generateCalendar() + '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="art/teaser.jpg" style="width:100%;"></div>' + txt;

			view.finishMarketList( txt);
		}
	};
});

// ·································································
