// ·································································

define( ['app/config','app/viewMarketsToday','app/viewMarketsTomorrow','app/viewMarketsNextDays','app/viewMarketsAll','app/viewMarketsNearby'/*,'app/viewMarketsFavorite'*/],
function( config, viewMarketsToday, viewMarketsTomorrow, viewMarketsNextDays, viewMarketsAll, viewMarketsNearby/*, viewMarketsFavorite*/)
{
	if( viewMarketsToday.count() < 4) {
		viewMarketsNextDays.init();
	} else {
		viewMarketsToday.init();
		viewMarketsTomorrow.init();
	}
	viewMarketsAll.init();
	viewMarketsNearby.init();
//	viewMarketsFavorite.init();

	document.querySelector('#btn-onemarket-back').addEventListener('click', function() {
		window.scrollTo( 0, 0);

		document.querySelector('#onemarket').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
	});

	if( viewMarketsToday.count() < 4) {
		setTimeout( viewMarketsNextDays.fillList, config.timeout);
	} else {
		setTimeout( viewMarketsToday.fillList, config.timeout);
	}

	return {
	};
});

// ·································································
