/*jslint browser: true*/
/*global require,define*/

//-----------------------------------------------------------------------

define(['app/config', 'app/view'], function (config, view) {
	'use strict';

	// ·····························································
	function openingTimeFn(a, b, timeA, timeB) {
		a.data_next_open = timeA;
		b.data_next_open = timeB;

		if (('' !== timeA) && ('' !== timeB)) {
			if (a.group !== b.group) {
				return a.group > b.group ? 1 : -1;
			}

			var intA = parseInt(timeA.substr(6, 2), 10),
				intB = parseInt(timeB.substr(6, 2), 10);

			if ((timeA.length < 6) || (timeB.length < 6)) {
				intA = 0;
				intB = 0;
			}

			if (intA !== intB) {
				return intB - intA;
			} else {
				intA = parseInt(timeA.substr(9, 2), 10);
				intB = parseInt(timeB.substr(9, 2), 10);
				if ((timeA.length < 6) || (timeB.length < 6)) {
					intA = 0;
					intB = 0;
				}
			}

			if (intA !== intB) {
				return intB - intA;
			} else {
				intA = parseInt(timeA.substr(0, 2), 10);
				intB = parseInt(timeB.substr(0, 2), 10);
			}

			if (intA !== intB) {
				return intA - intB;
			}

			return a.name < b.name ? 1 : -1;
		} else if ('' !== timeA) {
			return 1;
		} else if ('' !== timeB) {
			return -1;
		}

		return 0;
	}

	// ·····························································

	function openingTimeAll(a, b) {
		var daysA = view.getNextOpeningDays(a),
			daysB = view.getNextOpeningDays(b);

		a.data_next_open = daysA;
		b.data_next_open = daysB;

		if (daysA === daysB) {
			if (a.group !== b.group) {
				return a.group > b.group ? 1 : -1;
			}

			var timeA = view.getOpeningTime(a, daysA);
			var timeB = view.getOpeningTime(b, daysB);
			var intA = parseInt(timeA.substr(6, 2), 10);
			var intB = parseInt(timeB.substr(6, 2), 10);
			if ((timeA.length < 6) || (timeB.length < 6)) {
				intA = 0;
				intB = 0;
			}

			if (intA !== intB) {
				return intB - intA;
			} else {
				intA = parseInt( timeA.substr( 9, 2));
				intB = parseInt( timeB.substr( 9, 2));
				if(( timeA.length < 6) || (timeB.length < 6)) {
					intA = 0;
					intB = 0;
				}
			}

			if( intA != intB) {
				return intB - intA;
			} else {
				intA = parseInt( timeA.substr( 0, 2));
				intB = parseInt( timeB.substr( 0, 2));
			}

			if( intA != intB) {
				return intA - intB;
			}

			return a.name < b.name ? 1 : -1;
		}

		return daysA - daysB;
	}

	// ·····························································
	function openingTime0( a, b)
	{
		var timeA = view.getOpeningTime( a, 0);
		var timeB = view.getOpeningTime( b, 0);

		return openingTimeFn( a, b, timeA, timeB);
	}

	// ·····························································
	function openingTime1( a, b)
	{
		var timeA = view.getOpeningTime( a, 1);
		var timeB = view.getOpeningTime( b, 1);

		return openingTimeFn( a, b, timeA, timeB);
	}

	// ·····························································
	function openingTime2( a, b)
	{
		var timeA = view.getOpeningTime( a, 2);
		var timeB = view.getOpeningTime( b, 2);

		return openingTimeFn( a, b, timeA, timeB);
	}

	// ·····························································
	function getDistance(lat1, lon1, lat2, lon2) {
		if ((typeof lat1 === 'undefined') || (typeof lon1 === 'undefined') || (typeof lat2 === 'undefined') || (typeof lon2 === 'undefined') || ( lat1 === '') || (lon1 === '') || (lat2 === '') || (lon2 === '')) {
			return 0;
		}

		var R = 6371; // km
		var dLat = (lat2 - lat1).toRadians();
		var dLon = (lon2 - lon1).toRadians(); 
		var a = Math.sin( dLat / 2) * Math.sin( dLat / 2) +
				Math.cos( lat1.toRadians()) * Math.cos( lat2.toRadians()) * 
				Math.sin( dLon / 2) * Math.sin( dLon / 2); 
		var c = 2 * Math.atan2( Math.sqrt( a), Math.sqrt( 1 - a)); 
		return R * c;
	}

	// ·····························································
	function distance( a, b) {
		var daysA = view.getNextOpeningDays(a),
			daysB = view.getNextOpeningDays(b),
			kmA = 0,
			kmB = 0;

		if ((a.lat !== null) && (a.lng !== null)) {
			kmA = getDistance(a.lat, a.lng, config.userLat, config.userLon);
		}
		if ((b.lat !== null) && (b.lng !== null)) {
			kmB = getDistance(b.lat, b.lng, config.userLat, config.userLon);
		}

		a.data_next_open = daysA;
		b.data_next_open = daysB;
		a.data_km = kmA;
		b.data_km = kmB;

		if (kmA === kmB) {
			if (a.group != b.group) {
				return a.group > b.group ? 1 : -1;
			}

			return a.name < b.name ? 1 : -1;
		}

		return kmA - kmB;
	}

	// ·····························································
	return {
		all: function()
		{
			config.markets.sort( openingTimeAll);
		},
		today: function()
		{
			config.markets.sort( openingTime0);
		},
		tomorrow: function()
		{
			config.markets.sort( openingTime1);
		},
		overmorrow: function()
		{
			config.markets.sort( openingTime2);
		},
		around: function()
		{
			config.markets.sort( distance);
		}
	};
});

//-----------------------------------------------------------------------
