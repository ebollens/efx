;(function($){
    
    $('body').efx('add', 'toggle', 'init', function(data, _){

        var container = data.container,
            target    = data.target,
            trigger   = data.trigger;
            
        if(!_.inState(target, 'show'))
            _.addState(target, 'hide')

    });

    $('body').efx('add', 'toggle', 'click', function(data, _){

        var container = data.container,
            target    = data.target,
            trigger   = data.trigger;
            
            
        if(_.inState(target, 'show')){
            _.removeState(target, 'show')
            _.addState(target, 'hide')
        }else{
            _.removeState(target, 'hide')
            _.addState(target, 'show')
        }

    });
    
})(jQuery);

