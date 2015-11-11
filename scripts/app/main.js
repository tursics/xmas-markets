// ·································································

define( ['app/config','app/viewMarketsToday','app/viewMarketsTomorrow','app/viewMarketsAll','app/viewMarketsNearby'],
function( config, viewMarketsToday, viewMarketsTomorrow, viewMarketsAll, viewMarketsNearby)
{
	viewMarketsToday.init();
	viewMarketsTomorrow.init();
	viewMarketsAll.init();
	viewMarketsNearby.init();

	setTimeout( viewMarketsToday.fillList, config.timeout);

	return {
	};
});

// ·································································
