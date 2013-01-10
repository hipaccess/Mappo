// on document ready	
Meteor.startup(function() {

	Core.define('auth', ['loginOk', 'loginKo'], function(context) {
		return {
			login: function(username, password) {
				if (username === password) {
					context.trigger('loginOk', username, 'faketoken');
				} else {
					context.trigger('loginKo');
				}
			},
			handlerfake1: function() {
				// do something
			}
		};
	});

	Core.define('page', ['login', 'map'], function(context) {

		// page root element
		var page = $('body');

		return {
			init: function() {
				context.trigger('map', page);
			},
			click: function() {
				context.trigger('login', 'marco', 'marco');
			},
			loginOk: function(username, token) {
				console.log('success: ' + token);
			},
			loginKo: function() {
				console.log('login failed');
			}
		};

	});

	Core.define('map-viewer', ['ready'], function(context) {

		// create a map
		var mapId = Math.random().toString(36).substring(7);
		var el = $('<div></div>');
		el.attr('id', mapId);
		el.attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');


		return {
			render: function() {
				var map = L.map(mapId, {
					center: new L.LatLng(46, 11),
					zoom: 8,
					attributionControl: true
				});
				// https://github.com/CloudMade/Leaflet/issues/694
				map._onResize()
				context.trigger('ready', map);
			},
			map: function(page) {
				page.append(el);
				this.render();
			}
		};
	});

	Core.define('mongomap', [], function(context) {
		var group = L.geoJson(null, null);
		var features = Collections.get('features');
		return {
			ready: function(map) {
				features.find().observe({
					added: function(feature, beforeIndex) {
						var layer = L.GeoJSON.geometryToLayer(feature);
						group.addLayer(layer);
					}
				});
				map.addLayer(group);
				context.trigger('ready', map);
			},
			create: function(layer) {
				var feature = Util.formats.GeoJson.layerToGeometry(layer);
				features.insert(feature);
			}

		};
	});

	Core.define('draw', ['create'], function(context) {
		Leaflet.load('draw', drawLeafletPlugin);
		return {
			ready: function(map) {
				var drawControl = new L.Control.Draw({
					position: 'topleft',
					polygon: {
						title: 'Draw a sexy polygon!',
						allowIntersection: false,
						drawError: {
							color: '#b00b00',
							timeout: 1000
						},
						shapeOptions: {
							color: '#bada55'
						}
					},
					circle: {
						shapeOptions: {
							color: '#662d91'
						}
					}
				});
				map.addControl(drawControl);
				map.on('draw:poly-created', function(e) {
					context.trigger('create', e.poly);
				});
				map.on('draw:rectangle-created', function(e) {
					context.trigger('create', e.rect);
				});
				map.on('draw:circle-created', function(e) {
					context.trigger('create', e.circ);
				});
				map.on('draw:marker-created', function(e) {
					context.trigger('create', e.marker);
				});
			}
		};
	});

	Core.define('map-components', [], function(context) {
		Leaflet.load('providers', providerLeafletPlugin);
		var defaultLayer = L.TileLayer.provider('OpenStreetMap.Mapnik');
		var baseLayers = {
			"OpenStreetMap Default": defaultLayer,
			"OpenStreetMap German Style": L.TileLayer.provider('OpenStreetMap.DE'),
			"OpenStreetMap Black and White": L.TileLayer.provider('OpenStreetMap.BlackAndWhite'),
			"Thunderforest OpenCycleMap": L.TileLayer.provider('Thunderforest.OpenCycleMap'),
			"Thunderforest Transport": L.TileLayer.provider('Thunderforest.Transport'),
			"Thunderforest Landscape": L.TileLayer.provider('Thunderforest.Landscape'),
			"MapQuest OSM": L.TileLayer.provider('MapQuestOpen.OSM'),
			"MapQuest Aerial": L.TileLayer.provider('MapQuestOpen.Aerial'),
			"MapBox Simple": L.TileLayer.provider('MapBox.Simple'),
			"MapBox Streets": L.TileLayer.provider('MapBox.Streets'),
			"MapBox Light": L.TileLayer.provider('MapBox.Light'),
			"MapBox Lacquer": L.TileLayer.provider('MapBox.Lacquer'),
			"MapBox Warden": L.TileLayer.provider('MapBox.Warden'),
			"Stamen Toner": L.TileLayer.provider('Stamen.Toner'),
			"Stamen Terrain": L.TileLayer.provider('Stamen.Terrain'),
			"Stamen Watercolor": L.TileLayer.provider('Stamen.Watercolor'),
			"Esri WorldStreetMap": L.TileLayer.provider('Esri.WorldStreetMap'),
			"Esri DeLorme": L.TileLayer.provider('Esri.DeLorme'),
			"Esri WorldTopoMap": L.TileLayer.provider('Esri.WorldTopoMap'),
			"Esri WorldImagery": L.TileLayer.provider('Esri.WorldImagery'),
			"Esri OceanBasemap": L.TileLayer.provider('Esri.OceanBasemap'),
			"Esri NatGeoWorldMap": L.TileLayer.provider('Esri.NatGeoWorldMap')
		};

		return {
			ready: function(map) {
				map.addLayer(defaultLayer);
				map.addControl(new L.Control.Layers(baseLayers, '', {
					collapsed: true
				}));
			}
		};
	});
	
		/*	
			{ 'tourism':'information', 'attributes.information':'guidepost' },
			{ 'natural':'volcano' }, */

	Core.define('osm', [], function(context) {
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

	Core.compose('mongo-draw', 'mongomap', 'draw');
	Core.split('map', 'map-viewer', ['map-components', 'mongo-draw', 'osm']);
	Core.compose('app', 'page', 'map');

	app = Core.start('app');
	app.init();


});
