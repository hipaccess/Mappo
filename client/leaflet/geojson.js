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
	
	
	var CircleBuilder = {
		canHandle: function( geometry ){
			if ( geometry.getRadius && geometry.getLatLng ){
				return true;
			} else {
				return false;
			}
		},
		create: function( geometry ){
			var coords = geometry.getLatLng();
			var radius = geometry.getRadius();
			return {
				type:'Circle',
				coordinates: [coords.lat, coords.lng],
				radius: geometry.getRadius()
			};
		}
	};
	var PointBuilder = {
		canHandle: function( geometry ){
			if ( geometry.getLatLng ){
				return true;
			} else {
				return false;
			}
		},
		create: function( geometry ){
			var coords = geometry.getLatLng();
			return {
				type: "Point", 
				coordinates: [ coords.lat, coords.lng ]
			};
		}
	};
	var PolygonBuilder = {
		canHandle: function( geometry ){
			if ( geometry.getBounds ){
				return true;
			} else {
				return false;
			}
		},
		create: function( geometry ){
			var bounds = geometry.getBounds();
			var coords = bounds.toBBoxString().split(', ');
			return {
				type:'Polygon',
				coordinates: coords
			};
		}
	};
	
	var PolylineBuilder = {
		canHandle: function( geometry ){
			if ( geometry.getBounds ){
				return true;
			} else {
				return false;
			}
		},
		create: function( geometry ){
			var bounds = geometry.getBounds();
			var coords = bounds.toBBoxString().split(', ');
			return {
				type:'MultiLineString',
				coordinates: coords
			};
		}
	};
	
	var builders = [
		CircleBuilder,
		PointBuilder,
		PolygonBuilder,
		PolylineBuilder
	];

	L.formats.GeoJson.parse = function(){
		
	};
	
	L.formats.GeoJson.write = function( geometry ){
		var builder = _.filter(builders, function(builder){
			return builder.canHandle(geometry);
		});
	
		if ( builder && builder.length > 0){
			return builder[0].create( geometry );
		} else {
			console.error('unknown geometry');
		}
		
		
	};
	
}).call(this);