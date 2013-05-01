// on document ready	
Meteor.startup(function() {

     // create the structure of Mappo app
     var app = Cat.intc( 'map-viewer', 
                  Cat.dot('map-providers',
					Cat.dot('draw', 'mongo-collection')
				  )
               );
     // start the app and render it in body element
     Cat.start( app ).render($('body'));

});
