/*
 * this module uploads OSM waypoints from an external service
 */

Cat.define('osm', function(context) {
		// response in MongoHQ cannot be bigger than 100 documents
		var MAX_LIMIT = 100;

		var markers = [];
		var getIconUrl = function( item ){
			if ( item.tourism === 'alpine_hut'){
				return 'hut.png';
			} else if ( item.amenity === 'shelter'){
				return 'cabin-2.png';
			} else if ( item.natural === 'peak' ){
				return 'mountains.png';
			} else if ( item.mountain_pass === 'yes'){
				return 'mountain-pass.png';
		    } else if ( item.amenity === 'drinking_water'){
				return 'drinkingwater.png';
			} else if ( item.tourism === 'viewpoint'){
				return 'beautifulview.png';
			} else {
				return 'search-icon.png';
			}
		};

		var geo = L.geoJson([], {
			pointToLayer: function( node, latlng ){
				var icon = null;




				return L.marker( latlng, {icon: icon});
			},
			onEachFeature: function(node, layer){
				if (node.properties ) {
					var text = node.properties.name;
				    layer.bindPopup( text );
				}
			},
			filter: function(node, layer) {
			   return (node.properties.tourism === 'alpine_hut')
						|| (  node.properties.amenity === 'shelter' )
						    ||  ( node.properties.natural === 'peak' )
								|| ( node.properties.mountain_pass === 'yes') ;
			}
		});
		return {
			ready: function(map) {
				// add osm layer to map
				geo.addTo(map);

				map.on('viewreset', function(){
					// 0 max zoomout, 20 
					// 9 px per 9 zoom
					var zoom = map.getZoom();
				    /*_.each( markers, function(marker){
					   if (marker.iconUrl){
						 marker.setIcon( L.icon({
							iconUrl: marker.iconUrl,
							iconSize:[ zoom*1.5, zoom*1.5]
						 }));
					   }
					});*/
				});

				$.ajax({
					url: 'https://api.mongohq.com/databases/osm/collections/node?_apikey=ad1r3nxynhxls3vfq5q9',
					dataType: 'json',
					success: function(data) {
						var count = data.count;
						var requests = [];
						_.each(_.range(Math.ceil(count / MAX_LIMIT)), function(index) {
							requests.push(function(callback) {
								$.ajax({
									url: 'https://api.mongohq.com/databases/osm/collections/node/documents?_apikey=ad1r3nxynhxls3vfq5q9&limit=100&skip=' + (index * MAX_LIMIT),
									dataType: 'json',
									success: function(data) {
										_.each(data, function(node) {
											var url = getIconUrl( node.properties );
											var popupContent = node.properties.name;
											var coords = node.geometry.coordinates;
											var latLan = new L.LatLng( coords[1], coords[0]);
											var icon = L.icon({
												iconUrl: url,
												iconSize: [10, 10]
											});
											var marker = L.marker( latLan, {
												icon: icon 
											});
											marker.iconUrl = url;
											marker.bindPopup( JSON.stringify( node.properties ) );
											marker.addTo( map );
											// marker.iconUrl = url;
											markers.push( marker );
										});
										callback(null, true);
									},
									failure: function(data) {
										console.error(data);
										callback(null, false);
									}
								});
							});
						});
						async.parallel(
						requests, function(err, results) {
							if (err) {
								return console.log(err);
							}
						});
					},
					failure: function(data) {
						console.error(data);
					}
				});
			}
		};
	});
