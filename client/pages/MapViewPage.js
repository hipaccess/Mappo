var MapViewPage = Backbone.View.extend({

	initialize: function() {
	},
	render: function() {
		
	
		var map = L.plugins.MapViewer.create();
		
		$(this.el).append( $(map.el));
		
		
		

	}
});