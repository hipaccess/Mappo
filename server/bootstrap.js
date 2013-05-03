Meteor.startup(function () {
	Features = new Meteor.Collection("features");
	Meteor.publish("features", function () {
	  return Features.find(); // everything
	});
	
	/*Paths = new Meteor.Collection("paths");
	Meteor.publish("paths", function () {
  		return Paths.find(); 
	});
	
	if ( Paths.find().count() === 0 ){
		Meteor.http.get('https://api.mongohq.com/databases/osm/collections/satgpx?_apikey=ad1r3nxynhxls3vfq5q9', function (err, res) {
			if (err){
				console.log('cannot download info about collection')
				return console.log( JSON.stringify(res) );
			}
			var MAX_LIMIT = 100;
			var count = res.data.count;
			console.log('downloading ' + count + ' tracks');
			_.each(_.range(Math.ceil(count / MAX_LIMIT)), function(index) {
				Meteor.http.get('https://api.mongohq.com/databases/osm/collections/satgpx/documents?_apikey=ad1r3nxynhxls3vfq5q9&limit=100&skip=' + (index * MAX_LIMIT),
				function (err, res) {
					if (err){
						console.log('cannot download data');
						return console.log( JSON.stringify(res) );
					}
					var list =  res.data;
				  	_.each( list, function( feature ){
						delete feature._id;
						Paths.insert( feature );
					});		
				});			
			});

		});		
	}*/


	
	
});