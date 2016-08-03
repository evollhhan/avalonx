(function() {

    /**
     * Avalon Store
     *
     * based on Avalon 1.x
     * version: 0.1.0
     */
    function AvalonStore() {
        
        var state  = {},
            patch  = {},
            vmodel = {},
            source = {};

        return {

            define: function(param) {
                if(param.hasOwnProperty('store'))
                    throw 'Avalonx: keyword store is defined';
                else if(param.hasOwnProperty('$store')) {
                    param.store = state;
                    delete param.$store;
                    var vm = avalon.define(param);
                    source[param.$id] = param;
                    vmodel[param.$id] = vm;
                    return vm;
                }
                else
                    return avalon.define(param);
            },
            
            remove: function(id) {
                delete vmodel[id];
                delete source[id];
            },

            reset: function(id) {
                if(source.hasOwnProperty(id)) {
                    vmodel[id] = avalon.define(source[id]);
                    return 1;
                }
                else
                    return 0;
            },

            store: function(param) {
                for(var k in param) {
                    if(typeof param[k] === 'object' || typeof param[k] === 'function')
                        return 0;
                    state[k] = param[k];
                }
                for(var vm in vmodel)
                    vmodel[vm].store = state;
                return 1;
            },

            patch: function(key, val) {
                if(typeof key === 'object') {
                    for(var i in key) {
                        if(state.hasOwnProperty(i))
                            patch[i] = key[i];
                        else
                            return 0;  
                    }
                    return 1; 
                }
                else {
                    if(state.hasOwnProperty(key)) {
                        patch[key] = val;
                        return 1;
                    }
                    else
                        // dev
                        // console.log('no state found');
                        return 0;
                }
            },

            patching: function(key, val) {
                if(typeof key === 'object')
                    for(var i in key)
                        if(state.hasOwnProperty(i))
                            patch[i] = key[i];                    
                else
                    if(state.hasOwnProperty(key))
                        patch[key] = val;
                return this; 
            },

            unpatch: function(key) {
                if(key)
                    delete patch[key];
                else
                    patch = {};
            },

            dispatch: function(key) {
                if(key) {
                    if(state.hasOwnProperty(key)) {
                        for(var vm in vmodel)
                            vmodel[vm].store[key] = patch[key];
                        state[key] = patch[key];
                        delete patch[key];
                        return 1;
                    }
                    else {
                        // dev
                        // console.log('no patch found');
                        return 0;
                    }
                }
                else {
                    for(var vm in vmodel)
                        for(var k in patch) {
                            state[k] = patch[k];
                            vmodel[vm].store[k] = patch[k];
                        }
                    patch = {};
                    return 1;
                }
            }

        }
    }

    window.avalonx = new AvalonStore();

})();