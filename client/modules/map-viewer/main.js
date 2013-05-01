/*
 *  this module creates a map and expose a method to render it within an html element
 */

Cat.define('map-viewer', function(context) {

	// create a map
	var mapId = Math.random().toString(36).substring(7);
	var el = $('<div></div>');
	el.attr('id', mapId);
	el.attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');


	return {
		render: function( container ) {
			container.append( el );
			var map = L.map(mapId, {
				center: new L.LatLng(46, 11),
				zoom: 8,
				attributionControl: true
			});
			// https://github.com/CloudMade/Leaflet/issues/694
			map._onResize()
			context.trigger('ready', map);
		}
	};
});