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
	
	function createPolygon( layer ){
		var feature = createFeature('Polygon');
		var coords = [];
	    $.each( layer.getLatLngs(), function(index,value) {
	        coords.push([value.lng, value.lat]);
	    });
		feature.geometry.coordinates.push( coords );
		return feature;
	};

	function createMultiLineString( layer ){
		var feature = createFeature('MultiLineString');
		var coords = [];
	    $.each( layer.getLatLngs(), function(index,value) {
	        coords.push([value.lng, value.lat]);
	    });
		feature.geometry.coordinates.push( coords );
		return feature;
	};
	
	function createPoint( layer ){
		var feature = createFeature('Point'); 
		var latlng = layer.getLatLng();
		feature.geometry.coordinates = [latlng.lng, latlng.lat];
		return feature;
	};

	// adapted from https://github.com/CloudMade/Leaflet/issues/333
	function createFeature( type, layer ){
	    var feature = {
	        "type": "Feature",
	        "geometry": {
	            "type": type,
	            "coordinates": []
	        },
	    };

	    return feature;
	};
	
	
	L.formats.GeoJson.layerToGeometry = function( layer ){
		
		    if ( layer instanceof L.Polygon ){
				return createPolygon(layer);
			} else if ( layer instanceof L.Polyline ){
				return createMultiLineString( layer);
			} else if ( layer instanceof L.Marker ){
				return createPoint(layer);
			} else {
				console.error('not supported layer');
			}
		    
	};
	
}).call(this);