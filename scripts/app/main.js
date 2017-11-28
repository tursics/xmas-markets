// ·································································

define( ['app/config','app/viewAdventCalendar','app/viewMarketsToday','app/viewMarketsTomorrow','app/viewMarketsNextDays','app/viewMarketsAll','app/viewMarketsNearby'/*,'app/viewMarketsFavorite'*/],
function( config, viewAdventCalendar, viewMarketsToday, viewMarketsTomorrow, viewMarketsNextDays, viewMarketsAll, viewMarketsNearby/*, viewMarketsFavorite*/)
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
//	viewAdventCalendar.init();

	document.querySelector('#btn-onemarket-back').addEventListener('click', function() {
		try {
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
		} catch (err) {
		}

		document.querySelector('#onemarket').className = 'right';
		document.querySelector('[data-position="current"]').className = 'current';
	});
	document.addEventListener( 'backbutton', function(e){
		if( document.querySelector('[data-position="current"]').className != 'current'){
			try {
				window.scrollTo(0, 0);
				document.body.scrollTop = 0;
			} catch (err) {
			}

			document.querySelector('#onemarket').className = 'right';
			document.querySelector('[data-position="current"]').className = 'current';
		} else {
			navigator.app.exitApp();
		}
	}, false);

	if( viewMarketsToday.count() < 4) {
		setTimeout( viewMarketsNextDays.fillList, config.timeout);
	} else {
		setTimeout( viewMarketsToday.fillList, config.timeout);
	}

	return {
	};
});

// ·································································
