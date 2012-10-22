
/*
 * Leaflet plugin for Mappo.
 * Create a combo box with some free tile providers.
 *
 * The list of free tile providers is taken from https://github.com/seelmann/leaflet-providers
 *
 * Copyright 2012, mstn
 * Licensed under the Affero GPL license.
 */

;(function() {
	"use strict";
	
	// save a reference for this function scope/context
	var root = this;
	var L = root.L;
	var $ = root.jQuery;
	L.plugins = L.plugins || {};
	// expose plugin to the external world
	L.plugins.TileProviders = {};
	// plugin version
	L.plugins.TileProviders.VERSION = '0.1';
	

	var TileProvider = Backbone.Model.extend({

		layer: null,
		
		/**
		 * Initialize the model.
		 *
		 */
		initialize: function(){
			this.layer = new L.TileLayer(
				this.get('url'),
				this.get('options')
			);
		},
		/**
		 * Return the leaflet tile layer associated to this model.
		 *
		 * @return {Leaflet.TileLayer} The new tile layer.
		 */
		getLayer: function(){
			return this.layer;
		}

	});
	
	var TileProviderList = Backbone.Collection.extend({

		model: TileProvider,

		initialize: function() {

		  // TODO memorizza queste info nel db remoto
		  // OSM
		  var osmMapAttr = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
		  var osmDataAttr = 'Map data ' + osmMapAttr;
		  this.add( new TileProvider({ 
			name: 'Open Street Map',
			url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
			options: {attribution:osmMapAttr}
		  }));
		  var ocmAttr = '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
		  this.add( new TileProvider({
			name: 'Open Cycle Map',
		    url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
		    options: {attribution:ocmAttr}
		  }));

		},

		getLayer: function(name){
			var layers = this.where({name:'Open Street Map'});
			if ( layers.length > 1 ){
				console.error('name is not unique');
			} else if ( layers.length == 1){
				return layers[0].getLayer();
			}
			return null;
		},

		getLayers: function(){
			var layers = new Object;
			this.each(function(provider) {
			  var layer = provider.getLayer();
			  layers[ provider.get('name') ] = layer;
			  return true;
			});
			return layers;
		}
	});

	var TileProviders = new TileProviderList;

	var TileProviderView = Backbone.View.extend({
		initialize: function(options) {
	       this.map = options.map;
		   if ( !this.map ){
			 console.error('map not specified');
		   }
		   var defaultLayer = TileProviders.getLayer('Open Street Map');  
		   this.map.addLayer(defaultLayer);
		   var baseLayers = TileProviders.getLayers(); 
		   this.map.addControl(new L.Control.Layers(baseLayers,'',{collapsed: true}));
	    }
	});	
	
	
	
	L.plugins.TileProviders.addTo = function( map ) {
    	return new TileProviderView( {map:map} );
  	};
  
	
	
}).call(this);

		








