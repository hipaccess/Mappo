/*
 *  this module adds created feature to a mongodb collection and displays them within a leaflet group
 */

Cat.define('mongo-collection', function(context, options) {
	var collectionName = options.collection;
	var group = L.geoJson(null, null);
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
					
					var icon = L.icon({
						iconUrl: 'mountains.png',
						iconSize: [20, 20]
					});
					layer.setIcon( icon );
					
					group.addLayer(layer);
				}
			});
			map.addLayer(group);
		},
		create: function(layer) {
			var feature = Util.formats.GeoJson.layerToGeometry(layer);
			features.insert(feature);
		},
		addGeoJSon: function(json){
			features.insert(json);
		}

	};
});