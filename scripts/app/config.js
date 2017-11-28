/*jslint browser: true*/
/*global define,document*/

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
			docTitle = 'Weihnachtsmärkte in Berlin und Brandenburg';
			header = 'Weihnachtsmärkte <em>in Berlin und Brandenburg</em>';
			markets = 'Berliner Advents- und Weihnachtsmärkte<br>&nbsp;&nbsp;&nbsp;CC-BY 3.0 DE<br>&nbsp;&nbsp;&nbsp;daten.berlin.de';
			attribution = '<a href="#">Charles Blume Vergnügungsbetrieb GmbH</a>';
			teaserPath = 'art/berlin/teaser.jpg';
		} else if ('Brandenburg' === name) {
			markets = 'Brandenburger Weihnachtsmärkte<br>&nbsp;&nbsp;&nbsp;CC-BY 3.0 DE<br>&nbsp;&nbsp;&nbsp;daten.berlin.de';
		} else if ('Moers' === name) {
			docTitle = 'Weihnachten in Moers und Krefeld';
			header = 'Weihnachten <em>in Moers und Krefeld</em>';
			markets = 'Veranstaltungen zur Weihnachtszeit<br>&nbsp;&nbsp;&nbsp;DL-DE-Zero-2.0<br>&nbsp;&nbsp;&nbsp;offenedaten.moers.de';
			attribution = '<a href="#">MoersMarketing GmbH</a>';
			teaserPath = 'art/moers/teaser.jpg';
		} else if ('Wesel' === name) {
			markets = 'Veranstaltungen in Wesel<br>&nbsp;&nbsp;&nbsp;DL-DE-Zero-2.0<br>&nbsp;&nbsp;&nbsp;opendata.wesel.de';
		} else if ('Krefeld' === name) {
			markets = 'Veranstaltungskalender der Stadt Krefeld<br>&nbsp;&nbsp;&nbsp;DL-DE-Zero-2.0<br>&nbsp;&nbsp;&nbsp;offenesdatenportal.de/organization/krefeld';
		}

		if (docTitle.length > 0) {
			document.title = docTitle;
		}
		if (header.length > 0) {
			document.querySelector('#drawer h1').innerHTML = header;
			document.querySelector('#sidebarTop .title').innerHTML = header;
		}
		document.querySelector('#sidebarMiddle .markets').innerHTML += markets + '<br>';
		document.querySelector('#sidebarMiddle .credits').innerHTML += attribution;
	}

	function addData(name, data) {
		changeCI(name);

		for (market = 0; market < data.length; ++market) {
			data[market].path = name.toLowerCase();
			if (data[market].todo !== 'hide') {
				if (!isNaN(Date.parse(data[market].begin))) {
					firstDay = Math.min(firstDay, Date.parse(data[market].begin));
//					console.log(data[market].begin + ' ' + data[market].name);
				}
				if (!isNaN(Date.parse(data[market].end))) {
					lastDay = Math.max(lastDay, Date.parse(data[market].end));
				}
			}
		}

		markets = markets.concat(data);
	}

	addData('Berlin', dataBerlin.data);
	addData('Brandenburg', dataBrandenburg.data);
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
