/*
 *  This module provides a list of public tile providers.
 *  It is based on and adapted from https://github.com/seelmann/leaflet-providers
 */

Cat.define('map-providers', function(context) {
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