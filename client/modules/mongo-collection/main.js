/*
 *  this module adds created feature to a mongodb collection and displays them within a leaflet group
 */

Cat.define('mongo-collection', function(context, options) {
	function highlightFeature(e) {
	    var layer = e.target;
	    context.trigger('show', layer.feature);
	}
	function resetHighlight(e) {
	    group.resetStyle(e.target);
	    context.trigger('hide');
	}
	function zoomToFeature(e) {
	    // map.fitBounds(e.target.getBounds());
	}
	function onEachFeature(feature, layer) {
	    layer.on({
	        mouseover: highlightFeature,
	        mouseout: resetHighlight,
	        click: zoomToFeature
	    });
	}
	var collectionName = options.collection;
	var group = L.geoJson(null, {
		onEachFeature:onEachFeature
	});
	var features;
	if ( !collectionName ){
		throw 'You must specify a collection name in mongo-collection module.';
	}
	if ( Collections.has( collectionName) ){
		console.warn('Loading collection ' + collectionName + ' in module ' + options.name + '. Another module is using this collection.');
	}	
	features = Collections.get(collectionName);
	return {
		ready: function(map) {
			features.find().observe({
				added: function(feature, beforeIndex) {
					var layer = L.GeoJSON.geometryToLayer(feature);
					
					if ( layer instanceof L.Marker ){
						var icon = L.icon({
							iconUrl: options.icons(feature.properties),
							iconSize: [20, 20]
						});
						layer.feature = feature;
						layer.setIcon( icon );
						layer.bindPopup( JSON.stringify( feature.properties ) );
						layer.on({
					        mouseover: highlightFeature,
					        mouseout: resetHighlight,
					        click: zoomToFeature
					    });
					}
					
					
					group.addLayer(layer);
				}
			});
			map.addLayer(group);
		},
		create: function(item) {
			if ( Util.formats.GeoJson.isGeoJson( item) ){
			   features.insert(item);
			   return;
			}
			// attempts to convert layer to json
			var feature = Util.formats.GeoJson.layerToGeometry(item);
			if ( !feature ){
				throw 'Cannot add feature ' + JSON.stringigy(item) + '.';
			}
			features.insert(feature);
		}

	};
});