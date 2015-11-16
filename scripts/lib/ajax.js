// ·································································

define( function() {
	function getXHR()
	{
		if( typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest();
		}
		var versions = [
			"MSXML2.XmlHttp.6.0",
			"MSXML2.XmlHttp.5.0",
			"MSXML2.XmlHttp.4.0",
			"MSXML2.XmlHttp.3.0",
			"MSXML2.XmlHttp.2.0",
			"Microsoft.XmlHttp"
		];

		var xhr;
		for( var i = 0; i < versions.length; ++i) {
			try {
				xhr = new ActiveXObject( versions[i]);
				break;  
			} catch( e) {
			}
		}
		return xhr;
	}

	return {
		send: function( url, callback, method, data, sync)
		{
			var x = getXHR();
			x.open( method, url, sync);
			x.onreadystatechange = function() {
				if( x.readyState == 4) {
					callback( x.responseText);
				}
			};
			if( method == 'POST') {
				x.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded');
			}
			x.send( data);
		},
		get: function( url, data, callback, sync)
		{
			var query = [];
			for( var key in data) {
				query.push( encodeURIComponent( key) + '=' + encodeURIComponent( data[key]));
			}
			this.send( url + (query.length ? '?' + query.join( '&') : ''), callback, 'GET', null, sync);
		},
		post: function( url, data, callback, sync)
		{
			var query = [];
			for( var key in data) {
				query.push( encodeURIComponent( key) + '=' + encodeURIComponent( data[key]));
			}
			this.send( url, callback, 'POST', query.join('&'), sync);
		}
	};
});

// ·································································
