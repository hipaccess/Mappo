Collections = {
	_collections: {},
	get: function( name ){
		if ( !this._collections[name]){
			Meteor.subscribe( name );
			this._collections[name] = new Meteor.Collection( name );
		}
		return this._collections[name];
	}
};