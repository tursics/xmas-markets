/*jslint browser: true*/
/*global define*/

//-----------------------------------------------------------------------

define(['data/berlin', 'data/brandenburg', 'data/moers', 'data/krefeld'], function (dataBerlin, dataBrandenburg, dataMoers, dataKrefeld) {
	'use strict';

	var firstDay = 4000000000000,
		lastDay = 0,
		market,
		markets = [],
		teaserPath = '';

	function changeCI(name) {
		var docTitle = '',
			header = '',
			markets = '',
			attribution = '';

		if ('Berlin' === name) {
			docTitle = 'Weihnachtsmärkte in Berlin';
			header = 'Weihnachtsmärkte <em>in Berlin</em>';
			markets = '<li><a href="#">"Berliner Weihnachtsmärkte"<br>CC-BY 3.0 DE<br>daten.berlin.de</a></li>';
			attribution = '<li><a href="#">Charles Blume Vergnügungsbetrieb GmbH</a></li>';
			teaserPath = 'art/berlin/teaser.jpg';
		} else if ('Brandenburg' === name) {
			markets = '<li><a href="#">"Brandenburger Weihnachtsmärkte"<br>CC-BY 3.0 DE<br>daten.berlin.de</a></li>';
		} else if ('Moers' === name) {
			docTitle = 'Weihnachten in Moers';
			header = 'Weihnachten <em>in Moers</em>';
			markets = '<li><a href="#">"Veranstaltungen zur Weihnachtszeit"<br>DL-DE-Zero-2.0<br>offenedaten.moers.de</a></li>';
			attribution = '<li><a href="#">MoersMarketing GmbH</a></li>';
			teaserPath = 'art/moers/teaser.jpg';
		} else if ('Wesel' === name) {
			markets = '<li><a href="#">"Veranstaltungen in Wesel"<br>DL-DE-Zero-2.0<br>opendata.wesel.de</a></li>';
		} else if ('Krefeld' === name) {
			markets = '<li><a href="#">"Veranstaltungskalender der Stadt Krefeld"<br>DL-DE-Zero-2.0<br>offenesdatenportal.de/organization/krefeld</a></li>';
		}

		if (docTitle.length > 0) {
			document.title = docTitle;
		}
		if (header.length > 0) {
			document.querySelector('#drawer h1').innerHTML = header;
		}
		document.querySelector('#index nav ul:nth-child(6)').innerHTML += markets;
		document.querySelector('#index nav ul:nth-child(8)').innerHTML += attribution;
	}

	function addData(name, data) {
		changeCI(name);

		for (market = 0; market < data.length; ++market) {
			data[market].path = name.toLowerCase();
			if (data[market].todo !== 'hide') {
				if (!isNaN(Date.parse(data[market].begin))) {
					firstDay = Math.min(firstDay, Date.parse(data[market].begin));
				}
				if (!isNaN(Date.parse(data[market].end))) {
					lastDay = Math.max(lastDay, Date.parse(data[market].end));
				}
			}
		}

		markets = markets.concat(data);
	}

	addData('Berlin', dataBerlin.data);
//	addData('Brandenburg', dataBrandenburg.data);
//	addData('Moers', dataMoers.data);
//	addData('Wesel', dataWesel.data);
//	addData('Krefeld', dataKrefeld.data);

	return {
		timeout: 400,
		currentMarketId: 0,
		startDate: new Date(firstDay),
		endDate: new Date(lastDay + (1000 * 60 * 60 * 24)),
		views: [],
		markets: markets,
		teaserPath: teaserPath,
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
