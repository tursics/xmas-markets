// ·································································

define( function() {
	var isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);

	if( isiOS) {
		document.body.className += ' ios';
	}

	return {
	};
});

// ·································································
