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
	console.log( config);
});

// ·································································
