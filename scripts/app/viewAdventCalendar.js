/*jslint browser: true*/
/*global require,define*/

//-----------------------------------------------------------------------

define(['leaflet', 'app/config', 'app/view', 'app/sort'], function (L, config, view, sort) {
	'use strict';

	var idView = '#tab-advent-calendar',
		mapIDs = [],
		events = [
			{name: 'Weihnachtsmarkt Kita Entdeckerland', opening: 'Heute 15:00 - 18:00 Uhr', date: '20161201', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders Lichtenberg Nord veranstaltet die Kita „Entdeckerland“ einen Weihnachtsmarkt im Kindergarten.', street: 'Otto-Marquardt-Straße 2', zip_city: '10369 Berlin', district: 'Lichtenberg', lat: 52.532429, lng: 13.470844},
			{name: 'Jung und Queer in Lichtenberg', opening: 'Heute ab 18:00 Uhr', date: '20161201', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders öffent das Café Maggie wieder seine Türen für den vorweihnachtlichen offenen Treff für junge LSBTIQ* Menschen mit vielen Möglichkeiten der Mitgestaltung.', street: 'Frankfurter Allee 205', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.512319, lng: 13.490696},
			{name: 'Weihnachtsbasteln in der Kiezspinne', opening: 'Heute 16:00 - 18:00 Uhr', date: '20161202', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders können Groß und Klein gemeinsam in der Kiezspinne zum gemütlichen Basteln, Keksen, Kakao & viel Glitzer zusammen kommen. Das Team der Kiezspinne freut sich auf Ihren Besuch.', street: 'Schulze-Boysen-Straße 38', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.508325, lng: 13.479198},
			{name: 'Weihnachtsmarkt im Haus der Generationen', opening: 'Heute 15:00 - 18:00 Uhr', date: '20161202', fee: '', remarks: 'Im Rahmen des Lebendigen Adventskalenders wird im Haus der Generationen wieder der beliebte Weihnachtsmarkt veranstaltet.', street: 'Paul-Junius-Straße 46 A', zip_city: '10367 Berlin', district: 'Lichtenberg', lat: 52.525595, lng: 13.475606},
			{name: 'TubeSlam – Christmas Time', opening: 'Heute 19:30 - 22:30 Uhr', date: '20161203', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders präsentiert der Jugendclub Tube ein PoetrySlam in Stimmungsvoller Atmosphäre.', street: 'Herzbergstraße 160', zip_city: '10317 Berlin', district: 'Lichtenberg', lat: 52.527066, lng: 13.480061},
			{name: 'Adventssamstag in der Bibliothek', opening: 'Heute 10:00 - 13:00 Uhr', date: '20161203', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders veranstaltet die Egon-Erwin-Kisch-Bibliothek wieder den beliebten Familiennachmittag mit Puppentheater, basteln und lesen.', street: 'Frankfurter Allee 149', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.513377, lng: 13.481415},
			{name: 'Advent St. Mauritius Gemeinde', opening: 'Heute 17:00 - 18:30 Uhr', date: '20161204', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders sind Besucher*innen eingeladen, bei Gesang, Meditation, Glühwein und Pfefferkuchen die katholische Kirchengemeinde St. Mauritius kennenzulernen.', street: 'Mauritiuskirchstr. 1', zip_city: '10369 Berlin', district: 'Lichtenberg', lat: 52.511825, lng: 13.477864},
			{name: 'Advent Ev. Kirchengemeinde Fennpfuhl', opening: 'Heute ab 16:00 Uhr', date: '20161204', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders lädt die Evangelische Kirchengemeinde Lichtenberg in das Gemeindezentrum Fennpfuhl zu Adventsmusik im Kerzenschein.', street: 'Paul-Junius-Straße 75', zip_city: '10369 Berlin', district: 'Lichtenberg', lat: 52.529099, lng: 13.477747},
			{name: 'Pralinenwerkstatt im PflegeEngagement', opening: 'Heute 10:00 - 12:00 Uhr', date: '20161205', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders bietet die Kontaktstelle Pflegeengagement eine Pralinenwerkstatt mit ätherischen Ölen (für sorgende Angehörige und Menschen mit Unterstützungsbedarf).', street: 'Schulze-Boysen-Straße 37', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.507994, lng: 13.479978},
			{name: 'Kerzengießen im Advent', opening: 'Heute 15:00 - 18:00 Uhr', date: '20161206', fee: '', remarks: 'Im Rahmen des Lebendigen Adventskalenders können Sie in der Familienbegegnungsstätte FLIBB Kerzen gießen, bei Kakao und Plätzchen. Eine tolle Geschenkidee für Weihnachten.', street: 'Frankfurter Allee 219', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.512084, lng: 13.493393},
			{name: 'Modelleisenbahn-Ausstellung', opening: 'Heute 15:00 - 19:00 Uhr', date: '20161207', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders können große und kleine Eisenbahnfans die Ausstellung besuchen und die Anlage auch in Betrieb nehmen.', street: 'Siegfriedstraße 66-70', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.528533, lng: 13.500595},
			{name: 'Jugendmigrationsdienst pro Migra', opening: 'Heute 16:00 - 18:00 Uhr', date: '20161208', fee: 'Eintritt frei', remarks: 'Der Jugendmigrationsdienst Promigra lädt im Rahmen des Lebendigen Adventskalenders 2016 zur Weihnachtsgeschichte mit Leckereien.', street: 'Otto-Marquardt-Straße 6', zip_city: '10369 Berlin', district: 'Lichtenberg', lat: 52.533888, lng: 13.472953},
			{name: 'Advent im Kinderhaus NAPF', opening: 'Heute 14:00 - 18:00 Uhr', date: '20161209', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders sind Familien herzlich eingeladen zur Back-und Bastelstube und zu Weihnachtspunsch (alkoholfrei) am Lagerfeuer.', street: 'Hauffstraße 13', zip_city: '10317 Berlin', district: 'Lichtenberg', lat: 52.505522, lng: 13.480705},
			{name: 'Advent in der Kirche', opening: 'Heute ab 16:00 Uhr', date: '20161210', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders 2016 präsentiert die evangelische Kirchengemeinde Lichtenberg Adventsmusik für Trompete und Orgel.', street: 'Loeperplatz', zip_city: '10367 Berlin', district: 'Lichtenberg', lat: 52.521191, lng: 13.479762},
			{name: 'Adventssamstag in der Bibliothek', opening: 'Heute 10:00 - 15:00 Uhr', date: '20161210', fee: 'Eintritt frei', remarks: 'Die Anton-Saefkow-Bibliothek lädt im Rahmen des Lebendigen Adventskalenders 2016 zum Familiensamstag ein. Gezeigt wird das Puppentheaterspiel „Kasper und der gestohlene Weihnachtsbaum“ (ab 3 Jahren)', street: 'Anton-Saefkow-Platz 14', zip_city: '10369 Berlin', district: 'Lichtenberg', lat: 52.530709, lng: 13.470855},
			{name: 'Familien-Adventsnachmittag', opening: 'Heute 14:00 - 18:00 Uhr', date: '20161211', fee: 'Eintritt frei', remarks: 'Die Koptische Kirche am Roedeliusplatz lädt ein:<br><br>14:00 Uhr: tolle Mitmachangebote für Kinder<br><br>15:00 Uhr: Kinderchor der Schostakowitsch Musikschule, bekannte weihnachtliche Kinderlieder aus aller Welt<br>17:00 Uhr: Lukas Natschinski & Band, bekannte Gospels, Spirituals und Traditionals aus aller Welt<br>Wir freuen uns auf Ihren Besuch. Für Ihr leibliches Wohl ist gesorgt.', street: 'Roedeliusplatz', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.514859, lng: 13.489591},
			{name: 'Advent im Landschaftspark Herzberge', opening: 'Heute 10:00 - 12:00 Uhr', date: '20161212', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders 2016 können Familien die Schafe im Landschaftspark Herzberge besuchen. Treffpunkt: Tram-Haltestelle Evang. Krankenhaus KEH', street: 'Gotlindestraße 20', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.525525, lng: 13.508625},
			{name: 'Advent in der Apotheke', opening: 'Heute 10:00 - 16:00 Uhr', date: '20161212', fee: '', remarks: 'Die Oskar-Ziethen-Apotheke bietet Ihnen Tipps für die kalte Jahreszeit „Mit Wickeltechniken und etherischen Ölen durch die kalte Jahreszeit“', street: 'Frankfurter Allee 231', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.512712, lng: 13.495858},
			{name: 'Patengroßeltern stellen sich vor', opening: 'Heute 16:00 - 17:00 Uhr', date: '20161213', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders 2016 bietet der Berliner Familienfreunde e. V. Infos zu einem tollen Ehrenamt und möchte Interessierte dazu motivieren,  einem Kind Zeit und sich selbst Großelternglück zu bescheren.', street: 'Fanniger Str. 33', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.514327, lng: 13.496000},
			{name: 'Rathausführung für Kinder', opening: 'Heute 10:00 - 11:30 Uhr', date: '20161214', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders 2016 gibt es wieder spannende Geschichten von früher und heute und eine Tour durchs Haus, auch an geheime Orte. Weitere Informationen: Manuela Elsaßer, Koordinatorin für Kinder –und Jugendbeteiligung Berlin-Lichtenberg, Tel: 030 902966303', street: 'Möllendorffstraße 6', zip_city: '10367 Berlin', district: 'Lichtenberg', lat: 52.515954, lng: 13.479637},
			{name: 'Weihnachtsbasteln für Familien', opening: 'Heute 15:00 - 18:30 Uhr', date: '20161214', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders 2016 sind alle Familienzum zum gemeinsamen Weihnachtsbasteln mit Kaffee und Kuchen im Judith-Auer-Club eingeladen.', street: 'Otto-Marquardt-Str. 6-8', zip_city: '10369 Berlin', district: 'Lichtenberg', lat: 52.533888, lng: 13.472725},
			{name: 'Singer Songwriter im Advent', opening: 'Heute 16:00 - 17:00 Uhr', date: '20161215', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders 2016 lädt die Kinder- und Jugend-Freizeiteinrichtung Blu:boks zu einem Singer Songwriter- Abend zur Weihnachtszeit in das Café Blaupause.', street: 'Paul-Zobel-Str. 9', zip_city: '10367 Berlin', district: 'Lichtenberg', lat: 52.524539, lng: 13.481943},
			{name: 'Adventsnachmittag im Frauentreff', opening: 'Heute 14:30 - 17:00 Uhr', date: '20161215', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders lädt der Frauentreff in der Undine zu Adventskaffee und Weihnachtsgeschichten „Weihnachten – besinnlich, heiter, ironisch, geheimnisvoll“.', street: 'Hagenstraße 57', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.512464, lng: 13.499045},
			{name: 'Advent im Jugendzentrum', opening: 'Heute 15:00 - 19:00 Uhr', date: '20161216', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders werden in der Jugendfreizeiteinrichtung HolzHaus Lebkuchenfiguren gebacken.', street: 'Gotlindestr. 38', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.518350, lng: 13.499767},
			{name: 'Adventsnachmittag im Stadtteilzentrum', opening: 'Heute 14:00 - 18:00 Uhr', date: '20161216', fee: 'Eintritt frei', remarks: 'Bei Kaffee, Kuchen und Gebäck werden im Stadtteilbüro in den Möllendorffpassagen Weihnachtskarten gebastelt.', street: 'Paul-Zobel-Str. 8 e', zip_city: '10367 Berlin', district: 'Lichtenberg', lat: 52.524430, lng: 13.480749},
			{name: 'Advents-upcycling', opening: 'Heute 15:00 - 18:00 Uhr', date: '20161217', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders werden individuelle Notizhefte & Reisetagebücher aus Landkarten & alten Büchern genäht. Eine tolle Geschenkidee für Weihnachten.', street: 'Alfredstraße 4', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.512754, lng: 13.489994},
			{name: 'Lesung im Frauentreff', opening: 'Heute ab 15:00 Uhr', date: '20161219', fee: 'Eintritt frei', remarks: 'Der Kieztreff Undine veranstaltet im Rahmen des Lebendigen Adventskalenders die Lesung „Die vegetarische Weihnachtsgans“', street: 'Hagenstraße 57', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.512464, lng: 13.499045},
			{name: 'Kreativnachmittag in der Kita', opening: 'Heute 15:00 - 17:00 Uhr', date: '20161219', fee: 'Eintritt frei', remarks: 'Im Rahmen des Lebendigen Adventskalenders 2016 bietet die Kita Wunderkinder für Kinder von 1-6 Jahren einen Kreativnachmittag an. Familien sind herzlich Willkommen.', street: 'Paul-Zobel-Str. 9', zip_city: '10367 Berlin', district: 'Lichtenberg', lat: 52.524539, lng: 13.481943},
			{name: 'Theater in der Notunterkunft', opening: 'Heute ab 15:00 Uhr', date: '20161220', fee: 'Eintritt frei', remarks: 'Die Notunterkunft in der Ruschestraße präsentiert im Rahmen des lebendigen Adventskalenders ein interaktives, weihnachtliches Theaterstück.', street: 'Ruschstraße 104', zip_city: '10365 Berlin', district: 'Lichtenberg', lat: 52.513777, lng: 13.484987}
		];

	function addEvent(obj, id) {
		var txt = '';

		txt += '<div style="margin:0 -1.5rem 1rem -1.5rem;padding:1.5rem 1.5rem 1rem 1.5rem;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;">';
		txt += '<header style="white-space:normal;overflow:visible;height:auto;line-height:2rem;">' + obj.name + '</header>';
		txt += '</div>';
		txt += '<p>' + obj.remarks + '</p>';
		txt += '<p>' + obj.opening;
		if ('' !== obj.fee) {
			txt += '<br>' + obj.fee;
		}
		txt += '</p>';
		if (obj.street !== '') {
			if (typeof obj.zip_city !== 'undefined') {
				txt += '<p>' + obj.street + ', ' + obj.zip_city + ' ' + obj.district + '</p>';
			} else {
				txt += '<p>' + obj.street + ', ' + obj.zip + ' ' + obj.city + '</p>';
			}
		}

//		txt += '<div style="margin:1rem -1.5rem 1rem -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
		txt += '<div id="map' + id + '" style="height:25rem;margin:0 -1.5rem 0 -1.5rem;"></div>';
//		txt += '</div>';

		return txt;
	}

	function addEvents() {
		var txt = '', i, today = view.dateToStr(view.getToday());

		mapIDs = [];

		for (i = 0; i < events.length; ++i) {
			if (today === events[i].date) {
				txt += addEvent(events[i], i);
				mapIDs.push(i);
			}
		}

		if (mapIDs.length === 0) {
			txt += addEvent({
				name: 'Heute',
				opening: '',
				remarks: 'Heute versteckt sich hinter dem Türchen des Adventskalenders leider nichts. Komme morgen wieder.',
				'fee': '',
				street: '',
				zip_city: '',
				district: ''
			}, 9999);
		}

		return txt;
	}

	function addMaps() {
		var i,
			obj,
			mapboxToken = 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiJjaWh3Z3ZlNGYwMm01dWtrbzEyc3o5Z2l2In0.y9Lzc24BygGS_lmbpfRpxg',
			mapboxTiles,
			map,
			mapPin;

		for (i = 0; i < mapIDs.length; ++i) {
			obj = events[mapIDs[i]];

			if ((obj.lat !== null) && (obj.lng !== null)) {
				mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/tursics.l7ad5ee8/{z}/{x}/{y}.png?access_token=' + mapboxToken, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
				});

				map = L.map('map' + i, {zoomControl: true, scrollWheelZoom: false})
					.addLayer(mapboxTiles)
					.setView([obj.lat, obj.lng], 16);

				mapPin = L.circle([obj.lat, obj.lng], 25, {
					color: '#000',
					fillColor: '#F97C17',
					fillOpacity: 0.5,
					weight: 1
				}).addTo(map);
			}
		}
	}

	return {
		init: function () {
			view.add(idView, 'Advent');

			if (document.querySelector(idView) !== null) {
				document.querySelector(idView).addEventListener('click', this.fillList.bind(this), false);
			}
		},
		fillList: function () {
			view.setActive(idView);
			view.showProgress();

			var txt = '', obj = {
				path: 'berlin',
				uuid: 'advent-stz',
				name: 'Lebendiger Adventskalender<br><em style="font-size:.8em;">- jeden Tag ein neues Türchen -</em>',
				fee: '',
				remarks: '<p>Viele Einrichtungen der drei Stadtteile Fennpfuhl, Alt-Lichtenberg und Frankfurter Allee Süd öffnen auch in diesem Jahr ihre Türchen zum gemütlichen Beisammensein, Adventsbasteln und Plätzchenbacken oder zu Lesungen und Theateraufführungen.</p><p>Ab dem 1. Dezember sind alle Bürgerinnen und Bürger herzlich eingeladen die Angebote in Ihrem Kiez zu nutzen. Der „Lebendige Adventskalender“ ist eine gemeinsame Aktion von freien, öffentlichen und kirchlichen Trägern aus den drei Stadtteilen in Zusammenarbeit mit dem Stadtteilzentrum Lichtenberg Nord.</p>'
			},
				opening = '';
/*			for (var i = 0; i < config.markets.length; ++i) {
				var obj = config.markets[ i];

				if( '' != obj.data_next_open) {
					txt += view.composeMarketItem( obj, 1);
				}
			}*/

			txt += '<div style="margin:-1.5rem -1.5rem -1rem -1.5rem;"><img src="art/' + obj.path + '/' + obj.uuid + '/1200.jpg" style="width:100%;"></div>';

			txt += '<div style="margin:0 -1.5rem 1rem -1.5rem;padding:1.5rem 1.5rem 0 1.5rem;text-align:center;border-bottom:1px solid #f97c17;background:#fde4d0;">';
			txt += '<p style="color:#f97c17;">' + obj.name + '</p>';
			txt += '</div>';

			txt += '<p>' + obj.remarks + '</p>';
			txt += addEvents();
			txt += '<div style="margin:0 -1.5rem;padding:0 1.5rem 0 1.5rem;text-align:center;border-top:1px solid #f97c17;border-bottom:1px solid #f97c17;background:#fde4d0;">';
			txt += '<p id="copyright">Bildnachweis: Stadtteilzentrum Lichtenberg Nord</p>';
			txt += '</div>';

			txt = view.composeList(txt);
			txt = view.composeSectionList(txt);

			view.finishMarketList(txt);

			addMaps();
		}
	};
});

//-----------------------------------------------------------------------
