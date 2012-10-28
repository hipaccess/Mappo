;(function() {
	"use strict";
	
	// save a reference for this function scope/context
	var root = this;
	var L = root.L;
	var $ = root.jQuery;
	L.formats = L.formats || {};
	// expose plugin to the external world
	L.formats.GeoJson = {};
	// plugin version
	L.formats.GeoJson.VERSION = '0.1';
	
	L.formats.GeoJson.parse = function(){
		
	};
	
	L.formats.GeoJson.write = function( geometry ){
		var feature = new Object;
		feature.type = 'Feature';
		feature.geometry = {type: "Point", 
							coordinates: [ geometry._latlng.lat, geometry._latlng.lng]};
		return feature;
	};
	
}).call(this);