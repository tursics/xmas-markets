/*jslint browser: true*/
/*global define*/

//-----------------------------------------------------------------------

define(['data/berlin', 'data/brandenburg', 'data/moers', 'data/wesel'], function (dataBerlin, dataBrandenburg, dataMoers, dataWesel) {
	'use strict';

	var firstDay = 4000000000000,
		lastDay = 0,
		market,
		markets = [];

	function addData(name, data) {
		for (market = 0; market < data.length; ++market) {
			data[market].path = name.toLowerCase();
			if (!isNaN(Date.parse(data[market].begin))) {
				firstDay = Math.min(firstDay, Date.parse(data[market].begin));
			}
			if (!isNaN(Date.parse(data[market].end))) {
				lastDay = Math.max(lastDay, Date.parse(data[market].end));
			}
		}

		markets = markets.concat(data);
	}

//	addData('Berlin', dataBerlin.data);
//	addData('Brandenburg', dataBrandenburg.data);
//	addData('Moers', dataMoers.data);
	addData('Wesel', dataWesel.data);

	return {
		timeout: 400,
		currentMarketId: 0,
		startDate: new Date(firstDay),
		endDate: new Date(lastDay + (1000 * 60 * 60 * 24)),
		views: [],
		markets: markets,
		userLat: null,
		userLon: null,

		getMarketByID: function (marketId) {
			var path = marketId.split('-')[0],
				uuid = parseInt(marketId.split('-')[1], 10),
				i;

			for (i = 0; i < this.markets.length; ++i) {
				if ((this.markets[i].path === path) && (this.markets[i].uuid === uuid)) {
					return this.markets[i];
				}
			}

			return null;
		}
	};
});

//-----------------------------------------------------------------------
