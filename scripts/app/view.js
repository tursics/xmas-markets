// ·································································

define( ['app/config', 'app/viewMarketsOne'], function( config, viewMarketsOne) {

	// ·····························································
	function onMarket()
	{
		var marketId = this.getAttribute( 'data-market');
		if(( typeof marketId === 'undefined') || (null == marketId)) {
			return;
		}

		document.querySelector( '#onemarket').className = 'current';
		document.querySelector( '[data-position="current"]').className = 'left';

//		window.scrollTo( 0, 0);
		var txt = '<div class="center"><progress></progress></div>';
		document.querySelector( '#onemarket > article').innerHTML = txt;

		config.currentMarketId = marketId;

		var obj = config.getMarketByID( config.currentMarketId);
		setTimeout( viewMarketsOne.fillList(), config.timeout);
	}

	// ·····························································
	function getToday()
	{
		var today = new Date();
//		today.setDate(today.getDate() + 0);
		return today;
	}

	// ·····························································
	return {

		// ·························································
		add: function( viewName, title)
		{
			config.views.push( viewName);

			var child = document.createElement( 'li');
			child.setAttribute( 'role', 'presentation');
			child.innerHTML = '<a href="#" role="tab" id="' + viewName.substr( 1) + '">' + title + '</a>';
			document.querySelector( '#markettab>ul').appendChild( child);

			var objs = document.querySelector( '#markettab>ul').getElementsByTagName( 'li');
			var width = (objs.length <= 3 ? 32 : (objs.length <= 4 ? 23 : 18));
			for( var i = 0; i < objs.length; ++i) {
				objs[i].style.width = width + '%';
			}
		},

		// ·························································
		setActive: function( viewName)
		{
			for( var i = 0; i < config.views.length; ++i) {
				var view = config.views[ i];
				if( document.querySelector( view) !== null) {
					document.querySelector( view).setAttribute( 'aria-selected', view == viewName ? 'true' : 'false');
				}
			}
		},

		// ·························································
		showProgress: function()
		{
//			window.scrollTo( 0, 0);
			document.querySelector( '#marketlist').innerHTML = '<div class="center"><progress></progress></div>';
		},

		// ·························································
		composeSectionList: function( content)
		{
			return '<section data-type="list">' + content + '</section>';
		},

		// ·························································
		composeList: function( content)
		{
			return '<ul>' + content + '</ul>';
		},

		// ·························································
		composeMarketItem: function( obj, diffdays)
		{
			var openingtime = '';
			if( -2 == diffdays) {
				var km = parseInt( obj.data_km * 2);
				var km2 = parseInt( km / 2) * 2;
				if(( 0 == km) && (0 == km2)) {
					openingtime = 'Gleich hier, ' + this.getNextMarketOpeningTime( obj);
				} else if(( 1 == km) && (0 == km2)) {
					openingtime = 'Gleich um die Ecke, ' + this.getNextMarketOpeningTime( obj);
				} else if( 200 < km2) {
					openingtime = 'Viel zu weit weg, ' + this.getNextMarketOpeningTime( obj);
				} else if( 10 <= km2) {
					openingtime = (km2 / 2) + ' km entfernt, ' + this.getNextMarketOpeningTime( obj);
				} else if( 0 == (km - km2)) {
					openingtime = (km2 / 2) + ' km entfernt, ' + this.getNextMarketOpeningTime( obj);
				} else {
					openingtime = (km2 / 2) + ',5 km entfernt, ' + this.getNextMarketOpeningTime( obj);
				}
			} else if( -1 == diffdays) {
				openingtime = this.getNextMarketOpeningTime( obj);
			} else {
				openingtime = 'von ' + this.getOpeningTime( obj, diffdays) + ' Uhr';
			}

			if( 'hide' == obj.todo) { return ''; }
//			if( 'mail' == obj.todo) { return ''; }
//			if( 'ready' == obj.todo) { return ''; }
//			if( '' == obj.todo) { return ''; }

			var txt = '<p>' + obj.name + '</p><p>' + openingtime + '</p>';
			var img = '<aside class="pack-begin"><img src="art/' + obj.path + '/' + obj.uuid + '/128.jpg"></aside>';

			return '<li data-market="' + obj.path + '-' + obj.uuid + '">' + img + '' + txt + '</li>';
		},

		// ·························································
		finishMarketList: function( txt)
		{
			document.querySelector( '#marketlist').innerHTML = txt;
			var objs = document.querySelector( '#marketlist').getElementsByTagName( 'li');
			for( var i = 0; i < objs.length; ++i) {
				objs[i].addEventListener( 'click', onMarket);
			}
		},

		// ·························································
		dateToStr: function( obj)
		{
			var str = obj.getFullYear().toString();

			if( obj.getMonth() < 9) {
				str += '0';
			}
			str += obj.getMonth() + 1;
			if( obj.getDate() < 10) {
				str += '0';
			}
			str += obj.getDate();

			return str;
		},

		// ·························································
		getOpeningTime: function( obj, diffdays)
		{
			var workingDate = getToday();
			workingDate.setDate( workingDate.getDate() + diffdays);

			var daystr = this.dateToStr( workingDate);
			if( typeof obj[ daystr] !== 'undefined') {
				return obj[ daystr].trim();
			}

			return '';
		},

		// ·························································
		getNextOpeningDays: function( obj)
		{
			var days = 0;

			var workingDate = getToday();
			while( workingDate < config.startDate) {
				++days;
				workingDate.setDate( workingDate.getDate() + 1);
			}

			var late = getToday();
			late.setTime( config.endDate.getTime());
			late.setDate( late.getDate() + 1);

			while( workingDate < late) {
				var daystr = this.dateToStr( workingDate);
		    	if(( typeof obj[ daystr] !== 'undefined') && (obj[ daystr].trim() != '')) {
					return days;
	    		}

				++days;
				workingDate.setDate( workingDate.getDate() + 1);
			}

			return 36500;
		},

		// ·························································
		getNextMarketOpeningTime: function( obj)
		{
			var days = this.getNextOpeningDays( obj);
			var openingtime = '';

			var workingDate = getToday();
			workingDate.setHours( 0, 0, 0, 0);
			var nowTime = workingDate.getTime();
			workingDate.setDate( workingDate.getDate() - (workingDate.getDay() + 6) % 7);
			var mondayTime = workingDate.getTime();

			workingDate = getToday();
			workingDate.setDate( workingDate.getDate() + days);
			var workTime = workingDate.getTime();
			var weekday = workingDate.getDay();
			var diffNow = parseInt((workTime - nowTime) / 1000 / 60 / 60 / 24);
			var diffDays = parseInt((workTime - mondayTime) / 1000 / 60 / 60 / 24);
			var maxOpen = parseInt((config.endDate.getTime() - nowTime) / 1000 / 60 / 60 / 24);
			var diffWeeks = parseInt(diffDays / 7);
			var weekdays = new Array( "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");

			if( maxOpen <= days) {
				openingtime = 'Vorbei';
			} else if( 0 == days) {
				openingtime = 'Heute von ' + this.getOpeningTime( obj, days) + ' Uhr';
			} else if( 1 == days) {
				openingtime = 'Morgen von ' + this.getOpeningTime( obj, days) + ' Uhr';
			} else if( 0 == diffWeeks) {
				openingtime = weekdays[weekday] + ' von ' + this.getOpeningTime( obj, days) + ' Uhr';
			} else if( 1 == diffWeeks) {
				if( diffNow < 6) {
					openingtime = weekdays[weekday] + ' von ' + this.getOpeningTime( obj, days) + ' Uhr';
				} else {
					openingtime = 'Nächste Woche ' + weekdays[weekday];
				}
			} else if( 4 > diffWeeks){
				openingtime = weekdays[weekday] + ' in ' + diffWeeks + ' Wochen';
			} else {
				openingtime = 'Kurz vor Weihnachten';
			}

			return openingtime;
		}
	};
});

// ·································································
