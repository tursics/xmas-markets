// ·································································

define( ['data/berlin'], function( dataBerlin) {
	var end = 0;
	var start = 4000000000000;
	var markets = dataBerlin.data;
	for( var market = 0; market < markets.length; ++market) {
		start = Math.min( start, Date.parse( markets[market]['begin']));
		end = Math.max( end, Date.parse( markets[market]['end']));
	}

	return {
		timeout: 400,
		currentMarketId: 0,
		startDate: new Date( start),
		endDate: new Date( end),
		views: new Array(),
		markets: markets,

		getMarketByID: function( uuid)
		{
			for( var i = 0; i < this.markets.length; ++i) {
				if( this.markets[i].uuid == uuid) {
					return this.markets[i];
				}
			}

			return null;
		}
	};
});

// ·································································
