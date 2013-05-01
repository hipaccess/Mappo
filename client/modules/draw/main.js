Cat.define('draw', function(context) {
	Leaflet.load('draw', drawLeafletPlugin);
	return {
		ready: function(map) {
			var drawControl = new L.Control.Draw({
				position: 'topleft',
				polygon: {
					title: 'Draw a sexy polygon!',
					allowIntersection: false,
					drawError: {
						color: '#b00b00',
						timeout: 1000
					},
					shapeOptions: {
						color: '#bada55'
					}
				},
				circle: {
					shapeOptions: {
						color: '#662d91'
					}
				}
			});
			map.addControl(drawControl);
			map.on('draw:poly-created', function(e) {
				context.trigger('create', e.poly);
			});
			map.on('draw:rectangle-created', function(e) {
				context.trigger('create', e.rect);
			});
			map.on('draw:circle-created', function(e) {
				context.trigger('create', e.circ);
			});
			map.on('draw:marker-created', function(e) {
				context.trigger('create', e.marker);
			});
		}
	};
});