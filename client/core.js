
(function( window, undefined ) {
	
	var _ = window._;
	
	var modules = {};
	
	var Core = {};
	
	var Context = function( ){

		var listeners = {};
		var context = null;
		
		this.listen = function( events, handler, scope ){
			context = scope;
			_.each( events, function(e){
				if ( handler[e] ){
					if ( ! listeners[e] ){
						listeners[e] = [];
					}
					listeners[e].push( handler[e] );
				}
			});
		};

		this.trigger = function( event ){
			var params = Array.prototype.slice.call(arguments, 1);
			_.each( listeners[event], function(l){
				l.apply( context, params);
			});
		};
	}
	
	Core.define = function( name, events, builder ){
		var instance = builder( new Context );
		modules[ name ] = {
			handlers: _.keys( instance ),
			events: events,
			builder: builder
		};
	};

	
	Core.compose = function( name, m, n){
		var builder = function( context ){
			var mctx = new Context();
			var nctx = new Context();
			var minstance = modules[m].builder( mctx );
			var ninstance = modules[n].builder( nctx );
			// TODO assert intersection is not null
			mctx.listen( _.intersection( modules[m].events, modules[n].handlers), ninstance, ninstance );
			// TODO assert intersection is not null
			nctx.listen( _.intersection( modules[n].events, modules[m].handlers ), minstance, minstance );
			var obj = {};
			_.each( _.difference(  modules[n].handlers, modules[m].events), function( event){
				if ( obj[event] ){
					var old = obj[ event ];
					// TODO make in parallel
					obj[ event ] = function(){
						var params = Array.prototype.slice.call(arguments);
						old.apply(null, params);
						ninstance[ event ].apply(null, params);
					};
				} else {
					obj[ event ] = ninstance[ event ];
				}		
			});
			_.each( _.difference( modules[m].handlers , modules[n].events), function( event){
				if ( obj[event] ){
					var old = obj[ event ];
					// TODO make in parallel
					obj[ event ] = function(){
						var params = Array.prototype.slice.call(arguments);
						old.apply(null, params);
						minstance[ event ].apply(null, params);
					};
				} else {
					obj[ event ] = minstance[ event ];
				}
			});
			return obj;
		};
		modules[name] = {
			handlers: _.union( _.difference(  modules[n].handlers, modules[m].events),
							   _.difference( modules[m].handlers , modules[n].events) ),
			builder: builder,
			events: _.union( _.difference(modules[m].events, modules[n].handlers ), 
							 _.difference(modules[n].events, modules[m].handlers ))
		};
	};
	
	Core.split = function( name, m, components){
		var builder = function( context ){
			var obj = {};
			
			var mctx = new Context();
			var minstance = modules[m].builder( mctx );
			_.each( components, function(n){
				var nctx = new Context();
				var ninstance = modules[n].builder( nctx );
				mctx.listen( _.intersection( modules[m].events, modules[n].handlers), ninstance, ninstance );
				nctx.listen( _.intersection( modules[n].events, modules[m].handlers ), minstance, minstance );
				
				_.each( _.difference( modules[m].handlers , modules[n].events), function( event){
					obj[ event ] = minstance[ event ];
				});
				
				
				
				// TODO
				/* _.each( _.difference(  modules[n].handlers, modules[m].events), function( event){
					obj[ event ] = ninstance[ event ];
				}); */
			});
			
			
			return obj;
		};
		modules[ name ] = {
			handlers: modules[m].handlers,
			builder: builder,
			events: modules[m].events
		};
	};

	Core.start = function( name ){
		return modules[ name ].builder( new Context() );
	};

	window.Core = Core;
	
})( window );