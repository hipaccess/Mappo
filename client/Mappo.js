

// on document ready	
Meteor.startup(function () {
	
	Core.define('auth', ['loginOk', 'loginKo'], function( context ){
		return {
			login: function(username, password){
				if ( username === password ){
					context.trigger('loginOk', username, 'faketoken');
				} else {
					context.trigger('loginKo');
				}
			},
			handlerfake1: function(){
				// do something
			}			
		};
	});
	
	Core.define('page', ['login', 'map'], function(context){
		
		// page root element
		var page = $('body');
		
		return {
			init: function(){
				context.trigger('map', page);
			},
			click: function(){
				context.trigger('login', 'marco', 'marco');
			},
			loginOk: function( username, token ){
				console.log('success: ' + token);
			},
			loginKo: function( ){
				console.log('login failed');
			}			
		};

	});
	
	Core.define('map-viewer', [ 'ready' ], function(context){
		
		// create a map
		var mapId = Math.random().toString(36).substring(7);
		var el = $('<div></div>');
		el.attr('id', mapId);
		el.attr('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;');
	
		
		return {
			render: function(){
				var map = L.map( mapId, {
					center: new L.LatLng(0, 0),
					zoom: 5,
					attributionControl: true
				});
				// https://github.com/CloudMade/Leaflet/issues/694
				map._onResize()
				context.trigger('ready', map);
			},
			map: function( page ){
				page.append( el );
				this.render();
			}
		};
	});
	
	Core.define('mongomap', [], function(context){
		var group = L.geoJson( null, null );
		var features = Collections.get('features');
		return {
			ready: function( map ){
				features.find().observe({
							added: function(feature, beforeIndex) {
								var layer = L.GeoJSON.geometryToLayer( feature );
								group.addLayer( layer );
							}
						});
				map.addLayer( group );
				context.trigger('ready', map);
			},
			create: function( layer ){
				var feature = Util.formats.GeoJson.layerToGeometry(layer);
				features.insert(feature);
			}
			
		};
	});
	
	Core.define('draw', [ 'create' ], function(context){
		Leaflet.load( 'draw', drawLeafletPlugin );
		return {
			ready: function( map ){
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
	
	Core.define('map-components', [ ], function(context){
		
		var osmMapAttr = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
		var osmDataAttr = 'Map data ' + osmMapAttr;
		var layer = new L.TileLayer(
			'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', 
			{attribution:osmMapAttr}
		);
		
		return {
			ready: function( map ){
				map.addLayer( layer );
			}
		};
	});
	
	Core.compose('mongo-draw', 'mongomap', 'draw');
	Core.split('map', 'map-viewer', ['map-components', 'mongo-draw']);
	Core.compose('app', 'page', 'map');
	
	app = Core.start('app');
	app.init();
	

});

