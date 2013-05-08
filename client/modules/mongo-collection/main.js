/*
 *  this module adds created feature to a mongodb collection and displays them within a leaflet group
 */

Cat.define('mongo-collection', function(context) {
	var group = L.geoJson(null, null);
	var features = Collections.get('features');
	return {
		ready: function(map) {
			features.find().observe({
				added: function(feature, beforeIndex) {
					var layer = L.GeoJSON.geometryToLayer(feature);
					
					var icon = L.icon({
						iconUrl: 'mountains.png',
						iconSize: [10, 10]
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