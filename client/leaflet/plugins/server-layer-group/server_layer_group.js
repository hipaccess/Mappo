;
(function() {
	"use strict";

	// save a reference for this function scope/context
	var root = this;
	var L = root.L;
	var $ = root.jQuery;
	L.plugins = L.plugins || {};


	var LayerGroup = Backbone.Model.extend({

		initialize: function( name ) {
			this._name = name;
			Meteor.subscribe(this._name);
			this._features = new Meteor.Collection(this._name);
			
			var group = this;
			this._features.find().observe({
				added: function(feature, beforeIndex) {
					var layer = L.GeoJSON.geometryToLayer( feature );
					group.trigger('feature:added', layer);
				}
			});
		},
		addLayer: function( layer ){
			var feature = L.formats.GeoJson.layerToGeometry(layer);
			this._features.insert(feature);			
		}

	});


	var LayerGroupView = Backbone.View.extend({

		initialize: function( options ) {
			this._map = options.map;
			this._group = L.geoJson( null, options );
			this.model.bind('feature:added', this._onFeatureAdded, this);
		},
		render: function() {
			this._group.addTo( this._map );
			return this;
		},
		addLayer: function(layer){
			this.model.addLayer( layer );
		},
		_onFeatureAdded: function( feature ){
			this._group.addLayer( feature );
			this.trigger('feature:added', feature);
		}

	});


	L.plugins.ServerLayerGroup = {};
	L.plugins.ServerLayerGroup.VERSION = '0.1';

	L.plugins.serverFeatureGroup = function(options) {
		return new LayerGroupView({
			model: new LayerGroup( options.name ),
			map: options.map
		});
	};


}).call(this);
