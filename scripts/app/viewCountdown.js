// ·································································

define(['app/config', 'app/view'], function (config, view) {
	'use strict';

	var idView = '#tab-countdown';

	return {
		init: function () {
			view.add(idView, 'Weihnachten');

			if (document.querySelector(idView) !== null) {
				document.querySelector(idView).addEventListener('click', this.fillList.bind(this), false);
			}
		},
		fillList: function () {
			view.setActive(idView);
			view.showProgress();

			var today = new Date(),
				xmas = new Date('December 24, ' + today.getFullYear()),
				timeLeft = (xmas.getTime() - today.getTime()),
				daysLeft = Math.floor(timeLeft / (24 * 60 * 60 * 1000)) + 1,
				txt = '';

			txt += '<header>Bald nun ist...</header>';
			txt += '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">... Weihnachtszeit. In ' + daysLeft + ' Tagen ist es soweit.</p></li>';

			txt += '<header>Komme bald wieder</header>';
			txt += '<li style="height:auto;"><p style="white-space:normal;line-height:2rem;">Die App wird rechtzeitig aktualisiert.</p></li>';

			txt = view.composeList(txt);
			txt = view.composeSectionList(txt);

			txt = '<div style="margin:-1.5rem -1.5rem 1rem -1.5rem;"><img src="' + config.teaserPath + '" style="width:100%;"></div>' + txt;

			view.finishMarketList(txt);
		}
	};
});

// ·································································
