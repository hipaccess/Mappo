// adapted from Jacob Toye
// https://github.com/jacobtoye/Leaflet.draw


;(function() {
	"use strict";
	
	// save a reference for this function scope/context
	var root = this;
	var L = root.L;
	var $ = root.jQuery;
	L.plugins = L.plugins || {};
	// expose plugin to the external world
	L.plugins.Draw = {};
	// plugin version
	L.plugins.Draw.VERSION = '0.1';
	
	
	var DrawControlView = Backbone.View.extend({
		initialize: function(options) {
	       this.map = options.map;
		   if ( !this.map ){
			 console.error('map not specified');
		   }
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
		this.map.addControl(drawControl);

		var drawnItems = new L.LayerGroup();

		Features.find()
				.observe({
					added: function(feature, beforeIndex){
						var marker = new L.Marker([ feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
						drawnItems.addLayer(marker);
					}
				});
		
		this.map.on('draw:poly-created', function (e) {
					drawnItems.addLayer(e.poly);
				});
		this.map.on('draw:rectangle-created', function (e) {
					drawnItems.addLayer(e.rect);
				});
		this.map.on('draw:circle-created', function (e) {
					drawnItems.addLayer(e.circ);
				});
		this.map.on('draw:marker-created', function (e) {
					var feature = L.formats.GeoJson.write( e.marker );
					Features.insert( feature );
					e.marker.bindPopup('A popup!');
					drawnItems.addLayer(e.marker);
				});
		this.map.addLayer(drawnItems);
	    }
	});
	
	
	L.plugins.Draw.addTo = function( map ) {
    	return new DrawControlView( {map:map} );
  	};
	
	
}).call(this);