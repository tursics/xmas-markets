// ·································································

define( ['app/config','app/viewMarketsToday','app/viewMarketsTomorrow','app/viewMarketsAll','app/viewMarketsNearby'],
function( config, viewMarketsToday, viewMarketsTomorrow, viewMarketsAll, viewMarketsNearby)
{
	viewMarketsToday.init();
	viewMarketsTomorrow.init();
	viewMarketsAll.init();
	viewMarketsNearby.init();

	document.querySelector('#btn-onemarket-back').addEventListener('click', function() {
		window.scrollTo( 0, 0);

		document.querySelector('#onemarket').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
	});

	setTimeout( viewMarketsToday.fillList, config.timeout);

	return {
	};
});

// ·································································
