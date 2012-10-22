var MapView = Backbone.View.extend({

	events: {
		
	},
	initialize: function() {
	
	},
	render: function() {
		var map = L.map( this.$el.selector, {
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