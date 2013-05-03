/*
 *  this is a leaflet plugin manager
 *
 */

(function( window, undefined ) {
	
	var Leaflet = {};
	var plugins = {};
	
	Leaflet.load = function( name, plugin ){
		plugins[ name ] = plugin.apply(null);
		plugins[ name ].loader.apply(null);
	};
	
	window.Leaflet = Leaflet;
	
})(window);