;(function($){
    
    var counter = 1;
    
    $('body').efx('add', 'tabs', 'init', function(data, _){

        var container = data.container,
            target    = data.target,
            trigger   = data.trigger;
    
        var hasModifier = false;
        $.each(['slide','fade','basic'], function(){
            if(_.inState(container, this+''))
                hasModifier = true;
        })
        
        if(!hasModifier)
            _.addState(container, 'basic')
            
        if(!container.attr('id'))
            container.attr('id', '_tabs-'+counter++)
            
        if(!trigger.attr('id'))
            trigger.attr('id', '_tabs-'+counter++)
        
        if(!_.inState(target, 'show'))
            _.addState(target, 'hide')
        else
            trigger.attr('data-active')
        
        _.addState(target, 'c['+container.attr('id')+']')
        _.addState(target, 't['+trigger.attr('id')+']')
        
        if( _.inState(target, 'hide') && (
                _.inState(container, 'slide') 
            || 
                _.inState(container, 'fade')
            )
        )
            target.hide();
    });

    $('body').efx('add', 'tabs', 'click', function(data, _){

        var container = data.container,
            target    = data.target,
            trigger   = data.trigger;
            
        if(!_.inState(target, 'show')){
            
            _.removeState(target, 'hide')
            _.addState(target, 'show')
            
            if(_.inState(container, 'slide'))
                target.slideDown();
            else if(_.inState(container, 'fade'))
                target.fadeIn();

            $.each(_.getState(target), function(idx,state){
                var containerMatch = state.match(/^c\[(.*)\]$/);
                if(containerMatch)
                    $('[data-tabs~="'+state+'"]').each(function(){
                        $.each(_.getState($(this)), function(idx,state){
                            var targetMatch = state.match(/^t\[(.*)\]$/);
                            if(targetMatch)
                                $('#'+targetMatch[1]).removeAttr('data-active');
                        })
                    })
            });

            $.each(_.getState(target), function(idx,state){
                var targetMatch = state.match(/^t\[(.*)\]$/);
                if(targetMatch)
                    $('#'+targetMatch[1]).attr('data-active', true);
            });
            
            // Hide all the elements that are not targetted by this trigger
            $(container)
                .find('[data-tabs~="c['+container.attr('id')+']"]')
                .not('[data-tabs~="t['+trigger.attr('id')+']"]')
                .each(function(){
                    
                    var notTarget = $(this)
                    _.removeState(notTarget, 'show')
                    _.addState(notTarget, 'hide')
                    
                    if(_.inState(container, 'slide'))
                        notTarget.slideUp();
                    else if(_.inState(container, 'fade'))
                        notTarget.hide();
                })
            
        }

    });
    
})(jQuery);

