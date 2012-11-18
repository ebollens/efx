test("Module Attached", function() {

    ok(jQuery.fn.efx, "jQuery.efx() exists")
    ok($.fn.efx, "$.efx() exists")
    
});

module("engine.js", {
    
    setup: function() {
        
        var counter = 0
        
        $().efx('add', 'test', 'init', function(data, _){
            
            var container = data.container,
                target    = data.target,
                trigger   = data.trigger;
                
            $([trigger,target,container]).each(function(){
                this.attr('data-init', 'true')
                _.addState(this, 'init')
            })
            
        })
        
        $().efx('add', 'test', 'click', function(data, _){
            
            var container = data.container,
                target    = data.target,
                trigger   = data.trigger;

            var arr = [target,trigger]

            if(target[0] !== container[0])
                arr.push(container)

            $(arr).each(function(){
                var count = this.attr('data-execute') ? (parseInt(this.attr('data-execute'))+1) : 1
                this.attr('data-execute', count)
                this.attr('data-execute-last-effect', 'test')
                _.addState(this, 'exec')
                if(_.inState(this, 'init'))
                    _.removeState(this, 'init')
            })
            
        })
    },
    
    teardown: function() {
        $('#test > *').remove()
    }
    
});

test("Driver registered", function() {

    $('#test').efx()
    
    ok($().efx('supports', 'test'), 'Effect resolved')
    ok($().efx('supports', 'test', 'click'), 'Effect event resolved')
    
});

test("Listener attached by ID", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test')
    $('<div/>', {'id': 'target', 'data-effect': 'test'}).appendTo('#test')

    $('#test').efx()
    
    $('#trigger').click()
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    ok($('#target').data('execute'), 'Target executed')
    
});

test("Listener attached by class", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': '.target'}).appendTo('#test')
    $('<div/>', {'class': 'target', 'data-effect': 'test'}).appendTo('#test')
    $('<div/>', {'class': 'target', 'data-effect': 'test'}).appendTo('#test')

    $('#test').efx()
    
    $('#trigger').click()
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    equal($('.target').length, 2, 'Number of targets')
    $('.target').each(function(idx){
        ok($(this).data('execute'), 'Target '+(idx+1)+' executed')
    })
    
});

test("Listener attached to trigger once for multiple initializations", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test')  
    $('<div/>', {'id': 'target', 'data-effect': 'test'}).appendTo('#test')

    $('#test').efx()
    $('#test').efx()
    $('#test').efx()
    
    $('#trigger').click()
    
    equal($('#trigger').data('execute'), 1, 'Number of driver invocations for multiple initializations after one event')
    
});

test("Effect resolved to parent", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test')
    $('<div/>', {'id': 'container', 'data-effect': 'test'}).appendTo('#test')
    $('<div/>', {'id': 'target'}).appendTo('#container')

    $('#test').efx()
    
    $('#trigger').click()
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    ok($('#container').data('execute'), 'Container executed')
    ok($('#target').data('execute'), 'Target executed')
    
});

test("Effect resolved to child", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test')
    $('<div/>', {'id': 'container', 'data-effect': 'test'}).appendTo('#test')
    $('<div/>', {'id': 'target', 'data-effect': 'test'}).appendTo('#container')

    $('#test').efx()
    
    $('#trigger').click()
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    ok(!$('#container').data('execute'), 'Container did not execute')
    ok($('#target').data('execute'), 'Target executed')
    
});

test("Effect resolved to ignore undefined effect", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test')  
    $('<div/>', {'id': 'container', 'data-effect': 'test'}).appendTo('#test')
    $('<div/>', {'id': 'target', 'data-effect': 'undefined'}).appendTo('#container')

    $('#test').efx()
    
    $('#trigger').click()
    
    equal($('#trigger').data('execute-last-effect'), 'test', 'Effect resolved')
    equal($('#container').data('execute-last-effect'), 'test', 'Effect resolved')
    equal($('#target').data('execute-last-effect'), 'test', 'Effect resolved')
    
});

test("Driver state functions", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test')  
    $('<div/>', {'id': 'container', 'data-effect': 'test'}).appendTo('#test')
    $('<div/>', {'id': 'target'}).appendTo('#container')

    $('#test').efx()
    
    equal($('#trigger').attr('data-test'), 'init', 'State set on trigger during init')
    equal($('#container').attr('data-test'), 'init', 'State set on target during init')
    equal($('#target').attr('data-test'), 'init', 'State set on container during init')
    
    $('#trigger').click()
    
    equal($('#trigger').attr('data-test'), 'exec', 'State set and unset on trigger during execution')
    equal($('#container').attr('data-test'), 'exec', 'State set and unset on target during execution')
    equal($('#target').attr('data-test'), 'exec', 'State set and unset on container during execution')
    
    $('#trigger').click()
    
    equal($('#trigger').attr('data-test'), 'exec', 'State does not duplicate on multiple sets')
    
});

test("Driver bind existing driver to new event", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test')
    $('<div/>', {'id': 'target', 'data-effect': 'test'}).appendTo('#test')

    equal($().efx('get', 'blah', 'click'), false, 'Get driver for non-existent effect')
    equal($().efx('get', 'test', 'blah'), false, 'Get driver for non-existent event')
    
    var driver = $().efx('get', 'test', 'click')
    
    ok(driver, 'Get driver for existent (effect,event) tuple')

    $().efx('add', 'test', 'mousedown', driver)

    $('#test').efx()
    
    $('#trigger').trigger('mousedown')
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    ok($('#target').data('execute'), 'Target executed')
    
});
