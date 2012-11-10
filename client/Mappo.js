Meteor.subscribe("features");
Features = new Meteor.Collection("features");


var AppRouter = Backbone.Router.extend({
	        routes: {
	            "": "home",
				"create":"create"
	        },
		    initialize:function () {
		        $('.back').live('click', function(event) {
		            window.history.back();
		            return false;
		        });
		        this.firstPage = true;
		    },
			home: function(){
				this.changePage( new MapViewPage());
			},
			create: function(){
				console.error('action not supported yet');
			},
			changePage:function (page) {
		        page.render();
		        $('body').append($(page.el));
		    }
});

// on document ready	
Meteor.startup(function () {
	
	// init and start router
	var router = new AppRouter;
	Backbone.history.start();
	

});

