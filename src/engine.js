;(function( $ ) {

    /** 
     * Module definition that call-forwards to methods defined in a private 
     * member array EFX, or initializes Efx on the element specified if no 
     * method is defined, or throws a jQuery error if the method specified does 
     * not exist.
     */
    $.fn.efx = function(method) {
        
        // Call-forward to method specified by first argument
        if (EFX[method])
            return EFX[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        
        // Fallback to call-forward to init method
        else if (typeof method === 'object' || !method)
            return EFX.init.apply( this, arguments );
        
        // Cannot perform a call-forward so throw error
        else
            $.error( 'Method ' +  method + ' does not exist on jQuery.efx' );
    }
    
    /** 
     * Container holding all drivers that have been added.
     */
    var drivers = {}
    
    /**
     * Methods to which the module will call-forward for $(..).efx(method, ..). 
     */
    var EFX = {
        
        /**
         * Initializes Efx on ele for $(ele).efx() or $(ele).efx('init').
         */
        init: function(){
            
            init(this);
            
        },
        
        /**
         * $(null).efx('add', effect_name, driver) adds driver as the handler
         * for effect_name.
         */
        add: function(effect, driver){
            
            if(arguments.length < 2 || typeof driver != 'function')
                return;
            
            drivers[effect] = driver
            
        },
        
        /**
         * $(null).efx('add', effect_name) returns true if effect_name defined.
         */
        supports: function(effect){
            
            return drivers[effect] != undefined
            
        },
        
        /**
         * $(null).efx('remove', effect_name) removes the driver effect_name.
         */
        remove: function(effect){
            
            if(drivers[effect] != undefined)
                delete drivers[effect]
            
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
                init_effect_on($(this), trigger)
            })
        })
        
        // Attach listeners to the triggers
        triggers.click(delegate)
        
    }
    
    /**
     * Click handler that executes a trigger across its targets.
     */
    function delegate(){
        
        var trigger = $(this)
        targets_of(trigger).each(function(){
            execute_effect_on($(this), trigger)
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
    function init_effect_on(target, trigger){
        
        var driver = driver_for(target, trigger); 
        if(driver != undefined && driver.init != undefined)
            driver.init();
        
    }
    
    /**
     * Runs the init method of the driver for the trigger and its respective
     * targets/containers.
     */
    function execute_effect_on(target, trigger){
        
        var driver = driver_for(target, trigger);
        if(driver != undefined && driver.execute != undefined)
            driver.execute();
        
    }
    
    /**
     * Factory that constructs a driver for a given target. Trigger is also
     * provided as an argument since it too is passed to the driver.
     */
    function driver_for(target, trigger){
        
        var effect = false;
        var container = target;
        
        // Determine if the the target has a valid effect
        if(effect = target.data('effect'))
            if(!EFX.supports(effect))
                effect = false
        
        // Search parents for a valid effect if not on target itself
        if(!effect){
            var parents = target.parents('[data-effect]')
            for(var i = 0; i < parents.length && !effect; i++){
                container = $(parents[i])
                effect = container.data('effect')
                if(!EFX.supports(effect))
                    effect = false
            }
        }

        // Builds a driver if effect could be resolved or false otherwise
        return effect ? new drivers[effect]({'target':target, 'container':container, 'trigger':trigger}) : false
        
    }
  
})( jQuery );