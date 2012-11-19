;
(function() {
	"use strict";

	// save a reference for this function scope/context
	var root = this;
	var L = root.L;
	var $ = root.jQuery;
	L.plugins = L.plugins || {};
	// expose plugin to the external world
	L.plugins.Note = {};
	// plugin version
	L.plugins.Note.VERSION = '0.1';
	
	// idea: modal window con animazione
	var NoteView = Backbone.View.extend({

		initialize: function( map ) {
			this._map = map;
			/*var info = L.control();

			info.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			    this.update();
			    return this._div;
			};

			// method that we will use to update the control based on feature properties passed
			info.update = function (props) {
			    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
			        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
			        : 'Hover over a state');
			};

			info.addTo( map );*/
		},
		render: function() {
			console.log( this._feature instanceof L.MultiPolyline );
			var popup = L.popup()
			    .setLatLng( this._feature.getLatLngs()[0] )
			    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
			    .openOn(this._map);
		},
		bindTo: function( feature ){
			this._feature = feature;
			return this;
		},
		show: function(){
			this.render();
			
		},
		hide: function(){
			
		}
	});
	
	L.plugins.note = function( map ) {
		return new NoteView(map);
	};
	
}).call(this);