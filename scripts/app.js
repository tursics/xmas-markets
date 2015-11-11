// ·································································

requirejs.config({
	baseUrl: 'scripts/lib',
	paths: {
		app: '../app',
		data: '../../data'
	}
});

// ·································································

requirejs(['app/main', 'app/config', 'app/design'],
function(main, config, design) {
	if( typeof Number.prototype.toRadians == 'undefined') {
		Number.prototype.toRadians = function() { return this * Math.PI / 180; };
	}
});

// ·································································
