var MapView = Backbone.View.extend({

	initialize: function() {
		// generate a random id for this map
		this.mapId_ = Math.random().toString(36).substring(7);
		/*$(this.el).attr('id', this.mapId_);
		$(this.el).attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');*/
		this.map = $('<div/>');
		this.map.attr('id', this.mapId_);
		this.map.attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');
		$(this.el).append(this.map);
		// $(this.el).attr('style', 'position: absolute; top: 0; left: 0; width: 500px; height: 300px;');
	},
	render: function() {
		
		console.log( this.map[0] )
		var map = L.map( this.map[0] , {
			center: new L.LatLng(48, -3),
			zoom: 5,
			attributionControl: true
		});
		
		if ( L.plugins ){
			for ( var name in L.plugins ){
				L.plugins[name].addTo(map);
			}
		}
	},
});