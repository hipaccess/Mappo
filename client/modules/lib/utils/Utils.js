Collections = {
	_collections: {},
	get: function( name ){
		if ( !this._collections[name]){
			Meteor.subscribe( name, {
				onError: function(e){
					throw 'No collection with name ' + name + ' on server side.';
				}
			} );
			this._collections[name] = new Meteor.Collection( name );
		}
		return this._collections[name];
	},
	has: function(name){
		return ! _.isUndefined( this._collections[name] );
	}
};