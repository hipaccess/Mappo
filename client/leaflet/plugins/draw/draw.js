// adapted from Jacob Toye
// https://github.com/jacobtoye/Leaflet.draw

;
(function() {
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

		},
		addTo: function(map) {
			this._map = map;
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
			this._map.addControl(drawControl);
		}
	});


	L.plugins.draw = function(options) {
		return new DrawControlView(options);
	};


}).call(this);
