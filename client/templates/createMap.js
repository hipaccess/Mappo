

var CreateMapPageView =  Backbone.View.extend({
	
    initialize: function() {
      _.bindAll(this, 'render');
    },
    template: function() {
		return Meteor.render(function() {
	        return Template.createMapPage();
	    });
        
    },
    render: function() {
	  $(this.el).html( this.template()  );
	  new MapView( { el: 'map' } ).render();
			
	
	  return this;
    }	
});