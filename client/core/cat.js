/**
 * Cat module organizes the code in a compositional way (symmetric monoidal category)
 * 
 * See Retracing some paths in Process Algebra (1996) by Samson Abramsky for theory
 * 
 */
( function(root, _){
    
    var constants = {
	    MAX_RANDOM_NAME_LENGTH: 7
    };

    var modules = {};

    // generate a random string 
    function generateName(){
		return Math.random().toString(36).substring( constants.MAX_RANDOM_NAME_LENGTH );
    };
    
    function findModule( m ){
	     if ( m.isModule ){
		    return m;
	     }
	     if (typeof m === 'string' ){
		    if (! modules[m] || !modules[m].isModule ){
				throw 'Cannot find module with name ' + m + '.';
		    }
		    return modules[m];
	     }
	     throw 'Object ' + m.toString() + ' is not a module.';
    };

    var Context = function(listener){
        var children = [];
        listener = listener || {};
        
        this.trigger = function( event ){
            var params = Array.prototype.slice.call(arguments, 1);
            if ( listener[event] ){
				listener[event].apply( null, params);
				_.each( children, function(child){
				    child.trigger(event);	
				});
            }
            
        };
        
        this.listen = function( events, handler ){
            _.each( events, function(event){
               listener[ event ] = handler[event]; 
            });
        };

        
    };
    
    root.Cat = Cat = {
        
        /*
         *  define a module with a given name
         */
        define: function(name, builder){
            return modules[ name ] = {
                name: name,
                builder: builder,
                isModule: true
            };
        },
      
        /*
         * sequential composition M;N
         *
         * @param m, module name or module
         * @param n, module name or module
         */
        seq: function(m, n){
	        var name = generateName();
	        m = findModule(m); n = findModule(n);
            return modules[ name ] = {
                name: name,
                isModule: true,
                kind: 'SEQ',
                children: [ m, n ],
                builder: function(context){         
                    var nInstance = n.builder( context );
                    var mInstance = m.builder( new Context( nInstance ) );
                    return _.extend({}, mInstance);            
                }
            };
              
        },
      
        /*
         * parallel composition (or dot product) M|N
         *
         * @param m, module name or module
         * @param n, module name or module
         */
        dot: function(m, n){
	        var name = generateName();
            m = findModule(m); n = findModule(n);
            return modules[ name ] = {
                name: name,
                isModule: true,
                kind: 'DOT',
                children: [m, n],
                builder:function( context ){
	                var nInstance = n.builder( context );
	                var mInstance = m.builder( context );
                    var dot = {};
                    // TODO probably it is not the best way to do it!
                    _.each(
	                  _.union(_.keys(nInstance), _.keys(mInstance) ),
	                  function(key){
	                     dot[key] = function(){
		                     if (mInstance[key]) mInstance[key].apply(undefined, arguments);
		                     if (nInstance[key]) nInstance[key].apply(undefined, arguments);
		                 };
                      });
                    return dot;
                }
            };  
        },
      
        /*
         * trace (or feedback) M^
         *
         * @param m, module name or module
         * @param events, list of event names (String)
         */
        trace: function(m, events){
	       var name = generateName();
           m = findModule(m);
           return modules[ name] = {
               name: name,
               isModule: true,
               kind: 'TRACE',
               children: [m],
               builder: function( context ){
                   var mCtx = _.clone( context );
                   var mInstance = m.builder(mCtx);
                   mCtx.listen(events, mInstance);
                   return mInstance;
               }
           };
        },
      
        /*
         * int construction
         *
         * @param m, module name or module
         * #param n, module name or module
         */
        intc: function(m, n){
	      var name = generateName();
          m = findModule(m); n = findModule(n);
          return modules[ name  ] = {
              name: name,
              isModule:true,
              kind:'INTC',
              children: [m, n],
              builder: function( context ){
                  var ctx = _.clone( context );
                  var nInstance = n.builder( ctx );
                  var mInstance = m.builder( ctx );
                  var dot = _.extend( mInstance, nInstance);
                  ctx.listen( _.keys(nInstance), nInstance );
                  ctx.listen( _.keys(mInstance), mInstance );
                  return dot;
              }
          };
        },
      
        /*
         * start a module with a given name
         */
        start: function( m ){
	        m = findModule(m);
            return m.builder( new Context );
        },

        /*
         * get a list of loaded modules
         */
         loaded: function(){
	        return _.keys(modules);
         }
      
    };
    
    
})(this, _);


