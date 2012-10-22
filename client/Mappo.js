
	
Meteor.startup(function () {
	
	var AppRouter = Backbone.Router.extend({
		        routes: {
		            "*actions": "getCreateMapPageView"
		        },
		        getCreateMapPageView: function( ) {
			 	  new CreateMapPageView( 
						{ el: $("#content") }).render();

		        }
		    });
	var router = new AppRouter;
	Backbone.history.start();
	

});

