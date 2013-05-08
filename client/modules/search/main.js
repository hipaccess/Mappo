/*
 *  this module searches waypoints and add autocomplete textbox to map
 *  adapted from https://github.com/stefanocudini/leaflet-search
 */

Cat.define('search', function(context) {
	var waypoints = Collections.get('waypoints');
    
    var Search = L.Control.extend({
	
	   options: {
		  placeholder:'Search...',
		  buttonLabel:'Search',
		  position: 'topleft'
	   },
	   
	   initialize: function(options) {
		  L.Util.setOptions(this, options);
		
	   },
	
	   onAdd: function (map) {
		  this._map = map;
		  // build the ui
		  this._container = L.DomUtil.create('div', 'leaflet-control-search');
		  this._input = this._createInput(this.options.placeholder, 'search-input');
		  this._button = this._createButton(this.options.buttonLabel, 'search-button');
		  return this._container;
	   },
	
	   expand: function(){
		  this._input.style.display = 'block';
		  L.DomUtil.addClass(this._container, 'search-exp');	
		  this._input.focus();
		  return this;		
	   },
	
	   collapse: function(){
		  this._input.style.display = 'none';
		  L.DomUtil.removeClass(this._container, 'search-exp');
		  return this;
	   },
	
	   _createInput: function (text, className) {
		   var input = L.DomUtil.create('input', className, this._container);
		   input.type = 'text';
		   input.value = '';
		   input.placeholder = text;
		   input.style.display = 'none';
           $(input).autocomplete({
	           source: function(request, response){
		          response.call(undefined,
			         waypoints.find({"properties.name":new RegExp(request.term,"gi") })
		                   .map( function(item){
			                  return { value:item.properties.name, waypoint:item };
		                   })
				  );
	           },
	           select: function( event, ui ) {
		          context.trigger('addGeoJSon', ui.item.waypoint.geometry );
		          $(this).val('');
		          return false;
	           },
	           // hide helper texts
			   messages: {
			        noResults: '',
			        results: function() {}
			    }
           });
           L.DomEvent
			.disableClickPropagation(input);

		   return input;
	   },

	   _createButton: function (title, className) {
		  var button = L.DomUtil.create('a', className, this._container);
		  button.href = '#';
		  button.title = title;
		
		  L.DomEvent
		   .on(button, 'click', L.DomEvent.stop, this)
		   .on(button, 'click', this._handleClick, this);

		  return button;
	   },
	
	   _handleClick: function(){
		    // toggle
			if(this._input.style.display == 'none'){
				// show text field
				this.expand();
			} else {
				// hide
				this.collapse();
		    }		
	   }
	
	
	});

    var searchControl = new Search;

	return {
		ready: function(map) {
            map.addControl( searchControl );
		}

	};
});
