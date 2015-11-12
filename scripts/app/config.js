// ·································································

define( ['data/berlin', 'data/moers'], function( dataBerlin, dataMoers) {
	var firstDay = 4000000000000;
	var lastDay = 0;
	var markets = [];

	function addData( name, data)
	{
		markets = markets.concat( data);

		for( var market = 0; market < data.length; ++market) {
			data[market]['path'] = name.toLowerCase();
			firstDay = Math.min( firstDay, Date.parse( data[market]['begin']));
			lastDay = Math.max( lastDay, Date.parse( data[market]['end']));
		}
	}

	addData( 'Berlin', dataBerlin.data);
	addData( 'Moers', dataMoers.data);

	return {
		timeout: 400,
		currentMarketId: 0,
		startDate: new Date( firstDay),
		endDate: new Date( lastDay),
		views: new Array(),
		markets: markets,
		userLat: null,
		userLon: null,

		getMarketByID: function( marketId)
		{
			var path = marketId.split('-')[0];
			var uuid = marketId.split('-')[1];

			for( var i = 0; i < this.markets.length; ++i) {
				if(( this.markets[i].path == path) && ( this.markets[i].uuid == uuid)) {
					return this.markets[i];
				}
			}

			return null;
		}
	};
});

// ·································································
