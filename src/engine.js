;(function( $ ) {

    /** 
     * Module definition that call-forwards to methods defined in a private 
     * member array EFX, or initializes Efx on the element specified if no 
     * method is defined, or throws a jQuery error if the method specified does 
     * not exist.
     */
    $.fn.efx = function(method) {
        
        // Call-forward to method specified by first argument
        if (_EFX[method])
            return _EFX[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        
        // Fallback to call-forward to init method
        else if (typeof method === 'object' || !method)
            return _EFX.init.apply( this, arguments );
        
        // Cannot perform a call-forward so throw error
        else
            $.error( 'Method ' +  method + ' does not exist on jQuery.efx' );
    }
    
    /** 
     * Container holding all drivers that have been added.
     */
    var _drivers = {}
    
    /**
     * Container that stores all events that have been registered to any driver.
     */
    var _events = []
    
    /**
     * Boolean that tracks whether any elements have been initialized. If they
     * have, then it is unsafe to add further drivers.
     */
    var _has_initialized = false;
    
    /**
     * Methods to which the module will call-forward for $(..).efx(method, ..). 
     */
    var _EFX = {
        
        /**
         * Initializes Efx on ele for $(ele).efx() or $(ele).efx('init').
         */
        init: function(){
            
            init(this)
            
            _has_initialized = true
            
        },
        
        /**
         * $().efx('add', effect_name, driver) adds driver as the handler for 
         * effect_name. This should not be invoked after $(ele).efx('init') or 
         * $(ele).efx() has been called, or the driver will not necessarily
         * attach event handlers where expected for any ele previous 
         * initialized.
         */
        add: function(effect, event, driver){
            
            if(arguments.length < 3 || typeof driver != 'function')
                return;
            
            if(_drivers[effect] == undefined)
                _drivers[effect] = {}
            
            _drivers[effect][event] = driver
            
            if($.inArray(event, _events) < 0){
                
                _events.push(event)
                
                /** @todo make it possible to add drivers after init */
                if(_has_initialized){
                    var str = '[Efx] Driver event added after listeners have already been attached to some element'
                    if(console.warn) console.warn(str)
                    else if(console.log) console.log(str)
                }
                
            }
        },
        
        /**
         * $().efx('add', effect_name) returns true if effect_name defined.
         */
        supports: function(effect, event){
            
            return _drivers[effect] != undefined && ( event == undefined || _drivers[effect][event] != undefined )
            
        },
        
        /**
         * $().efx('remove', effect_name) removes the driver effect_name.
         */
        remove: function(effect, event){
            
            if(event == undefined){
                if(_drivers[effect] != undefined)
                    delete _drivers[effect]
            }else{
                if(_drivers[effect][event] != undefined)
                    delete _drivers[effect][event]
            }
            
        }
    }

    /**
     * Initializes all targets and their triggers/containers and then attaches
     * an event listener to the triggers that will delegate to the proper
     * driver upon the trigger being initiated.
     */
    function init(ele){
        
        // Find all triggers (elements with a data-target)
        var triggers = ele.find('[data-target]')
        
        // Initialize the triggers and their targets
        triggers.each(function(){
            var trigger = $(this)
            targets_of(trigger).each(function(){
                execute_effect_on('init',$(this), trigger)
            })
        })
        
        // Binds all events that drivers have registered to all triggers
        $(_events).each(function(){
            if(this != 'init')
                triggers.bind(this+'', delegate)
        })
        
    }
    
    /**
     * Click handler that executes a trigger across its targets.
     */
    function delegate(event){
        
        var trigger = $(this)
        targets_of(trigger).each(function(){
            execute_effect_on(event.type, $(this), trigger)
        })
        
    }
    
    /**
     * Determines all targets of a trigger element.
     */
    function targets_of(trigger){
        
        var target = trigger.data('target')
        
        // Shorthand for ID neglects the # sign since HTML elements not allowed
        if(target.match(/^[A-Za-z]/))
            target = '#'+target;
        
        return $(target)
        
    }
    
    /**
     * Runs the init method of the driver for the trigger and its respective
     * targets/containers.
     */
    function execute_effect_on(event, target, trigger){
        
        var effect = false;
        var container = target;
        
        // Determine if the the target has a valid effect
        if(effect = target.data('effect'))
            if(!_EFX.supports(effect, event))
                effect = false
        
        // Search parents for a valid effect if not on target itself
        if(!effect){
            var parents = target.parents('[data-effect]')
            for(var i = 0; i < parents.length && !effect; i++){
                container = $(parents[i])
                effect = container.data('effect')
                if(!_EFX.supports(effect, event))
                    effect = false
            }
        }

        // Run the driver for the effect if it could be resolved
        if(effect){
            _drivers[effect][event]({'target':target, 'container':container, 'trigger':trigger})
        }
        
    }
    
  
})( jQuery );