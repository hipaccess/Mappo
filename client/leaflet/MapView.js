var MapView = Backbone.View.extend({

	initialize: function() {
		// generate a random id for this map
		this.mapId_ = Math.random().toString(36).substring(7);
		$(this.el).attr('id', this.mapId_);
		$(this.el).attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');
	},
	render: function() {
		var map = L.map( this.el , {
			center: new L.LatLng(0, 0),
			zoom: 5,
			attributionControl: true
		});
		
		// https://github.com/CloudMade/Leaflet/issues/694
		map._onResize()
		
		if ( L.plugins ){
			for ( var name in L.plugins ){
				L.plugins[name].addTo(map);
			}
		}
	},
});