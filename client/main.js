// on document ready	
Meteor.startup(function() {

     // create the structure of Mappo app
	var app = Cat.intc( 
		          { name:'map-viewer' },
		          Cat.dot(
			         { name:'map-providers' },
			         Cat.trace(
			             Cat.dot(
				           Cat.dot(
					         { name:'draw' },
					         { name:'search' }
					       ),
					       { name:'mongo-collection',
					         collection:'features' }
					     ),
					     ['create']
				     )
			      )
			   );
     // start the app and render it in body element
     Cat.start( app ).render($('body'));

});
