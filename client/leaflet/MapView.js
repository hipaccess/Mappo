/*
 * Leaflet plugin for Mappo.
 * Create a map panel.
 *
 *
 * Copyright 2012, mstn
 * Licensed under the Affero GPL license.
 */

;
(function() {
	"use strict";

	// save a reference for this function scope/context
	var root = this;
	var L = root.L;
	var $ = root.jQuery;
	L.plugins = L.plugins || {};
	// expose plugin to the external world
	L.plugins.MapViewer = {};
	// plugin version
	L.plugins.MapViewer.VERSION = '0.1';

	var Map = Backbone.Model.extend({

		defaults: {
			center: new L.LatLng(0, 0),
			zoom: 5,
			attributionControl: true
		},

		initialize: function() {

		}

	});

	var MapView = Backbone.View.extend({

		initialize: function() {
			// generate a random id for this map
			this.mapId_ = Math.random().toString(36).substring(7);
			$(this.el).attr('id', this.mapId_);
			$(this.el).attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');
		},
		render: function() {
			var map = L.map(this.el, this.model.attributes);
			// https://github.com/CloudMade/Leaflet/issues/694
			map._onResize()
			this.trigger('map:ready', map);
		}

	});

	L.plugins.MapViewer.create = function(config) {
		var map = new MapView({
			model: new Map
		});
		map.bind('map:ready', function(map) {

			var group = L.plugins.serverFeatureGroup({
				name: 'features',
				map: map
			}).render();
			group.on('feature:added', function(feature) {

				function highlightFeature(e) {
					feature.setStyle({
						weight: 5,
						color: '#666',
						dashArray: '',
						fillOpacity: 0.7
					});

					if (!L.Browser.ie && !L.Browser.opera) {
						feature.bringToFront();
					}
				};

				function resetHighlight(e) {
					feature.setStyle({
						weight: 5,
						color: '#0033ff',
						dashArray: '',
						fillOpacity: 0.7
					});
				};

				function zoomToFeature(e) {
					map.fitBounds(e.target.getBounds());
				};
				
				function openNoteWindow(e) {
					L.plugins.note( map  ).bindTo( feature ).show( );
				};
				
				feature.on({
						mouseover: highlightFeature,
						mouseout: resetHighlight,
						// click: zoomToFeature,
						click:openNoteWindow
				});
				
			
				

			});
			

			L.plugins.draw().addTo( map );
			map.on('draw:poly-created', function(e) {
				group.addLayer(e.poly);
			});
			map.on('draw:rectangle-created', function(e) {
				group.addLayer(e.rect);
			});
			map.on('draw:circle-created', function(e) {
				group.addLayer(e.circ);
			});
			map.on('draw:marker-created', function(e) {
				group.addLayer(e.marker);
			});

			L.plugins.TileProviders.addTo(map);
			
		}, this);
		map.render();
		return map;
	};

}).call(this);
