;(function() {
	"use strict";
	
	var root = this;
	var $ = this.jQuery;
	var _ = this._;
	
	var MultiRequest = function(limit, total){
		this.limit = limit;
		this.total = total;
	};
	
	
		// get information about this collection
		/*$.ajax({
			url: 'https://api.mongohq.com/databases/osm/collections/relation?_apikey=ad1r3nxynhxls3vfq5q9',
			dataType: 'json',
			success: function(data) {
				var count = data.count;
				var ways = {};
				var requests = [];
				_.each(_.range(Math.ceil(count / MAX_LIMIT)), function(index) {
					requests.push(function(callback) {
						// console.log('request ' + index);
						$.ajax({
							url: 'https://api.mongohq.com/databases/osm/collections/relation/documents?_apikey=ad1r3nxynhxls3vfq5q9&limit=100&skip=' + (index * 100),
							dataType: 'json',
							success: function(data) {
								_.each(data, function(relation) {
									_.each(relation.members, function(member) {
										ways[ member.ref ] = true;
									});
								});
								callback(null, true);
							},
							failure: function(data) {
								console.error(data);
								callback(null, false);
							}
						});
					});
				});
				async.parallel(
				requests, function(err, results) {
					if (err) {
						return console.log(err);
					}
					var keys = _.keys( ways );
					// KEYS = keys;
					var wayRequests = [];
					// console.log( keys.length );
					// console.log( Math.ceil(keys.length / 50) );
					_.each(_.range(Math.ceil(keys.length / 50)), function(index) {
							wayRequests.push(function(callback) {
								// console.log( index + ': ' + JSON.stringify( keys.slice( index*50, (index+1)*50 ) ) );
								var filter =  '{ "properties.id": { "$in":' + JSON.stringify( keys.slice( index*50, (index+1)*50 ) ) + ' } }' ;	
								$.ajax({
									url: 'https://api.mongohq.com/databases/osm/collections/way/documents?_apikey=ad1r3nxynhxls3vfq5q9&q=' + encodeURIComponent( filter ),
									success: function(data) {
										_.each(data, function(way) {
											geo.addData(way);
										});
										// console.log( filter );
										callback(null, true);
									},
									failure: function(data) {
										console.error(data);
										callback(null, false);
									}
								});
							});
					});
				   async.parallel( wayRequests, function(err, results){
						if (err){
							return console.error(err);
						}
				   });	
				});
				}, failure: function(data) {
					console.error(data);
				}
			});*/

/*$.ajax({
			// max mongohq limit: 100 documents
			url: 'https://api.mongohq.com/databases/osm/collections/relation/documents?_apikey=ad1r3nxynhxls3vfq5q9&limit=100',
			dataType: 'json',
			success: function( data ){
				_.each( data, function( relation ){
					_.each( relation.members, function(member){
						var filter = encodeURIComponent('{ "osmId":"' + member.ref + '"}');
						$.ajax({
							url:'https://api.mongohq.com/databases/osm/collections/way/documents?_apikey=ad1r3nxynhxls3vfq5q9&q='+filter,
							dataType:'json',
							success: function( data ){
								_.each( data, function(way){
									geo.addData( way.geometry );
								});
							},
							failure: function( data ){
								console.log( data );
							}
						});
					});
				});
			
			},
			failure: function( data ){
				console.log( data );
			}
		});*/
	
}).call(this);