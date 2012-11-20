;(function($){
    
    $('body').efx('add', 'toggle', 'init', function(data, _){

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
        
        if(!_.inState(target, 'show'))
            _.addState(target, 'hide')
        
        if( _.inState(target, 'hide') && (
                _.inState(container, 'slide') 
            || 
                _.inState(container, 'fade')
            )
        )
            target.hide();

    });

    $('body').efx('add', 'toggle', 'click', function(data, _){

        var container = data.container,
            target    = data.target,
            trigger   = data.trigger;
            
            
        if(_.inState(target, 'show')){
            
            _.removeState(target, 'show')
            _.addState(target, 'hide')
            
            if(_.inState(container, 'slide'))
                target.slideUp();
            else if(_.inState(container, 'fade'))
                target.fadeOut();
            
        }else{
            
            _.removeState(target, 'hide')
            _.addState(target, 'show')
            
            if(_.inState(container, 'slide'))
                target.slideDown();
            else if(_.inState(container, 'fade'))
                target.fadeIn();
            
        }

    });
    
})(jQuery);

